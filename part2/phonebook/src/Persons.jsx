const Persons = ({ persons, handleDelete }) => {
  return (
    <ul>
      {persons.map((person) => {
        return (
          <li key={person.id}>
            {person.name} {person.number}
            {"  "}
            <button type="submit" onClick={() => handleDelete(person.id)}>
              delete
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Persons;
