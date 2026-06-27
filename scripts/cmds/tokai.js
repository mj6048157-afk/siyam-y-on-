const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports = {
  config: {
    name: "tokai",
    aliases: ["tukai"],
    version: "1.7",
    author: "MahMUD",
    role: 0,
    category: "fun",
    cooldown: 10,
    guide: "[mention/reply/UID]",
  },

  onStart: async function({ api, event, args }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage(
        `❌ 𝗨𝗡𝗔𝗨𝗧𝗛𝗢𝗥𝗜𝗭𝗘𝗗\n───────────────\n» ⚠️ 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗻𝗼𝘁 𝗮𝘂𝘁𝗵𝗼𝗿𝗶𝘇𝗲𝗱 𝘁𝗼 𝗰𝗵𝗮𝗻𝗴𝗲 𝘁𝗵𝗲 𝗮𝘂𝘁𝗵𝗼𝗿 𝗻𝗮𝗺𝗲.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
        event.threadID, 
        event.messageID
      );
    }

    const { senderID, mentions, threadID, messageID, messageReply } = event;
    let id;
    if (Object.keys(mentions).length > 0) {
      id = Object.keys(mentions)[0];
    } else if (messageReply) {
      id = messageReply.senderID;
    } else if (args[0]) {
      id = args[0]; 
    } else {
      return api.sendMessage(
        `⚠️ 𝗠𝗜𝗦𝗦𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧\n───────────────\n» 📝 𝗠𝗲𝗻𝘁𝗶𝗼𝗻, 𝗿𝗲𝗽𝗹𝘆, 𝗼𝗿 𝗴𝗶𝘃𝗲 𝗨𝗜𝗗 𝘁𝗼 𝗺𝗮𝗸𝗲 𝘁𝗼𝗸𝗮𝗶 𝘀𝗼𝗺𝗲𝗼𝗻𝗲.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        threadID,
        messageID
      );
    }

    try {
      const apiUrl = await baseApiUrl();
      const url = `${apiUrl}/api/tokai?user=${id}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `tokai_${id}.png`);
      fs.writeFileSync(filePath, response.data);
      
      api.sendMessage(
        { 
          attachment: fs.createReadStream(filePath), 
          body: `🗑️ 𝗧𝗢𝗞𝗔𝗜 𝗘𝗙𝗙𝗘𝗖𝗧\n───────────────\n» 😎🤨 এই টোকাই তুই টোকাই গিরি আর কয়দিন করবি?\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍` 
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (err) {
      api.sendMessage(
        `❌ 𝗘𝗥𝗥𝗢𝗥\n───────────────\n» 🥹 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁 𝘀𝗶𝘆𝗮𝗺.\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
        threadID, 
        messageID
      );
    }
  }
};
