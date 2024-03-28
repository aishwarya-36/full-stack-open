import { useState, useEffect } from "react";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import Filter from "./Filter";
import personService from "./services/persons";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notification">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState(null);

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
              setMessage(`Updated ${response.data.name}`);
              setTimeout(() => {
                setMessage(null);
              }, 2000);
            })
        : null;
    } else {
      personService.add(personObject).then((response) => {
        setPersons(persons.concat(response.data));
        setMessage(`Added ${response.data.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
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
      <Notification message={message} />
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
