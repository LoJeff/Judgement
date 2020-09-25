import React, {Component} from 'react';

class TruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "curTargets": null,
            "tarTODChoice": null,
            "isTarget": false
            };

        // functions
        this.submitChoice = this.submitChoice.bind(this);
        this.setTODChoice = this.setTODChoice.bind(this);
    }

    setTODChoice(choice){
        this.setState(() => ({
            tarTODChoice: choice
        }));
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitChoice(){
        this.props.emitters.sendTarTODVote(this.state.tarTODChoice);

        this.setState(() => ({
            tarTODChoice: "Vote submitted!"
        }));

        document.getElementById('submitButton').setAttribute("disabled", "disabled");
    }

    render(){
        const displaySubmitButton = () => {
            if (this.state.tarTODChoice !== null) {
                return (         
                    <div>
                    <button className="popButton" id="submitButton" onClick={this.submitChoice}> Submit Vote: {this.state.tarTODChoice}</button>
                    </div>
                )
            } else {
                return (
                    //TODO: SET VISUAL FOR DISABLED SUBMIT BUTTON
                    <div>
                    <button className="popButton" onClick={null} disabled> Submit Vote: Please select a Trial option!</button>
                    </div>
                )
            }
        }
        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                return(
                    <div>
                        <p>I am a target wooo</p>
                            <div id="possible_truthordare_set">
                                {/**have more flushed out hover values?*/}
                                <button className="popButton" onClick={ () => this.setTODChoice("Truth")}>Confess
                                </button>
                                <button className="popButton" onClick={ () => this.setTODChoice("Dare")}>Repent
                                </button>
                            </div>
                            <div>
                                {displaySubmitButton()}
                            </div>
                    </div> 
                )
            } else {
                return(
                <p>Sit tight! The accused are currently deciding their appeal</p>
                )
            }
        }

        return ( 
        <div>
            <div>
                <h1>Truth or Dare</h1>
            </div>

            <div>
                {showUserSpecificScreen()}
            </div>

        </div>

        )
    }
}

export default TruthOrDare;
