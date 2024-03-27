const Header = ({ course }) => <h1>{course.name}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part, i) => (
        <Part key={i} part={part} />
      ))}
    </>
  );
};

const Sum = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0);
  return <h4>Total of {total} exercises</h4>;
};

const Course = ({ course }) => (
  <>
    <Header course={course} />
    <Content parts={course.parts} />
    <Sum parts={course.parts} />
  </>
);

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        name: "Redux",
        exercises: 11,
        id: 4,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
