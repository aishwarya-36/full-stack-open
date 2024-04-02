import { useState } from "react";

const Country = ({ country }) => {
  const [show, setShow] = useState();

  return (
    <div>
      <h4>
        {country.name.common}
        <button
          key={country.ccn3}
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? "hide" : "show"}
        </button>
      </h4>
      {show ? (
        <div key={country.ccn3}>
          <p>
            Capital(s):
            {country.capital.map((item, index) => (
              <span key={item}>
                {item}
                {index !== country.capital.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <p>Area: {country.area}</p>
          <h5>Languages:</h5>
          <ul>
            {Object.keys(country.languages).map((lang) => (
              <li key={lang}>{country.languages[lang]}</li>
            ))}
          </ul>
          <h5>Flag: </h5>
          <img src={country.flags.png} alt="flag" height="200" width="250" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Country;
