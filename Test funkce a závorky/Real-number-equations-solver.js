test = true
solver = {
	/* cloneex: function (ex) {
		let retex = new solver.expression()
		for (let i in ex.terms) {
			retex.terms[i]=cloneterm
		}
	},
	cloneterm: function (ex) {
		let retex = new solver.expression()
		retex.terms = { ...ex.terms }
	}, */
	primes:[2,3,5,7,11,13,17,19,23,29,31,37],
	new: function (ex) {//Mark:New expression
		switch (typeof ex) {
			case typeof {}:
				if (ex.type == "expression") {
					return ex
				} else {
					console.error("wrong input")
					break
				}
			case typeof 2:
				ex = ex.toString()
			case typeof "a":
				let endobject = new solver.expression
				ex = ex.replace(/[ ]/g, "").replace(/[,]/g, ".").replace(/[:]/g, "/")
				let split = []
				let tosplit = ""
				let bracket = 0
				for (let i of ex) {
					if ("-+".includes(i) && bracket == 0) {
						if (tosplit != "") split[split.length] = tosplit
						tosplit = i
					} else {
						tosplit += i
					}
					if (i == "(") { bracket++ }
					if (i == ")") { bracket-- }
				}
				split[split.length] = tosplit

				for (let y of split) {
					let msplit = []
					let tosplit = ""
					let bracket = 0
					for (let i of y) {
						if ("*/".includes(i) && bracket == 0) {
							if (tosplit != "") msplit[msplit.length] = tosplit
							tosplit = i
						} else {
							tosplit += i
						}
						if (i == "(") { bracket++ }
						if (i == ")") { bracket-- }
					}
					if (tosplit != "") msplit[msplit.length] = tosplit
					if (msplit.length > 1) {
						let ex = solver.new(1)
						for (let i of msplit) {
							//if (i.match(/[-]/y)) console.error("wrong answer - before () \n" + tosplit.join(""))
							i = i.replace(/[+]/y, "").replace(/[-]/y, "")
							if (i[0] == "/") {
								ex = ex.divide(solver.new(i.replace("/", "")))
							} else {
								if (i[0] == "*") {
									i = i.replace("*", "")
								}
								ex = ex.multiply(solver.new(i))
							}
						}
						endobject.add(ex, true)
					} else {
						endobject.addtoex(y)
					}
				}
				return endobject
		}
	},
	objlength: function (obj) {
		let ret = 0
		for (let i in obj) {
			ret++
		}
		return ret
	}
	,
	expression: class {//Mark:expression
		constructor() {
			this.type = "expression"
			this.terms = {}
		}
		evaluate() {
			this.terms = Object.keys(this.terms).sort().reduce(
				(obj, key) => {
					obj[key] = this.terms[key];
					return obj;
				},
				{}
			);
			let termsleng = solver.objlength(this.terms)
			if (termsleng < 3) {
				if (termsleng < 1) console.error("Wierd flex but okay")
				//if (termsleng == 1 && this.terms[""] && this.terms[""].numerator[0] != 0) console.error("appointed function not equal to zero?")
				//if (termsleng == 1) console.error("//ToDo:Do it xd?")
				let calc = 0
				let variable = ""
				let variablestringif = ""
				if (termsleng == 2) {
					for (let i in this.terms) {
						if (i != "") { calc += solver.objlength(this.terms[i].variables); variable = this.terms[i].variables; variablestringif = i }
					}
					if (calc == 1) {
						for (let i in variable) variable = i
						let temp = new solver.term(this.terms[variablestringif].numerator[0], this.terms[variablestringif].denominator[0], {})
						this.terms[""] = this.terms[""].divide(temp)
						this.terms[variablestringif] = this.terms[variablestringif].divide(temp)
						this.terms[""] = this.terms[""].multiply(new solver.term(-1, 1, {}))
						return [variable, this.terms[""].power(1 / this.terms[variablestringif].variables[variable])]
					}
				}
			}
		}
		appoint(x) {
			for (let i in this.terms) {
				let temp = this.terms[i].appoint(x)
				if (temp) {
					delete this.terms[i]
					this.add(temp, true)
				}
			}
		}
		add(ex, dontcreate) {
			let retex
			if (typeof dontcreate == "undefined") dontcreate = false
			if (dontcreate) {
				retex = this
			} else {
				retex = { ...this }
			}
			if (ex.type == "expression") {
				for (let i in ex.terms) {
					if (retex.terms[i]) {
						retex.terms[i] = retex.terms[i].add(ex.terms[i])
					} else {
						retex.terms[i] = ex.terms[i]
					}
				}
			} else if (ex.type == "term") {
				if (retex.terms[ex.stringvariables]) {
					retex.terms[ex.stringvariables] = retex.terms[ex.stringvariables].add(ex)//Todo: Oprava možná už jsem to nějak změnil xd
				} else {
					retex.terms[ex.stringvariables] = ex
				}
			}
			return retex
		}
		multiply(ex) {
			let endex = new solver.expression
			for (let i in this.terms) {
				for (let y in ex.terms) {
					endex.addtoex(this.terms[i].multiply(ex.terms[y]))
				}
			}
			return endex
		}
		divide(ex) {
			let endex = new solver.expression
			for (let i in this.terms) {
				for (let y in ex.terms) {
					endex.addtoex(this.terms[i].divide(ex.terms[y]))
				}
			}
			return endex
		}
		addtoex(ex, rotate, minus) {
			switch (typeof ex) {
				case "object":
					if (ex.type == "expression" || ex.type == "term") {
						this.add(ex, true)
					} else {
						console.error("Wrong input:")
					}
					break
				case "string":
					let den
					if (typeof rotate == "undefined") {
						rotate = false
					}
					if (typeof minus == "undefined") {
						minus = false
					}
					if (ex[0] == "*") ex = ex.replace("*", "")
					if (ex[0] == "/") {
						ex = ex.replace("/", "");
						rotate = !rotate
					}
					if (ex[0] == "+") ex = ex.replace("+", "")
					if (ex[0] == "-") {
						ex = ex.replace("-", "")
						minus = !minus
					}
					let num
					if (num = ex.match(/([0-9]+[.][0-9]+)|([0-9]+)/y)) { num = num[0] } else { num = "1" }
					let temp = ex.replace(num, "")
					let variables = {}
					for (let i of temp) {
						if (variables[i]) {
							variables[i]++
						} else {
							variables[i] = 1
						}
					}
					if (num.includes(".")) {
						let i
						for (i = 1; i < num.length; i++) {
							if (num[num.length - i] == ".") break
						}
						i = i - 1
						den = Math.pow(10, i)
					} else {
						den = 1
					}
					num = parseFloat(num) * den * (minus ? -1 : 1)
					if (rotate) {
						let temp = num
						num = den
						den = temp
					}
					let term = new solver.term(num, den, variables)
					if (this.terms[term.stringvariables]) {
						this.terms[term.stringvariables] = this.terms[term.stringvariables].add(term)
					} else {
						this.terms[term.stringvariables] = term
					}
					if (this.terms[term.stringvariables].numerator[0] == 0) {
						delete this.terms[term.stringvariables]
					} else if (this.terms[term.stringvariables].denominator[0] == 0) {
						console.error("0 in denominator")
					}
					break
			}

		}
		print() {
			let ret = ""
			for (let i in this.terms) {
				ret += this.terms[i].print()
			}
			return ret
		}
	},
	term: class {//Mark:New term
		constructor(num, den, variables) {
			this.type = "term"
			this.numerator = [num]
			this.denominator = [den]
			this.variables = { ...variables }
			this.stringvariables = this.stringify()
			this.simplify()
		}
		power(x) {
			let retvars = {}
			for (let i in this.variables) {
				retvars[i] = this.variables[i] * x
			}
			if (x < 0) {
				x = Math.abs(x)
				return new solver.term(Math.pow(this.denominator[0], x), Math.pow(this.numerator[0], x), retvars)
			} else {
				return new solver.term(Math.pow(this.numerator[0], x), Math.pow(this.denominator[0], x), retvars)
			}
		}
		appoint(x) {
			let retterm = new solver.term(this.numerator[0], this.denominator[0], this.variables)
			let change = false
			/* let retvariables = {} */
			for (let i in this.variables) {
				if (x[i]) {
					change = true
					let temp = {}
					temp[i] = this.variables[i] * -1
					if (this.variables[i] < 0) {
						retterm = retterm.multiply(new solver.term(1, Math.pow(x[i], this.variables[i] * -1), temp))
					} else {
						retterm = retterm.multiply(new solver.term(Math.pow(x[i], this.variables[i]), 1, temp))
					}
				}/*  else {
					retvariables[i] = this.variables[i]
				} */
			}
			/* retterm.multiply(new solver.term(1, 1, retvariables)) */
			if (change) {
				return retterm
			} else {
				return false
			}
		}
		stringify() {
			let string = ""
			let first = true
			this.variables = Object.keys(this.variables).sort().reduce(
				(obj, key) => {
					obj[key] = this.variables[key];
					return obj;
				},
				{}
			);
			for (let i in this.variables) {
				string += (first ? "" : ";") + i + "^(" + this.variables[i] + ")"
				first = false
			}
			return string
		}
		add(term) {
			let num = term.numerator[0] * this.denominator[0] + this.numerator[0] * term.denominator[0]
			let den = this.denominator[0] * term.denominator[0]
			let variables = this.variables
			return new solver.term(num, den, variables)
		}
		sub(term) {
			let num = this.numerator[0] * term.denominator[0] - term.numerator[0] * this.denominator[0]
			let den = this.denominator[0] * term.denominator[0]
			let variables = this.variables
			return new solver.term(num, den, variables)
		}
		multiply(term) {
			let num = this.numerator[0] * term.numerator[0]
			let den = this.denominator[0] * term.denominator[0]
			let variables = this.variables
			for (let i in term.variables) {
				if (variables[i]) {
					variables[i] += term.variables[i]
					if (variables[i] == 0) delete variables[i]
				} else {
					variables[i] = term.variables[i]
				}
			}
			return new solver.term(num, den, variables)
		}
		divide(term) {
			let num = this.numerator[0] * term.denominator[0]
			let den = this.denominator[0] * term.numerator[0]
			let variables = this.variables
			for (let i in term.variables) {
				if (variables[i]) {
					variables[i] -= term.variables[i]
					if (variables[i] == 0) delete variables[i]
				} else {
					variables[i] = term.variables[i] * -1
				}
			}
			return new solver.term(num, den, variables)
		}
		simplify() {
			if (this.numerator[0] < 0 && this.denominator[0] < 0) {
				this.numerator[0] = this.numerator[0] * -1
				this.denominator[0] = this.denominator[0] * -1
			}
			if (test)xd:for (let i of solver.primes) {
				while (Math.abs(this.numerator[0]) % i === 0 & this.denominator[0] % i === 0 & this.denominator[0] !== 0) {
					this.numerator[0] = this.numerator[0] / i;
					this.denominator[0] = this.denominator[0] / i;
					if (i <= Math.min([Math.abs(this.numerator[0]), Math.abs(this.denominator[0])]) / 2) break xd;
				}
			}
		}
		print() {
			let ret = ""
			for (let i in this.variables) {
				ret += i
				if (this.variables[i] != 1) {
					ret += "^(" + this.variables[i] + ")"
				}
			}
			return ((this.numerator / this.denominator < 0) ? "-" : "+") + " " + Math.abs(this.numerator / this.denominator) + ret + " "
		}
		evaluate(s) {
			if (typeof s !== "object") {
				console.error("wrong input")
			} else {
				let change = true
				console.log("xd")//ToDo:evaluate
			}
		}
	},
	copy: function (a) {
		if (typeof a == "object") {
			switch (a.type) {
				case "term":
					return new solver.term(a.numerator[0], a.denominator[0], a.variables)
				case "expression":
					let ret = new solver.expression
					for (i in a.terms) {
						ret.terms[i] = solver.copy(a.terms[i])
					}
					for (i in a.brackets) {
						ret.brackets[i] = solver.copy(a.brackets[i])
					}
					return ret
				default:
					ret={}
					for (i in a) {
						ret[i]=solver.copy(a[i])
					}
			}
		} else {
			return a
		}
	},
	f: {//Mark:functions
		same: function (x, y) {//Mark: == for object but stil works with everithing
			if (typeof x !== typeof y) return false
			if (typeof x === "object") {
				if (x.length !== y.length) return false
				for (let i in x) {
					if (!y[i]) return false
					if (!this.same(x[i], y[i])) return false
				}
				return true
			} else { return x === y }
		}
	}
}
//Mark:test ^
/* if (test) {
	x = solver.new("-125.25+225.75-351yyxx+125.25yxxy+225.75xyyx+(x+12x*xy-x)/(6x-18x)")
	console.log(x)
	console.log(x.print())
	setTimeout(function () {
	}, 3600000);
}
if (test) {
	x = solver.new("1*(12+24x)*(2y-3)")
	console.log(x)
	console.log(x.print())
	setTimeout(function () {
	}, 3600000);
}
if (test) {
	x = solver.new("1/(6*(2+2*2x))/(2y-3)")
	console.log(x)
	console.log(x.print())
	setTimeout(function () {
	}, 3600000);
} */
if (test) {
	console.log("\n\n\n0=20/rr-gg-5      g: 2")
	x = solver.new("20/rr-gg-5")
	console.log(x)
	console.log(x.print())
	x.appoint({ g: 2 })
	console.log(x)
	console.log(x.print())
	y = x.evaluate()
	console.log(y)
	console.log(y[0] + "=" + y[1].numerator[0] / y[1].denominator[0])
	setTimeout(function () {
	}, 3600000);
}
if (test) {
	console.log("\n\n\n0=aa-bb-cc    a: 5000, b:4000")
	x = solver.new("aa-bb-cc")
	console.log(x)
	console.log(x.print())
	x.appoint({ a: 5000, b: 4000 })
	console.log(x)
	console.log(x.print())
	y = x.evaluate()
	console.log(y)
	console.log(y[0] + "=" + y[1].numerator[0] / y[1].denominator[0])
	setTimeout(function () {
	}, 3600000);
}
x = solver.new("0.15915494/f/c-C")
if (test) {
	console.log("\n\n\n0=0.15915494/f/c-C        f: 250, c: 70")
	x = solver.new("0.15915494/f/c-C")
	console.log(x)
	console.log(x.print())
	x.appoint({ f: 250, c: 70 })
	console.log(x)
	console.log(x.print())
	y = x.evaluate()
	console.log(y)
	console.log(y[0] + "=" + y[1].numerator[0] / y[1].denominator[0])
	setTimeout(function () {
	}, 3600000);
}
console.log(solver.copy(solver.copy(solver.copy(solver.copy(solver.copy(x))))))