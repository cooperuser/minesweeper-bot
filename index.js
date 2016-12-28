const Discord = require("discord.js");
settings = require("./settings");
bot = new Discord.Client();

bot.login(settings.token);

bot.on("message", function(message) {
	
})
