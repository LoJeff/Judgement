import React, {Component} from 'react';

class Punishment extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "receivedPackets": [],
        };

        // functions
        this.enterGame = this.enterGame.bind(this);
    }

    enterGame(){
        var punishment = document.getElementById("punishment").value;

        this.props.emitters.sendPunishment(punishment);

        // trigger page change
        this.props.triggerPageChange("pickTargets");
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
                <div className="row_of_input">
                    <div id="punishment_container">
                            <form > <input className="punishmentInput" type="text" id="punishment" placeholder="Enter punishment!"/></form>
                    </div>
                </div>

                <div id="submit_button_container">
					<button className="popButton" type="submit" onClick={this.enterGame}>Submit
                    </button>
				</div>
            </div>

        </div>

        )
    }
}

export default Punishment;