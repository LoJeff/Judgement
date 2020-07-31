import React, {Component} from 'react';

class TruthorDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "receivedPackets": [],
        };

        // functions
        this.submitChoice = this.submitChoice.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitChoice(){

        // trigger page change
        this.props.triggerPageChange("vote");
    }

    render(){

        return ( 
        <div>
            <div>
                <h1>TruthorDare</h1>
            </div>

            // TODO: add submit button visual modifiers in this div
            <div>
                <div id="submit_button_container">
					<button className="popButton" type="submit" onClick={this.submitChoice}>Submit
                    </button>
				</div>
            </div>

        </div>

        )
    }
}

export default TruthorDare;