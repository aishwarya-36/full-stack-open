import { useState, useEffect } from "react";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import Filter from "./Filter";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    personService.fetch().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (searchQuery != "") {
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
      id: (persons.length + 1).toString(),
    };
    if (persons.filter((person) => person.name === newName).length != 0) {
      alert(`${newName} is already added to the phonebook`);
    } else {
      personService.add(personObject).then((response) => {
        setPersons(persons.concat(response.data));
      });
    }

    setNewName("");
    setNewNumber("");
  };

  const handleDelete = (id) => {
    const delPerson = persons.find((n) => n.id === id);
    window.confirm(`Delete ${delPerson.name} ?`)
      ? personService
          .del(id)
          .then((response) =>
            setPersons(
              persons.filter((persons) => persons.id !== response.data.id)
            )
          )
      : null;
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
      <Persons persons={persons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
