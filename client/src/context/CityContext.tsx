import React, { createContext, useContext, useState, useEffect } from 'react';
import { City } from '../types';
import { cinebookApi } from '../api/cinebookApi';

interface CityContextType {
  currentCity: City;
  cities: City[];
  isCityModalOpen: boolean;
  openCityModal: () => void;
  closeCityModal: () => void;
  selectCity: (city: City) => void;
}

const defaultCity: City = {
  id: 'mumbai',
  name: 'Mumbai',
  state: 'Maharashtra',
  isPopular: true,
  monumentIcon: '🏛️'
};

const CityContext = createContext<CityContextType>({
  currentCity: defaultCity,
  cities: [defaultCity],
  isCityModalOpen: false,
  openCityModal: () => {},
  closeCityModal: () => {},
  selectCity: () => {}
});

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([defaultCity]);
  const [currentCity, setCurrentCity] = useState<City>(() => {
    const saved = localStorage.getItem('cinebook_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultCity;
      }
    }
    return defaultCity;
  });
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    cinebookApi.getCities().then((data) => {
      if (data && data.length > 0) {
        setCities(data);
        const match = data.find((c) => c.id === currentCity.id);
        if (match) setCurrentCity(match);
      }
    }).catch(console.error);
  }, []);

  const selectCity = (city: City) => {
    setCurrentCity(city);
    localStorage.setItem('cinebook_city', JSON.stringify(city));
    setIsCityModalOpen(false);
  };

  return (
    <CityContext.Provider
      value={{
        currentCity,
        cities,
        isCityModalOpen,
        openCityModal: () => setIsCityModalOpen(true),
        closeCityModal: () => setIsCityModalOpen(false),
        selectCity
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
