import React, {Component} from 'react';

class Vote extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isJudge": false,
            "playerVote": null,
            "trigLeaderboard": false,
            "curTargets": null,
            "playerList": [],
            "resultVote": null
        };

        // functions
        this.submitVote = this.submitVote.bind(this);
        this.setPlayerVote = this.setPlayerVote.bind(this);
        this.getTargetNameFromString = this.getTargetNameFromString(this);
        this.contToRoundEnd = this.contToRoundEnd(this);
    }

    setPlayerVote(playerInt){
        this.setState((playerInt) => ({
            playerVote: playerInt
        }))
    }

    submitVote(vote){
        this.setPlayerVote(vote);
        this.props.emitters.sendPlayerVote(this.state.playerVote);

        //if leaderboard screen is seen

    }

    contToRoundEnd(){
        if (this.state.trigLeaderboard){
            this.props.triggerPageChange("leaderboard");
        }
        //if round continues
        else {
            this.props.triggerPageChange("pickTargets");       
        }
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    getTargetNameFromString(playerIndex, playerList, string){
        return playerList[string.split(",")[playerIndex]]
    }

    render(){

        const showJudgeSpecificElement = () => {
            if ( this.state.isJudge ){
                return(
                    <div>
                        //the captain can say this:
                        <p>Remember, you are the judge! Your votes hold twice the power!</p>
                    </div> 
                )
            }
        }

        const voteResultElements = [];
        if (this.state.resultVote !== undefined){
            this.state.resultVote.forEach(function(target){
                voteResultElements.push(<li key={this.state.resultVote.indexOf(target)}>{target[0]} had {target[1]} votes </li>)
            });
        }

        const showVoteResult = () => {
            if (this.state.resultVote !== null){
                return(
                    <div>
                        <div>
                            {this.state.resultVote[0][0]} wins this trial.
                        </div>
                        <div>
                            Results:
                            {voteResultElements}
                        </div>
                        <div id="subtitle_button_container">
                            <button className="popButton" type="submit" onClick={this.contToRoundEnd()}>
                                Continue
                            </button>
                        </div>
                    </div>
                )
            }
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
                        <button className="popButton" type="submit" onClick={this.submitVote(0)}>
                            //this probably is not displayed properly?
                            {this.getTargetNameFromString(0, this.state.playerList, this.state.curTargets)}
                        </button>
                    </div>
                    <div>
                        <button className="popButton" type="submit" onClick={this.submitVote(1)}>
                            {this.getTargetNameFromString(1, this.state.playerList, this.state.curTargets)}
                        </button>
                    </div>
				</div>

                {showVoteResult()}

            </div>

        </div>

        )
    }
}

export default Vote;