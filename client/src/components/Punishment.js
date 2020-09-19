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
        <div id='punishment_page'>
            <div id="subtitle_container" className="title">
                <h1>Survey!</h1>
            </div>

            <div id="alert_container">
                All passengers receive a suprise notice!
            </div>

            <div id="punishment_container">
                <div id="punishment_title">
                    Mandatory Passenger Survey
                </div>

                <div id="punishment_description">
                    Before the ship can take off, please enter a suitable punishment for a fellow passenger.
                </div>

                <div>
                    <form> <textarea className="punishmentInput" id="punishment" placeholder="Enter a punishment!"/>
                    </form>
                </div> 
            </div>


            <div id="submit_button_container">
				<button className="popButton" type="submit" onClick={this.enterGame}>Submit
                </button>
			</div>

        </div>

        )
    }
}

export default Punishment;