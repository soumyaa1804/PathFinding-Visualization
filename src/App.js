import React, { Component } from 'react';
import PathFindingVisuallization from './PathFindingVisualization/PathFindingVisualization/PathFindingVisualization'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
          <PathFindingVisuallization />
      </div>
    );
  }
}


