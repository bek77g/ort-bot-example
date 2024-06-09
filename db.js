const fs = require('fs');
const questions = JSON.parse(fs.readFileSync('questions.json'));

module.exports = { questions };
