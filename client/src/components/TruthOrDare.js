import React, {Component} from 'react';

class TruthOrDare extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "curTargets": null,
            "tarTODChoice": null,
            "isTarget": null,
            "playerList": []
        };

        // functions
        this.submitChoice = this.submitChoice.bind(this);
        this.setTODChoice = this.setTODChoice.bind(this);
    }

    setTODChoice(choice){
        this.setState((choice) => ({
            tarTODChoice: choice
        }))

        this.submitChoice();
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitChoice(){
        //setup emitter
        this.props.emitters.sendTarTODVote(this.state.tarTODChoice)

        // trigger page change
        this.props.triggerPageChange("deliverToD");
    }

    render(){

        const showUserSpecificScreen = () => {
            if ( this.state.isTarget ){
                return(
                    <div>
                        <p>I am a target wooo</p>
                            <div id="possible_truthordare_set">
                                {/**have more flushed out hover values?*/}
                            <button className="popButton" onClick={this.setTODChoice("Truth")}>Confess
                            </button>
                            </div>
                            <button className="popButton" onClick={this.setTODChoice("Dare")}>Repent
                        </button>
                    </div> 
                )
            } else {
                return(
                <p>Sit tight! The accused are currently deciding their appeal</p>
                )
            }
        }

        return ( 
        <div>
            <div>
                <h1>Truth or Dare</h1>
            </div>

            <div>
                {showUserSpecificScreen()}
            </div>

        </div>

        )
    }
}

export default TruthOrDare;
