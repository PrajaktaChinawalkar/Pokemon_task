import { useState, useEffect, useCallback } from 'react';

function usePokemonList(initialPage = 1, initialItemsPerPage = 10) {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [allPokemonIds, setAllPokemonIds] = useState([]);

  // Fetch the initial count and basic list of all Pokemon
  useEffect(() => {
    const fetchPokemonCount = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        const data = await response.json();
        setTotalCount(data.count);
        
        // Fetch all Pokemon IDs for random selection
        const allResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${data.count}`);
        const allData = await allResponse.json();
        const ids = allData.results.map(p => {
          // Extract ID from URL: https://pokeapi.co/api/v2/pokemon/1/
          const urlParts = p.url.split('/');
          return parseInt(urlParts[urlParts.length - 2]);
        });
        setAllPokemonIds(ids);
      } catch (err) {
        setError('Failed to fetch Pokemon count');
        console.error(err);
      }
    };
    
    fetchPokemonCount();
  }, []);

  // Fetch Pokemon for the current page
  useEffect(() => {
    const fetchPokemonPage = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * itemsPerPage;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`);
        const data = await response.json();
        
        // Fetch detailed information for each Pokemon
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            return await pokemonResponse.json();
          })
        );
        
        setPokemonList(detailedPokemon);
        setFilteredList(detailedPokemon);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        setLoading(false);
        console.error(err);
      }
    };
    
    if (totalCount > 0) {
      fetchPokemonPage();
    }
  }, [page, itemsPerPage, totalCount]); // Dependencies correctly set

  // Filter Pokemon by type
  const filterByTypes = useCallback((types) => {
    if (!types || types.length === 0) {
      setFilteredList(pokemonList);
      return;
    }
    
    const filtered = pokemonList.filter(pokemon => {
      const pokemonTypes = pokemon.types.map(t => t.type.name);
      return types.some(type => pokemonTypes.includes(type));
    });
    
    setFilteredList(filtered);
  }, [pokemonList]);

  // Sort Pokemon by different criteria
  const sortPokemon = useCallback((sortOption) => {
    const [field, direction] = sortOption.split('-');
    
    const sorted = [...filteredList].sort((a, b) => {
      if (field === 'id') {
        return direction === 'asc' ? a.id - b.id : b.id - a.id;
      } else if (field === 'name') {
        return direction === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
    
    setFilteredList(sorted);
  }, [filteredList]);

  // Get a random Pokemon ID for the random Pokemon feature
  const getRandomPokemonId = useCallback(() => {
    if (allPokemonIds.length === 0) return 1;
    const randomIndex = Math.floor(Math.random() * allPokemonIds.length);
    return allPokemonIds[randomIndex];
  }, [allPokemonIds]);

  return {
    pokemonList: filteredList,
    loading,
    error,
    totalCount,
    filterByTypes,
    sortPokemon,
    getRandomPokemonId,
    page,
    itemsPerPage,
    setPage: (newPage) => {
      setPage(newPage);
    },
    setItemsPerPage: (newItems) => {
      setItemsPerPage(newItems);
      setPage(1); // Reset to first page when changing items per page
    }
  };
}

export default usePokemonList;