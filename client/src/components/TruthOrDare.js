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
        this.clickChoice = this.clickChoice.bind(this);
    }

    setTODChoice(choice){
        this.setState(() => ({
            tarTODChoice: choice
        }));
    }

    clickChoice(choice){

        if (this.state.tarTODChoice !== "Submitted"){
            this.setTODChoice(choice);

            if( choice === "Truth") {
                document.getElementById('choiceTruth').setAttribute("disabled", "true");
                document.getElementById('choiceDare').removeAttribute("disabled");
            } else {
                document.getElementById('choiceDare').setAttribute("disabled", "true");
                document.getElementById('choiceTruth').removeAttribute("disabled");
            }
        }
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitChoice(){
        this.props.emitters.sendTarTODVote(this.state.tarTODChoice);

        this.setState(() => ({
            tarTODChoice: "Submitted"
        }));

        document.getElementById('submitVoteButton').setAttribute("disabled", "true");
    }

    render(){
        const displaySubmitButton = () => {
            
            if (this.state.tarTODChoice === "Submitted"){
                return (         
                    <div>
                        <button className="submitVote" type="text" id="submitVoteButton" onClick={this.submitChoice}>Vote submitted</button>
                    </div>
                )

            } else if (this.state.tarTODChoice !== null) {
                return (         
                    <div>
                        <button className="submitVote" type="text" id="submitVoteButton" onClick={this.submitChoice}>Submit Vote</button>
                    </div>
                )
            } else {
                return (
                    <div>
                        <button className="submitVote" type="text" onClick={null} disabled>Submit Vote</button>
                    </div>
                )
            }
        }
        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                return(
                    <div>
                        <div id="vote_container">
                            <div id="tod_vote_title">
                                Choose a Trial!
                            </div>

                            <div id="tod_vote_desc">
                                You are currently under trial! Choose to <span id="blue_text"> Confess </span> your sins or <span id="blue_text"> Repent </span> with an act of service!
                            </div>

                            <div id="possible_truthordare_set">
                                {/**have more flushed out hover values?*/}
                                <button className="voteToDButtons" type="text" id="choiceTruth" onClick={ () => this.clickChoice("Truth")}>Confess
                                </button>
                                <button className="voteToDButtons" type="text" id="choiceDare" onClick={ () => this.clickChoice("Dare")}>Repent
                                </button>
                            </div>

                            <div>
                                {displaySubmitButton()}
                            </div>
                        </div>
                    </div> 
                )
            } else {
                return(
                <p>The accused are currently deciding their appeal</p>
                )
            }
        }

        return ( 
        <div id="truth_or_dare">
            <div id="subtitle_container">
                <h1>Appeal</h1>
            </div>

            <div>
                {showUserSpecificScreen()}
            </div>

        </div>

        )
    }
}

export default TruthOrDare;
