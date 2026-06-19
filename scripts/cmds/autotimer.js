const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autotimer",
  version: "13.5",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "⏰ Fixed & Professional AutoTimer with Safe Mention and Storage Clean",
  category: "AutoTime",
  countDown: 3,
};

const cacheDir = path.join(__dirname, "cache");
const statusFile = path.join(__dirname, "autotimer_status.json");

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

if (!fs.existsSync(statusFile)) {
  fs.writeJsonSync(statusFile, { enabled: true, lastSentTime: "" });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ নেটওয়ার্ক টাইমআউট এবং ৩ বার রিট্রাই সিস্টেম (কোড হ্যাং হওয়া আটকাবে)
async function downloadFile(url, destPath) {
  for (let i = 0; i < 3; i++) {
    try {
      const response = await axios.get(url, { 
        responseType: "arraybuffer",
        timeout: 30000 
      });
      if (response.data.byteLength > 50000) { // Corrupt Check (মিনিমাম ৫০KB)
        fs.writeFileSync(destPath, Buffer.from(response.data));
        return true;
      }
    } catch (err) {
      console.log(`⚠️ Retry ${i + 1} for download...`);
      await sleep(2000);
    }
  }
  return false;
}

// ✅ অটো ক্যাশ ক্লিনার ফাংশন (স্টোরেজ ফুল হওয়া রোধ করবে)
function cleanCacheFiles() {
  try {
    const files = fs.readdirSync(cacheDir);
    for (const file of files) {
      if (file.endsWith(".mp4")) {
        fs.unlinkSync(path.join(cacheDir, file));
      }
    }
  } catch (err) {
    console.log("Clean error:", err.message);
  }
}

// ⏰ ২৪ ঘণ্টার ডেটাবেজ এবং ব্যাকআপ লিংক (Catbox ডাউন থাকলে রানিং ইমার্জেন্সি CDN)
const timerData = {
  "12:00 AM": { text: "🌌 এখন রাত ১২টা বাজে❥︎নতুন দিন শুরু হলো ✨", url: "https://files.catbox.moe/2ii8c7.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/12am.mp4" },
  "01:00 AM": { text: "🌙 এখন রাত ১টা বাজে❥︎গভীর রাত, ঘুমাও সবাই 🤫", url: "https://files.catbox.moe/ah0s9r.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/01am.mp4" },
  "02:00 AM": { text: "🖤 এখন রাত ২টা বাজে❥︎কিছু নীরব স্মৃতি ও একাকীত্ব 🥀", url: "https://files.catbox.moe/ydwkrm.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/02am.mp4" },
  "03:00 AM": { text: "💤 এখন রাত ৩টা বাজে❥︎মন শুধু তোমাকেই খোঁজে 🥺", url: "https://files.catbox.moe/111n24.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/03am.mp4" },
  "04:00 AM": { text: "🕌 এখন ভোর ৪টা বাজে❥︎তাহাজ্জুদ/ফজরের প্রস্তুতি নাও 🤲", url: "https://files.catbox.moe/ebyeyi.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/04am.mp4" },
  "05:00 AM": { text: "🌅 এখন ভোর ৫টা বাজে❥︎শুভ সকাল, ভালো কাটুক দিনটি ☕", url: "https://files.catbox.moe/olpzpk.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/05am.mp4" },
  "06:00 AM": { text: "🌞 এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই ☕", url: "https://files.catbox.moe/3y330y.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/06am.mp4" },
  "07:00 AM": { text: "🍞 এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও", url: "https://files.catbox.moe/j4fhyp.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/07am.mp4" },
  "08:00 AM": { text: "✨ এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে", url: "https://files.catbox.moe/gc2ard.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/08am.mp4" },
  "09:00 AM": { text: "🕘 এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিይ", url: "https://files.catbox.moe/44oya3.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/09am.mp4" },
  "10:00 AM": { text: "☀️ এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি", url: "https://files.catbox.moe/ffvnm1.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/10am.mp4" },
  "11:00 AM": { text: "😌 এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও", url: "https://files.catbox.moe/c5ja93.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/11am.mp4" },
  "12:00 PM": { text: "❤️ এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে", url: "https://files.catbox.moe/56bgjp.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/12pm.mp4" },
  "01:00 PM": { text: "🤲 এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/2l5loh.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/01pm.mp4" },
  "02:00 PM": { text: "🍛 এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো", url: "https://files.catbox.moe/0j8bwh.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/02pm.mp4" },
  "03:00 PM": { text: "☀️ এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো", url: "https://files.catbox.moe/4hjg4f.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/03pm.mp4" },
  "04:00 PM": { text: "🥀 এখন বিকাল ৪টা বাজে❥︎আসরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/l5bfws.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/04pm.mp4" },
  "05:00 PM": { text: "🌆 এখন বিকাল ৫টা বাজে❥︎একতু বিশ্রাম নাও", url: "https://files.catbox.moe/7nvnsi.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/05pm.mp4" },
  "06:00 PM": { text: "🌇 এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও 😍", url: "https://files.catbox.moe/j7gndp.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/06pm.mp4" },
  "07:00 PM": { text: "🌃 এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো ❤️", url: "https://files.catbox.moe/9tfka4.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/07pm.mp4" },
  "08:00 PM": { text: "🧖 এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো", url: "https://files.catbox.moe/6dyzum.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/08pm.mp4" },
  "09:00 PM": { text: "🌙 এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও 😴", url: "https://files.catbox.moe/hgf9vq.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/09pm.mp4" },
  "10:00 PM": { text: "💤 এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে", url: "https://files.catbox.moe/3e5pct.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/10pm.mp4" },
  "11:00 PM": { text: "🌌 এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো 🥰", url: "https://files.catbox.moe/uak967.mp4", backup: "https://raw.githubusercontent.com/Siyam-Owner/Backup-CDN/main/videos/11pm.mp4" }
};

const startupTexts = [
  "✅ সিয়াম বস সফলভাবে চালু হয়েছে...!! 👑🚀",
  "🥀 কিছু কথা মনে হলে বুকটা কেঁপে ওঠে, আর কিছু মানুষ হারিয়ে গেলে জীবনটাই থমকে দাঁড়ায়..!! 💔",
  "🖤 ভালো থাকার অভিনয় করতে করতে আজ আমি বড়ই ক্লান্ত, অথচ কেউ আমার ভেতরের ক্ষতটা দেখলো না..!! 🥺"
];

module.exports.onLoad = async function ({ api }) {
  console.log("🔥 AUTOTIMER LOADED");

  if (global.autotimerInterval) {
    clearInterval(global.autotimerInterval);
  }

  // 🚀 স্টার্টআপ নোটিফিকেশন ফিক্সড ফাংশন
  const handleStartupAnnouncement = async () => {
    try {
      const startupVideoUrl = "https://files.catbox.moe/jjrnjf.mp4";
      const startupVideoPath = path.join(cacheDir, "bot_startup_video.mp4");
      const randomText = startupTexts[Math.floor(Math.random() * startupTexts.length)];  

      const success = await downloadFile(startupVideoUrl, startupVideoPath);
      if (!success) return;

      const startupMsg = `╭───────────────⭓\n│ 🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗥𝗧𝗨𝗣 𝗡𝗢𝗧𝗜𝗙𝗬\n├───────────────⭓\n│ ${randomText}\n├───────────────⭓\n│  👑𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌 👑\n╰───────────────⭓`;

      // 💥 getThreadList(250) করা হয়েছে, ২৫০ টা গ্রুপ কভার করবে।
      const allThreads = await api.getThreadList(250, null, ["INBOX"]);
      const groups = allThreads.filter(thread => thread.isGroup);  

      for (const thread of groups) {
        api.sendMessage({  
          body: startupMsg,  
          attachment: fs.createReadStream(startupVideoPath)  
        }, thread.threadID, (err, info) => {
          if (!err && info && info.messageID) {  
            setTimeout(() => { api.unsendMessage(info.messageID); }, 30 * 60 * 1000); 
          }  
        });
        await sleep(5000); // সেফটি ডিলে ৫ সেকেন্ড
      }
      
      if (fs.existsSync(startupVideoPath)) fs.unlinkSync(startupVideoPath); // স্টার্টআপ ফাইল ডিলিট
    } catch (err) {  
      console.log("Startup error:", err.message);
    }
  };

  setTimeout(handleStartupAnnouncement, 5000);

  // ⏱️ প্রতি ঘণ্টার অটো টাইমার ফাংশন
  const checkTimeAndSend = async () => {
    try {
      if (!fs.existsSync(statusFile)) return;
      const statusData = fs.readJsonSync(statusFile);
      if (!statusData.enabled) return;

      const currentTime = moment().tz("Asia/Dhaka");  
      const minutes = currentTime.format("mm");  
      const now = currentTime.format("hh:00 A");  

      if (minutes !== "00") return;  
      if (!timerData[now]) return;  

      // 🔴 রিস্টার্ট মারলেও ১ ঘণ্টার ভিডিও ২ বার যাবে না (Persistent Protection)
      if (now !== statusData.lastSentTime) {  
        
        cleanCacheFiles(); // পুরানো ভিডিও ক্লিয়ার

        statusData.lastSentTime = now;
        fs.writeJsonSync(statusFile, statusData);

        const todayDate = currentTime.format("DD-MM-YYYY");  
        const currentHourData = timerData[now];  
          
        const videoPath = path.join(cacheDir, `video_${now.replace(/:| /g, "_")}.mp4`);  

        // Catbox ডাউন থাকলে অটো ব্যাকআপ CDN লিংক থেকে ডাউনলোড হবে
        let isDownloaded = await downloadFile(currentHourData.url, videoPath);
        if (!isDownloaded) {
          isDownloaded = await downloadFile(currentHourData.backup, videoPath);
        }

        if (!isDownloaded) return;

        const text = currentHourData.text;  
        const msg = `╭───────────────⭓\n│ ⏰ 𝗔𝗨𝗧𝗢 𝗧𝗜𝗠𝗘 𝗡𝗢𝗧𝗘\n├───────────────⭓\n│ 🕒 𝗧𝗜𝗠𝗘 : ${now}\n│ 📅 𝗗𝗔𝗧𝗘 : ${todayDate}\n├───────────────⭓\n│ ${text}\n├───────────────⭓\n│ 👑𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌 👑\n╰───────────────⭓`;

        const allThreads = await api.getThreadList(250, null, ["INBOX"]);  
        const groups = allThreads.filter(thread => thread.isGroup);  

        for (const thread of groups) {
          // ✅ আগের মতো অরিজিনাল ও সেফ ফেসবুক মেনশন ফরম্যাট (যা ক্র্যাশ করবে না)
          let mentions = [];
          if (thread.participantIDs && thread.participantIDs.length > 0) {
            const randomUser = thread.participantIDs[Math.floor(Math.random() * thread.participantIDs.length)];
            mentions.push({
              tag: "@",
              id: randomUser
            });
          }

          api.sendMessage({  
            body: msg + " 🔔",  
            mentions: mentions,  
            attachment: fs.createReadStream(videoPath)  
          }, thread.threadID, (err, info) => {  
            if (!err && info && info.messageID) {  
              setTimeout(() => { api.unsendMessage(info.messageID); }, 30 * 60 * 1000);  
            }  
          });
          await sleep(5000); // ৫ সেকেন্ড সেফটি ডিলে
        }
      }  
    } catch (err) {  
      console.log("Timer loop error:", err.message);  
    }
  };

  global.autotimerInterval = setInterval(checkTimeAndSend, 60000);
};

// ✅ ON / OFF COMMAND SYSTEM
module.exports.onStart = async function ({ api, event, args }) {
  if (!fs.existsSync(statusFile)) {
    fs.writeJsonSync(statusFile, { enabled: true, lastSentTime: "" });
  }
  const statusData = fs.readJsonSync(statusFile);

  if (!args[0]) {
    return api.sendMessage("⚙️ Usage:\n/autotimer on\n/autotimer off", event.threadID, event.messageID);
  }

  if (args[0].toLowerCase() === "on") {
    if (statusData.enabled) return api.sendMessage("🚨 𝑨𝒖𝒕𝒐 𝑻𝒊𝒎𝒆𝒓 আগেই 𝑶𝑵 আছে 💻", event.threadID, event.messageID);
    statusData.enabled = true;
    statusData.lastSentTime = ""; 
    fs.writeJsonSync(statusFile, statusData);
    return api.sendMessage("╔═════ஜ۩☢۩ஜ═════╗\n   ⏰ 👑 𝐀𝐔𝐓𝐎 𝐓𝐈𝐌𝐄 𝐎𝐍 ✅\n   ✡️ এখন থেকে অটো ভিডিও যাবে📥\n╚═════ஜ۩☢۩ஜ═════╝", event.threadID, event.messageID);
  }

  if (args[0].toLowerCase() === "off") {
    if (!statusData.enabled) return api.sendMessage("⌛ 𝙰𝚄𝚃𝙾 𝚃𝙸𝙼𝙴 𝖮𝖥𝖥 আছে 💾", event.threadID, event.messageID);
    statusData.enabled = false;
    fs.writeJsonSync(statusFile, statusData);
    return api.sendMessage("╔═════ஜ۩☢۩ஜ═════╗\n   🔴 𝘼𝙐𝙏𝙊 𝙏𝙄𝙈𝙀𝙍 𝙊𝙁𝙁 ⚙️\n   🔐 এখন আর অটো ভিডিও যাবে না🔕\n╚═════ஜ۩☢۩ஜ═════╝", event.threadID, event.messageID);
  }
};
