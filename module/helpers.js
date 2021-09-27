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
