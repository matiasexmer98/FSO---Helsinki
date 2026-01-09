import { useState } from "react";
const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  );
};
const Statistics = ({ good, neutral, bad }) => {
  const all = good + bad + neutral;
  const average = (good - bad) / all;
  const positive = (good * 100) / all;
  if (all === 0) {
    return (
      <>
        <h2>statistics</h2>
        <p>no feedback given</p>
      </>
    );
  }

  return (
    <>
      <h2>statistics</h2>
      <table>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="neutral" value={neutral} />
        <tr>
          <td>all</td>
          <td>{all}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{average}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{positive}%</td>
        </tr>
      </table>
    </>
  );
};

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  );
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const handleGoodClick = () => {
    setGood(good + 1);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  return (
    <div>
      <h2>give feedback</h2>

      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleBadClick} text="bad" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
