import React, {Component} from 'react';

class FinalLeaderboard extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "finalRankInfo": [],
            "totalPlayers": 0,
            "numWaiting": 0,
            "forceCont": false
        };

        // functions
        this.proceedToEndGame = this.proceedToEndGame.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    setForceCont(set){
        this.setState((set) => ({
            forceCont: set
        }))
    }
    
    proceedToEndGame(){
        //send that current user has chosen to continue to punishment
        this.props.emitters.sig_contToPunishment()

        if (this.state.forceCont || this.state.numWaiting === this.state.totalPlayers) {
            //need to create deliver punishment
            this.props.triggerPageChange("deliverPunishment");
        }
    }

    render(){

        const finalLeaderboardElements = [];
        if (this.state.finalRankInfo !== undefined){
            this.state.finalRankInfo.forEach(function(player){
            finalLeaderboardElements.push(<li key={this.state.finalRankInfo.indexOf(player)}>{player[0]} earned {player[1]} points of salvation.</li>)
            });
        }

        const displayWaitingToContinue = () => {
            if (this.state.numWaiting > 0){
                return(
                    <div>
                        Waiting for {this.state.totalPlayers - this.state.numWaiting}/{this.state.totalPlayers} to say goodbye.
                    </div>
                )
            }
        }

        const displayForceContinue = () => {
            if (this.state.forceCont){
                return (
                    <div>
                        <div id="submit_button_container">
                                <button className="popButton" type="submit" onClick={this.setforceContGame(true)}> Force a farewell!
                                </button>
                            </div>
                    </div>
                )
            }
        }

        return ( 
        <div>
            <div>
                <h1>Final Ranking</h1>
            </div>
            <div>
                {finalLeaderboardElements}
            </div>

            <div>
                Unfortunate! It looks like we'll have to leave {finalLeaderboardElements[finalLeaderboardElements.length - 1][0]} behind!
            </div>
            <div id="submit_button_container">
                <button className="popButton" type="submit" onClick={this.proceedToEndGame()}> Goodbye {leaderboardElements[leaderboardElements.length][0]}
                </button>
            </div>

            {displayWaitingToContinue()}
            {displayForceContinue()}

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