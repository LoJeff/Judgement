import React, {Component} from 'react';

class PickTargets extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "receivedPackets": [],
        };

        // functions
        this.submitTargets = this.submitTargets.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitTargets(){
        // TODO: figure out how to get two targets, this probably won't work
        //var targetOne = document.getElementById("targetOne").value;
        //var targetTwo = document.getElementById("targetTwo").value;

        // trigger page change
        this.props.triggerPageChange("truthOrDare");
    }

    render(){

        return ( 
        <div>
            <div>
                <h1>PickTargets</h1>
            </div>

            // TODO: add submit button visual modifiers in this div
            <div>
                <div id="submit_button_container">
                    <button className="popButton" type="submit" onClick={this.submitTargets}>Judge!
                    </button>
                </div>
            </div>
        </div>

        )
    }
}

export default PickTargets;