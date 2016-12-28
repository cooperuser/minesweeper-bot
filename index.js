const Discord = require("discord.js");
const parseArgse = require("./parse-args");
MineSweeper = require("./minesweeper");
settings = require("./settings");
bot = new Discord.Client();

bot.login(settings.token);
let command = "/mine";

bot.on("message", function(message) {
	if (message.content.startsWith(command)) {
		let test = new MineSweeper(parseArgse(message.content.slice(command.length)));
		console.log(test);
	}
})
