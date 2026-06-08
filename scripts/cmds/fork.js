const fs = require("fs");
const path = require("path");

const ADMIN_UIDS = [
  "61590360434650"
];

const PASSWORDS = [
  "1024", "1458", "1960", "2048", "2233",
  "2401", "2580", "2718", "3001", "3210",
  "3456", "3698", "4040", "4321", "4567",
  "5005", "5123", "5555", "6006", "6789",
  "7007", "7124", "7777", "8080", "8123",
  "8754", "8888", "9009", "9321", "9999",
  "1111", "2222", "3333", "4444", "6666"
];

module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "link"],
    version: "5.0",
    author: "SIYAM",
    countDown: 3,
    role: 0,
    shortDescription: "GOAT BOT V2 Information",
    longDescription: "Shows GOAT BOT V2 information and password system",
    category: "info",
    guide: {
      en: "{pn} <password>\n{pn} list"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const dataDir = path.join(__dirname, "fork_data.json");

    if (!fs.existsSync(dataDir)) {
      fs.writeFileSync(
        dataDir,
        JSON.stringify({ usedPasswords: [] }, null, 2)
      );
    }

    const data = JSON.parse(fs.readFileSync(dataDir));

    // fork list
    if (args[0] === "list") {
      if (!ADMIN_UIDS.includes(event.senderID)) {
        return message.reply("❌ এই কমান্ড শুধুমাত্র 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍-এর জন্য।☺️");
      }

      let listText = "🔐 PASSWORD LIST\n\n";

      for (const pass of PASSWORDS) {
        const used = data.usedPasswords.includes(pass);
        listText += `${used ? "❌" : "✅"} ${pass}\n`;
      }

      return message.reply(listText);
    }

    const userPassword = args[0];

    if (!userPassword) {
      return message.reply(
        "🔐 Password দিন\n\nউদাহরণ:\nfork 1950"
      );
    }

    if (!PASSWORDS.includes(userPassword)) {
      return message.reply("❌ গরিবের দল 🌝 ঠিক পাসওয়ার্ড দে আমার বস 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪এর চাম**চা💩🔪!");
    }

    if (data.usedPasswords.includes(userPassword)) {
      return message.reply(
        "❌ এই Password ইতিমধ্যে ব্যবহার করা হয়েছে😝 গরিবের দল ☹️🤛!"
      );
    }

    data.usedPasswords.push(userPassword);

    if (data.usedPasswords.length >= PASSWORDS.length) {
      data.usedPasswords = [];
    }

    fs.writeFileSync(dataDir, JSON.stringify(data, null, 2));

    const loading = await message.reply(
      "⏳ 𝗟𝗢𝗔𝗗𝗜𝗡𝗚 • 𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧..."
    );

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      if (loading?.messageID) {
        await api.unsendMessage(loading.messageID);
      }
    } catch (e) {
      console.log(e);
    }

    return message.reply(`
╭━━━━━━━━━━━━━━━╮
🚀 𝐆𝐎𝐀𝐓 𝐁𝐎𝐓 ⚡ 𝐕𝟐 ⚡
╰━━━━━━━━━━━━━━━╯
👑 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 :
𓆩👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑𓆪
━━━━━━━━━━━━━━
📢 গুরুত্বপূর্ণ নোট
🎬 আপাতত টাইটেল ভিডিও নেই।
⏳ পরবর্তীতে টাইটেল ভিডিও দেওয়া হবে।
📂 Fork-এর ভিতরে প্রয়োজনীয় ফাইল দেওয়া আছে।
🔍 নিজে ট্রাই করে নিতে পারেন।
━━━━━━━━━━━━━━
💎 POWERED BY
👑 SIYAM-HASAN 👑

🔰 OFFICIAL REPO
https://github.com/siyam-crypto/mdsiyam-God--Bot-v5.git
━━━━━━━━━━━━━━

📱 WHATSAPP :
+8801789138157

🌐 FACEBOOK :
https://www.facebook.com/profile.php?id=61590360434650
`);
  }
};
