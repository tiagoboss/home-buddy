import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'imoveis_favoritos';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    } catch (err) {
      console.error('Error saving favorites:', err);
    }
  }, [favoritos]);

  const toggleFavorito = useCallback((id: string) => {
    setFavoritos(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    );
  }, []);

  const isFavorito = useCallback((id: string) => {
    return favoritos.includes(id);
  }, [favoritos]);

  return { favoritos, toggleFavorito, isFavorito };
};
