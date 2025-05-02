import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import DetailPage from './pages/DetailPage';
import ComparePage from './pages/ComparePage';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CompareProvider } from './contexts/CompareContext';
import ErrorBoundary from './components/ErrorBoundary';
import NavBar from './components/NavBar';

function App() {
  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <CompareProvider>
          <div className="app-container">
            <NavBar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/pokemon/:id" element={<DetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
              </Routes>
            </main>
          </div>
        </CompareProvider>
      </FavoritesProvider>
    </ErrorBoundary>
  );
}

export default App;