import React, {Component} from 'react';

class PerformTruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isTarget": false,
            "isJudge": false,
            "playerList": [],
            "curTrial": ""        
        };

        // functions
        this.continueGame = this.continueGame.bind(this);
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
                <p> {this.props.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets)} are currently on Trial! They received this order from the Judge: </p>
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
