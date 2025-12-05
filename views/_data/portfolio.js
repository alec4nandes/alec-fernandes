const { articles, shows } = require("../../portfolio-scraper/work.json");

module.exports = function () {
    return { articles, shows };
};
