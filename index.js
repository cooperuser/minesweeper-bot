const Discord = require("discord.js");
const parseArgse = require("./parse-args");
const {Vector2} = require("./vectors");
MineSweeper = require("./minesweeper");
settings = require("./settings");
bot = new Discord.Client();

bot.login(settings.token);
let command = "/mine";
let characters = {space: "**", flag: "|>", bomb: "XX"};

function formatSpot(spot) {
	let character = "";
	if (spot.flag) {
		character = characters.flag;
	} else if (spot.mined) {
		if (spot.bomb) {
			character = characters.bomb;
		}
		else {
			character = spot.count ? '0'.repeat(spot.count.toString(16).length) + spot.count.toString(16) : "  ";
		}
	} else {
		character = characters.space;
	}
	return character;
}

function format(game) {
	let blankLine = "\n  " + "+--".repeat(game.width) + "+\n";
	let output = "  ";
	for (let x = 0; x < game.width; x++) {
		let num = x.toString(16).toUpperCase();
		output += " " + '0'.repeat(2 - num.length) + num;
	}
	output += blankLine;
	for (let y = 0; y < game.height; y++) {
		let num = y.toString(16).toUpperCase();
		output += '0'.repeat(2 - num.length) + num + '|';
		for (let x = 0; x < game.width; x++) {
			output += formatSpot(game.map[x][y]) + '|';
		}
		output += blankLine;
	}
	return output;
}

//let game, gameMessage;
game = undefined;
gameMessage = undefined;

bot.on("message", function(message) {
	if (message.content.startsWith(command)) {
		game = new MineSweeper(parseArgse(message.content.slice(command.length)));
		message.delete();
		message.channel.sendMessage("```" + format(game) + "```").then(message => {gameMessage = message});
	}
	if (gameMessage != undefined) {
		let data = (message.content.match(/\s*([fF])*\s*`\s*([0-9]+)\s*,\s*([0-9]+)\s*`\s*/));
		if (data != null) {
			if (data[1] == undefined) {
				game.play(new Vector2(parseInt(data[2]), parseInt(data[3])));
			} else if (data[1].toLowerCase() == 'f') {
				game.flag(new Vector2(parseInt(data[2]), parseInt(data[3])));
			}
			gameMessage.edit("```" + format(game) + "```");
			message.delete();
		}
	}
})
