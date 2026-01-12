const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
morgan.token("body", function (req, res) {
  const body = req.body;
  if (body) {
    const { name, number } = body;
    return `{"name":${name}, "number":${number}}`;
  }
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((note) => note.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<p>
        <p>${new Date()}<p>`);
});

app.post("/api/persons", (request, response) => {
  const randomId = Math.floor(Math.random() * 99999);
  const person = request.body;
  const nameExists = persons.some((p) => p.name === person.name);
  if (!person.name || !person.number) {
    return response.status(400).json({ error: "name or number missing" });
  }
  if (nameExists) {
    return response.status(400).json({ error: "name must be unique" });
  }
  person.id = String(randomId);
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
