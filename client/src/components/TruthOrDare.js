import React, {Component} from 'react';

class TruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
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

        this.setTODChoice(true);

        document.getElementById('submitVoteButton').setAttribute("disabled", "true");
    }

    render(){

        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                console.log("props: " + Object.keys(this.props));
                console.log("emitters: " + Object.keys(this.props.emitters));
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
                                <button className="voteToDButtons" type="text" id="0" onClick={ () => this.props.displayVoteChoices(0, this.setTODChoice, this.state.tarTODChoice)}>Confess
                                </button>
                                <button className="voteToDButtons" type="text" id="1" onClick={ () => this.props.displayVoteChoices(1, this.setTODChoice, this.state.tarTODChoice)}>Repent
                                </button>
                            </div>

                            <div>
                                {this.props.displaySubmitButton(this.state.tarTODChoice, this.submitChoice)}
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
