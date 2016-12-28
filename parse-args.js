module.exports = function parseArgs(input, normal={}) {
	let args = {};
	for (let arg of input.split("--")) {
		if (arg != "") {
			let data = arg.trim().split('=');
			args[data[0]] = parseFloat(data[1]) || data[1] == "true" || data[1];
		}
	}
	for (let key in normal) {
		args[key] = args[key] || normal[key];
	}
	return args;
}
