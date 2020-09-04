import React, {Component} from 'react';

class DeliverTruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isTarget": false,
            "isJudge": false,
            "curTargets": null,
            "playerList": [],
            "suggestion": ""
            };

        // functions
        //TODO: figure this out with correct parameters
        //figure out how to import functions
        //Vote.getTargetNameFromString(0, this.state.playerList, this.state.curTargets);
        this.continueToTrial = this.continueToTrial.bind(this);
        this.displayPlayerNamesFromString = this.displayPlayerNamesFromString.bind(this);
        this.getTargetNameFromString = this.getTargetNameFromString.bind(this);
    }

    getTargetNameFromString(playerIndex, playerList, string){
        return playerList[string.split(",")[playerIndex]]
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

    displayPlayerNamesFromString(playerList, string){
        var result = "";
        var idsFromString = string.split(",");
        for (var i = 0; i < idsFromString.length; i++){
            if (i === idsFromString.length - 1) {
                result += " and ";
            }
            result += this.getTargetNameFromString(i, playerList, string) + " ";
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
                    <div>
                        <h2>Judge</h2>
                        <p> Give {this.state.curTargets} a trial.</p>
                        <p>Come up with your own trial or choose one of ours?</p>
                        <div id="interactive_set">
                            <div className="row_of_input">
                                <div id="punishment_container">
                                        <form > <input className="punishmentInput" type="text" id="customTrial" placeholder="Enter Trial!"/></form>
                                </div>
                            </div>

                            <div id="submit_button_container">
                                <button className="popButton" type="submit" onClick={this.continueToTrial(document.getElementById("customTrial").value)}>Submit Custom Trial
                                </button>
                            </div>
                            
                        <div id="submit_button_container">
                            <button className="popButton" type="submit" onClick={this.continueToTrial(this.state.suggestion)}>
                                Suggestion: {this.state.suggestion}
                            </button>
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
                        <p>Awaiting Judge Trial for, {this.props.displayPlayerNamesFromString(this.state.playerList, this.state.curTargets)} </p>
                    </div>
                )
            }
        }

        return ( 
        <div>
            <div>
                <h1>Awaiting Trial for: {this.state.curTargets} </h1>
            </div>

            <div>
                {showUserSpecificScreen()}
            </div>

        </div>

        )
    }
}

export default DeliverTruthOrDare;