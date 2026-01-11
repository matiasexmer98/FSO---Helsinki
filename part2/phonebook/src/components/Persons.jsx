import personService from "../services/persons.js";
const deleteFunction = (id, name) => {
  if (window.confirm(`Delete ${name}?`)) {
    personService
      .deletePerson(id)
      .then((response) => console.log(`person deleted ${response}`));
  }
};
const Persons = ({ personsToShow }) => {
  return (
    <>
      {personsToShow.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}
          <button
            onClick={() => {
              deleteFunction(person.id, person.name);
            }}
          >
            delete
          </button>
        </li>
      ))}
    </>
  );
};

export default Persons;
