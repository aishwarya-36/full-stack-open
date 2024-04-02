import { useState, useEffect } from "react";
import axios from "axios";
import Country from "./Country";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div>{message}</div>;
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const countriesList = response.data.filter((country) =>
          country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (searchQuery.length > 0) {
          if (countriesList.length > 10) {
            setMessage("Too many matches,specify another filter");
            setCountries([]);
          } else {
            setMessage(null);
            setCountries(countriesList);
          }
        } else setMessage(null);
      })
      .catch((error) => console.log(error));
  }, [searchQuery]);

  return (
    <div>
      Find countries
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Notification message={message} />
      <ol>
        {countries?.map((country, i) => (
          <li key={i}>
            <Country key={i} country={country} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
