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
            curTargets: ""
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
                                triggerPageChange={this.triggerPageChange}
                                updateCurTargets={this.updateCurTargets}
                />)
        }
        else if(this.state.pageState === "truthOrDare"){
            return(<TruthOrDare emitters={this.state.emitters}
                                handlers={this.state.handlers}
                                triggerPageChange={this.triggerPageChange}
                                updateCurTargets={this.updateCurTargets}
                />)
        }        
        else if(this.state.pageState === "deliverToD"){
            return(<DeliverTruthOrDare emitters={this.state.emitters}
                                handlers={this.state.handlers}
                                triggerPageChange={this.triggerPageChange}
                                curTargets={this.state.curTargets}
                />)
        }
        else if(this.state.pageState === "performToD"){
            return(<PerformTruthOrDare emitters={this.state.emitters}
                         handlers={this.state.handlers}
                         triggerPageChange={this.triggerPageChange}
                         curTargets={this.state.curTargets}
                />)
        }
        else if(this.state.pageState === "vote"){
            return(<Vote emitters={this.state.emitters}
                         handlers={this.state.handlers}
                         triggerPageChange={this.triggerPageChange}
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
