import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  // Inicializar el estado desde localStorage o usar valores por defecto
  const initialMenuData = JSON.parse(localStorage.getItem('menuData')) || {
    Almuerzo: {
      note: '',
      mainDish: '',
      drink: '',
      dessert: '',
      price: 0,
    },
    Refrigerio: {
      note: '',
      appetizer: '',
      drink: '',
      price: 0,
    },
  };

  const [menuData, setMenuData] = useState(initialMenuData);

  // Guardar el estado del menú en localStorage cada vez que se actualice
  useEffect(() => {
    localStorage.setItem('menuData', JSON.stringify(menuData));
  }, [menuData]);

  return (
    <MenuContext.Provider value={{ menuData, setMenuData }}>
      {children}
    </MenuContext.Provider>
  );
};
