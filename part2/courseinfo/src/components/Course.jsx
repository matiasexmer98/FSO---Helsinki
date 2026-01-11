const Header = ({ name }) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <>
      <p>
        {name} {exercises}
      </p>
    </>
  );
};

const Total = ({ parts }) => {
  const totalExercises = parts
    .map((part) => part.exercises)
    .reduce((acum, cur) => acum + cur, 0);
  return (
    <>
      <p>
        <strong>total of {totalExercises} exercises</strong>
      </p>
    </>
  );
};
const Course = ({ courses }) => {
  return (
    <>
      <Header name={courses[0].name} />
      <Content parts={courses[0].parts} />
      <Total parts={courses[0].parts} />
      <Header name={courses[1].name} />
      <Content parts={courses[1].parts} />
      <Total parts={courses[1].parts} />
    </>
  );
};

export default Course;
