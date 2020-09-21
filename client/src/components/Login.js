import React, {Component} from 'react';

class Login extends Component {
    constructor(props){
        super(props);
        
        // functions
        this.joinGameRoom = this.joinGameRoom.bind(this);
        this.dummyFunction = this.dummyFunction.bind(this);
        
        // state
        this.state = {
        };
    }

    //when need to interact with browser
    //if need data from remote endpoint, good place to instantiate network request
    componentDidMount(){
        this.props.handlers.updateReact(this);
        document.getElementById("name").value = this.props.clientName;
    }

    joinGameRoom(){
        var name = document.getElementById("name").value;
        var gameid = document.getElementById("gameid").value;
        this.props.emitters.joinGameRoom(name,gameid);

        // update data
        this.props.updateGameid(gameid);
        this.props.updateClientName(name);

        // trigger page change
        this.props.triggerPageChange("lobby");
    }

    dummyFunction(){
        this.props.emitters.dummyFunction();
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
