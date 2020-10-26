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
        console.log("in setPLayerVote: " + playerInt);
        this.setState(() => ({
            playerVote: playerInt
        }))

        console.log("state playerVote after set: "+this.state.playerVote);

    }

    submitVote(vote){
        this.setPlayerVote(vote);
        console.log("playerVote to send: "+this.state.playerVote);
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
            if ( this.state.isJudge ){
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
        <div id="vote">
            <div>
                <h1>Pass Judgement</h1>
                <p>Whose appeal was stronger?</p>
                {showJudgeSpecificElement()}
            </div>
            <div id="row_container">
                <div id="vote_ticket_container">
                    <div id="tod_vote_title">
                        Voting Ballot
                    </div>
                    <div id="tar_list">
                        <div id="vote_radio_container">
                            <input className="vote_radio" type="radio" name="voteTarget" onClick={ () => this.setPlayerVote(0)}></input>
                            <span className="vote_radio"></span>
                            {this.props.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets[0])}

                        </div>
                        <div id="vote_radio_container">
                            <input className="vote_radio" type="radio" name="voteTarget" onClick={ () => this.setPlayerVote(1)}></input>
                            <span className="vote_radio"></span>
                            {this.props.displayPlayerNamesFromString(this.props.playerList, this.props.curTargets[1])}

                        </div>
                    </div>

                    <div id="submit_button_container">
                    {this.props.displaySubmitButton(this.state.playerVote, this.submitVote)}

                    </div>

                    {this.showVoteResult(voteResultElements)}

                </div>

                <div id="side_help_container">
                    <div id="side_help_desc">
                            Please select the candidate with the best appeal. The candidate with best appeal voted by Jury majority will receive favour from the Captain.
                    </div>
                </div>
            </div>

        </div>

        )
    }
}

export default Vote;