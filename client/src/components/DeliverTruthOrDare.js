import React, {Component} from 'react';

class DeliverTruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isTarget": null,
            "isJudge": null,
            "suggestion": ""
            };

        // functions
        this.continueToTrial = this.continueToTrial.bind(this);
        this.displayPlayerNamesFromString = this.displayPlayerNamesFromString.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    continueToTrial(trial){
        // send string of trial, suggested by us or custom input by Judge
        this.props.emitters.sendJudgePrompt(trial);

        // trigger page change
        this.props.triggerPageChange("vote");
    }

    displayPlayerNamesFromString(playerList, pairID){
        var result = "";
        if (pairID !== null) {

            var idsFromString = JSON.stringify(pairID);
            var listOfIds = idsFromString.split(",").map((x)=>{ 
                var x = x.replace(/\D/g, ''); 
                return parseInt(x);
            });

            for (var i = 0; i < listOfIds.length; i++){
                if (i === listOfIds.length - 1) {
                    result += " and";
                }
                result += " " + playerList[listOfIds[i]];
            }
        }
        return result;
    }

    render(){

        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                return(
                    <div>
                        <h2>Awaiting Trial</h2>
                        <p>Pay Attention! Judge is about to announce the Trial!</p>
                    </div> 
                )
            } else if (this.state.isJudge) {
                return(
                    <div id="deliver-tod">
                        <div id="trials-container">
                            <div className="enter-trial-container">
                                <div id="trial_vote_title">
                                    Trial
                                </div>

                                <div id="tod_vote_desc">
                                    Test {this.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets)} with a trial.
                                </div>

                                <div>
                                        <form > <textarea className="custom-trial-input" type="text" id="customTrial" placeholder="Enter Trial!"/></form>
                                </div>

                                <div id="submit_button_container">
                                    <button className="submitButton" type="submit" onClick={ () => this.continueToTrial(document.getElementById("customTrial").value)}>Submit Custom Trial
                                    </button>
                                </div>

                            </div>

                            <div className="enter-trial-sidebar-container">
                                <div id="enter-trial-sidebar-title"> Message from the captain:</div>
                                Hey, try this trial!
                                <div id="suggestion-container">
                                    {this.state.suggestion}
                                </div>

                                <div id="submit_button_container">

                                    <button className="submitButton" type="submit" onClick={ () => this.continueToTrial(this.state.suggestion)}>
                                        Submit Suggested Trial
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )
            //if not judge or target, then they are jury
            //consider implement jury vote to continue round?
            } else {
                return (
                    <div>
                        <h2>Jury</h2>
                        <p>Awaiting Judge to choose a Trial for, {this.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets)} </p>
                    </div>
                )
            }
        }

        return ( 
        <div>
            <div>
                <h1>Awaiting Trial for: {this.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets)} </h1>
            </div>

            <div>
                {showUserSpecificScreen()}
            </div>

        </div>

        )
    }
}

export default DeliverTruthOrDare;