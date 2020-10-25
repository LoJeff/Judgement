import React, {Component} from 'react';
import io from 'socket.io-client';
import connectionEmitter from "../clientSockets/connectionEmitter.js";
import connectionHandler from "../clientSockets/connectionHandler.js";

// Component imports
import Login from './Login.js';
import Lobby from './Lobby.js';
import Punishment from './Punishment.js';
import PickTargets from './PickTargets.js';
import TruthOrDare from './TruthOrDare.js';
import DeliverTruthOrDare from './DeliverTruthOrDare.js';
import Leaderboard from './Leaderboard.js';
import Vote from './Vote.js';
import Endgame from './Endgame.js';
import PerformTruthOrDare from './PerformTruthOrDare.js';
import FinalLeaderboard from './FinalLeaderboard.js';

class App extends Component {
    constructor(props){
        super(props);

        this.triggerPageChange = this.triggerPageChange.bind(this);
        this.updateGameid = this.updateGameid.bind(this);
        this.updateClientName = this.updateClientName.bind(this);
        this.updateCurTargets = this.updateCurTargets.bind(this);
        this.updatePlayerList = this.updatePlayerList.bind(this);
        this.displayPlayerNamesFromString = this.displayPlayerNamesFromString.bind(this);
        this.displayVoteChoices = this.displayVoteChoices.bind(this);
        this.displaySubmitButton = this.displaySubmitButton.bind(this);
        //this.submitVote = this.submitVote.bind(this);


        // create socket connection
        const socket = io();
        const emitters = new connectionEmitter(socket);
        const handlers = new connectionHandler(socket,this);
        
        // state
        this.state = {
            emitters: emitters,
            handlers: handlers,
            pageState: "login",
            gameid: "",
            clientName: "",
            curTargets: "",
            playerList: []
        };
    }

    componentDidMount(){
        this.state.handlers.updateReact(this);
        // Turn on event listening handlers
        this.state.handlers.eventHandlers();
    }

    triggerPageChange(newPage){
        this.setState({pageState: newPage});
    }

    // Login Page
    updateGameid(newGameId){
        this.setState({gameid: newGameId});
    }

    updateClientName(newName){
        this.setState({clientName: newName});
    }

    updateCurTargets(targetIds){
        this.setState({curTargets: targetIds});
    }

    updatePlayerList(playerList){
        this.setState({playerList: playerList});
    }

    displayPlayerNamesFromString(playerList, playerID){
        var result = "";
        if (playerID !== undefined) {

            var idsFromString = JSON.stringify(playerID);
            var listOfIds = idsFromString.split(",").map((x)=>{ 
                var x = x.replace(/\D/g, ''); 
                return parseInt(x);
            });

            for (var i = 0; i < listOfIds.length; i++){
                if (i === listOfIds.length - 1 && result.length > 0) {
                    result += " and";
                }
                result += " " + playerList[listOfIds[i]];
            }
        }
        return result;
    }

    displayVoteChoices(vote, setFunc, stateVal){

        if (stateVal !== true){
            setFunc(vote);

            if( vote === 0) {
                document.getElementById("0").setAttribute("disabled", "true");
                document.getElementById("1").removeAttribute("disabled");
            } else {
                document.getElementById("1").setAttribute("disabled", "true");
                document.getElementById("0").removeAttribute("disabled");
            }
        }
    }

    // submitVote(emitFunc, stateVal, setFunc){
    //     emitFunc(stateVal);

    //     setFunc(true);

    //     document.getElementById('submitVoteButton').setAttribute("disabled", "true")
    // }

    displaySubmitButton(stateVal, subFunc){

        if (stateVal === true){
            return (         
                <div>
                    <button className="submitVote" type="text" id="submitVoteButton" onClick={subFunc}>Vote submitted</button>
                </div>
            )

        } else if (stateVal !== null) {
            return (         
                <div>
                    <button className="submitVote" type="text" id="submitVoteButton" onClick={subFunc}>Submit Vote</button>
                </div>
            )
        } else {
            return (
                <div>
                    <button className="submitVote" type="text" onClick={null} disabled>Submit Vote</button>
                </div>
            )
        }
    }

    // Lobby Page
    render(){
        if(this.state.pageState === "login"){
            return(<Login emitters={this.state.emitters}
                          handlers={this.state.handlers}
                          triggerPageChange={this.triggerPageChange} 
                          updateGameid={this.updateGameid}
                          updateClientName={this.updateClientName}
                          clientName={this.state.clientName}
                          />);
        }
        else if (this.state.pageState === "lobby"){
            return(<Lobby emitters={this.state.emitters}
                          handlers={this.state.handlers}
                          triggerPageChange={this.triggerPageChange}
                          updateGameid={this.updateGameid}
                          gameid={this.state.gameid}
                          clientName={this.state.clientName}
                          updatePlayerList={this.updatePlayerList}
                          playerList={this.state.playerList}
                          />);
        }
        else if(this.state.pageState === "punishment"){
            return(<Punishment emitters={this.state.emitters}
                               handlers={this.state.handlers}
                               triggerPageChange={this.triggerPageChange}
                />)
        }
        else if(this.state.pageState === "pickTargets"){
            return(<PickTargets emitters={this.state.emitters}
                                handlers={this.state.handlers}
                                playerList={this.state.playerList}
                                triggerPageChange={this.triggerPageChange}
                                updateCurTargets={this.updateCurTargets}
                                updatePlayerList={this.updatePlayerList}
                />)
        }
        else if(this.state.pageState === "truthOrDare"){
            return(<TruthOrDare emitters={this.state.emitters}
                                handlers={this.state.handlers}
                                triggerPageChange={this.triggerPageChange}
                                updateCurTargets={this.updateCurTargets}
                                displayVoteChoices={this.displayVoteChoices}
                                displaySubmitButton={this.displaySubmitButton}
                                submitVote={this.submitVote}
                />)
        }        
        else if(this.state.pageState === "deliverToD"){
            return(<DeliverTruthOrDare emitters={this.state.emitters}
                                handlers={this.state.handlers}
                                triggerPageChange={this.triggerPageChange}
                                curTargets={this.state.curTargets}
                                playerList={this.state.playerList}
                                displayPlayerNamesFromString={this.displayPlayerNamesFromString}
                />)
        }
        else if(this.state.pageState === "performToD"){
            return(<PerformTruthOrDare emitters={this.state.emitters}
                         handlers={this.state.handlers}
                         triggerPageChange={this.triggerPageChange}
                         curTargets={this.state.curTargets}
                         playerList={this.state.playerList}
                         displayPlayerNamesFromString={this.displayPlayerNamesFromString}
                />)
        }
        else if(this.state.pageState === "vote"){
            return(<Vote emitters={this.state.emitters}
                         handlers={this.state.handlers}
                         triggerPageChange={this.triggerPageChange}
                         curTargets={this.state.curTargets}
                         playerList={this.state.playerList}
                         displayPlayerNamesFromString={this.displayPlayerNamesFromString}
                         displayVoteChoices={this.displayVoteChoices}
                         displaySubmitButton={this.displaySubmitButton}
                         submitVote={this.submitVote}
                />)
        }
        else if(this.state.pageState === "leaderboard"){
            return(<Leaderboard emitters={this.state.emitters}
                                handlers={this.state.handlers}
                                triggerPageChange={this.triggerPageChange}
                />)
        }
        else if(this.state.pageState === "finalLeaderboard"){
            return(<FinalLeaderboard emitters={this.state.emitters}
                                handlers={this.state.handlers}
                                triggerPageChange={this.triggerPageChange}
                />)
        }
        else if(this.state.pageState === "endgame"){
            return(<Endgame emitters={this.state.emitters}
                            handlers={this.state.handlers}
                            triggerPageChange={this.triggerPageChange}
                />)
        }
        else{
            return(<h1>Page not found </h1>);
        }
    }
}

export default App;
