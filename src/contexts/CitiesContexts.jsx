import { createContext, useEffect, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:8000/cities";

const CitiesContext = createContext();

const initialState = {
  loading: false,
  cities: [],
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "cities/loaded":
      return { ...state, loading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, loading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        loading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error("Event not found");
  }
}

function CitiesProvider({ children }) {
  const [{ loading, cities, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Something went wrong.");
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.log(error.message);
        dispatch({ type: "rejected", payload: error.message });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) throw new Error("Something went wrong.");
      const data = await response.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Something went wrong.");
      const data = await response.json();
      console.log(data);
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Something went wrong.");
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, loading, currentCity, getCity, createCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
