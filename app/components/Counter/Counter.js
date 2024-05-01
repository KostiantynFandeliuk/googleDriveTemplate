"use client";
import React, { useState } from "react";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div style={{ border: "1px solid red", marginBottom: 20 }}>
      <h1>Counter</h1>
      <h3>{counter}</h3>
      <button onClick={() => setCounter((prev) => prev + 1)}>+++++</button>
      <br />
      <button onClick={() => setCounter((prev) => prev - 1)}>-----</button>
    </div>
  );
};

export default Counter;
