import React, {Component} from 'react';

class Endgame extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "punishment": null,
            "punOwner": null,
            "victim": null
        };

        // functions
        this.playAgain = this.playAgain.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    playAgain(){
        this.props.triggerPageChange("lobby");
    }

    render(){

        return (
        <div>
            <div>
                <h1>The End</h1>
            </div>

            <div>
                Urgent message for: {this.state.victim}
            </div>

            <div>
                {/**message in a box*/}
                To whom it may concern,

                We may be able to fit one more passenger on the escape panel. However, since it would be at the cost of our seated comfort, you must earn this spot.
                To repent and salvage your soul, execute the following punishment submitted by {this.state.punOwner}.
            </div>
            <div>
                {this.state.punishment}
            </div>
            <div>
                Upon completion, we will consider saving your sorry ass.

                Yours Truly, the Captain
            </div>
            <div>
                <div id="submit_button_container">
                    <button className="popButton" type="submit" onClick={this.playAgain}>Play Again!
                    </button>
                </div>
            </div>

        </div>
        )
    }
}

export default Endgame;