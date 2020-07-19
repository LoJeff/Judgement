import React, {Component} from 'react';

class Endgame extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "receivedPackets": [],
        };
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    render(){

        return ( 
        <div>
            <h1>EndGame</h1>

        </div>

        )
    }
}

export default Endgame;