const Header = ({ course }) => <h1>{course.name}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  );
};

const Sum = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0);
  return <h4>Total of {total} exercises</h4>;
};

const Courses = ({ courses }) =>
  courses.map((course) => (
    <div key={course.id}>
      <Header course={course} />
      <Content parts={course.parts} />
      <Sum parts={course.parts} />
    </div>
  ));

export default Courses;
