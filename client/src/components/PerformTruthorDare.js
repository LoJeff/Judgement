import React, {Component} from 'react';

class PerformTruthorDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "isTarget": false,
            "isJudge": false,
            "isjury": true
        };

        // functions
        this.continueGame = this.continueGame.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitChoice(){

        // trigger page change
        this.props.triggerPageChange("vote");
    }

    render(){

        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                return(
                    <div>
                        <p>I am a target wooo</p>
                    </div> 
                )
            } else if (this.state.isJudge) {
                return(
                    //figure out how im getting/in what form im getting cur targets
                <p>Sit tight! {this.state.curTargets} are in trial.</p>
                )
            }
        }

        return ( 
        <div>
            <div>
                <h1>TruthorDare</h1>
            </div>

            <div>
                {showUserSpecificScreen}
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

export default PerformTruthorDare;