import React, {Component} from 'react';

class PickTargets extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            //"receivedPacket": [],
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
        
        const showUserSpecificScreen = () => {
            if ( false
                //receivedPacket.uid == 11
                ){
                return <p>I am a judge wooo</p>
            } else {
                return <p>I am not une judge :(</p>
            }
        }

        return ( 
        <div>
            <div id="subtitle_container">
                <h1>Pick Targets</h1>
            </div>

            <div> 
                {showUserSpecificScreen()}
            </div>

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