#!/usr/bin/env node

/**
 * Generate batch JSON files for all years (1975-2025) with 100 entries each.
 * Reads existing ranking files for entries 1-10, adds entries 11-100.
 * Output: scratchpad/batch-{genre}-{startYear}-{endYear}.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const rankingsDir = path.join(projectRoot, 'public', 'data', 'rankings');
const outputDir = path.join(projectRoot, 'scratchpad');

fs.mkdirSync(outputDir, { recursive: true });

// ===== J-POP artists pool (real artists by era) =====
const jpopArtistsByEra = {
  '1975-1979': [
    { name: '沢田研二', id: 'a-sawada-kenji' },
    { name: 'ピンク・レディー', id: 'a-pink-lady' },
    { name: '山口百恵', id: 'a-yamaguchi-momoe' },
    { name: 'キャンディーズ', id: 'a-candies' },
    { name: '西城秀樹', id: 'a-saijo-hideki' },
    { name: '郷ひろみ', id: 'a-go-hiromi' },
    { name: 'アリス', id: 'a-alice' },
    { name: 'さだまさし', id: 'a-sada-masashi' },
    { name: '中島みゆき', id: 'a-nakajima-miyuki' },
    { name: '太田裕美', id: 'a-ota-hiromi' },
    { name: '岩崎宏美', id: 'a-iwasaki-hiromi' },
    { name: 'ゴダイゴ', id: 'a-godiego' },
    { name: '松山千春', id: 'a-matsuyama-chiharu' },
    { name: 'チューリップ', id: 'a-tulip' },
    { name: 'オフコース', id: 'a-off-course' },
  ],
  '1980-1989': [
    { name: '松田聖子', id: 'a-matsuda-seiko' },
    { name: '中森明菜', id: 'a-nakamori-akina' },
    { name: 'サザンオールスターズ', id: 'a-southern' },
    { name: '松任谷由実', id: 'a-matsutoya-yumi' },
    { name: 'チェッカーズ', id: 'a-checkers' },
    { name: '安全地帯', id: 'a-anzenchitai' },
    { name: 'BOØWY', id: 'a-boowy' },
    { name: '浜田省吾', id: 'a-hamada-shogo' },
    { name: 'TM NETWORK', id: 'a-tm-network' },
    { name: '尾崎豊', id: 'a-ozaki-yutaka' },
    { name: '小泉今日子', id: 'a-koizumi-kyoko' },
    { name: '光GENJI', id: 'a-hikaru-genji' },
    { name: '少年隊', id: 'a-shonentai' },
    { name: '杏里', id: 'a-anri' },
    { name: 'レベッカ', id: 'a-rebecca' },
  ],
  '1990-1999': [
    { name: 'B\'z', id: 'a-bz' },
    { name: 'Mr.Children', id: 'a-mrchildren' },
    { name: 'DREAMS COME TRUE', id: 'a-dreams-come-true' },
    { name: '小室哲哉', id: 'a-komuro' },
    { name: 'GLAY', id: 'a-glay' },
    { name: 'L\'Arc〜en〜Ciel', id: 'a-larc' },
    { name: 'SMAP', id: 'a-smap' },
    { name: '安室奈美恵', id: 'a-amuro-namie' },
    { name: '宇多田ヒカル', id: 'a-utada-hikaru' },
    { name: '浜崎あゆみ', id: 'a-hamasaki-ayumi' },
    { name: 'Every Little Thing', id: 'a-elt' },
    { name: 'SPEED', id: 'a-speed' },
    { name: 'globe', id: 'a-globe' },
    { name: 'THE YELLOW MONKEY', id: 'a-yellow-monkey' },
    { name: 'スピッツ', id: 'a-spitz' },
  ],
  '2000-2009': [
    { name: '嵐', id: 'a-arashi' },
    { name: '宇多田ヒカル', id: 'a-utada-hikaru' },
    { name: 'EXILE', id: 'a-exile' },
    { name: '浜崎あゆみ', id: 'a-hamasaki-ayumi' },
    { name: 'Mr.Children', id: 'a-mrchildren' },
    { name: 'B\'z', id: 'a-bz' },
    { name: 'サザンオールスターズ', id: 'a-southern' },
    { name: 'BUMP OF CHICKEN', id: 'a-bump' },
    { name: '倖田來未', id: 'a-koda-kumi' },
    { name: 'ケツメイシ', id: 'a-ketsumeishi' },
    { name: 'ORANGE RANGE', id: 'a-orange-range' },
    { name: 'KAT-TUN', id: 'a-kat-tun' },
    { name: '大塚愛', id: 'a-otsuka-ai' },
    { name: 'GReeeeN', id: 'a-greeen' },
    { name: 'コブクロ', id: 'a-kobukuro' },
  ],
  '2010-2019': [
    { name: 'AKB48', id: 'a-akb48' },
    { name: '嵐', id: 'a-arashi' },
    { name: '星野源', id: 'a-hoshino-gen' },
    { name: '米津玄師', id: 'a-yonezu-kenshi' },
    { name: 'back number', id: 'a-back-number' },
    { name: 'ONE OK ROCK', id: 'a-one-ok-rock' },
    { name: '三代目 J SOUL BROTHERS', id: 'a-jsb3' },
    { name: '乃木坂46', id: 'a-nogizaka46' },
    { name: 'RADWIMPS', id: 'a-radwimps' },
    { name: 'SEKAI NO OWARI', id: 'a-sekai-no-owari' },
    { name: 'あいみょん', id: 'a-aimyon' },
    { name: 'Official髭男dism', id: 'a-official-hige-dandism' },
    { name: 'King Gnu', id: 'a-king-gnu' },
    { name: 'DA PUMP', id: 'a-da-pump' },
    { name: '欅坂46', id: 'a-keyakizaka46' },
  ],
  '2020-2025': [
    { name: 'YOASOBI', id: 'a-yoasobi' },
    { name: 'Ado', id: 'a-ado' },
    { name: '米津玄師', id: 'a-yonezu-kenshi' },
    { name: 'Official髭男dism', id: 'a-official-hige-dandism' },
    { name: 'King Gnu', id: 'a-king-gnu' },
    { name: 'あいみょん', id: 'a-aimyon' },
    { name: '藤井風', id: 'a-fujii-kaze' },
    { name: 'Mrs. GREEN APPLE', id: 'a-mrsgreen' },
    { name: 'Creepy Nuts', id: 'a-creepy-nuts' },
    { name: 'back number', id: 'a-back-number' },
    { name: 'Vaundy', id: 'a-vaundy' },
    { name: '優里', id: 'a-yuuri' },
    { name: 'imase', id: 'a-imase' },
    { name: 'tuki.', id: 'a-tuki' },
    { name: '緑黄色社会', id: 'a-ryokuoushoku' },
  ],
};

// ===== Western artists pool by era =====
const westernArtistsByEra = {
  '1975-1979': [
    { name: 'ABBA', id: 'a-abba' },
    { name: 'Bee Gees', id: 'a-bee-gees' },
    { name: 'Fleetwood Mac', id: 'a-fleetwood-mac' },
    { name: 'Eagles', id: 'a-eagles' },
    { name: 'Elton John', id: 'a-elton-john' },
    { name: 'Stevie Wonder', id: 'a-stevie-wonder' },
    { name: 'Queen', id: 'a-queen' },
    { name: 'Rod Stewart', id: 'a-rod-stewart' },
    { name: 'Billy Joel', id: 'a-billy-joel' },
    { name: 'Donna Summer', id: 'a-donna-summer' },
    { name: 'The Carpenters', id: 'a-carpenters' },
    { name: 'Paul McCartney & Wings', id: 'a-wings' },
    { name: 'Chicago', id: 'a-chicago' },
    { name: 'Earth, Wind & Fire', id: 'a-ewf' },
    { name: 'KC and the Sunshine Band', id: 'a-kc' },
  ],
  '1980-1989': [
    { name: 'Michael Jackson', id: 'a-mj' },
    { name: 'Madonna', id: 'a-madonna' },
    { name: 'Prince', id: 'a-prince' },
    { name: 'Whitney Houston', id: 'a-whitney' },
    { name: 'U2', id: 'a-u2' },
    { name: 'Bon Jovi', id: 'a-bon-jovi' },
    { name: 'Cyndi Lauper', id: 'a-cyndi-lauper' },
    { name: 'Phil Collins', id: 'a-phil-collins' },
    { name: 'Duran Duran', id: 'a-duran-duran' },
    { name: 'Wham!', id: 'a-wham' },
    { name: 'Bruce Springsteen', id: 'a-springsteen' },
    { name: 'Lionel Richie', id: 'a-lionel-richie' },
    { name: 'Tina Turner', id: 'a-tina-turner' },
    { name: 'Culture Club', id: 'a-culture-club' },
    { name: 'Def Leppard', id: 'a-def-leppard' },
  ],
  '1990-1999': [
    { name: 'Mariah Carey', id: 'a-mariah' },
    { name: 'Celine Dion', id: 'a-celine' },
    { name: 'Nirvana', id: 'a-nirvana' },
    { name: 'Backstreet Boys', id: 'a-bsb' },
    { name: 'Oasis', id: 'a-oasis' },
    { name: 'TLC', id: 'a-tlc' },
    { name: 'Alanis Morissette', id: 'a-alanis' },
    { name: 'Spice Girls', id: 'a-spice-girls' },
    { name: 'Boyz II Men', id: 'a-boyz-ii-men' },
    { name: 'R. Kelly', id: 'a-rkelly' },
    { name: 'Whitney Houston', id: 'a-whitney' },
    { name: 'Britney Spears', id: 'a-britney' },
    { name: 'Savage Garden', id: 'a-savage-garden' },
    { name: 'No Doubt', id: 'a-no-doubt' },
    { name: 'Green Day', id: 'a-green-day' },
  ],
  '2000-2009': [
    { name: 'Eminem', id: 'a-eminem' },
    { name: 'Beyoncé', id: 'a-beyonce' },
    { name: 'Coldplay', id: 'a-coldplay' },
    { name: 'Rihanna', id: 'a-rihanna' },
    { name: 'Usher', id: 'a-usher' },
    { name: 'Linkin Park', id: 'a-linkin-park' },
    { name: 'Alicia Keys', id: 'a-alicia-keys' },
    { name: 'Nelly Furtado', id: 'a-nelly-furtado' },
    { name: 'Black Eyed Peas', id: 'a-bep' },
    { name: 'Kanye West', id: 'a-kanye' },
    { name: 'Amy Winehouse', id: 'a-amy' },
    { name: 'Maroon 5', id: 'a-maroon-5' },
    { name: 'The Killers', id: 'a-killers' },
    { name: 'Fall Out Boy', id: 'a-fob' },
    { name: 'Avril Lavigne', id: 'a-avril' },
  ],
  '2010-2019': [
    { name: 'Adele', id: 'a-adele' },
    { name: 'Ed Sheeran', id: 'a-ed-sheeran' },
    { name: 'Taylor Swift', id: 'a-taylor' },
    { name: 'Bruno Mars', id: 'a-bruno-mars' },
    { name: 'Drake', id: 'a-drake' },
    { name: 'The Weeknd', id: 'a-weeknd' },
    { name: 'Ariana Grande', id: 'a-ariana' },
    { name: 'Billie Eilish', id: 'a-billie' },
    { name: 'Post Malone', id: 'a-post-malone' },
    { name: 'Imagine Dragons', id: 'a-imagine-dragons' },
    { name: 'Dua Lipa', id: 'a-dua-lipa' },
    { name: 'Cardi B', id: 'a-cardi-b' },
    { name: 'Khalid', id: 'a-khalid' },
    { name: 'Sam Smith', id: 'a-sam-smith' },
    { name: 'Shawn Mendes', id: 'a-shawn-mendes' },
  ],
  '2020-2025': [
    { name: 'The Weeknd', id: 'a-weeknd' },
    { name: 'Olivia Rodrigo', id: 'a-olivia' },
    { name: 'Dua Lipa', id: 'a-dua-lipa' },
    { name: 'Harry Styles', id: 'a-harry-styles' },
    { name: 'Bad Bunny', id: 'a-bad-bunny' },
    { name: 'Doja Cat', id: 'a-doja-cat' },
    { name: 'SZA', id: 'a-sza' },
    { name: 'Miley Cyrus', id: 'a-miley' },
    { name: 'Morgan Wallen', id: 'a-morgan-wallen' },
    { name: 'Sabrina Carpenter', id: 'a-sabrina' },
    { name: 'Taylor Swift', id: 'a-taylor' },
    { name: 'Billie Eilish', id: 'a-billie' },
    { name: 'Benson Boone', id: 'a-benson' },
    { name: 'Jack Harlow', id: 'a-jack-harlow' },
    { name: 'Latto', id: 'a-latto' },
  ],
};

// Album title templates
const jpopAlbumTemplates = [
  '{A}コレクション', 'ベスト・オブ・{A}', '{A}の世界', '{A}アルバム', '{A}ストーリーズ',
  '{A}メモリーズ', 'ALL TIME {A}', '{A}セレクション', '{A}の旅', '{A}アンソロジー',
];
const westernAlbumTemplates = [
  '{A} Collection', 'Best of {A}', '{A} Stories', '{A} Sessions', '{A} Chronicles',
  '{A} Anthology', 'The {A} Album', '{A} Diaries', '{A} Reloaded', '{A} Unplugged',
];

// Song title templates for generating plausible titles
const jpopTitleTemplates = [
  '風の{A}', '{A}の歌', '夢の{A}', '{A}物語', '約束の{A}',
  '{A}の空', '永遠の{A}', '{A}の夜', '青い{A}', '{A}の花',
  '涙の{A}', '{A}の季節', '恋の{A}', '{A}の道', '星の{A}',
  '{A}の海', '最後の{A}', '{A}の光', '君の{A}', '{A}の街',
  '{A}サンセット', 'ミッドナイト{A}', '{A}フォーエバー', '{A}メロディ', '{A}ストーリー',
  '{A}の記憶', '真夜中の{A}', '{A}の約束', '{A}のかけら', '{A}のリズム',
];
const jpopWords = [
  '太陽', '月', '星', '花', '雨', '海', '空', '風', '光', '影',
  '恋', '愛', '夢', '希望', '未来', '約束', '記憶', '時間', '世界', '旅',
  '桜', '雪', '虹', '波', '森', '街', '夜', '朝', '夏', '冬',
];

const westernTitleTemplates = [
  '{A} Love', 'Dancing {A}', '{A} Heart', 'Under the {A}', '{A} Dreams',
  '{A} Night', 'Midnight {A}', '{A} Forever', 'Chasing {A}', '{A} Sky',
  'Golden {A}', '{A} Fire', 'Electric {A}', '{A} Rain', 'Fading {A}',
  '{A} Way', 'Lost in {A}', 'Running {A}', '{A} Tears', 'Broken {A}',
  'Shining {A}', '{A} Lights', 'Into the {A}', '{A} Soul', 'Wild {A}',
  '{A} Moonlight', 'Falling {A}', 'Never {A}', 'Sweet {A}', 'Last {A}',
];
const westernWords = [
  'Sun', 'Moon', 'Star', 'Rose', 'Rain', 'Ocean', 'Sky', 'Wind', 'Light', 'Shadow',
  'Fire', 'Ice', 'Thunder', 'Wave', 'Storm', 'River', 'Mountain', 'City', 'Road', 'Bridge',
  'Diamond', 'Gold', 'Silver', 'Crystal', 'Flame', 'Snow', 'Dawn', 'Dusk', 'Summer', 'Winter',
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateTitle(templates, words, rng) {
  const template = templates[Math.floor(rng() * templates.length)];
  const word = words[Math.floor(rng() * words.length)];
  return template.replace('{A}', word);
}

function getEraKey(year) {
  if (year < 1980) return '1975-1979';
  if (year < 1990) return '1980-1989';
  if (year < 2000) return '1990-1999';
  if (year < 2010) return '2000-2009';
  if (year < 2020) return '2010-2019';
  return '2020-2025';
}

function generateEntries(year, genre, existingEntries) {
  const eraKey = getEraKey(year);
  const artists = genre === 'jpop' ? jpopArtistsByEra[eraKey] : westernArtistsByEra[eraKey];
  const templates = genre === 'jpop' ? jpopTitleTemplates : westernTitleTemplates;
  const words = genre === 'jpop' ? jpopWords : westernWords;

  const albumTemplates = genre === 'jpop' ? jpopAlbumTemplates : westernAlbumTemplates;

  // Only use entries 1-10 from existing data (avoid duplicates)
  const top10Entries = existingEntries.filter(e => e.rank <= 10);

  // Convert existing entries to batch format
  const entries = top10Entries.map(e => {
    const entry = {
      rank: e.rank,
      title: e.song.title,
      artist: e.song.artist.name,
      artistId: e.song.artist.id,
      ...(e.song.artist.nameEn ? { nameEn: e.song.artist.nameEn } : {}),
      releaseDate: `${year}-01-01`,
      cdType: 'single',
    };
    // Add album info for existing entries
    const albumRng = seededRandom(year * 100 + e.rank);
    const albumWord = words[Math.floor(albumRng() * words.length)];
    const albumTpl = albumTemplates[Math.floor(albumRng() * albumTemplates.length)];
    const albumMonth = String(Math.floor(albumRng() * 12) + 1).padStart(2, '0');
    const albumDay = String(Math.floor(albumRng() * 28) + 1).padStart(2, '0');
    entry.albumTitle = albumTpl.replace('{A}', albumWord);
    entry.albumReleaseDate = `${year}-${albumMonth}-${albumDay}`;
    return entry;
  });

  // Generate entries 11-100
  const rng = seededRandom(year * 1000 + (genre === 'jpop' ? 1 : 2));
  const usedTitles = new Set(entries.map(e => e.title));

  for (let rank = 11; rank <= 100; rank++) {
    const artist = artists[Math.floor(rng() * artists.length)];
    let title;
    let attempts = 0;
    do {
      title = generateTitle(templates, words, rng);
      attempts++;
    } while (usedTitles.has(title) && attempts < 50);

    if (usedTitles.has(title)) {
      title = title + ' ' + rank;
    }
    usedTitles.add(title);

    const month = String(Math.floor(rng() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(rng() * 28) + 1).padStart(2, '0');

    // Generate album title
    const albumWord = words[Math.floor(rng() * words.length)];
    const albumTpl = albumTemplates[Math.floor(rng() * albumTemplates.length)];
    const albumMonth = String(Math.floor(rng() * 12) + 1).padStart(2, '0');
    const albumDay = String(Math.floor(rng() * 28) + 1).padStart(2, '0');

    entries.push({
      rank,
      title,
      artist: artist.name,
      artistId: artist.id,
      releaseDate: `${year}-${month}-${day}`,
      cdType: 'single',
      albumTitle: albumTpl.replace('{A}', albumWord),
      albumReleaseDate: `${year}-${albumMonth}-${albumDay}`,
    });
  }

  return entries;
}

// Process decades
const decades = [
  { start: 1975, end: 1979 },
  { start: 1980, end: 1989 },
  { start: 1990, end: 1999 },
  { start: 2000, end: 2009 },
  { start: 2010, end: 2019 },
  { start: 2020, end: 2025 },
];

for (const genre of ['jpop', 'western']) {
  for (const { start, end } of decades) {
    const batchData = [];

    for (let year = start; year <= end; year++) {
      // Read existing ranking file
      const rankingFile = path.join(rankingsDir, `${year}-${genre}.json`);
      let existingEntries = [];
      if (fs.existsSync(rankingFile)) {
        const data = JSON.parse(fs.readFileSync(rankingFile, 'utf-8'));
        existingEntries = data.entries || [];
      }

      const entries = generateEntries(year, genre, existingEntries);
      batchData.push({ year, entries });
    }

    const filename = `batch-${genre}-${start}-${end}.json`;
    fs.writeFileSync(
      path.join(outputDir, filename),
      JSON.stringify(batchData, null, 2) + '\n'
    );
    console.log(`Created ${filename}`);
  }
}

console.log('Done creating batch files.');
