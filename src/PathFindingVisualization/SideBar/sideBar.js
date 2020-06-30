import React, { Component } from "react";
import Button from "../Button/Button";
import "./sideBar.css";
//Make a component sideBAr
class SBar extends Component {
  constructor(props) {
    //Parent class contructor
    super(props);
    //initailize the state object
    this.state = {
      algorithms: [
        { id: 1, name: "reset", text: "reset" },
        { id: 2, name: "aStar", text: "A*" },
        { id: 3, name: "BFS", text: "Breadth First Search" },
        { id: 4, name: "DFS", text: "Depth First Search" },
        { id: 5, name: "Dijkstra", text: "Dijkstra" },
      ],
    };
  }
  //After the selections of one of the Algorithms
  //invoked immediately after updating
  // componentDidUpdate(prevProps, prevState) {
  //   //Check if a new props provided
  //   //Access props using this.props
  //   if (this.props !== prevProps) {
  //     // Object destructuring //ES6 feature
  //     const { reset, dfs, bfs, dijkstra, aStar } = this.props;
  //     //Schedule updates to the local state
  //     this.setState({
  //       reset,
  //       bfs,
  //       dfs,
  //       aStar,
  //       dijkstra,
  //     });
  //   }
  // }
  render() {
    const { algorithms } = this.state;
    return (
      <div className="side-bar">
        <div className="side-bar-text">Algorithms</div>
        {algorithms.map((algo) => (
          <Button
            key={algo.id}
            id={algo.id}
            name={algo.name}
            text={algo.text}
          ></Button>
        ))}
      </div>
    );
  }
}
export default SBar;
