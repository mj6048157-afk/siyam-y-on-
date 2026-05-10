const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help2",
    version: "4.0.0",
    author: "UDAY HASAN SIYAM",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Show all commands"
    },
    longDescription: {
      en: "Display command list and usage"
    },
    category: "info",
    guide: {
      en: "{pn}help2 / {pn}help2 <command>"
    }
  },

  onStart: async function ({ message, args, event, role }) {

    const prefix = global.GoatBot.config.prefix;
    const groupName = event.threadName || "UNKNOWN GROUP";

    // 🖼️ IMAGE ROTATION SYSTEM
    const mediaLinks = [
      "https://files.catbox.moe/41hfau.jpg",
      "https://files.catbox.moe/81i9c7.jpg",
      "https://files.catbox.moe/3hhite.jpg"
    ];

    const countFile = path.join(__dirname, "help2_image_count.json");

    function getNextImage() {
      let index = 0;

      try {
        if (fs.existsSync(countFile)) {
          const data = JSON.parse(fs.readFileSync(countFile, "utf8"));
          index = data.index || 0;
        }
      } catch (e) {
        console.log("Image count read error:", e.message);
      }

      const selectedImage = mediaLinks[index];

      const nextIndex = (index + 1) % mediaLinks.length;

      try {
        fs.writeFileSync(
          countFile,
          JSON.stringify({ index: nextIndex })
        );
      } catch (e) {
        console.log("Image count write error:", e.message);
      }

      return selectedImage;
    }

    const { commands, aliases } = global.GoatBot;

    // 🔥 MAIN MENU
    if (!args[0]) {

      let msg = `
╔════════════════════╗
        🌸 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 🌸
╚════════════════════╝

👑 𝗚𝗥𝗢𝗨𝗣 : ${groupName}
⚡ 𝗣𝗥𝗘𝗙𝗜𝗫 : ${prefix}
📖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 : ${prefix}help2

━━━━━━━━━━━━━━━━━━━
`;

      const categories = {};

      for (const [name, cmd] of commands) {
        if (!cmd.config || cmd.config.role > role) continue;

        const category = (cmd.config.category || "OTHER").toUpperCase();

        if (!categories[category]) {
          categories[category] = [];
        }

        categories[category].push(name);
      }

      for (const cat of Object.keys(categories).sort()) {

        msg += `
╭───────────────╮
│ ✨ ${cat}
╰───────────────╯
`;

        for (const name of categories[cat].sort()) {
          msg += `➤ ${name}\n`;
        }

        msg += `━━━━━━━━━━━━━━━━━━━\n`;
      }

      const total = Object.values(categories)
        .reduce((a, b) => a + b.length, 0);

      msg += `
╔════════════════════╗
📊 TOTAL COMMAND : ${total}
📘 USE : ${prefix}help2 <command>
🌐 FB : MR.FARHAN.420
👑 OWNER : UDAY HASAN SIYAM
╚════════════════════╝
`;

      try {

        // 🖼️ AUTO IMAGE CHANGE
        const randomLink = getNextImage();

        const stream = await axios.get(randomLink, {
          responseType: "stream"
        }).then(res => res.data);

        return message.reply({
          body: msg,
          attachment: stream
        });

      } catch (e) {
        return message.reply(msg);
      }
    }

    // 🔍 COMMAND INFO
    const cmdName = args[0].toLowerCase();

    const cmd =
      commands.get(cmdName) ||
      commands.get(aliases.get(cmdName));

    if (!cmd) {
      return message.reply(`❌ Command "${cmdName}" not found`);
    }

    const cfg = cmd.config;

    const roleText =
      cfg.role == 0 ? "All Users" :
      cfg.role == 1 ? "Group Admin" :
      cfg.role == 2 ? "Bot Admin" :
      "Unknown";

    const usage = (cfg.guide?.en || "No guide")
      .replace(/{pn}/g, prefix)
      .replace(/{n}/g, cfg.name);

    const info = `
╔════════════════════╗
       ⚡ COMMAND INFO ⚡
╚════════════════════╝

👑 NAME : ${cfg.name}

📂 CATEGORY : ${cfg.category}

📝 DESCRIPTION :
${cfg.longDescription?.en || "No description"}

📖 GUIDE :
${usage}

🔐 PERMISSION :
${roleText}

🔄 VERSION :
${cfg.version}

👑 AUTHOR :
${cfg.author}

━━━━━━━━━━━━━━━━━━━
🌸 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 🌸
━━━━━━━━━━━━━━━━━━━
`;

    try {

      // 🖼️ COMMAND INFO IMAGE ROTATION
      const randomLink = getNextImage();

      const stream = await axios.get(randomLink, {
        responseType: "stream"
      }).then(res => res.data);

      return message.reply({
        body: info,
        attachment: stream
      });

    } catch (e) {
      return message.reply(info);
    }
  }
};
