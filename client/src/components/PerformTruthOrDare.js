import React, {Component} from 'react';

class PerformTruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isTarget": false,
            "isJudge": false,
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
        this.props.emitters.sig_judgeContGame();

        // trigger page change
        this.props.triggerPageChange("vote");
    }

    render(){
        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                return(
                    <div>
                        <div id="target-trial-container">
                            <div id="trial_vote_title">On Trial</div>
                            You have received the following trial:
                            <div id="trial-container">{this.state.curTrial}</div>
                            The Jury will judge you based on your performance. The trial ends upon the Judge and Jury's discretion.
                        </div> 
                        <div id="role-container">
                            Currently you are: On Trial
                        </div>
                    </div>
                )
            } else if (this.state.isJudge) {
                return(
                    <div>
                        <div id="role-container">
                            Currently you are: Judge
                        </div>
                        <div id="continue-trial-container">
                            <div id="trial_vote_title">On Trial</div>

                            {this.props.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets)} are under trial.
                            
                            <div>Current Trial: </div>

                            <div id="trial-container">
                                {this.state.curTrial}
                            </div>
                            Proceed to judgement when trial is complete and Jury is finished viewing:
                                <div>
                                    <button className="popButton" type="submit" onClick={this.continueGame}>
                                        Proceed
                                    </button>
                                </div>
                        </div>
                    </div>
                )
            //if not judge or target, then they are jury
            //consider implement jury vote to continue round?
            } else {
                return (
                    <div id="wait-vote-container">
                        Jury
                        {this.props.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets)} are currently on Trial. They received this order from the Judge:
                        <div>
                            {this.state.curTrial}
                        </div>
                        Be prepared to vote on who passes the trial!
                    </div>
                )
            }
        }

        return ( 
        <div id="punishment_page">
            <div>
                <h1>Trial</h1>
            </div>

            <div>
                {showUserSpecificScreen()}
            </div>

        </div>

        )
    }
}

export default PerformTruthOrDare;
