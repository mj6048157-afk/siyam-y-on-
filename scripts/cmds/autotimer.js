const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autotimer",
  version: "7.0",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে",
  category: "AutoTime",
  countDown: 3,
};

const cacheDir = path.join(__dirname, "cache");
const statusFile = path.join(__dirname, "autotimer_status.json");

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

if (!fs.existsSync(statusFile)) {
  fs.writeJsonSync(statusFile, { enabled: false });
}

// ✅ ভিডিও লিংক
const videos = [
  "https://files.catbox.moe/2ii8c7.mp4",
  "https://files.catbox.moe/ah0s9r.mp4",
  "https://files.catbox.moe/ydwkrm.mp4",
  "https://files.catbox.moe/111n24.mp4",
  "https://files.catbox.moe/ebyeyi.mp4",
  "https://files.catbox.moe/olpzpk.mp4",
  "https://files.catbox.moe/3y330y.mp4",
  "https://files.catbox.moe/j4fhyp.mp4",
  "https://files.catbox.moe/gc2ard.mp4",
  "https://files.catbox.moe/44oya3.mp4",
  "https://files.catbox.moe/ffvnm1.mp4",
  "https://files.catbox.moe/c5ja93.mp4",
  "https://files.catbox.moe/56bgjp.mp4",
  "https://files.catbox.moe/2l5loh.mp4",
  "https://files.catbox.moe/0j8bwh.mp4",
  "https://files.catbox.moe/4hjg4f.mp4",
  "https://files.catbox.moe/l5bfws.mp4",
  "https://files.catbox.moe/7nvnsi.mp4"
];

// ✅ টাইম অনুযায়ী মেসেজ
const timerData = {
  "06:00 AM": "🌞 এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই ☕",
  "07:00 AM": "🍞 এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও",
  "08:00 AM": "✨ এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে",
  "09:00 AM": "🕘 এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই",
  "10:00 AM": "☀️ এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি",
  "11:00 AM": "😌 এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও",
  "12:00 PM": "❤️ এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে",
  "01:00 PM": "🤲 এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও",
  "02:00 PM": "🍛 এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো",
  "03:00 PM": "☀️ এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো",
  "04:00 PM": "🥀 এখন বিকাল ৪টা বাজে❥︎আসরের নামাজ পড়ে নাও",
  "05:00 PM": "🌆 এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও",
  "06:00 PM": "🌇 এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও 😍",
  "07:00 PM": "🌃 এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো ❤️",
  "08:00 PM": "🧖 এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো",
  "09:00 PM": "🌙 এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও 😴",
  "10:00 PM": "💤 এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে",
  "11:00 PM": "🌌 এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো 🥰"
};

let lastSentTime = "";

module.exports.onLoad = async function ({ api }) {

  if (module.exports.config.author !== "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ") {
    console.error("❌ Author Changed");
    return process.exit(1);
  }

  const checkTimeAndSend = async () => {

    const statusData = fs.readJsonSync(statusFile);

    if (!statusData.enabled) return;

    const now = moment()
      .tz("Asia/Dhaka")
      .format("hh:00 A");

    if (!timerData[now]) return;

    if (now !== lastSentTime) {

      lastSentTime = now;

      const todayDate = moment()
        .tz("Asia/Dhaka")
        .format("DD-MM-YYYY");

      const videoIndex =
        Object.keys(timerData).indexOf(now) %
        videos.length;

      const videoUrl = videos[videoIndex];

      const videoName = `video_${videoIndex}.mp4`;

      const videoPath = path.join(
        cacheDir,
        videoName
      );

      try {

        // ✅ ভিডিও Download
        if (
          !fs.existsSync(videoPath) ||
          fs.statSync(videoPath).size === 0
        ) {

          const response = await axios.get(videoUrl, {
            responseType: "arraybuffer"
          });

          fs.writeFileSync(
            videoPath,
            Buffer.from(response.data)
          );

          console.log("📥 Downloaded:", videoName);
        }

        const text = timerData[now];

        // ✅ সুন্দর Note Design
        const msg = `
╭───────────────⭓
│ ⏰ 𝗔𝗨𝗧𝗢 𝗧𝗜𝗠𝗘𝗥 𝗡𝗢𝗧𝗘
├───────────────⭓
│ 🕒 𝗧𝗜𝗠𝗘 : ${now}
│ 📅 𝗗𝗔𝗧𝗘 : ${todayDate}
├───────────────⭓
│ ${text}
├───────────────⭓
│ 👑𝗕𝗢𝗪𝗡𝗘𝗥 𝆠፝𝐒𝐈𝐘𝐀𝐌-👑
╰───────────────⭓
`;

        const allThreads =
          await api.getThreadList(
            1000,
            null,
            ["INBOX"]
          );

        const groups = allThreads.filter(
          thread => thread.isGroup
        );

        for (const thread of groups) {

          const mentions = thread.participantIDs.map(uid => ({
            tag: "@",
            id: uid
          }));

          api.sendMessage(
            {
              body: msg,
              mentions,
              attachment:
                fs.createReadStream(videoPath)
            },
            thread.threadID,
            (err, info) => {

              // ✅ ৩০ মিনিট পরে Auto Delete
              if (!err && info.messageID) {

                setTimeout(() => {
                  api.unsendMessage(
                    info.messageID
                  );
                }, 30 * 60 * 1000);
              }
            }
          );
        }

        console.log("✅ Sent:", now);

      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
  };

  // ✅ প্রতি ১০ সেকেন্ডে চেক
  setInterval(checkTimeAndSend, 10000);
};

// ✅ ON OFF COMMAND
module.exports.onStart = async function ({
  api,
  event,
  args
}) {

  const statusData =
    fs.readJsonSync(statusFile);

  if (!args[0]) {

    return api.sendMessage(
      "⚙️ Usage:\n/autotimer on\n/autotimer off",
      event.threadID,
      event.messageID
    );
  }

  // ✅ ON
  if (args[0].toLowerCase() === "on") {

    if (statusData.enabled) {

      return api.sendMessage(
        "🚨 𝑨𝒖𝒕𝒐 𝑻𝒊𝒎𝒆𝒓 আগেই 𝑶𝑵 আছে 💻",
        event.threadID,
        event.messageID
      );
    }

    fs.writeJsonSync(statusFile, {
      enabled: true
    });

    return api.sendMessage(
`╔═════ஜ۩☢۩ஜ═════╗
⏰ 𝐀𝐔𝐓𝐎 𝐓𝐈𝐌𝐄𝐑 𝐎𝐍 ✅
✡️ এখন থেকে অটো ভিডিও যাবে📥
╚═════ஜ۩☢۩ஜ═════╝`,
      event.threadID,
      event.messageID
    );
  }

  // ✅ OFF
  if (args[0].toLowerCase() === "off") {

    if (!statusData.enabled) {

      return api.sendMessage(
        "⌛𝙰𝚄𝚃𝙾 𝚃𝙸𝙼𝙴𝚁 আগেই 𝙾𝙵𝙵 আছে 💾",
        event.threadID,
        event.messageID
      );
    }

    fs.writeJsonSync(statusFile, {
      enabled: false
    });

    return api.sendMessage(
`╔═════ஜ۩☢۩ஜ═════╗
🔴𝘼𝙐𝙏𝙊 𝙏𝙄𝙈𝙀𝙍 𝙊𝙁𝙁 ⚙️
🔐এখন আর অটো ভিডিও যাবে না🔕
╚═════ஜ۩☢۩ஜ═════╝`,
      event.threadID,
      event.messageID
    );
  }
};
