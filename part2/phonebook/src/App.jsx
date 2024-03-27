import { useState } from "react";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import Filter from "./Filter";

const App = () => {
  const personsInit = [
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ];
  const [persons, setPersons] = useState(personsInit);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (searchQuery === "") setPersons(personsInit);
    else {
      const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPersons(filteredPersons);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };
    if (persons.filter((person) => person.name === newName).length != 0) {
      alert(`${newName} is already added to the phonebook`);
    } else setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} handleSearch={handleSearch} />
      <h3>Add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} />
    </div>
  );
};

export default App;
