import React, {Component} from 'react';

class PerformTruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isTarget": false,
            "isJudge": false,
            "curTargets": null,
            "playerList": [],
            "curTrial": ""        
        };

        // functions
        //TODO: figure this out with correct parameters
        //figure out how to import functions
        //Vote.getTargetNameFromString(0, this.state.playerList, this.state.curTargets);
        this.continueGame = this.continueGame.bind(this);
        this.displayPlayerNamesFromString = this.displayPlayerNamesFromString.bind(this);
        this.getTargetNameFromString = this.getTargetNameFromString.bind(this);
    }

    getTargetNameFromString(playerIndex, playerList, string){
        return playerList[string.split(",")[playerIndex]]
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    continueGame(){
        //signal judge cue to continue game
        this.props.emitters.sigJudgeContGame();

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
                        <h2>Currently on Trial</h2>
                        <p>The Judge has submitted their trial"</p>
                    </div> 
                )
            } else if (this.state.isJudge) {
                return(
                    <div>
                        <h2>Judge</h2>
                        <p> {this.state.curTargets} are performing!</p>
                        <p>Proceed with trial?</p>
                        <div id="submit_button_container">
                            <button className="popButton" type="submit" onClick={this.continueGame}>
                                Proceed
                            </button>
                        </div>
                    </div>
                )
            //if not judge or target, then they are jury
            //consider implement jury vote to continue round?
            } else {
                return (
                    <div>
                        <h2>Jury</h2>
                <p> {this.props.displayPlayerNamesFromString(this.state.playerList, this.state.curTargets)} are currently on Trial! They received this order from the Judge.</p>
                <p> Be prepared to vote on who passes the trial! </p>
                    </div>
                )
            }
        }

        return ( 
        <div>
            <div>
                <h1>Trial for: {this.state.curTargets} </h1>
            </div>

            <div>
                {showUserSpecificScreen()}
            </div>

        </div>

        )
    }
}

export default PerformTruthOrDare;
