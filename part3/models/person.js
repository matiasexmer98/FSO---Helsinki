const mongoose = require("mongoose");
// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: String,
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

// if (process.argv.length === 3) {
//   Person.find({}).then((result) => {
//     result.forEach((person) => {
//       console.log(person);
//       mongoose.connection.close();
//     });
//   });
// } else if (process.argv.length === 5) {
//   person.save().then((result) => {
//     console.log(`added ${person.name} number ${person.number} to phonebook `);
//     mongoose.connection.close();
//   });
// }

module.exports = mongoose.model("Person", personSchema);
