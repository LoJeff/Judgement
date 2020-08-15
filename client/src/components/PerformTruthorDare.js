import React, {Component} from 'react';
import * as Vote from './Vote.js';

class PerformTruthorDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isTarget": false,
            "isJudge": false,
            "curTargets": null,
            "playerList": []
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
            if (i == idsFromString.length - 1) {
                result += " and ";
            }
            result += this.getTargetNameFromString(i, playerList, string) + " ";
        }
    }

    render(){

        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                return(
                    <div>
                        <h2>On Trial</h2>
                        <p>I am a target, time to fight for my life D:</p>
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
                        <p> {this.props.displayPlayerNamesFromString(this.state.playerList, this.state.curTargets)} are performing! Prepare to vote!</p>
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
                {showUserSpecificScreen}
            </div>

        </div>

        )
    }
}

export default PerformTruthorDare;