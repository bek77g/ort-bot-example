const { bot } = require('./bot');
const { questions } = require('./db');

function showMainMenu(msg) {
	const options = {
		reply_markup: JSON.stringify({
			keyboard: [
				[{ text: '/question' }, { text: '/info' }],
				[{ text: '/help' }],
			],
		}),
	};

	bot.sendMessage(msg.chat.id, 'Приветствую! Чем я могу вам помочь?', options);
}

function showHelpMessage(msg) {
	bot.sendMessage(
		msg.chat.id,
		'Список доступных команд:\n\n/start - приветствие\n/help - справка\n/question - выбрать предмет и номер вопроса\n/info - информация о боте'
	);
}

function showInfoMessage(msg) {
	bot.sendMessage(
		msg.chat.id,
		'Информация о боте:\n\nНазвание: Мой чат-бот ОРТ\nВерсия: 1.0\nАвтор: [Ваше имя]'
	);
}

function showSubjectsMenu(msg) {
	const subjects = Object.keys(questions);
	const options = {
		reply_markup: JSON.stringify({
			inline_keyboard: subjects.map(subject => [
				{ text: `${subject}`, callback_data: `subject-${subject}` },
			]),
		}),
	};

	bot.sendMessage(msg.chat.id, 'Выберите предмет:', options);
}

function showQuestionsMenu(msg, subject) {
	if (subject in questions) {
		const questionNumbers = Array.from(
			{ length: questions[subject].length },
			(v, i) => i + 1
		);

		const options = {
			reply_markup: JSON.stringify({
				inline_keyboard: [
					[
						{
							text: 'Случайный вопрос',
							callback_data: `questionRandom-${subject}`,
						},
					],
					...questionNumbers.map(number => [
						{
							text: `Вопрос ${number}`,
							callback_data: `question-${subject}-${number}`,
						},
					]),
				],
			}),
		};

		bot.sendMessage(
			msg.chat.id,
			`Выберите вопрос по предмету ${subject}:`,
			options
		);
	} else {
		bot.sendMessage(msg.chat.id, 'Неизвестный предмет. Попробуйте еще раз.');
	}
}

function answerQuestion(msg, subject, questionNumber) {
	const question = questions[subject].find(
		question => question.number === questionNumber
	);

	const options = {
		parse_mode: 'Markdown',
		reply_markup: JSON.stringify({
			inline_keyboard: [
				...question?.options.map(option => [
					{
						text: option.text,
						callback_data: `answer-${subject}-${questionNumber}-${option.correct}`,
					},
				]),
				[
					{
						text: 'Узнать ответ',
						callback_data: `correctAnswer-${subject}-${questionNumber}`,
					},
				],
			],
		}),
	};

	bot.sendMessage(
		msg.chat.id,
		`**Вопрос ${questionNumber} по предмету ${subject}:**\n\n${question.question}`,
		options
	);
}

function showCorrectAnswer(msg, subject, questionNumber) {
	const question = questions[subject].find(
		question => question.number === questionNumber
	);

	const correctAnswer = question.options.find(option => option.correct).text;

	bot.sendMessage(msg.chat.id, `Правильный ответ: \n\n ${correctAnswer}`, {
		reply_markup: JSON.stringify({
			inline_keyboard: [
				[{ text: 'Следующий вопрос', callback_data: `subject-${subject}` }],
			],
		}),
	});
}

function checkAnswer(msg, subject, questionNumber, isCorrect) {
	const feedback = isCorrect ? '✅ Ответ верный!' : '❌ Ответ неверный.';

	const options = {
		reply_markup: JSON.stringify({
			inline_keyboard: [
				isCorrect
					? []
					: [
							{
								text: 'Проверить ответ',
								callback_data: `correctAnswer-${subject}-${questionNumber}`,
							},
					  ],

				[{ text: 'Следующий вопрос', callback_data: `subject-${subject}` }],
			],
		}),
	};

	bot.sendMessage(msg.chat.id, feedback, options);
}

module.exports = {
	showMainMenu,
	showHelpMessage,
	showInfoMessage,
	showSubjectsMenu,
	showQuestionsMenu,
	answerQuestion,
	showCorrectAnswer,
	checkAnswer,
};
