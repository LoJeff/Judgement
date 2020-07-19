import React, {Component} from 'react';

class Punishment extends Component {
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
            <h1>Punishment</h1>

        </div>

        )
    }
}

export default Punishment;