import React, {Component} from 'react';

class PickTargets extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "playerList": [],
            "invalidPairs": [],
            //isJudge may be redundant, keep for now
            "isJudge": false,
            "curJudge": null,
            "targetAID": null,
            "targetBID": null
            };

        // functions
        this.submitTargets = this.submitTargets.bind(this);
        this.generatePossibleTargets = this.generatePossibleTargets.bind(this);
        this.generatePair = this.generatePair.bind(this);
        this.generatePossibleTargetsList = this.generatePossibleTargetsList.bind(this);
        this.isIdJudge = this.isIdJudge.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitTargets(){
        this.props.emitters.sendTargets(this.generatePossibleTargets(this.state.targetAID, this.state.targetBID));

        // trigger page change
        this.props.triggerPageChange("truthOrDare");
    }

    //TODO think of clearer parameter names?
    generatePair(idA, idB){
        var resPair = [];
        resPair.push(idA);
        resPair.push(idB);
        resPair.sort();
        resPair = toString(resPair);
        return resPair
    }

    isIdJudge(ID){
        return this.state.playerList[ID] == this.state.curJudge
    }

    generatePossibleTargetsList(targetAID){
        //list of player names
        var possibleTargetsList = [];
        
        //if first target has been chosen
        if (targetAID != null){
            for (var i = 0; i < this.state.playerList.length; i++ ){
                
                var currPair = this.generatePair(targetAID, i);
                
                //add possible targets to list
                if (!(currPair in this.state.invalidPairs) ||
                i != targetAID || !this.isIdJudge){
                    possibleTargetsList.push(this.state.playerList[i]);
                }
            }
        } 
        else {
            if (this.state.playerList != undefined){
                //create list of targets, not including judge
                for (i = 0; i < this.state.playerList.length; i++ ){
                    if (!this.isIdJudge){
                        possibleTargetsList.push(this.state.playerList[i])
                    }
                };
            }
        }
        return possibleTargetsList
    }

    generatePossibleTargets(target){
        //if the first target has not been chosen yet
        var targetID = this.state.playerList.indexOf(target);
        if (this.state.targetAID == null){
            this.state.targetAID = targetID
            return this.generatePossibleTargetsList(targetID)
        } else {
            this.state.targetBID = targetID
            return []
        }   
    }

    render(){
        const possibleTargets = this.generatePossibleTargets(null);
        const possibleTargetElements = [];
        
        if (possibleTargets != undefined){
            possibleTargets.forEach(function(target){
                possibleTargetElements.push(
                    <li key={target} onClick={this.props.generatePossibleTargets(target)}>
                        {target}
                    </li>
                )
            })
        }

        const showUserSpecificScreen = () => {
            if ( this.state.isJudge ){
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
                <p>Sit tight! Judge {this.state.curJudge} is deciding who to test.</p>
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
                <div id="interactive_set">
                    <div id="submit_button_container">
                        <button className="popButton" type="submit" onClick={this.submitTargets}>Judge!
                        </button>
                    </div>
                </div>
            </div>
        </div>

        )
    }
}

export default PickTargets;