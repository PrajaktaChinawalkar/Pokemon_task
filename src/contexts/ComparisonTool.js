import React from 'react';
import { useCompare } from '../contexts/CompareContext';
import { Link } from 'react-router-dom';

function ComparisonTool() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return null;
  }

  return (
    <div className="comparison-container">
      <h2>Pokémon Comparison</h2>
      <button className="clear-btn" onClick={clearCompare}>Clear All</button>

      <div className="pokemon-comparison">
        {compareList.map((pokemon) => (
          <div key={pokemon.id} className="compare-pokemon-card">
            <h3>{pokemon.name}</h3>
            <img 
              src={pokemon.sprites.front_default} 
              alt={pokemon.name} 
              className="compare-pokemon-image"
            />
            <button 
              onClick={() => removeFromCompare(pokemon.id)}
              className="remove-btn"
            >
              Remove
            </button>
            <Link to={`/pokemon/${pokemon.id}`} className="view-details-btn">
              View Details
            </Link>
            
            <div className="stat-container">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-bar">
                  <div className="stat-name">{stat.stat.name}</div>
                  <div className="stat-bar-container">
                    <div 
                      className="stat-bar-fill" 
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    >
                      {stat.base_stat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="types">
              {pokemon.types.map((type) => (
                <span key={type.type.name} className={`type ${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {compareList.length === 1 && (
          <div className="empty-comparison">
            <p>Add one more Pokémon to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonTool;