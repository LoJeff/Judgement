import React, {Component} from 'react';

class Lobby extends Component {
    constructor(props){
        super(props);

        this.leaveGameRoom = this.leaveGameRoom.bind(this);
        this.startGame = this.startGame.bind(this);

        // state
        this.state = {
            "playersList": [],
        };
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
    }

    leaveGameRoom(){
        this.props.emitters.leaveGameRoom(this.props.clientName,this.props.gameid);
        // update data
        this.props.updateGameid("");

        // trigger page change
        this.props.triggerPageChange("login");
    }

    startGame(){
        // if(this.state.playersList.length === 6){
            // emit game start to server
            this.props.emitters.startGame(this.props.gameid);
            // trigger page change
            this.props.triggerPageChange("game");
        // }
    }


    render(){
        const playersListElements = [];
        if(this.state.playersList !== undefined){
            this.state.playersList.forEach(function(player){
                playersListElements.push(<li key={player.id}>{player.name} (id:{player.id})</li>)
            });
        }

        return(
            <div>
                <h1>Welcome {this.props.clientName}</h1>
                <h1>Currently aboard The {this.props.gameid}</h1>
                <br/>
                <Chat emitters={this.props.emitters}
                      handlers={this.props.handlers}
                      gameid={this.props.gameid}
                      clientName={this.props.clientName}
                      />
                <h1>Passengers Onboard: </h1>
                <ul>
                    {playersListElements}
                </ul>
                <button className="popButton" onClick={this.leaveGameRoom}>Jump Ship</button>
                <button className="popButton" onClick={this.startGame}>Start Voyage</button>
			</div>
        );
    }
}

export default Lobby;
