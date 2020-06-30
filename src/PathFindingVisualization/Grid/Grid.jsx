import React, { Component } from "react";
import Node from "../Node/Node";

import "./Grid.css";

const size = 30;
const width = window.innerWidth;
const height = window.innerHeight;
const noOfRows = Math.floor(height / size) - 1;
const noOfColumn = Math.floor(width / size) - 1;
const START_NODE_ROW = Math.floor(noOfRows / 2);
const START_NODE_COL = Math.floor(noOfColumn / 4);
const FINISH_NODE_ROW = Math.floor(noOfRows / 2);
const FINISH_NODE_COL = Math.floor((3 * noOfColumn) / 4);

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

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({
      grid: newGrid,
      mouseIsPressed: true
    });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
    console.log(`Mouse Enter! ${row}-${col} `);
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
    console.log("Mouse Up!")
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
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
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

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice(); // The slice() method returns the selected elements in an array, as a new array object.
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}