require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy');
const {hydrate} = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());


bot.api.setMyCommands([
	{
		command: 'start', description: "Запуск бота",
	},
	{
		command: 'mood',
		description: "Оценить настроение",
	},
	{
		command: 'share',
		description: "Поделится данными",
	},
	{
		command: 'inline_keyboard',
		description: "Инлайн клавиатура",
	},
	{
		command: 'menu',
		description: "Получить меню",
	},
]);

// Ключевые слова для стара Бота
bot.command('start', async (ctx) => {
	await ctx.react('❤‍🔥');
	await ctx.reply('Привет, я Моанна, Добро Пожаловать! Моя Волшебная Группа в Телеграм: <a href="https://t.me/moanna_be_life_official">Ссылка</a>', {
		reply_parameters: {message_id: ctx.msg.message_id},
		parse_mode: 'HTML',
		// disable_web_page_preview: true
	});
});

// Создаем клавиатуры
const menuKeyboard = new InlineKeyboard().text('Узнать про Курс', "course-info").text('Написать мне', "support");
const backKeyboard = new InlineKeyboard().text('< Назад в меню', "back");


bot.command('menu', async (ctx) => {
	await ctx.reply('Выберите пункт меню', {
		reply_markup: menuKeyboard
	});
});

bot.callbackQuery('course-info', async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.callbackQuery.message.editText('Актуальные Курсы', {
		reply_markup: backKeyboard,
	});
});	

bot.callbackQuery('support', async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
		reply_markup: backKeyboard,
	});
});
bot.callbackQuery('back', async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.callbackQuery.message.editText('Выберите пункт меню', {
		reply_markup: menuKeyboard,
	});
});





bot.command('mood', async (ctx) => {
	// Способы работы с Клавиатурой.
	// const moodKeyboard = new Keyboard().text('Good').row().text("Normal").row().text("Bad").resized();
	const moodLabels = ["Good", "Normal", "Bad"];
	const rows = moodLabels.map((label) => {
		return [Keyboard.text(label)];
	});
	const moodKeyboard2 = Keyboard.from(rows).resized();

	await ctx.reply('Как настроение?', {
		reply_markup: moodKeyboard2,
	});
});



bot.command('share', async (ctx) => {
	const shareKeyboard = new Keyboard().requestLocation('Geolocation').row().requestContact('Contacts').row().requestPoll('Ask').placeholder('Укажи данные').resized();

	await ctx.reply('Чем хочешь поделиться?', {
		reply_markup: shareKeyboard
	});
});


bot.command('inline_keyboard', async (ctx) => {
	// const inlineKeyboard = new InlineKeyboard().text('1', 'card-1').text('2', 'card-2').text('3', 'card-3');

	const inlineKeyboard = new InlineKeyboard().url('Перейти в Телеграм канал', 'https://t.me/moanna_be_life_official')

	await ctx.reply('Нажмите кнопку', {
		reply_markup: inlineKeyboard
	});
})


// Command Inline Keyboard card-[1-3] Карты от 1 до 30
// bot.callbackQuery(/card-[1-3]/, async (ctx) => {
	// await ctx.answerCallbackQuery();
	// await ctx.reply(`Вы выбрали карту: ${ctx.callbackQuery.data}`);
// });

bot.on('callback_query:data', async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.reply(`Вы выбрали карту: ${ctx.callbackQuery.data}`);
});


// Command Share
bot.on(':contact', async (ctx) => {
	await ctx.reply('Спасибо за контакт');
});

// Command moods
bot.hears('Good', async (ctx) => {
	await ctx.react('👍');
	await ctx.reply('Мммм превосходное настроение!', {
		reply_markup: {remove_keyboard: true}
	});
});

// В массиве мы можем указать разные варианты Приветсвия и Старта Бота
// bot.command(['start', 'hello_moanna', 'hello'], async (ctx) => {
// 	await ctx.reply('Привет, я Моанна, Добро Пожаловать!');
// })


// Возможные ответы на сообщения от пользователей 'message:text' ['message:photo/video' = :mdeia] 'message:voice' это что посылает нам Клиент
// Ответ только на определенное сообщение.
// bot.hears(['Пинг', 'Magic'], async (ctx) => {
// 	await ctx.reply('I know this text');
// });

//Узнать ID клиента.
// bot.hears('ID', async (ctx) => {
// 	await ctx.reply(ctx.from.id);
// });

bot.on('message', async (ctx) => {
	await ctx.reply('Волшебство думает...');

	// Context = ctx Это обьект с данными
	console.log(ctx.message);
	// console.log(ctx.from);
	// console.log(ctx.from.id);
});




// Ответы только по Фильтрам
// bot.on('message').filter((ctx) => {
// 	return ctx.from.id === 480053772
// }, async (ctx) => {
// 	await ctx.reply("Я тебя узнал :)");
// });

// Должны сопадать все условия для ответа Бота, должна быть Фото и Хэштег
// bot.on(':photo').on('::hashtag', (ctx) => {

// })




// Либо фото или видео или URL, одно из предложенных
// bot.on([':media', '::url'], async (ctx) => {
// 	await ctx.reply('Получил Ваши данные!');
// });
// bot.on(':voice', async (ctx) => {
// 	await ctx.reply("Я получил Ваш вопрос, и скоро вернусь к Вам с ответом.");
// })
// bot.on('::email', async (ctx) => {
// 	await ctx.reply("Я получил Ваш вопрос, и скоро вернусь к Вам с ответом.");
// })


// Обработка Ошибок
bot.catch((err) => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}:`);
	const e = err.error;

	if(e instanceof GrammyError) {
		console.error("Error in request:", e.description);
	} else if(e instanceof HttpError) {
		console.error("Could not contact Telegram:", e);
	} else {
		console.error("Uknown error:", e);
	}
});

bot.start();