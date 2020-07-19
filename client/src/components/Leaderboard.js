import React, {Component} from 'react';

class Leaderboard extends Component {
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
            <h1>Leaderboard</h1>

        </div>

        )
    }
}

export default Leaderboard;