import React, {Component} from 'react';

class Leaderboard extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "roundRank": [],
            "trigEndGame": false
        };

        // functions
        this.proceedGame = this.proceedGame.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    // TODO: think of better method name
    proceedGame(){
        //send that current user has chosen to continue
        this.props.emitters.sig_contNextRound()

        if (this.state.trigEndGame) {
            this.props.triggerPageChange("endgame");
        }
        else {
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

        return ( 
        <div>
            <div>
                <h1>Current Standing</h1>
            </div>
            <div>
                {leaderboardElements}
            </div>
            <div>
                Take care, {leaderboardElements[leaderboardElements.length][0]}! We don't want to leave you behind!
            </div>
            <div>
                <div id="submit_button_container">
					<button className="popButton" type="submit" onClick={this.proceedGame}> Continue
                    </button>
				</div>
            </div>

            { /**TODO: if not end game, display enter rule to top player. (have this as another screen?) */}
            { /**figure out how to display conditional elements*/ }
            <div>
                {/** if current user.score == highest score */ }
            </div>

        </div>

        )
    }
}

export default Leaderboard;