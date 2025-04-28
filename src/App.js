import { useEffect, useState } from "react";
import "./App.css"; // import the CSS file

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();

        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemonList(detailedPokemon);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokémon!");
        setLoading(false);
      }
    }

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === "" || pokemon.types.some(t => t.type.name === selectedType))
  );

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  }

  return (
    <div>
      <h1>Pokémon Explorer</h1>

      {/* Search and Filter */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input 
          type="text" 
          placeholder="Search Pokémon..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="grass">Grass</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="bug">Bug</option>
          <option value="normal">Normal</option>
          <option value="poison">Poison</option>
          <option value="electric">Electric</option>
          <option value="ground">Ground</option>
          <option value="fairy">Fairy</option>
          <option value="fighting">Fighting</option>
          <option value="psychic">Psychic</option>
          <option value="rock">Rock</option>
          <option value="ghost">Ghost</option>
          <option value="ice">Ice</option>
          <option value="dragon">Dragon</option>
          <option value="dark">Dark</option>
          <option value="steel">Steel</option>
          <option value="flying">Flying</option>
        </select>
      </div>

      {/* Pokémon Cards */}
      <div className="pokemon-container">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <h3>{pokemon.name}</h3>
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name} 
              />
              <p><strong>ID:</strong> {pokemon.id}</p>
              <p className="pokemon-type"><strong>Type:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", fontSize: "18px" }}>No Pokémon found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
