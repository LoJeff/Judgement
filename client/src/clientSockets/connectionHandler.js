// This class handles all the game connections socket handlers
class connectionHandler{
	constructor(client,react){
		this.client = client;
		this.react = react;
	}

	updateReact(newReact){
		this.react = newReact;
    }

	genUserInfo(data){

		console.log("USERID: "+data.name);
		console.log("GAMEID: "+data.gameid);
		
		this.react.setState({ "genUserID": data.name,
							"genGameID": data.gameid 
		});
	}

	// Notifies the client that a new member has joined the game room
	updateRoomPlayers(data){
		// data
			// data.players
		this.react.setState({"playersList": data.playersList});
	}

	updateGame(data){
        console.log(String(data));
    }
    
    updateUser(data){
        console.log("Received Data for User " + String(data.userid));
	}
	
	imJudge(data){
		this.react.setState({"invalidSets": data.invalidSets,
							"playerList": data.idToName,
							"judgeID": data.judgeID,
							"isJudge": true
						});
	}

	curJudge(data){
		this.react.setState({"curJudge": data.name});
	}

	beginGame(data){
		console.log("Received begin game");
		this.react.setState({"enoughPlayers": true})        
		this.react.props.triggerPageChange("punishment");
	}

	notEnoughPlayers(data){
		console.log("Received not enough players");
		this.react.setState({"enoughPlayers": false});
	}

	//before vote, after judge given prompt
	cueWaitForTrial(data){
		this.react.props.triggerPageChange("performToD");
	}

	//broadcasts to targets the current targets
	valTargets(data){
		this.react.setState({"targets": data.targets});
	}

	//the targets final decision of truth or dare
	tarResultTOD(data){
		this.react.setState({"tarResultTOD": data.decision});
		//this.react.props.triggerPageChange("performToD");
	}

	//tells judge to choose our prompt, or give own suggestion
	judgeChoosePrompt(data){
		this.react.setState({"suggest": data.suggestion});
	}

	//broadcast the trial that judge chose
	judgeResultPrompt(data){
		this.react.setState({"curTrial": data.prompt});
	}

	judgeReqCont(data){
		console.log("Received: tell judge to continue when trial is over");
	}

	playerVote(data){
		this.react.props.triggerPageChange("deliverToD");
		this.react.setState({"curTargets": data.targets})
	}

	resultVote(data){
		this.react.setState({"resultVote": data.result});
	}

	roundRank(data){
		this.react.setState({"roundRank": data.roundRank,
							"trigLeaderBoard": true});
	}

	nextRound(data){
		this.react.setState({"totalPlayers": data.total});
	}

	tarChooseTOD(data){
		//remove tarTOD
		this.react.setState({"isTarget": true,
							"playerList": data.idToName});
		console.log("Received trig choose ToD")
		this.react.props.triggerPageChange("truthOrDare");
	}

	contWaitFor(data){
		this.react.setState({"numWaiting": data.waiting});
	}

	waitForceStart(){
		this.react.setState({"forceCont": true});
	}

	endGame(data){
		this.react.setState({"ranking": data.rankInfo,
							"punishment": data.punInfo.punishment,
							"trigEndGame": true,
							"punOwner": data.punInfo.punOwner,
							"victim": data.punished
						});
	}

	eventHandlers(){
		const client = this.client;

		client.on("Hid's a dummyFunction",function(data){
			this.genUserInfo(data);
		}.bind(this));
		
		client.on("updateRoomPlayers",function(data){
			this.updateRoomPlayers(data);
		}.bind(this));

		client.on("updateGame",function(data){
			this.updateGame(data);
        }.bind(this));
        
        client.on("updateUser",function(data){
			this.updateUser(data);
		}.bind(this));

		client.on("beginGame",function(data){
			this.beginGame(data);
		}.bind(this));

		client.on("notEnoughPlayers",function(){
			this.notEnoughPlayers();
		}.bind(this));

		client.on("curJudge",function(data){
			this.curJudge(data);
		}.bind(this));

		client.on("imJudge",function(data){
			this.imJudge(data);
		}.bind(this));

		client.on("tarResultTOD",function(data){
			this.tarResultTOD(data);
		}.bind(this));

		client.on("waitForTrial",function(){
			this.cueWaitForTrial();
		}.bind(this));

		client.on("valTargets",function(data){
			this.valTargets(data);
		}.bind(this));

		client.on("tarChooseTOD",function(){
			//signal to target to choose ToD
			this.tarChooseTOD();
		}.bind(this));
		
		client.on("judgeChoosePrompt",function(data){
			this.judgeChoosePrompt(data);
		}.bind(this));

		client.on("judgeResultPrompt", function(data){
			this.judgeResultPrompt(data);
		}.bind(this));
		
		client.on("judgeReqCont",function(data){
			this.judgeReqCont(data);
		}.bind(this));
		
		client.on("playerVote",function(data){
			this.playerVote(data);
		}.bind(this));
		
		client.on("resultVote",function(data){
			this.resultVote(data);
		}.bind(this));
		
		client.on("roundRank",function(data){
			this.roundRank(data);
		}.bind(this));
		
		client.on("nextRound",function(data){
			this.nextRound(data);
		}.bind(this));

		client.on("contWaitFor",function(data){
			this.contWaitFor(data);
		}.bind(this));

		client.on("waitForceStart",function(){
			this.waitForceStart();
		}.bind(this))
		
		client.on("endGame",function(data){
			this.endGame(data);
        }.bind(this));
	}
}

export default connectionHandler;