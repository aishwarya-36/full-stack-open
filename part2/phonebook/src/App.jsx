import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas" },
    { name: "Ada Lovelace" },
  ]);
  const [newName, setNewName] = useState("");

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const personObject = {
      name: newName,
    };
    if (persons.filter((person) => person.name === newName).length != 0) {
      alert(`${newName} is already added to the phonebook`);
    } else setPersons(persons.concat(personObject));
    setNewName("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNewName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => {
          return <li key={person.name}>{person.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default App;
