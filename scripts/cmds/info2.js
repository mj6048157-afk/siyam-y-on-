const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "info2",
    version: "5.0.0",
    author: "SIYAM-HASAN", // এই নাম পরিবর্তন করলে বট বন্ধ হয়ে যাবে
    role: 0,
    category: "owner"
  },

  onStart: async function ({ message }) {
    const botName = "𝐍𝐈𝐉𝐇𝐔𝐌";
    const prefix = global.GoatBot?.config?.prefix || ".";
    const commands = global.GoatBot?.commands?.size || 200;

    const now = moment().tz("Asia/Dhaka");
    const time = now.format("hh:mm:ss A");
    const date = now.format("DD MMMM YYYY");

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    
    const links = [
      "https://files.catbox.moe/7siyec.jpg",
      "https://files.catbox.moe/zz241j.jpg"
    ];

    /* ✅ TOGGLE SYSTEM WITH UNIVERSAL FORMAT HANDLER */
    if (typeof global.info2ImageIndex === "undefined") {
      global.info2ImageIndex = 0;
    }

    const selectedImage = links[global.info2ImageIndex % links.length];
    global.info2ImageIndex = (global.info2ImageIndex + 1) % links.length;

    let attachment;
    if (selectedImage) {
      try {
        const urlClean = selectedImage.split('?')[0].toLowerCase();
        if (urlClean.endsWith(".mp4") || urlClean.endsWith(".mov") || urlClean.endsWith(".mkv") || urlClean.includes("video")) {
          attachment = await global.utils.getStreamFromURL(selectedImage, "video.mp4");
        } else if (urlClean.endsWith(".gif") || urlClean.includes("gif")) {
          attachment = await global.utils.getStreamFromURL(selectedImage, "animated.gif");
        } else {
          attachment = await global.utils.getStreamFromURL(selectedImage, "image.jpg");
        }
      } catch (err) {
        console.error("Media Load Error:", err);
        attachment = undefined;
      }
    }

    return message.reply({
      body: `╔═══════════════╗
  ‿👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
╚═══════════════╝
╭〔 🤖 ‿𝐁𝐎𝐓 𝐏𝐀𝐍𝐄𝐋 〕╮
│ 🤖 ‿𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 ➤ ${botName}
│ ⚡ ‿𝐏𝐑𝐄𝐅𝐈𝐗 ➤ ${prefix}
│ 📦 ‿𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ➤ ${commands}
╰────────────────╯
╭〔 👤 ‿𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 〕╮
│ 👑 ‿𝐍𝐀𝐌𝐄 ➤ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
│ 🎂 ‿𝐀𝐆𝐄 ➤ 𝟏𝟕+ | 🚹 𝐆𝐄𝐍𝐃𝐄𝐑 ➤ 𝐌𝐀𝐋𝐄
│ 📘 ‿𝐒𝐓𝐔𝐃𝐘 ➤ 𝐂𝐋𝐀𝐒𝐒 𝟏𝟎
│ 💔 ‿𝐒𝐓𝐀𝐓𝐔𝐒 ➤ 𝐒𝐈𝐍𝐆𝐋𝐄
╰─────────────────
╭〔 📍 ‿𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 〕╮
│ 🏠 ‿𝐃𝐈𝐒𝐓𝐑𝐈𝐂𝐓 ➤ 𝐊𝐈𝐒𝐇𝐎𝐑𝐄𝐆𝐀𝐍𝐉
│ 🌍 ‿𝐂𝐎𝐔𝐍𝐓𝐑𝐘 ➤ 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇
╰────────────────╯
╭〔 🧬 ‿𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋 〕╮
│ 👪 ‿Explicit ➤ 𝐎𝐍𝐋𝐘 𝐒𝐎𝐍 😎
│ 💞 ‿𝐆𝐅 ➤ 𝐘𝐄𝐒 (𝐍𝐀𝐊𝐀𝐌𝐎 😏)
╰────────────────╯
╭─〔 🎯 ‿𝐇𝐎𝐁𝐁𝐘 〕─╮
│ 🔥 ➤ 𝐅𝐑𝐈𝐄𝐍𝐃𝐒 𝐀𝐃𝐃𝐃𝐀
│ 🏍️ ➤ 𝐁𝐈𝐊𝐄 𝐑𝐈𝐃𝐄 | 📱 ➤ 𝐌𝐎𝐁𝐈𝐋𝐄 𝐔𝐒𝐄
╰────────────────╯
╭─〔 💋 ‿𝐒𝐏𝐄𝐂𝐈𝐀𝐋 〕─╮
│ 😘 ➤ 𝐆𝐈𝐑𝐋𝐒 = 𝐔𝐌𝐌𝐀𝐇
╰────────────────╯
╭─〔 🌐 ‿𝐂𝐎𝐍𝐓𝐀𝐂𝐓 〕─╮
│ 🌐 ‿𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 ➤ https://www.facebook.com/profile.php?id=61591371186179
│ 📞 ‿𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 ➤ +8801789138157
╰────────────────╯
╭〔 ⏳ ‿𝐒𝐘𝐒𝐓𝐄𝐌 〕╮
│ 🕒 ‿𝐓𝐈𝐌𝐄 ➤ ${time}
│ 📅 ‿𝐃𝐀𝐓𝐄 ➤ ${date}
│ ⏱️ ‿𝐔𝐏𝐓𝐈𝐌𝐄 ➤ ${h}𝐡 ${m}𝐦 ${s}𝐬
╰────────────────╯
╔════════════════╗
   ✡️ ‿𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 ✡️
╚════════════════╝
➤ 😎 আমি নিজের মতোই চলি
➤ 🔥 আমি কপি না, আমি আলাদা
➤ 🖤 যারে ভালোবাসি, শেষ পর্যন্ত
➤ 💖 যারে না চাই, সে নাই
╭─〔 🔥 ‿𝐁𝐑𝐀𝐍𝐃 〕─╮
│ 👑 ‿𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
│ ❌ ‿𝐍𝐎 𝐂𝐎𝐏𝐘 | ✔️ ‿𝐎𝐍𝐋𝐘 𝐎𝐑𝐈𝐆𝐈𝐍𝐀𝐋
╰────────────────╯`,
      attachment: attachment
    });
  }
};
