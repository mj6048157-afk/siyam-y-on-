const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "filecmd",
    aliases: ["file"],
    version: "2.0",
    author: "NIJHUM-BOT",
    countDown: 5,
    role: 0,
    shortDescription: "View code of a command",
    longDescription: "View raw source code of commands safely",
    category: "owner",
    guide: "{pn} <commandName>"
  },

  onStart: async function ({ args, message, event }) {

    // 🔐 ONLY YOUR UID CAN USE
    const ownerUID = "61590360434650";

    const isAdmin = event.senderID === ownerUID;

    // ❌ NOT OWNER
    if (!isAdmin) {
      return message.reply(`
  👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
😾 কিরে ফাইল কি 😼তোর বাপে বানাইছে 🙄
😾 সিয়াম 🪯 বসের 🖕চুদা খাবি নাকি 🥵
          👑 𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓 👑
`);
    }

    // 📌 COMMAND NAME
    const cmdName = args[0];

    if (!cmdName) {
      return message.reply(
        "❌ | Please provide command name.\nExample: filecmd help"
      );
    }

    // 📂 COMMAND PATH
    const cmdPath = path.join(__dirname, `${cmdName}.js`);

    // ❌ FILE NOT FOUND
    if (!fs.existsSync(cmdPath)) {
      return message.reply(`❌ | Command "${cmdName}" not found.`);
    }

    try {

      // 📖 READ FILE
      const code = fs.readFileSync(cmdPath, "utf8");

      // ⚠️ LARGE FILE BLOCK
      if (code.length > 19000) {
        return message.reply("⚠️ | File too large to display.");
      }

      // ✅ SEND CODE
      return message.reply({
        body: `📄 | Source code of "${cmdName}.js":\n\n${code}`
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ | Error reading file.");
    }
  }
};
