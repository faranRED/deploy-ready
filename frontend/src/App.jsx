import { useState, useEffect } from "react";
import personServices from "./services/persons";

const PersonForm = ({
  persons,
  setPersons,
  newName,
  newNumber,
  setNewName,
  setNewNumber,
}) => {
  const checkDuplicates = (newPerson) => {
    const result = persons.find((person) => person.name === newName);
    if (!!result === false) {
      console.log(!!result);
      console.log(newPerson);
      personServices.createPerson(newPerson).then((createdPerson) => {
        setPersons(persons.concat(createdPerson));
        setNewName("");
        setNewNumber("");
      });
    } else if (!!result === true && result.number != newNumber) {
      if (window.confirm(`Do you want to update the number ?`)) {
        const updatedPerson = { ...result, number: newNumber };
        personServices
          .updatePerson(result.id, updatedPerson)
          .then(
            (response) =>
              setPersons(
                persons.map((person) =>
                  person.id === result.id ? response : person,
                ),
              ),
            setNewName(""),
            setNewNumber(""),
          );
      } else {
        return false;
      }
    } else {
      alert(`${newName} already exists!`);
      setNewName("");
      setNewNumber("");
    }
  };

  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    checkDuplicates(newPerson);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addNewPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />{" "}
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Filter = ({ personSearch, setPersonSearch }) => {
  const handleNameSearch = (event) => {
    setPersonSearch(event.target.value);
  };
  return <input value={personSearch} onChange={handleNameSearch} />;
};

const Persons = ({ persons, personSearch, setPersons }) => {
  const handleDeletion = (personID) => {
    if (window.confirm("Do you want to delete this person ?")) {
      personServices.deletePerson(personID).then((response) => {
        if (response === 200) {
          setPersons(persons.filter((person) => person.id !== personID));
        }
      });
    }
  };
  const personsToShow = personSearch
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(personSearch.toLowerCase()),
      )
    : persons;
  return (
    <>
      {personsToShow.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{" "}
          <button type="submit" onClick={() => handleDeletion(person.id)}>
            delete
          </button>
        </p>
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personSearch, setPersonSearch] = useState("");

  useEffect(() => {
    personServices
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        <p>filter shown with</p>
        <Filter personSearch={personSearch} setPersonSearch={setPersonSearch} />
      </div>

      <h2>add a new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        personSearch={personSearch}
        setPersons={setPersons}
      />
    </div>
  );
};

export default App;
