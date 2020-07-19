import React, {Component} from 'react';
import overall from './main.js';

//rethink this class. is it necessary?
class Game extends Component {
    constructor(props){
        super(props);
        
        // state
        this.state = {
            "receivedPackets": [],
        };
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
        overall();
    }

    //insert functions in game here
    //pick target
    //choose truth or dare
    //



    //can use componentDidUpdate(prevProps). invoked after update. good place for net req.
    //compare curr props to prev props to see if net req needed
    //to operate on DOM when comp has been updated
    //if need to setState(), can do here

    //if need to perform side effect (animate or data fetch) when prop changes, check componentDidUpdate

    //if re-comp data only when prop changes, use memorization helper

    render(){
        const packetList = [];
        if(this.state.receivedPackets !== undefined){
            this.state.receivedPackets.forEach(function(packet,index){
                packetList.push(<li key={index}>{JSON.stringify(packet)}</li>)
            });
        }
        return(
            <div>
				<h1> GAME START</h1>
                <ul>
                    {packetList}
                </ul>
				<canvas id="canvas"></canvas>
            </div>
        );
    }
}

export default Game;
