const {Vector2} = require("./vectors");
const seedRandom = require("seedrandom");

class Space {
	constructor(bomb=false, flag=false, mined=false, count=0) {
		this.bomb = bomb;
		this.flag = flag;
		this.mined = mined;
		this.count = 0;
	}
	setFlag(value=undefined) {
		if (value == undefined) {
			this.flag = !this.flag;
		} else {
			this.flag = value;
		}
	}
}

class MineSweeper {
	constructor(args={}) {
		this.width = args.width || 8;
		this.height = args.height || 8;
		this.bombs = args.bombs || this.width * this.height / 4;
		this.seed = args.seed || Math.floor(Math.random() * 9999) + 1;
		this.checks = args.checks || [new Vector2(-1, -1), new Vector2(0, -1), new Vector2(1, -1), new Vector2(-1, 0), new Vector2(1, 0), new Vector2(-1, 1), new Vector2(0, 1), new Vector2(1, 1)];
		this.map = MineSweeper.EmptyMap(this.width, this.height);
		this.firstMove = true;
	}
	placeBombs(random) {
		for (let bomb = 0; bomb < this.bombs; bomb++) {
			let position = new Vector2(Math.floor(random() * this.width), Math.floor(random() * this.height));
			while (this.map[position.x][position.y].bomb) {
				position = new Vector2(Math.floor(random() * this.width), Math.floor(random() * this.height));
			}
			this.map[position.x][position.y].bomb = true;
		}
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				for (let check of this.checks) {
					let pos = Vector2.Add(new Vector2(x, y), check);
					if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height && this.map[pos.x][pos.y].bomb) {
						this.map[x][y].count++;
					}
				}
			}
		}
	}
	generateMap(position) {
		let random = seedRandom(this.seed);
		this.placeBombs(random);
		while (this.map[position.x][position.y].count || this.map[position.x][position.y].bomb) {
			this.map = MineSweeper.EmptyMap(this.width, this.height);
			this.placeBombs(random);
		}
	}
	play(position, y) {
		if (typeof position != "object") {
			position = new Vector2(position, y);
		}
		if (this.firstMove) {
			this.generateMap(position);
			this.firstMove = false;
		}
		this.map[position.x][position.y].mined = true;
		if (!this.map[position.x][position.y].count && !this.map[position.x][position.y].bomb) {
			this.exposeEmpties(position);
		}
		this.print();
	}
	checkWin() {
		let won = true;
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				won = (this.map[x][y].mined || this.map[x][y].bomb) && won
			}
		}
		return won;
	}
	checkLose() {
		let lose = false;
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				if (this.map[x][y].bomb && this.map[x][y].mined && !lose) {
					lose = true;
				}
			}
		}
		return lose;
	}
	exposeEmpties(position) {
		for (let check of this.checks) {
			let pos = Vector2.Add(position, check);
			if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height && !this.map[pos.x][pos.y].mined) {
				this.map[pos.x][pos.y].mined = true;
				if (!this.map[pos.x][pos.y].count) {
					this.exposeEmpties(pos);
				}
			}
		}
	}
	flag(position, y) {
		if (typeof position != "object") {
			position = new Vector2(position, y);
		}
		this.map[position.x][position.y].setFlag();
		this.print();
	}
	print() {
		let output = "";
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let spot = this.map[x][y];
				if (spot.flag) {
					output += 'F';
				} else if (spot.mined) {
					if (spot.bomb) {
						output += 'B';
					}
					else {
						output += spot.count ? spot.count : ' ';
					}
				} else {
					output += '*';
				}
			}
			output += '\n';
		}
		console.log(output);
	}
	printNoHidden() {
		let output = "";
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let spot = this.map[x][y];
				if (spot.flag) {
					output += 'F';
				} else
				if (spot.bomb) {
					output += 'B';
				}
				else if (spot.mined) {
					output += spot.count ? spot.count : ' ';
				} else {
					output += '*';
				}
			}
			output += '\n';
		}
		console.log(output);
	}
	static EmptyMap(width, height) {
		let map = [];
		for (let x = 0; x < width; x++) {
			map.push([]);
			for (let y = 0; y < height; y++) {
				map[x].push(new Space());
			}
		}
		return map;
	}
}

module.exports = MineSweeper;
