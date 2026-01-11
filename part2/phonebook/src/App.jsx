import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import personService from "./services/persons";
import Error from "./components/Error";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filteredName, setFilteredName] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((response) => {
      console.log("promise fullfilled");
      setPersons(response.data);
    });
  }, []);

  const personsToShow =
    filteredName === ""
      ? persons
      : persons.filter((person) =>
          person.name.trim().toLowerCase().includes(filteredName)
        );

  return (
    <div>
      <Error error={error} />
      <Notification message={message} />
      <h2>Phonebook</h2>
      <Filter setFilteredName={setFilteredName} />
      <h2>add a new</h2>
      <PersonForm
        persons={persons}
        newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setMessage={setMessage}
        setError={setError}
      />
      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
