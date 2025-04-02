import { useState, useEffect } from "react";
const Home = () => {
  const [count, setCount] = useState(0);
  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count - 1);
  useEffect(() => {
    alert("this will run  when value of count is changed");
  }, [count]);

  useEffect(() => {
    alert("this will run when Home component is rendered first");
  }, []);
  return (
    <div className="mainContainer">
      <h1>This is Home page</h1>
      <h1>Count: {count}</h1>
      <div className="buttonContainer">
        <button onClick={increase} type="button" class="btn btn-primary">
          Increase
        </button>
        <button onClick={decrease} type="button" class="btn btn-secondary">
          Decrease
        </button>
      </div>
    </div>
  );
};

export default Home;

