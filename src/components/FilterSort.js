import React, { useState, useEffect, useCallback } from 'react';



function FilterSort({ onSort, onFilter }) {
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState('id-asc');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch types only once when component mounts
  useEffect(() => {
    setIsLoading(true);
    fetch('https://pokeapi.co/api/v2/type')
      .then(res => res.json())
      .then(data => {
        setTypes(data.results);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching types:', err);
        setIsLoading(false);
      });
  }, []);

  const handleTypeToggle = useCallback((type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  // Apply filter whenever selected types change
  useEffect(() => {
    onFilter(selectedTypes);
  }, [selectedTypes, onFilter]);

  // Apply sort whenever sort option changes
  const handleSortChange = useCallback((e) => {
    const value = e.target.value;
    setSortOption(value);
    onSort(value);
  }, [onSort]);

  return (
    <div className="filter-sort-container">
      <div className="sort-section">
        <h3>Sort By</h3>
        <select value={sortOption} onChange={handleSortChange} className="sort-select">
          <option value="id-asc">ID (Low to High)</option>
          <option value="id-desc">ID (High to Low)</option>
          <option value="name-asc">Name (A to Z)</option>
          <option value="name-desc">Name (Z to A)</option>
        </select>
      </div>
      
      <div className="filter-section">
        <h3>Filter By Type</h3>
        {isLoading ? (
          <div className="loading-indicator">Loading types...</div>
        ) : (
          <div className="type-buttons">
            {types.map(type => (
              <button
                key={type.name}
                className={`type-button ${selectedTypes.includes(type.name) ? 'selected' : ''} type-${type.name}`}
                onClick={() => handleTypeToggle(type.name)}
              >
                {type.name}
              </button>
            ))}
          </div>
        )}
        {selectedTypes.length > 0 && (
          <button 
            className="clear-filters-button"
            onClick={() => setSelectedTypes([])}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterSort;