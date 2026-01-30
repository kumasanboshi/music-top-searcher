import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopPage from './pages/TopPage'
import YearSelectPage from './pages/YearSelectPage'
import RankingListPage from './pages/RankingListPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/rankings/:genre" element={<YearSelectPage />} />
        <Route path="/rankings/:genre/:year" element={<RankingListPage />} />
        <Route
          path="/rankings/:genre/decade/:decade"
          element={<RankingListPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
