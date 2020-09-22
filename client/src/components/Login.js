import React, {Component} from 'react';

class Login extends Component {
    constructor(props){
        super(props);
        
        // functions
        this.joinGameRoom = this.joinGameRoom.bind(this);
        this.dummyFunction = this.dummyFunction.bind(this);
        this.setVisual = this.setVisual.bind(this);
        
        // state
        this.state = {
            "isVisual": false,
            "genUserID": null,
            "genGameID": null
        };
    }

    componentDidMount(){
        this.props.handlers.updateReact(this);
        document.getElementById("name").value = this.props.clientName;
    }

    setVisual(visual){
        this.setState(() => ({
            isVisual: visual
        }));

        console.log("IN SET VISUAL STATE");
    }

    joinGameRoom(name = null, gameid = null){
       
        if (name === null) {
            name = document.getElementById("name").value;
        }

        if (gameid === null) {
            gameid = document.getElementById("gameid").value;
        }

        this.props.emitters.sig_visualSupported(this.state.isVisual);
        this.props.emitters.joinGameRoom(name,gameid);

        // update data
        this.props.updateGameid(gameid);
        this.props.updateClientName(name);

        // trigger page change
        console.log("IS VISUAL?: "+this.state.isVisual);
        this.props.triggerPageChange("lobby");
    }

    dummyFunction(){
        this.props.emitters.dummyFunction();

        this.joinGameRoom(this.state.genUserID, this.state.genGameID);
    }

    render(){
        return(
            <div id="login_page">
				<div id="fancyticket_container">
                    <div id="fancyticket">
                        <div id="ticket_sidebar">
                                <div className="row_of_input">
                                    <div id="IGN_input_container">
                                        Name:
                                        <form > <input className="fancyInput" type="text" id="name" placeholder="Enter name" /></form>
                                    </div>
                                    <div id="Game_ID_input_container">
                                        Ship ID:
                                        <form >
                                            <input className="fancyInput" type="text" id="gameid" placeholder="Enter game ID"/>
                                        </form>
                                    </div>
                                    <div>
                                        <button className="visSuppButton" onClick={ () => this.setVisual(true)}> Include Visual Support </button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
				
				<div className="button_set">
                        <div className="login_button_container">
					    <button className="popButton" type="submit" onClick={this.joinGameRoom}>Join 
                        </button>
                        </div>
                        <div className="login_button_container">
                        <button className="popButton" onClick={this.dummyFunction}>Giff's butt</button>
                        </div>
                </div>

                <div id="login_title_container">
                    JUDGEMENT!
                </div>
            </div>
        );
    }
}

export default Login;
