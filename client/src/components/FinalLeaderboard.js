import React, {Component} from 'react';

class FinalLeaderboard extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "roundRank": [],
            "trigEndGame": false,
            "totalPlayers": 0,
            "numWaiting": 0,
            "forceCont": false
        };

        // functions
        this.proceedGame = this.proceedGame.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    setForceCont(set){
        this.setState((set) => ({
            forceCont: set
        }))
    }
    
    // TODO: think of better method name
    proceedGame(nextStep){
        //send that current user has chosen to continue
        this.props.emitters.sig_contNextRound()

        if (this.state.trigEndGame) {
            //need to create deliver punishment
            this.props.triggerPageChange("deliverPunishment");
        }
        else if (this.state.forceCont){
            this.props.triggerPageChange("pickTargets")
        }
    }

    render(){

        const leaderboardElements = [];
        if (this.state.roundRank !== undefined){
            this.state.roundRank.forEach(function(player){
                leaderboardElements.push(<li key={this.state.roundRank.indexOf(player)}>{player[0]}</li>)
            });
        }

        const displayWaitingToContinue = () => {
            if (this.state.numWaiting > 0){
                return(
                    <div>
                        Waiting for {this.state.totalPlayers - this.state.numWaiting}/{this.state.totalPlayers} to continue.
                    </div>
                )
            }
        }

        const displayForceContinue = () => {
            if (this.state.forceCont){
                return (
                    <div>
                        <div id="submit_button_container">
                                <button className="popButton" type="submit" onClick={this.setforceContGame(true)}> Force Continue!
                                </button>
                            </div>
                    </div>
                )
            }
        }

        const displaySpecificLeaderboard = () => {
            if (this.state.trigEndGame){
                return (
                    <div>
                        <div>
                            Unfortunate! It looks like we'll have to leave {leaderboardElements[leaderboardElements.length][0]} behind!
                        </div>
                        <div id="submit_button_container">
                            <button className="popButton" type="submit" onClick={this.proceedGame()}> Goodbye {leaderboardElements[leaderboardElements.length][0]}
                            </button>
                        </div>
                    </div>
                )

            } else {
                return (
                    <div>
                        <div>
                            Take care, {leaderboardElements[leaderboardElements.length][0]}! We don't want to leave you behind!
                        </div>
                        <div>
                            <div id="submit_button_container">
                                <button className="popButton" type="submit" onClick={this.proceedGame()}> Continue
                                </button>
                            </div>
                            {displayWaitingToContinue()}
                            {displayForceContinue()}
                        </div>
                </div>
                )
            }

        }

        return ( 
        <div>
            <div>
                <h1>Current Ranking</h1>
            </div>
            <div>
                {leaderboardElements}
            </div>

            {displaySpecificLeaderboard()}

            { /**TODO: if not end game, display enter rule to top player. (have this as another screen?) */}
            { /**figure out how to display conditional elements*/ }
            <div>
                {/** if current user.score == highest score */ }
            </div>
        </div>
        )
    }
}

export default FinalLeaderboard;