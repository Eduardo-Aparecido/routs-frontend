import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { News } from './pages/News';
import { Cinema } from './pages/Cinema';

export default function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/cinema" element={<Cinema />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}