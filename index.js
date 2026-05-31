require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.use(morgan("tiny"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const recdtime = new Date();
  Person.find({}).then((person) => {
    response.send(
      `<p>Phonebook has info for ${person.length} people.</p> <p>${recdtime.toString()} </p>`,
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (request, response, next) => {
  const newPerson = new Person({
    id: Math.floor(Math.random() * 10000),
    name: request.body.name,
    number: request.body.number,
  });
  if (!newPerson) {
    return response.status(400).json({
      error: "Name should be unique!",
    });
  }

  if (newPerson.name && newPerson.number) {
    newPerson
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => next(error));
  } else {
    response.status(400).end("Name is not an optional field");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result);
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findById(request.params.id)
    .then((person) => {
      person.name = name;
      person.number = number;

      return person.save().then((result) => {
        response.json(result);
      });
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.name);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformated Id" });
  } else if (error.name === "ValidationError") {
    if (error.errors.name) {
      return response
        .status(400)
        .json({ error: "Name should be 3 characters long" });
    } else if (error.errors.number) {
      return response
        .status(400)
        .json({ error: "Number should be formatted in 000-000-0000" });
    }
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT: ${PORT}`);
});
