const { bot } = require('./bot');
const { questions } = require('./db');
const {
	showQuestionsMenu,
	answerQuestion,
	checkAnswer,
	showCorrectAnswer,
	showMainMenu,
	showHelpMessage,
	showInfoMessage,
	showSubjectsMenu,
} = require('./events');

function handleTextMessage(msg) {
	if (msg.text === '/start') {
		showMainMenu(msg);
	} else if (msg.text === '/help') {
		showHelpMessage(msg);
	} else if (msg.text === '/info') {
		showInfoMessage(msg);
	} else if (msg.text === '/question') {
		showSubjectsMenu(msg);
	} else {
		console.log('Text message:', msg.text);
		showMainMenu(msg);
	}
}

bot.on('callback_query', function onCallbackQuery(callback) {
	if (callback.data && callback.data.startsWith('subject-')) {
		const subject = callback.data.split('-')[1];
		showQuestionsMenu(callback.message, subject);
	} else if (callback.data && callback.data.startsWith('question-')) {
		const subject = callback.data.split('-')[1];
		const questionNumber = parseInt(callback.data.split('-')[2]);
		answerQuestion(callback.message, subject, questionNumber);
	} else if (callback.data && callback.data.startsWith('questionRandom-')) {
		const subject = callback.data.split('-')[1];
		const questionNumber =
			Math.floor(Math.random() * questions[subject].length) + 1;
		answerQuestion(callback.message, subject, questionNumber);
	} else if (callback.data && callback.data.startsWith('answer-')) {
		const subject = callback.data.split('-')[1];
		const questionNumber = parseInt(callback.data.split('-')[2]);
		const isCorrect = callback.data.split('-')[3] === 'true';
		checkAnswer(callback.message, subject, questionNumber, isCorrect);
	} else if (callback.data && callback.data.startsWith('correctAnswer-')) {
		const subject = callback.data.split('-')[1];
		const questionNumber = parseInt(callback.data.split('-')[2]);
		showCorrectAnswer(callback.message, subject, questionNumber);
	}
});

bot.on('message', handleTextMessage);
bot.startPolling();
