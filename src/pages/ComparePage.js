import React from 'react';
import { useCompare } from '../contexts/CompareContext';
import { Link } from 'react-router-dom';


function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="empty-state">
        <h1>Pokémon Comparison</h1>
        <p>You haven't added any Pokémon to compare yet.</p>
        <Link to="/" className="btn">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Pokémon Comparison</h1>
        <button onClick={clearCompare} className="clear-btn">Clear All</button>
      </div>

      <div className="comparison-grid">
        {/* First column - categories */}
        <div className="comparison-categories">
          <div className="category-header">Pokémon</div>
          <div className="category-item">ID</div>
          <div className="category-item">Type</div>
          <div className="category-item">Height</div>
          <div className="category-item">Weight</div>
          
          <div className="category-header">Base Stats</div>
          {compareList.length > 0 && 
            compareList[0].stats.map(stat => (
              <div key={stat.stat.name} className="category-item">
                {stat.stat.name}
              </div>
            ))
          }
          
          <div className="category-header">Abilities</div>
        </div>

        {/* Pokemon columns */}
        {compareList.map(pokemon => (
          <div key={pokemon.id} className="comparison-pokemon">
            <div className="pokemon-header">
              <h3>{pokemon.name}</h3>
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name} 
              />
              <div className="pokemon-actions">
                <Link to={`/pokemon/${pokemon.id}`} className="btn">View Details</Link>
                <button 
                  onClick={() => removeFromCompare(pokemon.id)}
                  className="btn remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="pokemon-item">{pokemon.id}</div>
            <div className="pokemon-item types">
              {pokemon.types.map(t => (
                <span key={t.type.name} className={`type ${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
            <div className="pokemon-item">{(pokemon.height / 10).toFixed(1)}m</div>
            <div className="pokemon-item">{(pokemon.weight / 10).toFixed(1)}kg</div>

            <div className="pokemon-header">Stats</div>
            {pokemon.stats.map(stat => (
              <div key={stat.stat.name} className="pokemon-item stat">
                <div className="stat-value">{stat.base_stat}</div>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar-fill" 
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="pokemon-header">Abilities</div>
            <div className="pokemon-item abilities">
              {pokemon.abilities.map(a => (
                <div key={a.ability.name} className="ability">
                  {a.ability.name}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty column for single Pokemon */}
        {compareList.length === 1 && (
          <div className="comparison-empty">
            <div className="empty-header">
              <p>Add another Pokémon to compare</p>
              <Link to="/" className="btn">Return to Home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;