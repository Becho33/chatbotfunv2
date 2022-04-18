"use strict";
import { NlpManager } from "node-nlp";
import TeleBot from "telebot";
import dotenv from "dotenv";
dotenv.config();

const manager = new NlpManager({ languages: ["en"], forceNER: true });
const bot = new TeleBot(process.env.BOT_TOKEN);

// Load the model. Then connect to the Telegram bot
(async () => {
  manager.addCorpus("corpus.json");
  await manager.train();
  manager.save();

  bot.on("text", async function (msg) {
    let response;
    let chatid = msg.chat.id;

    if (msg.text === "/start") {
      await msg.reply.text("Hello! My name's Booker. How can I help you?");
    } else {
      response = await manager.process("en", msg.text);

      await msg.reply.text(response.answer);
    }
  });

  bot.start();
})();
