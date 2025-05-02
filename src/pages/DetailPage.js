import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCompare } from '../contexts/CompareContext';
import ErrorBoundary from '../components/ErrorBoundary';


function DetailPage() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCompare, compareList } = useCompare();
  const navigate = useNavigate();
  
  const isFavorite = pokemon && favorites.some(f => f.id === pokemon.id);
  const isInCompare = pokemon && compareList.some(p => p.id === pokemon.id);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch basic Pokemon data
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!pokemonRes.ok) throw new Error('Failed to fetch Pokemon');
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);
        
        // Fetch species data to get evolution chain
        const speciesRes = await fetch(pokemonData.species.url);
        if (!speciesRes.ok) throw new Error('Failed to fetch species data');
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);
        
        // Fetch evolution chain
        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        if (!evolutionRes.ok) throw new Error('Failed to fetch evolution data');
        const evolutionData = await evolutionRes.json();
        setEvolution(evolutionData);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  // Function to extract evolution data in a usable format
  const getEvolutionChain = (chain) => {
    const evoChain = [];
    let currentEvo = chain;
    
    do {
      const speciesName = currentEvo.species.name;
      const speciesUrl = currentEvo.species.url;
      // Extract ID from URL (URL format: https://pokeapi.co/api/v2/pokemon-species/{id}/)
      const urlParts = speciesUrl.split('/');
      const speciesId = urlParts[urlParts.length - 2];
      
      evoChain.push({
        name: speciesName,
        id: speciesId,
        min_level: currentEvo.evolution_details[0]?.min_level || null,
        trigger: currentEvo.evolution_details[0]?.trigger?.name || null,
        item: currentEvo.evolution_details[0]?.item?.name || null
      });
      
      currentEvo = currentEvo.evolves_to[0];
    } while (currentEvo && currentEvo.hasOwnProperty('evolves_to'));
    
    return evoChain;
  };

  const handleCompare = () => {
    if (pokemon) {
      addToCompare(pokemon);
      navigate('/compare');
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!pokemon) return <div className="error-message">Pokemon not found</div>;

  const evolutionChain = evolution ? getEvolutionChain(evolution.chain) : [];

  return (
    <div className="container">
      <div className="detail-page">
        <div className="detail-header">
          <h1 className="pokemon-title">
            {pokemon.name} <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
          </h1>
          
          <div className="action-buttons">
            <button 
              className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(pokemon)}
            >
              {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
            
            <button 
              className={`compare-button ${isInCompare ? 'in-compare' : ''}`} 
              onClick={handleCompare}
            >
              {isInCompare ? 'Already in Compare' : 'Add to Compare'}
            </button>
          </div>
        </div>

        <div className="detail-main">
          <div className="detail-image-section">
            <div className="pokemon-image-large">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
              />
            </div>
            
            <div className="pokemon-types detail-types">
              {pokemon.types.map(typeInfo => (
                <span 
                  key={typeInfo.type.name} 
                  className={`type-badge type-${typeInfo.type.name}`}
                >
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
            
            <div className="pokemon-basic-info">
              <div className="info-item">
                <span className="info-label">Height:</span>
                <span className="info-value">{pokemon.height / 10} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight:</span>
                <span className="info-value">{pokemon.weight / 10} kg</span>
              </div>
              {species && (
                <div className="info-item">
                  <span className="info-label">Habitat:</span>
                  <span className="info-value">{species.habitat?.name || 'Unknown'}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-info-section">
            <ErrorBoundary>
              <div className="detail-section">
                <h3 className="section-title">Stats</h3>
                <div className="stat-bars">
                  {pokemon.stats.map((s) => (
                    <div key={s.stat.name} className="stat-bar-container">
                      <div className="stat-name">{s.stat.name}</div>
                      <div className="stat-bar-wrapper">
                        <div 
                          className="stat-bar" 
                          style={{ width: `${(s.base_stat / 255) * 100}%` }}
                        >
                          <span className="stat-value">{s.base_stat}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ErrorBoundary>

            <ErrorBoundary>
              <div className="detail-section">
                <h3 className="section-title">Abilities</h3>
                {/* <ul className="ability-list">
                  {pokemon.abilities.map((a) => (
                    <li key={a.ability.name} className="ability-item">
                      <span className="ability-name">{a.ability.name}</span>
                      {a.is_hidden && <span className="hidden-badge">Hidden</span>}
                    </li>
                  ))}
                </ul> */}
              <ul className="ability-list">
                  {pokemon.abilities.map((a, index) => (
                      <li key={`${a.ability.name}-${pokemon.id}-${index}`} className="ability-item">
                        <span className="ability-name">{a.ability.name}</span>
                            {a.is_hidden && <span className="hidden-badge">Hidden</span>}
                      </li>
                   ))}
                </ul>
              </div>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <div className="detail-section">
                <h3 className="section-title">Evolution Chain</h3>
                {evolutionChain.length > 0 ? (
                  <div className="evolution-chain">
                    {evolutionChain.map((evo, index) => (
                      <React.Fragment key={evo.id}>
                        <div className="evolution-item">
                          <Link to={`/pokemon/${evo.id}`} className="evolution-link">
                            <div className="evolution-name">{evo.name}</div>
                          </Link>
                          {evo.min_level && (
                            <div className="evolution-level">Level {evo.min_level}</div>
                          )}
                          {evo.trigger && evo.trigger !== 'level-up' && (
                            <div className="evolution-trigger">{evo.trigger}</div>
                          )}
                          {evo.item && (
                            <div className="evolution-item-required">{evo.item}</div>
                          )}
                        </div>
                        {index < evolutionChain.length - 1 && (
                          <div className="evolution-arrow">→</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p>No evolution data available</p>
                )}
              </div>
            </ErrorBoundary>
          </div>
        </div>

        <ErrorBoundary>
          <div className="detail-section moves-section">
            <h3 className="section-title">Moves</h3>
            <div className="moves-list">
              {pokemon.moves.slice(0, 20).map((m) => (
                <span key={m.move.name} className="move-chip">
                  {m.move.name}
                </span>
              ))}
              {pokemon.moves.length > 20 && (
                <span className="more-moves">+{pokemon.moves.length - 20} more</span>
              )}
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default DetailPage;