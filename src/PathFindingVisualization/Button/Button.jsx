import React from "react";
import "./Button.css";
import DFS from "../Algorithms/DFS";
const Button = (props) => {
  const { id, name, text } = props;
  const clickEvent = () => {
    if (id === 1) {
      console.log("reset");
    } else {
      console.log(name);
    }
  };
  return (
    <div className="button-container">
      <button className="button-text" onClick={clickEvent}>
        {text}
      </button>
    </div>
  );
};
export default Button;
