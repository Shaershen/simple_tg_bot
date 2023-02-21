const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const token = '6102474535:AAG62vXDueJlkO74anhmw8T-9DvyJ0-noEk'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Im wondering number from 0 to 9, you try to guess it'
  )
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Guess', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Starting command' },
    { command: '/info', description: 'Info command' },
    { command: '/game', description: 'Game command' },
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/11.webp'
      )
      return bot.sendMessage(chatId, `Welcome! `)
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is: ${msg.from.first_name} `)
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'I dont understand you sorry')
  })

  bot.on('callback_query', (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Congratulations, you guess right number! ${data}`,
        againOptions
      )
    } else {
      return bot.sendMessage(
        chatId,
        `Unfortunately, you not guess the number! ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
