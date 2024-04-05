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
      const filteredPersons = response.data.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPersons(filteredPersons);
    });
  }, [searchQuery]);
  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };
    // Alert if the name and number already matches the on in the phonebook.
    if (
      persons.filter(
        (person) => person.name === newName && person.number === newNumber
      ).length != 0
    ) {
      window.alert(`${newName} is already added to phonebook`);

      // If the number is different, then confirm if the user wants to update
    } else if (
      persons.filter((person) => person.name === newName).length != 0
    ) {
      // Filter returns the object in an array, so the indexing is used to assign the object to the variable.
      const existingPerson = persons.filter(
        (person) => person.name === newName
      )[0];

      window.confirm(
        `${newName} is already added to the phonebook, replace the old number with the new one?`
      )
        ? personService
            .update(existingPerson.id, personObject)
            .then((response) => {
              setPersons(
                persons.map((person) =>
                  person.id !== existingPerson.id ? person : response.data
                )
              );
            })
        : null;
    } else personService.add(personObject);
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
      <Filter
        searchQuery={searchQuery}
        handleSearch={(e) => setSearchQuery(e.target.value)}
      />
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
