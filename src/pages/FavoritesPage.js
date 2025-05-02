import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import FilterSort from '../components/FilterSort';
import ErrorBoundary from '../components/ErrorBoundary';


function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);
  
  const handleSort = (sortOption) => {
    const [field, direction] = sortOption.split('-');
    
    const sorted = [...filteredFavorites].sort((a, b) => {
      if (field === 'id') {
        return direction === 'asc' ? a.id - b.id : b.id - a.id;
      } else if (field === 'name') {
        return direction === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
    
    setFilteredFavorites(sorted);
  };
  
  const handleFilter = (types) => {
    if (types.length === 0) {
      setFilteredFavorites(favorites);
      return;
    }
    
    const filtered = favorites.filter(pokemon => {
      const pokemonTypes = pokemon.types.map(t => t.type.name);
      return types.some(type => pokemonTypes.includes(type));
    });
    
    setFilteredFavorites(filtered);
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="main-title">My Favorite Pokémon</h1>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/favorites" className="nav-link active">Favorites ({favorites.length})</Link>
        </div>
      </header>

      {favorites.length > 0 && (
        <ErrorBoundary>
          <FilterSort onSort={handleSort} onFilter={handleFilter} />
        </ErrorBoundary>
      )}
      
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-message">
            <h2>No favorites yet!</h2>
            <p>Go to the home page and click the heart icon to add Pokémon to your favorites.</p>
            <Link to="/" className="go-home-button">
              Explore Pokémon
            </Link>
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-message">
            <h2>No matches found</h2>
            <p>Try adjusting your filters to see some of your favorite Pokémon.</p>
          </div>
        </div>
      ) : (
        <ErrorBoundary>
          <div className="pokemon-grid favorites-grid">
            {filteredFavorites.map((pokemon) => (
              <div key={pokemon.id} className="pokemon-card favorite-card">
                <div className="pokemon-image-container">
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={pokemon.name} 
                    className="pokemon-image"
                  />
                </div>
                <div className="pokemon-info">
                  <h3 className="pokemon-name">
                    <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
                  </h3>
                  <div className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</div>
                  <div className="pokemon-types">
                    {pokemon.types.map(typeInfo => (
                      <span 
                        key={typeInfo.type.name} 
                        className={`type-badge type-${typeInfo.type.name}`}
                      >
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  className="favorite-button favorited" 
                  onClick={() => toggleFavorite(pokemon)}
                  aria-label="Remove from favorites"
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default FavoritesPage;