import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OfflineBanner from './components/OfflineBanner'
import TopPage from './pages/TopPage'
import YearSelectPage from './pages/YearSelectPage'
import RankingListPage from './pages/RankingListPage'
import SongDetailPage from './pages/SongDetailPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/rankings/:genre" element={<YearSelectPage />} />
        <Route path="/rankings/:genre/:year" element={<RankingListPage />} />
        <Route
          path="/rankings/:genre/decade/:decade"
          element={<RankingListPage />}
        />
        <Route path="/songs/:genre/:songId" element={<SongDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
