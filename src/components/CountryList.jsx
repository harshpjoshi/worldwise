import styles from "./CountryList.module.css";
import Spinner from "../components/Spinner";
import CountryItem from "./CountryItem";
import Message from "../components/Message";
import { useCities } from "../contexts/CitiesContexts";

function CountryList() {
  const { loading, cities } = useCities();

  if (loading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first country by clicking on the map" />;

  const countries = cities.reduce((arrayAcc, city) => {
    if (!arrayAcc.map((e) => e.country).includes(city.country)) {
      return [...arrayAcc, { country: city.country, emoji: city.emoji }];
    } else return arrayAcc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
