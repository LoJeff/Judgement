import React, {Component} from 'react';

class Vote extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "receivedPackets": [],
        };

        // functions
        this.continueGame = this.continueGame.bind(this);
    }

    continueGame(){
        // if turn x, y, z, show leaderboard; else, start another episode
        // TODO: update this with condition on when to choose leaderboard
        if (true){
        this.props.triggerPageChange("leaderboard");
        }
        else {
        this.props.triggerPageChange("pickTargets");       
        }
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    render(){

        return ( 
        <div>
            <div>
                <h1>Vote</h1>
            </div>

            // TODO: add submit button visual modifiers in this div
            <div>
                <div id="submit_button_container">
					<button className="popButton" type="submit" onClick={this.continueGame}>Submit
                    </button>
				</div>
            </div>

        </div>

        )
    }
}

export default Vote;