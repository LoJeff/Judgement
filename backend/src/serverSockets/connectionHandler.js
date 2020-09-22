
// This class handles all the game connections socket handlers
class connectionHandler{
	constructor(server, client, debug = false){
		this.server = server;
        this.client = client;
        this.debug = debug;
        this.curRandGame = undefined;
    }

	joinGameRoom(client,data){
		// client joins room with gameid
		client.join(data.gameid);

        // if game does not exist

		if(global.data.findGame(data.gameid) === undefined){
			console.log("DATA GAMEID: "+data.gameid);
			global.data.createNewGame(data.gameid);
		}
        var game = global.data.findGame(data.gameid);

		// check that max players have not been exceeded
		if(game.getPlayersList().length < game.m_max_players){
            // add the player to the gamelist
            console.log("ADDING PLAYER " + data.name);
			game.addPlayer(client.id,data.name);

			// broadcast to all users in the room that a new player has joined
			var playersList = global.data.findGame(data.gameid).getPlayersList();
			var broadcastData = {"gameid":data.gameid,"playersList":playersList};
			global.emitters.broadcast_updateRoomPlayers(broadcastData);	

			// broadcast chat message that a new player has joined
			var chatMessage = data.name + " has joined the room!"
			var chatData = {gameid: data.gameid, from: "server", content: chatMessage, type:"serverAnnouncement"};

			global.data.mongoDB.insertChatMessage(data.gameid, "server", chatMessage, "serverAnnouncement").catch(function(err){
				console.log("Error:", err);
			}).finally(function(results){
				global.emitters.broadcast_chatUpdate(chatData);	
			});
			
		} else{
			// throw an error, max players reached in this game room
		}
	}

	leaveGameRoom(client,data){
		// client leaves the room with the gameid
		client.leave(data.gameid);

		// remove the player from the room
		global.data.findGame(data.gameid).removePlayer(data.name);

		var playersList = global.data.findGame(data.gameid).getPlayersList();

		// if that was the last user in the room, delete the room
		if(playersList.length == 0 ) {
			console.log("No one left in game id:",data.gameid,"removing game...");
			global.data.removeGame(data.gameid);
		}
		else{
			// otherwise, update the game room
			// broadcast to all users in the room that a new player has joined
			var broadcastData = {"gameid":data.gameid,"playersList":playersList};
			global.emitters.broadcast_updateRoomPlayers(broadcastData);
		}
    }
    
    getGame(client) {
        var gameId;
        if (Object.keys(client.rooms)[0] == client.id) {
            gameId = Object.keys(client.rooms)[1];
        } else {
            gameId = Object.keys(client.rooms)[0];
        }
        
        return global.data.findGame(gameId);
    }

    updateGame(client,data){
        var game = this.getGame(client);
        game.update(data);
    }

    startGame(client) {
		// find game
        var game = this.getGame(client);
        game.beginGame(client.id);
    }

    rcvPunish(client, data) {
        var game = this.getGame(client);
        
        if ("punishment" in data) {
            if (this.debug) {
                console.log("Receiving punishment from player | pid: " + client.id);
            }
            game.rcvPunish(client.id, data.punishment);
        } else {
            if (this.debug) {
                console.log("Did not receive punishment from player | pid: " + client.id);
            }
        }
    }

    rcvTargets(client, data) {
        var game = this.getGame(client);
        
        if ("targetSet" in data) {
            if (this.debug) {
                console.log("Receiving targets from the judge | judId: " + client.id + ", tarPair: " + data.targetPair.toString());
            }
            var target = data.targetSet.split(",").map((x)=>{return parseInt(x)});
            game.setTarget(target, client.id);
        } else {
            if (this.debug) {
                console.log("Did not receive targets from the judge | judId: " + client.id + ", tarPair: " + data.targetPair.toString());
            }
        }
    }

    rcvTarTODVote(client, data) {
        var game = this.getGame(client);

        if ("tarVote" in data) {
            if (this.debug) {
                console.log("Receiving target vote for TOD | tarId: " + client.id + ", tarVote: " + data.tarVote.toString());
            }
            game.rcvTarTOD(data.tarVote, client.id);
        } else {
            if (this.debug) {
                console.log("Did not receive target vote for TOD | tarId: " + client.id + ", tarVote: " + data.tarVote.toString());
            }
        }
    }

    rcvJudgePrompt(client, data) {
        var game = this.getGame(client);
        
        if ("prompt" in data) {
            if (this.debug) {
                console.log("Receiving judges prompt | judId: " + client.id);
            }
            game.rcvJudgePrompt(data.prompt, client.id);
        } else {
            if (this.debug) {
                console.log("Did not receive a prompt | judId: " + client.id);
            }
        }
    }

    rcvJudgeCont(client) {
        var game = this.getGame(client);
        if (this.debug) {
            console.log("Receiving judges continue | judId: " + client.id);
        }
        game.rcvJudgeCont(client.id);
    }

    rcvPlayerVote(client, data) {
        var game = this.getGame(client);
        if ("playerVote" in data) {
            if (this.debug) {
                console.log("Receiving vote from player | pid: " + client.id);
            }
            game.rcvVote(data.playerVote, client.id);
        } else {
            if (this.debug) {
                console.log("Did not receive playerVote from player | pid: " + client.id);
            }
        }
    }

    rcvContToPunish(client) {
        var game = this.getGame(client);
        if (this.debug) {
            console.log("Receiving end game continue | pid: " + client.id);
        }
        game.rcvContToPunish(client.id);
    }

    randStr(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

	eventHandlers(){
		const client = this.client;

		client.on("joinGameRoom",function(data){
			this.joinGameRoom(client,data);
		}.bind(this));

		client.on("leaveGameRoom",function(data){
			this.leaveGameRoom(client,data);
		}.bind(this));

        client.on("updateGame", function(data){
            this.updateGame(client,data);
        })
        
		client.on("Giff's a dummyFunction",function(data){
            var name = this.randStr(Math.floor(Math.random() * 10) + 1);
            if (this.curRandGame === undefined || (global.data.findGame(this.curRandGame) != undefined &&
                    global.data.findGame(this.curRandGame).getState() != 0)) {
                this.curRandGame = this.randStr(Math.floor(Math.random() * 20) + 1);
            }
            var gameid = this.curRandGame;
            global.emitters.sig_genUserInfo(client.id, gameid, name);
        }.bind(this));

        client.on("startGame",function(){
			this.startGame(client);
        }.bind(this));
        
        client.on("sendPunishment",function(data){
            this.rcvPunish(client,data);
        }.bind(this));

        client.on("sendTargets",function(data){
            this.rcvTargets(client,data);
        }.bind(this));

        client.on("tarTODVote",function(data){
            this.rcvTarTODVote(client,data);
        }.bind(this));

        client.on("sendJudgePrompt",function(data){
            this.rcvJudgePrompt(client, data);
        }.bind(this));

        client.on("sigJudgeContGame",function(data){
            this.rcvJudgeCont(client);
        }.bind(this));

        client.on("sendPlayerToDChoice",function(data){
            this.rcvPlayerVote(client,data);
        }.bind(this));

        client.on("sig_contToPunishment",function(data){
            this.rcvContToPunish(client);
        }.bind(this)); 
	}

}

export default connectionHandler;