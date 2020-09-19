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
        } else if (this.state.targetBID === null && this.state.targetAID != null) {
            this.setState(() => ({
                targetBID: targetID
            }))

            //submit choices
            this.props.emitters.sendTargets(this.generatePair(this.state.targetAID, this.state.targetBID));

            //trigger page change
            this.props.triggerPageChange("truthOrDare");
        }
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

    render(){

        var checkDisplayButton = (targetID) => {

            //if player is not judge
            if (targetID !== this.state.judgeID){

                //if first target is already picked
                if(this.state.targetAID !== null){
                    var currPair = this.generatePair(targetID, this.state.targetAID);

                    if(!currPair in this.state.invalidSets || targetID !== this.state.targetAID) {
                        return(
                            <div>
                                <button className='popButton' onClick={ () => this.submitTargets(targetID) }> Select for Trial </button>
                            </div>
                        )
                    }
                }
                return(
                //if first target has not been picked
                <div>
                    <button className='popButton' onClick={ () => this.submitTargets(targetID) }> Select for Trial </button>
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
                        <p>I am a judge wooo</p>
                            <div id="possible_targets_set">
                                <ul className="target_container">
                                    {possibleTargetElements}
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
        </div>

        )
    }
}

export default PickTargets;