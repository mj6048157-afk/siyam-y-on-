// 😼 Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 😼
// ⚠️ নাম চেঞ্জ করলে ফাইল নষ্ট হয়ে যাবে ভাই 😾

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const _x1 = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const _x2 = "MR_FARHAN";

// 🔒 hidden protect
const __lock = (() => {
  const a = ["𝆠", "፝", "𝐒", "𝐈", "𝐘", "𝐀", "𝐌"];
  return a.join("");
})();

// Cooldown Storage
const userCooldowns = {};

module.exports = {
  config: {
    name: "text_voice",
    version: "3.0.0",
    author: _x2,
    countDown: 1,
    role: 0,
    shortDescription: "Ultra Fast Voice Reply",
    longDescription: "Premium Auto Voice System",
    category: "system"
  },

  // =========================
  // 🔒 HIDDEN LOCK SYSTEM
  // =========================
  _s() {
    if (!_x1.includes(__lock)) {  
      throw new Error("SYSTEM LOCKED");  
    }  
    if (  
      module.exports.config.author !==  
      String.fromCharCode(77, 82, 95, 70, 65, 82, 72, 65, 78)  
    ) {  
      throw new Error("AUTHOR CHANGE DETECTED");  
    }  
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    this._s();  
    if (!event.body) return;  

    // 🛑 BOT SELF-REPLY FILTER (বট নিজের মেসেজে নিজে রেসপন্স করবে না)
    const botID = global.GoatBot?.config?.botID || ""; 
    if (event.senderID === botID) return;

    const input = event.body.toLowerCase().trim();  
    const senderID = event.senderID;
    const bossID = "61590360434650"; // মালিকের ইউআইডি

    // =========================  
    // 🎤 VOICE DATABASE  
    // =========================  
    const voiceMap = {  
      "good night": "https://files.catbox.moe/i29m4q.mp3",  
      "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",  
      "good morning": "https://files.catbox.moe/8gzqx5.mp3",  
      "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3",  
      "siyam": "https://files.catbox.moe/9w6moo.mp3",  
      "সিয়াম ভাই": "https://files.catbox.moe/9w6moo.mp3",  
      "সিয়াম": "https://files.catbox.moe/9w6moo.mp3",  
      "@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ت্যা্ঁহ্ঁ": "https://files.catbox.moe/9w6moo.mp3",  
      "@everyone": "https://files.catbox.moe/5myzdz.mp4",  
      "নিঝুম": "https://files.catbox.moe/5myzdz.mp4",  
      ",sex": "https://files.catbox.moe/uy7mrv.mp3",  
      ",hot": "https://files.catbox.moe/m5djca.mp3",  
      "s+n": "https://files.catbox.moe/w9doti.mp4",  
      "টুকি": "https://files.catbox.moe/e8ebel.mp3",  
      "আমি মাদিহা": "https://files.catbox.moe/9gyjwp.mp3",  
      "নুনু": "https://files.catbox.moe/r5uz42.mp3",  
      "🐍": "https://files.catbox.moe/s1k2nx.mp4",  
      "✡️": "https://files.catbox.moe/5rdtc6.mp3",  
      "মিম তুমারে চুদি": "https://files.catbox.moe/plex4g.mp4",  
      "কপি বট": "https://files.catbox.moe/4vmyke.mp4",  

      "bot": "https://files.catbox.moe/8cxvdg.mp3",
      "জান": "https://files.catbox.moe/b5l6nz.mp3",
      "baby": "https://files.catbox.moe/gzq54t.mp3",
      "bby": "https://files.catbox.moe/uwg21p.mp3",
      "বেবি": "https://files.catbox.moe/x8ina4.mp3"
    };  

    const badWordsMap = {
      "ভুদা": "https://files.catbox.moe/gnyx0p.mp3",  
      "চুদি তর মাকে": "https://files.catbox.moe/8nhe74.mp4",  
      "আসো হাত মারি": "https://files.catbox.moe/8ioph1.mp3",  
      "মাদারচোদ চামচা": "https://tmpfiles.org/dl/wwwq6rpmRD0h/upload_1779657408207.mp3"
    };

    // =========================  
    // 📜 CUSTOM VOICE HELP  
    // =========================  
    if (input === "voicehelp") {  
      const admins = global.GoatBot?.config?.adminBot || [];  
      if (!admins.includes(senderID)) {  
        return message.reply(" | 🤬এ মাদারচোদ বট তোর বাপের।🙄   🥵তোর আম্মুর বোদা ফাক কর🖕 👉এইটা শুধু আমার বস সিয়াম এর জন্য😻!");  
      }  

      const badWordsList = Object.keys(badWordsMap);
      const exactMatchList = [
        "good night", "গুড নাইট", "good morning", "গুড মর্নিং", "siyam", 
        "সিয়াম ভাই", "সিয়াম", "@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ", "@everyone", 
        "নিঝুম", ",sex", ",hot", "s+n", "টুকি", "আমি মাদিহা", "নুনু", 
        "🐍", "✡️", "মিম তুমারে চুদি", "কপি বট"
      ];
      const multiVoiceList = ["bot", "জান", "baby", "bby", "বেবি"];
      
      const totalVoices = badWordsList.length + exactMatchList.length + multiVoiceList.length;

      let serial = 1;
      let msg = `🛡️ ［ 𝗩𝗢𝗜𝗖𝗘 𝗛𝗘𝗟𝗣 🛡️\n\n`;
      msg += `🔋────🛡️────🪫\n\n`;
      
      msg += `┌── 🚫 [ GALI / INCLUDES ]\n`;
      badWordsList.forEach(trigger => {
        msg += `├── ${serial++}. ${trigger}\n`;
      });

      msg += `├── 🎵 [ EXACT MATCH ]\n`;
      exactMatchList.forEach(trigger => {
        msg += `├── ${serial++}. ${trigger}\n`;
      });

      msg += `├── 💖 [ MULTI-VOICE ]\n`;
      multiVoiceList.forEach(trigger => {
        msg += `├── ${serial++}. ${trigger}\n`;
      });
      
      msg += `└──────────────🐲\n`;
      msg += `🤖 𝗕𝗢𝗧: 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧\n`;
      msg += `👑 𝗢𝗪𝗡𝗘𝗥: 𝗦𝗜𝗬𝗔𝗠 𝗛𝗔𝗦𝗔𝗡\n`;
      msg += `📊 𝗧𝗢𝗧𝗔𝗟 𝗩𝗢𝗜𝗖𝗘𝗦: ${totalVoices}\n\n`;
      msg += `📱 Contact: +8801789138157`;

      return message.reply(msg);  
    }  

    // =========================  
    // 🎧 AUTO VOICE SYSTEM  
    // =========================  
    let targetAudioUrl = null;
    let matchedTrigger = null;

    for (const key in badWordsMap) {
      if (input.includes(key)) {
        targetAudioUrl = badWordsMap[key];
        matchedTrigger = key;
        break;
      }
    }

    if (!targetAudioUrl && voiceMap[input]) {
      targetAudioUrl = voiceMap[input];
      matchedTrigger = input;
    }

    if (targetAudioUrl) {
      const currentTime = Date.now();
      const cooldownTime = 3 * 60 * 1000; 

      if (senderID !== bossID) {
        if (!userCooldowns[senderID]) userCooldowns[senderID] = {};

        if (userCooldowns[senderID][matchedTrigger]) {
          const expirationTime = userCooldowns[senderID][matchedTrigger] + cooldownTime;
          if (currentTime < expirationTime) {
            return; 
          }
        }
      }

      const cacheDir = path.join(__dirname, "cache", "voices");  
      fs.ensureDirSync(cacheDir);  

      const ext = targetAudioUrl.endsWith(".mp4") ? ".mp4" : ".mp3";  
      const fileName = Buffer.from(matchedTrigger).toString("hex") + ext;  
      const filePath = path.join(cacheDir, fileName);  

      try {  
        if (senderID !== bossID) {
          userCooldowns[senderID][matchedTrigger] = currentTime;
        }

        if (fs.existsSync(filePath)) {  
          return await message.reply({  
            attachment: fs.createReadStream(filePath)  
          });  
        }  

        const response = await axios.get(targetAudioUrl, {  
          responseType: "arraybuffer"  
        });  

        fs.writeFileSync(filePath, Buffer.from(response.data));

        await message.reply({  
          attachment: fs.createReadStream(filePath)  
        });  

      } catch (e) {  
        console.error("Voice Error:", e);  
      }  
    }  
  }
};
