import React, {Component} from 'react';

class Endgame extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "receivedPackets": [],
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
                <h1>EndGame</h1>

            </div>

            // TODO: add submit button visual modifiers in this div
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