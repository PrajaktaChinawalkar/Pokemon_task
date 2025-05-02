import { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (pokemon) => {
    setCompareList((prev) => {
      // Only allow maximum of 2 pokemon for comparison
      if (prev.length >= 2) {
        return [...prev.slice(1), pokemon];
      }
      return [...prev, pokemon];
    });
  };

  const removeFromCompare = (pokemonId) => {
    setCompareList((prev) => 
      prev.filter((p) => p.id !== pokemonId)
    );
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);