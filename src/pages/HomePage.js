import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import usePokemonList from '../hooks/usePokemonList';
import FilterSort from '../components/FilterSort';
import ErrorBoundary from '../components/ErrorBoundary';


function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(10);
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  
  const { 
    pokemonList, 
    loading, 
    error, 
    totalCount,
    filterByTypes, 
    sortPokemon,
    getRandomPokemonId,
    setPage,
    setItemsPerPage
  } = usePokemonList(currentPage, currentItemsPerPage);
  
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / currentItemsPerPage);
  }, [totalCount, currentItemsPerPage]);

  const handleItemsPerPageChange = useCallback((e) => {
    const newItemsPerPage = Number(e.target.value);
    setCurrentItemsPerPage(newItemsPerPage);
    setItemsPerPage(newItemsPerPage);
  }, [setItemsPerPage]);
  
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  }, [setPage]);
  
  const handleSort = useCallback((sortOption) => {
    sortPokemon(sortOption);
  }, [sortPokemon]);
  
  const handleFilter = useCallback((types) => {
    filterByTypes(types);
  }, [filterByTypes]);
  
  const handleRandomPokemon = useCallback(() => {
    const randomId = getRandomPokemonId();
    navigate(`/pokemon/${randomId}`);
  }, [getRandomPokemonId, navigate]);
  
  if (error) return (
    <div className="error-container">
      <div className="error-message">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <header className="app-header">
        <button 
          className="random-pokemon-btn"
          onClick={handleRandomPokemon}
        >
          Random Pokémon
        </button>
      </header>
    
      <ErrorBoundary>
        <FilterSort onSort={handleSort} onFilter={handleFilter} />
      </ErrorBoundary>

      <div className="controls">
        <label>Items per page:</label>
        <select 
          value={currentItemsPerPage} 
          onChange={handleItemsPerPageChange} 
          className="items-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading Pokémon...</div>
      ) : (
        <ErrorBoundary>
          <div className="pokemon-grid">
            {pokemonList.length > 0 ? pokemonList.map((pokemon) => (
              <div key={pokemon.id} className="pokemon-card">
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
                  className={`favorite-button ${favorites.some(f => f.id === pokemon.id) ? 'favorited' : ''}`} 
                  onClick={() => toggleFavorite(pokemon)}
                  aria-label={favorites.some(f => f.id === pokemon.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favorites.some(f => f.id === pokemon.id) ? '❤️' : '🤍'}
                </button>
              </div>
            )) : (
              <div className="no-results">
                <p>No Pokémon found matching your filters.</p>
                <button onClick={() => filterByTypes([])} className="reset-button">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </ErrorBoundary>
      )}

      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;