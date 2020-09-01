import React, {Component} from 'react';

class Leaderboard extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "receivedPackets": [],
        };

        // functions
        this.proceedGame = this.proceedGame.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    // TODO: think of better method name
    proceedGame(){
        // if end game; Else, loop
        if (true) {
            this.props.triggerPageChange("endgame");
        }
        else {
            this.props.triggerPageChange("pickTargets")
        }
    }

    render(){

        return ( 
        <div>
            <div>
                <h1>Leaderboard</h1>
            </div>

            <div>
                <div id="submit_button_container">
					<button className="popButton" type="submit" onClick={this.proceedGame}>Submit
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