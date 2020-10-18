import React, {Component} from 'react';

class Lobby extends Component {
    constructor(props){
        super(props);

        this.leaveGameRoom = this.leaveGameRoom.bind(this);
        this.startGame = this.startGame.bind(this);

        // state
        this.state = {
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
        if (this.props.playerList !== undefined){
            this.props.playerList.forEach(function(playerName){
                playersListElements.push(<li key={playerName}>{playerName}</li>)
            });
        }

        const displayNotEnoughPlayers = () => {
            if (this.state.displayNotEnoughPlayers) {
                return(
                    <div>
                        <p>Waiting for more passengers! Ship cannot set sail until at least 3 passengers are on board.</p>
                    </div>
                )
            } else if (this.state.displayNotEnoughPlayers === false) {
                return(
                    <div>
                        <p>Setting sail! What could possibly go wrong?</p>
                    </div>
                )
            }
        }

        return(
            <div id='lobby'>
                <div id='title_container'>
                    <h1>Welcome: {this.props.clientName}</h1>
                    <h1>Currently aboard: {this.props.gameid}</h1>
                </div>

                <div id='list_container'>
                    <div id='list_title'>Passengers </div>
                    <hr/>
                    <ul>
                        {playersListElements}
                    </ul>
                    <div>
                        {displayNotEnoughPlayers()}
                    </div>
                </div>

                <div className='button_set'>
                    <div className="login_button_container">
                    <button className="popButton" onClick={this.leaveGameRoom}>Abandon Ship</button>
                    </div>
                    
                    <div className="login_button_container">
                    <button className="popButton" onClick={this.startGame}>Start Voyage</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Lobby;
