import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Accueil from './pages/Home'

function App() {

  return (
    <BrowserRouter>
      {/* On place le ConfirmProvider ici */}
        <Routes>
          <Route path='/smartschool' element={<Accueil />} />
          <Route path="/" element={<Navigate to="/smartschool" replace />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    </BrowserRouter>
  )
}

export default App
