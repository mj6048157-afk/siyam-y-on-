const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autotimer",
  version: "11.0",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "⏰ ২৪ ঘণ্টায় ২৪টি নির্দিষ্ট ভিডিও ও টেক্সট পাঠাবে (রিস্টার্ট অ্যানাউন্সমেন্টসহ ফিক্সড)",
  category: "AutoTime",
  countDown: 3,
};

const cacheDir = path.join(__dirname, "cache");
const statusFile = path.join(__dirname, "autotimer_status.json");

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// ✅ বট রিস্টার্ট দিলে যেন ডিফল্টভাবে ON থাকে
fs.writeJsonSync(statusFile, { enabled: true });

// ✅ ২৪ ঘণ্টার ২৪টি নির্দিষ্ট আলাদা ভিডিও লিংক এবং আলাদা টেক্সট ডেটা সেটআপ
const timerData = {
  "12:00 AM": { text: "🌌 এখন রাত ১২টা বাজে❥︎নতুন দিন শুরু হলো ✨", url: "https://files.catbox.moe/2ii8c7.mp4" },
  "01:00 AM": { text: "🌙 এখন রাত ১টা বাজে❥︎গভীর রাত, ঘুমাও সবাই 🤫", url: "https://files.catbox.moe/ah0s9r.mp4" },
  "02:00 AM": { text: "🖤 এখন রাত ২টা বাজে❥︎কিছু নীরব স্মৃতি ও একাকীত্ব 🥀", url: "https://files.catbox.moe/ydwkrm.mp4" },
  "03:00 AM": { text: "💤 এখন রাত ৩টা বাজে❥︎মন শুধু তোমাকেই খোঁজে 🥺", url: "https://files.catbox.moe/111n24.mp4" },
  "04:00 AM": { text: "🕌 এখন ভোর ৪টা বাজে❥︎তাহাজ্জুদ/ফজরের প্রস্তুতি নাও 🤲", url: "https://files.catbox.moe/ebyeyi.mp4" },
  "05:00 AM": { text: "🌅 এখন ভোর ৫টা বাজে❥︎শুভ সকাল, ভালো কাটুক দিনটি ☕", url: "https://files.catbox.moe/olpzpk.mp4" },
  "06:00 AM": { text: "🌞 এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই ☕", url: "https://files.catbox.moe/3y330y.mp4" },
  "07:00 AM": { text: "🍞 এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও", url: "https://files.catbox.moe/j4fhyp.mp4" },
  "08:00 AM": { text: "✨ এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে", url: "https://files.catbox.moe/gc2ard.mp4" },
  "09:00 AM": { text: "🕘 এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই", url: "https://files.catbox.moe/44oya3.mp4" },
  "10:00 AM": { text: "☀️ এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি", url: "https://files.catbox.moe/ffvnm1.mp4" },
  "11:00 AM": { text: "😌 এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও", url: "https://files.catbox.moe/c5ja93.mp4" },
  "12:00 PM": { text: "❤️ এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে", url: "https://files.catbox.moe/56bgjp.mp4" },
  "01:00 PM": { text: "🤲 এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/2l5loh.mp4" },
  "02:00 PM": { text: "🍛 এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো", url: "https://files.catbox.moe/0j8bwh.mp4" },
  "03:00 PM": { text: "☀️ এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো", url: "https://files.catbox.moe/4hjg4f.mp4" },
  "04:00 PM": { text: "🥀 এখন বিকাল ৪টা বাজে❥︎আসরের নামাজ পড়ে নাও", url: "https://files.catbox.moe/l5bfws.mp4" },
  "05:00 PM": { text: "🌆 এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও", url: "https://files.catbox.moe/7nvnsi.mp4" },
  "06:00 PM": { text: "🌇 এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও 😍", url: "https://files.catbox.moe/j7gndp.mp4" },
  "07:00 PM": { text: "🌃 এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো ❤️", url: "https://files.catbox.moe/9tfka4.mp4" },
  "08:00 PM": { text: "🧖 এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো", url: "https://files.catbox.moe/6dyzum.mp4" },
  "09:00 PM": { text: "🌙 এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও 😴", url: "https://files.catbox.moe/hgf9vq.mp4" },
  "10:00 PM": { text: "💤 এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে", url: "https://files.catbox.moe/3e5pct.mp4" },
  "11:00 PM": { text: "🌌 এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো 🥰", url: "https://files.catbox.moe/uak967.mp4" }
};

// 📥 চালুর সময়ের স্পেশাল টেক্সট লিস্ট (১টি সাকসেস + ৪টি স্যাড)
const startupTexts = [
  "✅ সিয়াম বস সফলভাবে চালু হয়েছে...!! 👑🚀",
  "🥀 কিছু কথা মনে হলে বুকটা কেঁপে ওঠে, আর কিছু মানুষ হারিয়ে গেলে জীবনটাই থমকে দাঁড়ায়..!! 💔",
  "🖤 ভালো থাকার অভিনয় করতে করতে আজ আমি বড়ই ক্লান্ত, অথচ কেউ আমার ভেতরের ক্ষতটা দেখলো না..!! 🥺",
  "🥀 অবহেলা জিনিসটা বড্ড বিষাক্ত, যা একটা জ্যান্ত মানুষকে ভেতর থেকে প্রতিনিয়ত কুঁড়ে কুঁড়ে খায়..!! 💔",
  "⏳ যাকে নিজের চেয়েও বেশি বিশ্বাস করেছিলাম, আজ তার দেওয়া উপহার শুধুই একাকীত্ব আর চোখের জল..!! 🥀"
];

let lastSentTime = "";

module.exports.onLoad = async function ({ api }) {

  if (module.exports.config.author !== "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ") {
    console.error("❌ Author Changed");
    return process.exit(1);
  }

  // 🚀 বট চালু হওয়ার সাথে সাথে এক্সিকিউট হওয়া স্পেশাল ফাংশন
  const handleStartupAnnouncement = async () => {
    try {
      const startupVideoUrl = "https://files.catbox.moe/jjrnjf.mp4";
      const startupVideoPath = path.join(cacheDir, "bot_startup_video.mp4");

      // র্যান্ডমলি ১টি টেক্সট সিলেক্ট করা
      const randomText = startupTexts[Math.floor(Math.random() * startupTexts.length)];

      if (!fs.existsSync(startupVideoPath) || fs.statSync(startupVideoPath).size === 0) {
        const response = await axios.get(startupVideoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(startupVideoPath, Buffer.from(response.data));
      }

      const startupMsg = `
╭───────────────⭓
│ 🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗥𝗧𝗨𝗣 𝗡𝗢𝗧𝗜𝗙𝗬
├───────────────⭓
│ ${randomText}
├───────────────⭓
│  👑𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌 👑
╰───────────────⭓
`;

      const allThreads = await api.getThreadList(100, null, ["INBOX"]);
      const groups = allThreads.filter(thread => thread.isGroup);

      for (const thread of groups) {
        api.sendMessage({
          body: startupMsg,
          attachment: fs.createReadStream(startupVideoPath)
        }, thread.threadID, (err, info) => {
          if (!err && info.messageID) {
            setTimeout(() => { api.unsendMessage(info.messageID); }, 30 * 60 * 1000); // ৩০ মিনিট পর অটো ডিলিট
          }
        });
      }
      console.log("✅ Startup announcement sent successfully.");
    } catch (err) {
      console.error("❌ Error sending startup announcement:", err.message);
    }
  };

  // বট চালু হওয়ার ৫ সেকেন্ডের মধ্যে স্পেশাল নোটিফিকেশনটি চলে যাবে
  setTimeout(handleStartupAnnouncement, 5000);

  // কারেন্ট মিনিট যেন প্রথম ঘণ্টার লজিক ওভারল্যাপ না করে তার জন্য সেটআপ
  lastSentTime = moment().tz("Asia/Dhaka").format("hh:00 A");

  const checkTimeAndSend = async () => {
    try {
      const statusData = fs.readJsonSync(statusFile);
      if (!statusData.enabled) return;

      const currentTime = moment().tz("Asia/Dhaka");
      const minutes = currentTime.format("mm");
      const now = currentTime.format("hh:00 A");

      // যদি কাঁটায় কাঁটায় ০ মিনিট (যেমন ৪:০০, ৫:০০) না হয়, তবে রেগুলার মেসেজ প্রসেস করবে না
      if (minutes !== "00") return;
      if (!timerData[now]) return;

      if (now !== lastSentTime) {
        lastSentTime = now;

        const todayDate = currentTime.format("DD-MM-YYYY");
        const currentHourData = timerData[now];
        const videoUrl = currentHourData.url;
        
        const videoName = `video_${now.replace(/:| /g, "_")}.mp4`;
        const videoPath = path.join(cacheDir, videoName);

        if (!fs.existsSync(videoPath) || fs.statSync(videoPath).size === 0) {
          const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(videoPath, Buffer.from(response.data));
          console.log("📥 Downloaded:", videoName);
        }

        const text = currentHourData.text;
        const msg = `
╭───────────────⭓
│ ⏰ 𝗔𝗨𝗧𝗢 𝗧𝗜𝗠ＥＲ 𝗡𝗢𝗧Ｅ
├───────────────⭓
│ 🕒 𝗧𝗜𝗠Ｅ : ${now}
│ 📅 𝗗𝗔𝗧𝗘 : ${todayDate}
├───────────────⭓
│ ${text}
├───────────────⭓
│ 👑𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌 👑
╰───────────────⭓
`;

        const allThreads = await api.getThreadList(1000, null, ["INBOX"]);
        const groups = allThreads.filter(thread => thread.isGroup);

        for (const thread of groups) {
          const mentions = thread.participantIDs.map(uid => ({ tag: "@", id: uid }));

          api.sendMessage({
            body: msg,
            mentions,
            attachment: fs.createReadStream(videoPath)
          }, thread.threadID, (err, info) => {
            if (!err && info.messageID) {
              setTimeout(() => { api.unsendMessage(info.messageID); }, 30 * 60 * 1000);
            }
          });
        }
        console.log("✅ Sent regular routine video for:", now);
      }
    } catch (err) {
      console.error("❌ Error in interval:", err);
    }
  };

  // প্রতি ১০ সেকেন্ডে ব্যাকগ্রাউন্ড ওয়াচ লুপ
  setInterval(checkTimeAndSend, 10000);
};

// ✅ ON / OFF COMMAND SYSTEM
module.exports.onStart = async function ({ api, event, args }) {
  const statusData = fs.readJsonSync(statusFile);

  if (!args[0]) {
    return api.sendMessage(
      "⚙️ Usage:\n/autotimer on (চালু করতে)\n/autotimer off (বন্ধ করতে)",
      event.threadID,
      event.messageID
    );
  }

  if (args[0].toLowerCase() === "on") {
    if (statusData.enabled) {
      return api.sendMessage("🚨 𝑨𝒖𝒕𝒐 𝑻𝒊𝒎𝒆𝒓 আগেই 𝑶𝑵 আছে 💻", event.threadID, event.messageID);
    }
    fs.writeJsonSync(statusFile, { enabled: true });
    lastSentTime = ""; 

    return api.sendMessage(
`╔═════ஜ۩☢۩ஜ═════╗
⏰ 👑 𝐀𝐔𝐓𝐎 𝐓𝐈𝐌𝐄𝐑 𝐎𝐍 ✅
✡️ এখন থেকে অটো ভিডিও যাবে📥
╚═════ஜ۩☢۩ஜ═════╝`,
      event.threadID,
      event.messageID
    );
  }

  if (args[0].toLowerCase() === "off") {
    if (!statusData.enabled) {
      return api.sendMessage("⌛ 𝙰𝚄𝚃𝙾 𝚃𝙸𝙼𝙴𝚁 আগেই 𝙾𝖥𝖥 আছে 💾", event.threadID, event.messageID);
    }
    fs.writeJsonSync(statusFile, { enabled: false });

    return api.sendMessage(
`╔═════ஜ۩☢۩ஜ═════╗
🔴 𝘼𝙐𝙏𝙊 𝙏𝙄𝙈𝙀Ｒ 𝙊𝙁𝙁 ⚙️
🔐 এখন আর অটো ভিডিও যাবে না🔕
╚═════ஜ۩☢۩ஜ═════╝`,
      event.threadID,
      event.messageID
    );
  }
};
