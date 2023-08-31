import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:8000/cities";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      setLoading(true);
      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Something went wrong.");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) throw new Error("Something went wrong.");
      const data = await response.json();
      setCurrentCity(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, loading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
