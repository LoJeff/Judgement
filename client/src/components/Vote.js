import React, {Component} from 'react';

class Vote extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isJudge": false,
            "playerVote": null,
            "trigLeaderboard": false,
            "curTargets": null,
            "playerList": []
        };

        // functions
        this.submitVote = this.submitVote.bind(this);
        this.setPlayerVote = this.setPlayerVote.bind(this);
        this.getTargetNameFromString = this.getTargetNameFromString(this);
    }

    setPlayerVote(playerInt){
        this.setState((playerInt) => ({
            playerVote: this.state.curTargets.split(",")[playerInt]
        }))
    }

    submitVote(vote){
        this.setPlayerVote(vote);
        this.props.emitters.sendPlayerVote(this.state.playerVote);

        //if leaderboard screen is seen
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
        return ( 
        <div>
            <div>
                <h1>Pass Judgement</h1>
                <p>Whos appeal was stronger?</p>
                {showJudgeSpecificElement}
            </div>
            <div>
                <div id="submit_button_container">
                    <div>
                        <button className="popButton" type="submit" onClick={this.submitVote(0)}>
                            //this probably is not displayed properly
                            {this.getTargetNameFromString(0, this.state.playerList, this.state.curTargets)}
                        </button>
                    </div>
                    <div>
                        <button className="popButton" type="submit" onClick={this.submitVote(1)}>
                            {this.getTargetNameFromString(1, this.state.playerList, this.state.curTargets)}
                        </button>
                    </div>
				</div>
            </div>

        </div>

        )
    }
}

export default Vote;