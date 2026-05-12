const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

module.exports = {
  config: {
    name: "bot",
    aliases: ["hippi", "baby"],
    version: "2.1.0",
    author: "rX",
    countDown: 0,
    role: 0,
    shortDescription: "Cute AI Baby Chatbot",
    longDescription: "Talk & Chat with Emotion — Auto teach enabled with typing effect.",
    category: "box chat",
    guide: {
      en: "{p}bot [message]\n{p}bot teach [Question] - [Answer]\n{p}bot list"
    }
  },

  // ─────────────── TYPING ───────────────

  sendTyping: async function (api, threadID) {
    try {
      if (typeof api.sendTypingIndicatorV2 === "function") {
        await api.sendTypingIndicatorV2(true, threadID);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await api.sendTypingIndicatorV2(false, threadID);
      }
    } catch (err) {
      console.error("❌ Typing error:", err.message);
    }
  },

  // ─────────────── GET REPLY ───────────────

  getReply: async function (text, senderName) {
    try {
      const res = await axios.get(
        `${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`,
        {
          timeout: 10000
        }
      );

      if (!res.data || !res.data.response)
        return [];

      return Array.isArray(res.data.response)
        ? res.data.response
        : [res.data.response];

    } catch (err) {
      console.error("❌ API error:", err.message);
      return [];
    }
  },

  // ─────────────── AUTO TEACH ───────────────

  autoTeach: async function (text, senderName) {
    try {
      await axios.get(
        `${simsim}/teach?ask=${encodeURIComponent(text)}&ans=${encodeURIComponent("hmm baby 😚 (auto learned)")}&senderName=${encodeURIComponent(senderName)}`
      );
    } catch (err) {
      console.error("❌ Auto teach error:", err.message);
    }
  },

  // ─────────────── SEND REPLIES ───────────────

  sendReplies: async function ({ message, replies, senderID }) {
    for (const reply of replies) {
      if (!reply || typeof reply !== "string") continue;

      await new Promise(resolve => {
        message.reply(reply, (err, info) => {
          if (!err && info?.messageID) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              author: senderID
            });
          }
          resolve();
        });
      });
    }
  },

  // ─────────────── MAIN COMMAND ───────────────

  onStart: async function ({ api, event, args, message, usersData }) {
    try {
      const senderID = event.senderID;
      const senderName = await usersData.getName(senderID);
      const threadID = event.threadID;

      const query = args.join(" ").trim();

      // Empty Message
      if (!query) {
        await this.sendTyping(api, threadID);

        const ran = [
          "Bolo baby 💖",
          "Hea baby 😚"
        ];

        const random = ran[Math.floor(Math.random() * ran.length)];

        return message.reply(random, (err, info) => {
          if (!err && info?.messageID) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              author: senderID
            });
          }
        });
      }

      const lowerQuery = query.toLowerCase();

      // ───────── TEACH ─────────

      if (args[0]?.toLowerCase() === "teach") {
        const teachText = query.slice(6).trim();
        const parts = teachText.split(" - ");

        if (parts.length < 2) {
          return message.reply(
            "Use:\nbot teach [Question] - [Reply]"
          );
        }

        const ask = parts[0].trim();
        const ans = parts.slice(1).join(" - ").trim();

        if (!ask || !ans) {
          return message.reply("Question or answer missing.");
        }

        const res = await axios.get(
          `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`
        );

        return message.reply(
          res.data?.message || "Learned successfully!"
        );
      }

      // ───────── LIST ─────────

      if (args[0]?.toLowerCase() === "list") {
        const res = await axios.get(`${simsim}/list`);

        if (res.data?.code === 200) {
          return message.reply(
            `♾ Total Questions: ${res.data.totalQuestions}\n★ Replies: ${res.data.totalReplies}\n👑 Author: ${res.data.author}`
          );
        }

        return message.reply(
          `Error: ${res.data?.message || "Failed to fetch list"}`
        );
      }

      // ───────── NORMAL CHAT ─────────

      await this.sendTyping(api, threadID);

      const replies = await this.getReply(lowerQuery, senderName);

      // যদি API কিছু না দেয়
      if (!replies.length) {

        console.log(`🧠 Auto teaching: ${lowerQuery}`);

        await this.autoTeach(lowerQuery, senderName);

        const fallbackReplies = [
          "hmm baby 😚",
          "কি বলো বুঝলাম না 🥺",
          "আবার বলো জান 😗",
          "আমি একটু লজ্জা পাইছি 🙈",
          "এইটা আমি এখনো শিখি নাই 😿"
        ];

        const fallback =
          fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

        return message.reply(fallback);
      }

      await this.sendReplies({
        message,
        replies,
        senderID
      });

    } catch (err) {
      console.error("❌ Main command error:", err);

      return message.reply(
        "Bot is busy 😿"
      );
    }
  },

  // ─────────────── HANDLE REPLY ───────────────

  onReply: async function ({ api, event, message, usersData }) {
    try {
      const replyText = event.body?.trim();

      if (!replyText) return;

      const senderName = await usersData.getName(event.senderID);

      await this.sendTyping(api, event.threadID);

      const replies = await this.getReply(
        replyText.toLowerCase(),
        senderName
      );

      // যদি API কিছু না দেয়
      if (!replies.length) {

        console.log(`🧠 Auto teaching reply: ${replyText}`);

        await this.autoTeach(replyText, senderName);

        const fallbackReplies = [
          "hmm baby 😚",
          "আবার বলো না জান 🥺",
          "আমি বুঝি নাই 😿",
          "তুমি অনেক কিউট 😗",
          "এইটা নতুন লাগলো 🙈"
        ];

        const fallback =
          fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

        return message.reply(fallback);
      }

      await this.sendReplies({
        message,
        replies,
        senderID: event.senderID
      });

    } catch (err) {
      console.error("❌ Reply error:", err);

      return message.reply(
        "Reply system busy 😿"
      );
    }
  },

  // ─────────────── AUTO CHAT ───────────────

  onChat: async function ({ api, event, message, usersData }) {
    try {
      const raw = event.body?.trim().toLowerCase();

      if (!raw) return;

      const senderName = await usersData.getName(event.senderID);
      const senderID = event.senderID;
      const threadID = event.threadID;

      // Simple trigger replies
      const simpleTriggers = [
        "বট",
        "bot",
        "হাই",
        "বেবি",
        "baby",
        "hi",
        "oi",
        "oii",
        "ওই"
      ];

      if (simpleTriggers.includes(raw)) {

        await this.sendTyping(api, threadID);

        const replies = [
          "ডাকো কেন 🥺 প্রেম করবা নাকি 😞",
          "বুকাচুদা আর কত বট বট করবি 🐸",
          "ওই জান কাছে আসো 🫦👅",
          "আলাবু বলো সোনা 🤧",
          "সিয়াম কে দেখছো? 🥺 তাকে কোথাও খুজে পাচ্ছি না 😩",
          "তুমার নু**নু*তে উম্মাহ 🥺🤌",
          "হ্যাঁ গো জান বলো 🙂",
          "ডাকিস না, তুই পচা 😼"
        ];

        const random =
          replies[Math.floor(Math.random() * replies.length)];

        return message.reply(random, (err, info) => {
          if (!err && info?.messageID) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              author: senderID
            });
          }
        });
      }

      // Prefix trigger
      const prefixes = [
        "ওই ",
        "bot ",
        "বেবি ",
        "বট ",
        "baby ",
        "নিঝুম "
      ];

      const prefix = prefixes.find(p => raw.startsWith(p));

      if (!prefix) return;

      const query = raw.slice(prefix.length).trim();

      if (!query) return;

      await this.sendTyping(api, threadID);

      const replies = await this.getReply(query, senderName);

      // যদি API fail করে
      if (!replies.length) {

        console.log(`🧠 Auto learned: ${query}`);

        await this.autoTeach(query, senderName);

        return message.reply("hmm baby 😚");
      }

      await this.sendReplies({
        message,
        replies,
        senderID
      });

    } catch (err) {
      console.error("❌ onChat error:", err);
    }
  }
};
