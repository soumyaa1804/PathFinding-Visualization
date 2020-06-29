import React,{Component} from 'react';
import Button from '../Button/Button';
import './sideBar.css'
//Make a component sideBAr
class SBar extends Component{
    constructor(props){
        //Parent class contructor
        super(props);
        //initailize the state object
        this.state = {};
    }
    //After the selections of one of the Algorithms
    //invoked immediately after updating
    componentDidUpdate(prevProps,prevState)
    {
        //Check if a new props provided
        //Access props using this.props
        if(this.props !== prevProps)
        {
            // Object destructuring //ES6 feature
            const{reset,dfs,bfs,dijkstra,aStar} = this.props;
            //Schedule updates to the local state
            this.setState({
                reset,bfs,dfs,aStar,dijkstra
            });
        }
    }
    render(){
        const{reset,bfs,dfs,aStar,dijkstra} = this.state;
        return(
            <div className = "side-bar e-card ">
                <div className = "side-bar-text">Algorithms</div>
                <Button
                onClick = {bfs}
                text = {"Breadth First Search"}>
                </Button>
                <Button
                onClick = {dfs}
                text = {"Depth First Search"}>
                </Button>
                <Button
                onClick = {aStar}
                text = {"A*"}>
                </Button>
                <Button
                onClick = {dijkstra}
                text = {"Dijkstra"}>
                </Button>
                <Button
                onClick = {reset}
                text = {"Reset"}>
                </Button>
             </div>
        );
    }
}
export default SBar;