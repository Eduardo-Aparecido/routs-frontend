import { Navigate, Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { News } from './pages/News';
import { Cinema } from './pages/Cinema';
import { Restaurants } from './pages/Restaurants';

export default function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/noticias"
            element={<News />}
          />

          <Route
            path="/cinema"
            element={<Cinema />}
          />

          <Route
            path="/restaurantes"
            element={<Restaurants />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

