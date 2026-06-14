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

// Global Storage to prevent Memory Leaks
if (!global.SiyamVoiceCooldowns) global.SiyamVoiceCooldowns = {};
const cacheDir = path.join(__dirname, "cache", "voices");

// Auto-clean memory leaks & old cache every 1 hour
setInterval(() => {
  try {
    const now = Date.now();
    // 1. Clean Expired Cooldowns from RAM
    for (const userId in global.SiyamVoiceCooldowns) {
      for (const trigger in global.SiyamVoiceCooldowns[userId]) {
        if (now - global.SiyamVoiceCooldowns[userId][trigger] > 3 * 60 * 1000) {
          delete global.SiyamVoiceCooldowns[userId][trigger];
        }
      }
      if (Object.keys(global.SiyamVoiceCooldowns[userId]).length === 0) {
        delete global.SiyamVoiceCooldowns[userId];
      }
    }
    
    // 2. Max Cache Size Protection (50MB Limit)
    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      let totalSize = 0;
      const fileStats = files.map(file => {
        const filePath = path.join(cacheDir, file);
        const stat = fs.statSync(filePath);
        totalSize += stat.size;
        return { path: filePath, mtime: stat.mtimeMs };
      });

      if (totalSize > 50 * 1024 * 1024) { // 50MB
        console.log("[text_voice] Cache storage exceeded 50MB. Cleaning old files...");
        fileStats.sort((a, b) => a.mtime - b.mtime);
        while (totalSize > 30 * 1024 * 1024 && fileStats.length > 0) {
          const oldest = fileStats.shift();
          try {
            const size = fs.statSync(oldest.path).size;
            fs.unlinkSync(oldest.path);
            totalSize -= size;
          } catch(e) {}
        }
      }
    }
  } catch (err) {
    console.error("[text_voice] Background cleanup error:", err.message);
  }
}, 60 * 60 * 1000);

module.exports = {
  config: {
    name: "text_voice",
    version: "3.5.0",
    author: _x2,
    countDown: 1,
    role: 0,
    shortDescription: "Ultra Fast Voice Reply",
    longDescription: "Premium Auto Voice System with advanced memory management",
    category: "system"
  },

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

    // 🛑 1. SELF REPLY PROTECTION (Strict Bot ID Validation)
    const botID = String(global.GoatBot?.config?.botID || (typeof api !== 'undefined' ? api.getCurrentUserID() : "")); 
    const senderID = String(event.senderID);
    if (senderID === botID || senderID === "0") return;

    // Normalize Input (Lowercase & single space trimming)
    const input = event.body.toLowerCase().replace(/\s+/g, " ").trim();  
    const bossID = "61590360434650"; // মালিকের ইউআইডি

    // =========================  
    // 🎤 DATABASES (Categorized)
    // =========================  
    const badWordsMap = {
      "ভুদা": "https://files.catbox.moe/gnyx0p.mp3",  
      "চুদি": "https://files.catbox.moe/0ykb7f.mp3",  
      "আসো হাত মারি": "https://files.catbox.moe/8ioph1.mp3",  
      "মাদারচোদ চামচা": "https://tmpfiles.org/dl/wwwq6rpmRD0h/upload_1779657408207.mp3"
    };

    const exactMatchMap = {  
      "good night": "https://files.catbox.moe/i29m4q.mp3",  
      "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",  
      "good morning": "https://files.catbox.moe/8gzqx5.mp3",  
      "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3",  
      "siyam": "https://files.catbox.moe/9w6moo.mp3",  
      "সিয়াম ভাই": "https://files.catbox.moe/9w6moo.mp3",  
      "সিয়াম": "https://files.catbox.moe/9w6moo.mp3",  
      "@পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ": "https://files.catbox.moe/9w6moo.mp3",  
      "@everyone": "https://files.catbox.moe/khxecx.mp4",  
      "নিঝুম": "https://files.catbox.moe/par79o.mp4",  
      ",sex": "https://files.catbox.moe/uy7mrv.mp3",  
      ",hot": "https://files.catbox.moe/m5djca.mp3",  
      "s+n": "https://files.catbox.moe/841gpc.mp4",  
      "টুকি": "https://files.catbox.moe/e8ebel.mp3",  
      "আমি মাদিহা": "https://files.catbox.moe/9gyjwp.mp3",  
      "নুনু": "https://files.catbox.moe/r5uz42.mp3",  
      "👍": "https://files.catbox.moe/ahux2o.mp4",  
      "✡️": "https://files.catbox.moe/5rdtc6.mp3",  
      "মিম তুমারে চুদি": "https://files.catbox.moe/plex4g.mp4",  
      "কপি বট": "https://files.catbox.moe/4vmyke.mp4"
    };  

    const multiVoiceMap = {
      "bot": "https://files.catbox.moe/8cxvdg.mp3",
      "জান": "https://files.catbox.moe/b5l6nz.mp3",
      "baby": "https://files.catbox.moe/gzq54t.mp3",
      "bby": "https://files.catbox.moe/uwg21p.mp3",
      "বেবি": "https://files.catbox.moe/x8ina4.mp3"
    };  

    // =========================  
    // 📜 8. DYNAMIC VOICEHELP MENU  
    // =========================  
    if (input === "voicehelp") {  
      const admins = (global.GoatBot?.config?.adminBot || []).map(id => String(id));  
      
      // Fix: Ensure Owner UID or Admin list both can access
      if (senderID !== bossID && !admins.includes(senderID)) {  
        return message.reply(" | 🤬এ মাদারচোদ বট তোর বাপের।🙄   🥵তোর আম্মুর বোদা ফাক কর🖕 👉এইটা শুধু আমার বস সিয়াম এর জন্য😻!");  
      }  

      const badWordsList = Object.keys(badWordsMap);
      const exactMatchList = Object.keys(exactMatchMap);
      const multiVoiceList = Object.keys(multiVoiceMap);
      const totalVoices = badWordsList.length + exactMatchList.length + multiVoiceList.length;

      let serial = 1;
      let msg = `🛡️ ［ 𝗩𝗢𝗜𝗖𝗘 𝗛𝗘𝗟𝗣 🛡️\n\n🔋────🛡️────🪫\n\n`;
      
      msg += `┌── 🚫 [ GALI / INCLUDES ]\n`;
      badWordsList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);

      msg += `├── 🎵 [ EXACT MATCH ]\n`;
      exactMatchList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);

      msg += `├── 💖 [ MULTI-VOICE ]\n`;
      multiVoiceList.forEach(trigger => msg += `├── ${serial++}. ${trigger}\n`);
      
      msg += `└──────────────🐲\n`;
      msg += `🤖 𝗕𝗢𝗧: 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧\n`;
      msg += `👑 𝗢𝗪𝗡𝗘𝗥: 𝗦𝗜𝗬𝗔𝗠 𝗛𝗔𝗦𝗔𝗡\n`;
      msg += `📊 𝗧𝗢𝗧𝗔𝗟 𝗩𝗢𝗜𝗖𝗘𝗦: ${totalVoices}\n\n`;
      msg += `📱 Contact: +8801789138157`;

      return message.reply(msg);  
    }  

    // =========================  
    // 🎧 VOICE MATCHING SYSTEM (Optimized Priority)
    // =========================  
    let targetAudioUrl = null;
    let matchedTrigger = null;

    // Priority 1: Partial Match (Includes)
    for (const key in badWordsMap) {
      if (input.includes(key)) {
        targetAudioUrl = badWordsMap[key];
        matchedTrigger = key;
        break;
      }
    }

    // Priority 2: Exact Match
    if (!targetAudioUrl && exactMatchMap[input]) {
      targetAudioUrl = exactMatchMap[input];
      matchedTrigger = input;
    }

    // Priority 3: Multi-Voice Match
    if (!targetAudioUrl && multiVoiceMap[input]) {
      targetAudioUrl = multiVoiceMap[input];
      matchedTrigger = input;
    }

    // Process voice if trigger matched
    if (targetAudioUrl) {
      const currentTime = Date.now();
      const cooldownTime = 3 * 60 * 1000; // 3 Minutes

      // 🔒 4. COOLDOWN SYSTEM (Owner Bypass)
      if (senderID !== bossID) {
        if (!global.SiyamVoiceCooldowns[senderID]) global.SiyamVoiceCooldowns[senderID] = {};

        if (global.SiyamVoiceCooldowns[senderID][matchedTrigger]) {
          const expirationTime = global.SiyamVoiceCooldowns[senderID][matchedTrigger] + cooldownTime;
          if (currentTime < expirationTime) return; // Silent suppression
        }
      }

      fs.ensureDirSync(cacheDir);  
      const ext = targetAudioUrl.endsWith(".mp4") ? ".mp4" : ".mp3";  
      // Safe Filename using HEX conversion to handle symbols/emojis safely
      const safeFileName = Buffer.from(matchedTrigger).toString("hex") + ext;  
      const filePath = path.join(cacheDir, safeFileName);  

      try {  
        // Update Cooldown State Immediately
        if (senderID !== bossID) {
          global.SiyamVoiceCooldowns[senderID][matchedTrigger] = currentTime;
        }

        // ⚡ 5. CACHE HIT SYSTEM
        if (fs.existsSync(filePath)) {  
          console.log(`[text_voice] Cache Hit for trigger: [${matchedTrigger}]`);
          return await message.reply({  
            attachment: fs.createReadStream(filePath)  
          });  
        }  

        // 🌐 6. DOWNLOAD SYSTEM WITH RETRY & TIMEOUT
        console.log(`[text_voice] Downloading voice for trigger: [${matchedTrigger}]`);
        let response = null;
        let retries = 2;

        while (retries > 0) {
          try {
            response = await axios.get(targetAudioUrl, {  
              responseType: "arraybuffer",
              timeout: 5000 // 5 Seconds Timeout Protection
            });
            if (response && response.data && response.data.byteLength > 100) break; // Valid Data Check
          } catch (downloadErr) {
            retries--;
            if (retries === 0) throw downloadErr;
          }
        }

        if (!response || !response.data) throw new Error("Invalid or corrupted stream payload");

        // Write to Cache Layer
        fs.writeFileSync(filePath, Buffer.from(response.data));

        // 📤 SEND RESPONSE
        await message.reply({  
          attachment: fs.createReadStream(filePath)  
        });  

      } catch (e) {  
        // 11. ERROR HANDLING & LOGGING (No Crash Guard)
        console.error(`[text_voice] Processing Failed for [${matchedTrigger}]:`, e.message);
        // Delete potentially corrupted partial file
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch(err) {}
        }
      }  
    }  
  }
};
