import React, { Component } from 'react'
import Grid from '../Grid/Grid'
import SBar from '../SideBar/sideBar'
export default class PathFindingVisualization extends Component {
    render() {
        return (
            <div className = "container">
                <Grid></Grid>
                <SBar></SBar>
            </div>
        )
    }
}
