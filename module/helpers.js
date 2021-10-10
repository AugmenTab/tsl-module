/** @module helpers */

/**
 * Register Handlebars helper to concatenate strings.
 * @param {...string} arguments - The strings to be concatenated.
 * @returns {string} The concatenated string.
 */
Handlebars.registerHelper("concat", function() {
  let str = "";
  for(let arg in arguments){
    if(typeof arguments[arg] != "object"){
      str += arguments[arg];
    }
  }
  return str;
});

/**
 * Register Handlebars helper to perform comparisons.
 * @param {string} operator - A string representation of a comparison operator.
 * @param {...*} var_args - An array of arguments containing a string representation of the comparison operator, the booleans to be compared, and optionally an object containing the HTML block from Handlebars.
 * @returns {boolean} The outcome of the comparison operations.
 */
Handlebars.registerHelper("cond", function(...var_args) {
  if (typeof(var_args.slice(-1)[0]) === "object") var_args.pop();
  const operator = var_args[0];
  return var_args.slice(1)
    .map(x => {if (x) { return true } else { return false }})
    .reduce(_compare);
  
  function _compare(v1, v2) {
    switch (operator) {
      case '==': return (v1 == v2);
      case '===': return (v1 === v2);
      case '!=': return (v1 != v2);
      case '!==': return (v1 !== v2);
      case '<': return (v1 < v2);
      case '<=': return (v1 <= v2);
      case '>': return (v1 > v2);
      case '>=': return (v1 >= v2);
      case '&&': return (v1 && v2);
      case '||': return (v1 || v2);
      default: throw new Error(`The '${operator}' operator is not recognized.`);
    }
  };
});

/**
 * Convert a Sp value to mph, kph, or spr.
 * @param {string} to - The target unit of speed.
 * @param {number} val - The Sp value to be converted.
 */
Handlebars.registerHelper("convert", function(to, val) {
  if (!val) {
    return 0;
  } else {
    let mph = (val * 2) + 40;
    switch(to) {
      case "mph": return mph.toLocaleString();
      case "kph": return Math.floor(mph * 1.6093440).toLocaleString();
      case "spr": return Math.floor((mph * 88) / 30).toLocaleString();
    }
  }
});

/**
 * Determines which classes to use for the fuel gauge indicator light element.
 * @param {object} obj - The Hours of Operation TSL Vehicle Actor data object.
 * @returns {string} The `class` HTML attribute value.
 */
Handlebars.registerHelper("fuelClass", function(obj) {
  return obj.value > (obj.max / 4) ? "dim" : "glow-red";
});

/**
 * Translates a number into a string representation of that number in the local format.
 * @param {number} num - The number to be converted.
 * @returns {string} The string representing the provided number in local format.
 */
Handlebars.registerHelper("localnum", function(num) {
  return typeof(num) === "number" ? num.toLocaleString() : num;
});

/**
 * Repeat a section of code n times.
 * @param {number} n - The number of times to repeat the code block.
 * @param {Block} block - The Handlebars block.
 * @returns {string} A string of the repeated HTML code.
 */
Handlebars.registerHelper("times", function(n, block) {
  let accum = "";
  for (let i = 0; i < n; i++) accum += block.fn(i);
  return accum;
});