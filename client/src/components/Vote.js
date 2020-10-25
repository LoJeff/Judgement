import React, {Component} from 'react';

class Vote extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isJudge": false,
            "playerVote": null,
            "trigLeaderboard": false,
            "resultVote": null,
            "trigEndGame": false
        };

        // functions
        this.submitVote = this.submitVote.bind(this);
        this.setPlayerVote = this.setPlayerVote.bind(this);
        this.contToRoundEnd = this.contToRoundEnd.bind(this);
        this.showVoteResult = this.showVoteResult.bind(this);
    }

    setPlayerVote(playerInt){
        this.setState((playerInt) => ({
            playerVote: playerInt
        }))
    }

    submitVote(vote){
        this.setPlayerVote(vote);
        this.props.emitters.sendPlayerVote(this.state.playerVote);
    }

    contToRoundEnd(){
        //if leaderboard screen is seen
        if (this.state.trigEndGame){
            this.props.triggerPageChange("finalLeaderboard");

        } else if (this.state.trigLeaderboard){
            this.props.triggerPageChange("leaderboard");
            
        } else {
            //if round continues
            console.log("in contToRoundEnd");
            this.props.triggerPageChange("pickTargets");       
        }
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    showVoteResult(resultList){
        if (this.state.resultVote !== null){
            return(
                <div>
                    <div>
                        {this.state.resultVote[0][0]} wins this trial.
                    </div>
                    <div>
                        Results:
                        {resultList}
                    </div>
                    <div id="subtitle_button_container">
                        <button className="popButton" type="submit" onClick={this.contToRoundEnd}>
                            Continue
                        </button>
                    </div>
                </div>
            )
        }
    }

    render(){

        const showJudgeSpecificElement = () => {
            if ( true ){
                return(
                    <div>
                        <p>You are the judge! Your vote holds twice the power!</p>
                    </div> 
                )
            }
        }

        const voteResultElements = [];
        if (this.state.resultVote !== null){
            this.state.resultVote.forEach(function(target){
                voteResultElements.push(<li key={this.state.resultVote.indexOf(target)}>{target[0]} had {target[1]} votes </li>)
            });
        }

        return ( 
        <div>
            <div>
                <h1>Pass Judgement</h1>
                <p>Whos appeal was stronger?</p>
                {showJudgeSpecificElement()}
            </div>
            <div>
                <div id="submit_button_container">
                    <div>
                        <button className="popButton" type="submit" onClick={ () => this.submitVote(0)}>
                            {this.props.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets[0])}
                        </button>
                    </div>
                    <div>
                        <button className="popButton" type="submit" onClick={ () => this.submitVote(1)}>
                            {this.props.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets[1])}
                        </button>
                    </div>
				</div>

                {this.showVoteResult(voteResultElements)}

            </div>

        </div>

        )
    }
}

export default Vote;