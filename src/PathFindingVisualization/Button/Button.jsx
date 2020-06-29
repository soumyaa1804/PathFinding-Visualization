import React from 'react';
import './Button.css'
const Button = (props) =>{
    const ClickEvent = (e) =>{
        //button_text is a variable that is set to props(object).onClick(property)
        let button_text = props.onClick;
        let algorithm = props.text;
        // if(algorithm === 'reset')
        // {
        //     button_text(false);
        // }
        // else{
        //     button_text();
        // }
    }
    return(
        <div className = "button-container" onClick = {ClickEvent}>
            <button className = "button-text">{props.text}</button>
        </div>
    );
};
// function Button(){
//     const sayHello = () =>{
//         console.log("Hello");
//     }
//     return(
//         <div> 
//             <button onClick = {sayHello}>Hello</button>
//         </div>
//     );
// }
export default Button;