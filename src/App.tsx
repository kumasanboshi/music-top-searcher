import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopPage from './pages/TopPage'
import YearSelectPage from './pages/YearSelectPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/rankings/:genre" element={<YearSelectPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
