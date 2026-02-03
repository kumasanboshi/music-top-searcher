#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const inputDir = process.argv[2] || path.join(projectRoot, 'scratchpad');

const rankingsDir = path.join(projectRoot, 'public', 'data', 'rankings');
const songsDir = path.join(projectRoot, 'public', 'data', 'songs');
const indexPath = path.join(projectRoot, 'public', 'data', 'index.json');

const SKIP_YEAR = 2024;

function padRank(rank) {
  return String(rank).padStart(2, '0');
}

function genrePrefix(genre) {
  return genre === 'western' ? 'west' : genre;
}

function buildArtistObj(entry) {
  const artist = { id: entry.artistId, name: entry.artist };
  if (entry.nameEn) artist.nameEn = entry.nameEn;
  return artist;
}

// Read all batch files
const batchFiles = fs.readdirSync(inputDir).filter(f => f.startsWith('batch-') && f.endsWith('.json'));

// Collect all generated song details keyed by song id
// Also collect ranking entries per genre
const allSongDetails = new Map(); // songId -> detail object (file path + data)
const allRankingEntries = []; // { year, genre }

for (const batchFile of batchFiles) {
  const match = batchFile.match(/^batch-(\w+)-(\d+)-(\d+)\.json$/);
  if (!match) continue;
  const genre = match[1];
  const prefix = genrePrefix(genre);

  const batchData = JSON.parse(fs.readFileSync(path.join(inputDir, batchFile), 'utf-8'));

  for (const yearData of batchData) {
    const { year, entries } = yearData;
    if (year === SKIP_YEAR) continue;

    // Generate ranking file
    const rankingObj = {
      year,
      genre,
      entries: entries.map(e => ({
        rank: e.rank,
        song: {
          id: `${prefix}-${year}-${padRank(e.rank)}`,
          title: e.title,
          artist: buildArtistObj(e),
          genre,
        },
      })),
    };

    fs.mkdirSync(rankingsDir, { recursive: true });
    const rankingFile = path.join(rankingsDir, `${year}-${genre}.json`);
    fs.writeFileSync(rankingFile, JSON.stringify(rankingObj, null, 2) + '\n');
    allRankingEntries.push({ year, genre });

    // Generate song detail files
    for (const e of entries) {
      const songId = `${prefix}-${year}-${padRank(e.rank)}`;
      const artist = buildArtistObj(e);
      const detail = {
        song: {
          id: songId,
          title: e.title,
          artist,
          genre,
        },
        rankingYear: year,
        rank: e.rank,
        cdInfo: [
          {
            title: e.title,
            type: e.cdType || 'single',
            releaseDate: e.releaseDate,
          },
          ...(e.albumTitle
            ? [
                {
                  title: e.albumTitle,
                  type: 'album',
                  releaseDate: e.albumReleaseDate,
                },
              ]
            : []),
        ],
        externalLinks: {
          amazonMusic: 'https://music.amazon.co.jp/albums/example1',
          amazonCD: 'https://amazon.co.jp/dp/example1',
          appleMusic: 'https://music.apple.com/jp/album/example1',
        },
        artistSongs: [],
      };

      const songFile = path.join(songsDir, `${prefix}-${year}-${padRank(e.rank)}.json`);
      fs.mkdirSync(songsDir, { recursive: true });
      allSongDetails.set(songId, { filePath: songFile, data: detail });
    }
  }
}

// Also load existing 2024 song detail files for artistSongs cross-referencing
const existingSongFiles = fs.readdirSync(songsDir).filter(f => f.endsWith('.json'));
for (const f of existingSongFiles) {
  const filePath = path.join(songsDir, f);
  const songId = f.replace('.json', '');
  if (!allSongDetails.has(songId)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allSongDetails.set(songId, { filePath, data, existing: true });
    } catch {
      // skip
    }
  }
}

// Build artist index: artistId+genre -> list of { rank, song, year }
const artistIndex = new Map();
for (const [, { data }] of allSongDetails) {
  const key = `${data.song.artist.id}|${data.song.genre}`;
  if (!artistIndex.has(key)) artistIndex.set(key, []);
  artistIndex.get(key).push({
    rank: data.rank,
    song: { ...data.song },
    year: data.rankingYear,
  });
}

// Update artistSongs for newly generated files
for (const [songId, entry] of allSongDetails) {
  if (entry.existing) continue; // don't overwrite existing 2024 files
  const key = `${entry.data.song.artist.id}|${entry.data.song.genre}`;
  const otherSongs = (artistIndex.get(key) || []).filter(s => s.song.id !== songId);
  // Sort by year desc, then rank asc
  otherSongs.sort((a, b) => b.year - a.year || a.rank - b.rank);
  entry.data.artistSongs = otherSongs;
  fs.writeFileSync(entry.filePath, JSON.stringify(entry.data, null, 2) + '\n');
}

// Update index.json
const existingIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
const existingSet = new Set(existingIndex.rankings.map(r => `${r.year}-${r.genre}`));

for (const { year, genre } of allRankingEntries) {
  const key = `${year}-${genre}`;
  if (!existingSet.has(key)) {
    existingIndex.rankings.push({
      year,
      genre,
      file: `rankings/${year}-${genre}.json`,
    });
    existingSet.add(key);
  }
}

// Sort by year descending, then genre
existingIndex.rankings.sort((a, b) => b.year - a.year || a.genre.localeCompare(b.genre));

fs.writeFileSync(indexPath, JSON.stringify(existingIndex, null, 2) + '\n');

console.log(`Generated ${allRankingEntries.length} ranking files.`);
console.log(`Generated ${allSongDetails.size} song detail entries (including existing).`);
console.log('Updated index.json.');
