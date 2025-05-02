import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCompare } from '../contexts/CompareContext';

function NavBar() {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { compareList } = useCompare();

  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <h1>Pokémon Explorer</h1>
      </div>
      
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/favorites' ? 'active' : ''}>
          <Link to="/favorites">
            Favorites
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </Link>
        </li>
        {compareList.length > 0 && (
          <li className={location.pathname === '/compare' ? 'active' : ''}>
            <Link to="/compare">
              Compare
              <span className="badge">{compareList.length}/2</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;