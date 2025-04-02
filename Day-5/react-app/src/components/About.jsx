import React from "react";
import { useState } from "react";

const About = () => {
  const [count, setCount] = useState(0);
  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count - 1);
  return (
    <div className="mainContainer">
      <h1>This is About page</h1>
      <h2>Count: {count}</h2>
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

export default About;
