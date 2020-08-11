import React, {Component} from 'react';

class PickTargets extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "playerList": [],
            "invalidPairs": [],
            "judge": null,
            "targetA": null,
            "targetB": null
            };

        // functions
        this.submitTargets = this.submitTargets.bind(this);
        this.generatePossibleTargets = this.generatePossibleTargets.bind(this);
        this.generatePossibleTargetsList = this.generatePossibleTargetsList.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitTargets(){
        this.props.emitters.sendTargets(this.state.targetA, this.state.targetB);

        // trigger page change
        this.props.triggerPageChange("truthOrDare");
    }

    generatePossibleTargetsList(targetA){
        var possibleTargetsList = [];
        var player = null;
        
        //if first target has been chosen
        if (targetA != null){
            //TODO: fix the typing for this
            for (player in this.state.playerList){
                //assuming given list with 2 player objects
                if (!([targetA, player] in this.state.invalidPairs) ||
                     !([player,targetA] in this.state.invalidPairs)){
                    possibleTargetsList.push(player);
                }
            }
        } 
        else {
            if (this.state.playerList != undefined){
                for (player in this.state.playerList){
                    if (player != this.state.judge){
                        possibleTargetsList.push(player)
                    }
                };
            }
        }
        return possibleTargetsList
    }

    generatePossibleTargets(target){
        //if the first target has not been chosen yet
        if (this.state.targetA == null){
            this.state.targetA = target
            this.generatePossibleTargetsList(target)
        } else {
            this.state.targetB = target
        }
        
    }



    render(){
        const possibleTargets = this.generatePossibleTargets(null);
        const possibleTargetElements = [];
        
        if (possibleTargets != undefined){
            possibleTargets.forEach(function(target){
                possibleTargetElements.push(
                    <li key={target.name} onClick={this.props.generatePossibleTargets(target)}>
                        {target.name}
                    </li>
                )
            })
        }

        const showUserSpecificScreen = () => {
            if ( true ){
                return(
                    <div>
                        <p>I am a judge wooo</p>
                            <div id="possible_targets_set">
                                <ul class="target_container">
                                    {possibleTargets}
                                </ul>
                                
                            </div>
                    </div> 
                )
            } else {
                return(
                <p>Sit tight! The judge is deciding who to test.</p>
                )
            }
        }

        return( 
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