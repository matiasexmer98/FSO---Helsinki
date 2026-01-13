import personService from "../services/persons.js";
const PersonForm = ({
  persons,
  newName,
  newNumber,
  setPersons,
  setNewName,
  setNewNumber,
  setMessage,
  setError,
}) => {
  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} already exists on phonebook`)) {
        const personChanged = {
          ...existingPerson,
          number: newNumber,
        };

        personService
          .update(existingPerson.id, personChanged)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            );
            setMessage(`Updated ${personChanged.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
            setError(
              `Information of ${existingPerson.name} has already been  removed from server `
            );
          });
      }
    } else {
      if (newName.length < 3) {
        setError(`Name ${newName} is too short (min 3 characters) `);
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personService
        .create(personObject)
        .then((response) => {
          if (response && response.data) {
            setPersons(persons.concat(response.data));
            setNewName("");
            setNewNumber("");
            setMessage(`Added ${personObject.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response.data.error;
          setError(errorMessage);
          setTimeout(() => {
            setError(null);
          }, 5000);
        });
    }
  };

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
