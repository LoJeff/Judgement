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
            <div id="subtitle_container" className="title">
                <h1>Punishment</h1>
            </div>

            <div id="description_container">
                <p> blahblahsome description for punishmentbalhblah</p>
            </div>

            <div id="interactive_set">
            <div id="punishment_container">
							<form > <input className="fancyInput" type="text" id="name" placeholder="Enter punishment!" /></form>
						</div>

            </div>

        </div>

        )
    }
}

export default Punishment;