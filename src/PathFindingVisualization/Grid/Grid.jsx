import React, { Component } from "react";
import Node from "../Node/Node";

import "./Grid.css";

const size = 30;
var width = window.innerWidth;
var height = window.innerHeight;
var noOfRows = Math.floor(height / size) - 1;
var noOfColumn = Math.floor(width / size) - 1;
var START_NODE_ROW = Math.floor(noOfRows / 2);
var START_NODE_COL = Math.floor(noOfColumn / 4);
var FINISH_NODE_ROW = Math.floor(noOfRows / 2);
var FINISH_NODE_COL = Math.floor((3 * noOfColumn) / 4);

export default class Grid extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isStart, isFinish, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      row={row}
                      mouseIsPressed={mouseIsPressed}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < noOfRows; row++) {
    const currentRow = [];
    for (let col = 0; col < noOfColumn; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
