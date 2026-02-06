import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import OfflineBanner from './components/OfflineBanner'
import TopPage from './pages/TopPage'
import YearSelectPage from './pages/YearSelectPage'
import RankingListPage from './pages/RankingListPage'
import SongDetailPage from './pages/SongDetailPage'
import SearchPage from './pages/SearchPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
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
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
