import React, {Component} from 'react';

class Lobby extends Component {
    constructor(props){
        super(props);

        this.leaveGameRoom = this.leaveGameRoom.bind(this);
        this.startGame = this.startGame.bind(this);

        // state
        this.state = {
            "playersList": [],
            "enoughPlayers": false,
            "displayNotEnoughPlayers": null
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
        // emit game start to server
        this.props.emitters.startGame();

        if (this.state.enoughPlayers) {
            // trigger page change to enter punishment page
            this.props.triggerPageChange("punishment");
        } else {
            this.setState(() => ({
                displayNotEnoughPlayers: true
            }))

        }
    }

    render(){
        const playersListElements = [];
        if (this.state.playersList !== undefined){
            this.state.playersList.forEach(function(player){
                playersListElements.push(<li key={player.id}>{player.name} (id:{player.id})</li>)
            });
        }

        const displayNotEnoughPlayers = () => {
            console.log("in not enough player display")
            if (this.state.displayNotEnoughPlayers) {
                return(
                    <div>
                        <p>Waiting for more passengers! Ship cannot set sail until at least 3 passengers are on board.</p>
                    </div>
                )
            } else if (this.state.displayNotEnoughPlayers === false) {
                return(
                    <div>
                        <p> Setting sail! What could possibly go wrong?</p>
                    </div>
                )
            }
        }

        return(
            <div>
                <h1>Welcome {this.props.clientName}</h1>
                <h1>Currently aboard The {this.props.gameid}</h1>
                <br/>

                <h1>Passengers Onboard: </h1>
                <ul>
                    {playersListElements}
                </ul>
                <div>
                    {displayNotEnoughPlayers()}
                </div>
                <button className="popButton" onClick={this.leaveGameRoom}>Abandon Ship</button>
                <button className="popButton" onClick={this.startGame}>Start Voyage</button>
            </div>
        );
    }
}

export default Lobby;
