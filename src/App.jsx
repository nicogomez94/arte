import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/galeria" element={<Gallery />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
