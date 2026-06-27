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
    name: "trash",
    aliases: [],
    version: "1.7",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", // এই নাম কাটলে, বট বন্ধ হয়ে যাবে 
    role: 0,
    category: "fun",
    cooldown: 10,
    guide: "rip [mention-reply-UID]",
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply, mentions } = event;
    let id2; 
    
    if (messageReply) { 
      id2 = messageReply.senderID; 
    } else if (Object.keys(mentions).length > 0) {
      id2 = Object.keys(mentions)[0];  
    } else if (args[0]) {  
      id2 = args[0]; 
    } else {
      return api.sendMessage(`⚠️ 𝗠𝗜𝗦𝗦𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧\n───────────────\n» 📝 𝗠𝗲𝗻𝘁𝗶𝗼𝗻, 𝗿𝗲𝗽𝗹𝘆, 𝗼𝗿 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗨𝗜𝗗 𝗼𝗳 𝘁𝗵𝗲 𝘁𝗮𝗿𝗴𝗲𝘁.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID );
    }

    try {
      const url = `${await baseApiUrl()}/api/dig?type=trash&user=${id2}`;
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `trash_${id2}.png`);
      fs.writeFileSync(filePath, response.data);

      api.sendMessage({ 
        attachment: fs.createReadStream(filePath),
        body: `🗑️ 𝗧𝗥𝗔𝗦𝗛 𝗘𝗙𝗙𝗘𝗖𝗧\n───────────────\n» 🪬 সিয়াম বস এই দেখো 🤖 🖕 কত বড় আবাল 😎\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
      }, threadID, () => fs.unlinkSync(filePath), messageID );
      
    } catch (err) {
      console.error(err);
      api.sendMessage(`❌ 𝗘𝗥𝗥𝗢Ｒ\n───────────────\n» 🥹 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁 𝘀𝗶𝘆𝗮𝗺.\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, threadID, messageID);
    }
  },
};
