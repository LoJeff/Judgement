import React, {Component} from 'react';

class TruthorDare extends Component {
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
            <h1>TruthorDare</h1>

        </div>

        )
    }
}

export default TruthorDare;