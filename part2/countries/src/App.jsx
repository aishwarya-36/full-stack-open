import { useState, useEffect } from "react";
import axios from "axios";

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
      Find countries{" "}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Notification message={message} />
      <div>
        {countries.length === 1 ? (
          <div>
            <h2> {countries[0].name.common}</h2>
            <p>
              Capital(s):{" "}
              {countries[0].capital.map((item, index) => (
                <span key={item}>
                  {item}
                  {index !== countries[0].capital.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p>Area: {countries[0].area}</p>
            <h3>Languages:</h3>
            <ul>
              {Object.keys(countries[0].languages).map((lang) => (
                <li key={lang}>{countries[0].languages[lang]}</li>
              ))}
            </ul>
            <h3>Flag: </h3>
            <img
              src={countries[0].flags.png}
              alt="flag"
              height="200"
              width="250"
            />
          </div>
        ) : (
          <ol>
            {countries?.map((country) => (
              <li key={country.cca2}> {country.name.common}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default App;
