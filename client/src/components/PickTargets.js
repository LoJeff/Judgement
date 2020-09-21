import React, {Component} from 'react';

class PickTargets extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            "playerList": [],
            "invalidSets": [],
            "isJudge": false,
            "curJudge": null,
            "targetAID": null,
            "targetBID": null,
            "judgeID": null
            };

        // functions
        this.submitTargets = this.submitTargets.bind(this);
        this.generatePair = this.generatePair.bind(this);
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    submitTargets(targetID){
        //if first target has not been chosen
        if (this.state.targetAID === null){
            this.setState(() => ({
                targetAID: targetID
            }))

        //if second target has not been chosen but first target has
        } else if (this.state.targetBID === null && this.state.targetAID !== null) {
            this.setState(() => ({
                targetBID: targetID
            }))
            
        } else if (this.state.targetBID !== null && this.state.targetAID !== null) {

            //submit choices
            this.props.emitters.sendTargets(this.generatePair(this.state.targetAID, this.state.targetBID));
            
            //trigger page change
            this.props.triggerPageChange("truthOrDare");
        }
    }

    //TODO think of clearer parameter names?
    generatePair(idA, idB){
        var resPair = [idA, idB];
        resPair.sort();
        resPair = resPair.toString();
        return resPair;
    }

    render(){

        var checkDisplayButton = (targetID) => {

            //if player is not judge
            if (targetID !== this.state.judgeID){

                //if first target is already picked
                if(this.state.targetAID !== null){
                    var currPair = this.generatePair(targetID, this.state.targetAID);

                    if(currPair in this.state.invalidSets || targetID === this.state.targetAID || targetID === this.state.targetBID) {
                        return(
                            <div>
                                <button className='selectButton' onClick={ () => this.submitTargets() } disabled> Select for Trial </button>
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                <button className='selectButton' onClick={ () => this.submitTargets(targetID) }> Select for Trial </button>
                            </div>
                        )
                    }
                }
                return(
                //if first target has not been picked
                <div>
                    <button className='selectButton' onClick={ () => this.submitTargets(targetID) }> Select for Trial </button>
                </div>
                )
            } else {
                return (
                    <div>
                        <button className='selectButton' onClick={ () => this.submitTargets(null) } disabled> Select for Trial </button>
                    </div>
                )
            }
        }

        var displaySubmitButton = () => {
            if (this.state.targetAID !== null && this.state.targetBID !== null) {
                return (
                    <div>
                        <button className='submitButton' onClick={this.submitTargets}>Submit Passengers {this.state.playerList[this.state.targetAID]} and {this.state.playerList[this.state.targetBID]} for Trial!</button>
                    </div>
                )
            }
        }

        var possibleTargetElements = [];
        
        if (this.state.playerList !== undefined){

            for (var i = 0; i < this.state.playerList.length; i++){
                possibleTargetElements.push(
                    <li key={i} >
                        {this.state.playerList[i]}
                        {checkDisplayButton(i)}
                    </li>
                )
            };
        }

        const showUserSpecificScreen = () => {
            if ( this.state.isJudge ) {
                return(
                    <div>
                        <div id="possible_targets_set">

                            <div id='target_description'>
                                Here is our passenger roster, select the first then second passenger to be judged for trial. You can only select passenger pairs that have not already been selected this round.
                                Choose wisely, once selected they cannot be de-selected!
                            </div>

                            <ul className="targetContainer">
                                <div id='passenger_title'>
                                    PAssenNGeR RosteR
                                </div>
                                {possibleTargetElements}

                                <div id='submit_target_button_container'>
                                    {displaySubmitButton()}
                                </div>
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
        <div id='pick_targets'>
            <div id="subtitle_container">
                <h1>Pick Targets</h1>
            </div>

            <div> 
                {showUserSpecificScreen()}
            </div>
        </div>

        )
    }
}

export default PickTargets;