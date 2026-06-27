const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "tokai",
    aliases: ["tukai"],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", // এই নাম কাটলে, বট বন্ধ হয়ে যাবে 
    role: 0,
    category: "fun",
    cooldown: 10,
    guide: "[mention/reply/UID]",
  },

  onStart: async function({ api, event, args }) {
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
          body: `🗑️ 𝗧𝗢𝗞𝗔𝗜 𝗘𝗙𝗙𝗘𝗖𝗧\n───────────────\n» 😎🤨 এই টোকাই তুই টোকাই গিরি আর কয়দিন করবি?\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍` 
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (err) {
      api.sendMessage(
        `❌ 𝗘𝗥𝗥𝗢Ｒ\n───────────────\n» 🥹 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁 𝘀𝗶𝘆𝗮𝗺.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, 
        threadID, 
        messageID
      );
    }
  }
};
