const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

const toEnglishName = (name) => {
  // যদি নাম null বা undefined হয়, তবে 'Unknown' রিটার্ন করবে
  if (!name) return "Unknown";
  
  const map = {
    'আ': 'A', 'ই': 'I', 'উ': 'U', 'এ': 'E', 'ও': 'O',
    'ক': 'K', 'খ': 'Kh', 'গ': 'G', 'ঘ': 'Gh', 'ঙ': 'Ng',
    'চ': 'Ch', 'ছ': 'Chh', 'জ': 'J', 'ঝ': 'Jh', 'ঞ': 'Ny',
    'ট': 'T', 'ঠ': 'Th', 'ড': 'D', 'ঢ': 'Dh', 'ণ': 'N',
    'ত': 'T', 'থ': 'Th', 'দ': 'D', 'ধ': 'Dh', 'ন': 'N',
    'প': 'P', 'ফ': 'Ph', 'ব': 'B', 'ভ': 'Bh', 'ম': 'M',
    'য': 'Y', 'র': 'R', '防': 'L', 'শ': 'Sh', 'ষ': 'Sh', 'স': 'S', 'হ': 'H',
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au'
  };
  return name.split('').map(c => map[c] || c).join('').replace(/\s+/g, ' ').trim() || "Unknown";
};

module.exports = {
  config: {
    name: "wanted",
    version: "1.3",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: "Wanted poster",
    longDescription: "Mention someone to create a high quality wanted poster.",
    category: "fun",
    guide: { en: "{pn} @mention" }
  },

  getCrime() {
    const crimes = [
      "Stealing Hearts", "Being Too Cool", "Spreading Chaos",
      "Hacking Laughter", "Breaking Rules", "Too Much Swag"
    ];
    return crimes[Math.floor(Math.random() * crimes.length)];
  },

  getReward() {
    const rewards = [1000, 5000, 10000, 50000, 100000];
    return "$" + rewards[Math.floor(Math.random() * rewards.length)];
  },

  onStart: async function ({ event, message, usersData }) {
    try {
      const mentionID = Object.keys(event.mentions)[0];
      if (!mentionID) return message.reply(`⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗧𝗔𝗥𝗚𝗘𝗧\n───────────────\n» 📌 𝗣𝗹𝗲𝗮𝘀𝗲 𝗺𝗲𝗻𝘁𝗶𝗼𝗻 𝘀𝗼𝗺𝗲𝗼𝗻𝗲!`);

      // সেফটি চেক: নাম null বা ফেইল হলে 'Wanted User' সেট হবে
      let rawName = "Wanted User";
      try {
        rawName = await usersData.getName(mentionID) || "Wanted User";
      } catch (e) {
        console.log("Failed to fetch user name, using fallback.");
      }
      
      const name = toEnglishName(rawName);

      // ✅ Updated Tokenless HD Photo Fetching Method
      const photoUrl = `https://graph.facebook.com/${mentionID}/picture?type=large&width=1000&height=1000`;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

      const avatarPath = path.join(cacheDir, `wanted_avatar_${mentionID}.jpg`);
      const outputPath = path.join(cacheDir, `wanted_poster_${mentionID}.jpg`);

      const res = await axios.get(photoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(avatarPath, Buffer.from(res.data));

      const canvas = createCanvas(700, 900);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, 700, 900);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 700, 150);

      ctx.font = "bold 100px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("WANTED", 350, 120);

      const avatar = await loadImage(avatarPath);

      ctx.fillStyle = "#fff";
      ctx.fillRect(100, 180, 500, 500);
      ctx.save();
      ctx.beginPath();
      ctx.rect(100, 180, 500, 500);
      ctx.clip();

      ctx.drawImage(avatar, 100, 180, 500, 500);
      ctx.restore();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#000";
      ctx.strokeRect(100, 180, 500, 500);

      ctx.font = "bold 50px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(name.toUpperCase(), 350, 750);

      const crime = this.getCrime();
      ctx.font = "italic 32px Arial";
      ctx.fillText("CRIME: " + crime, 350, 800);

      const reward = this.getReward();
      ctx.font = "bold 36px Arial";
      ctx.fillStyle = "#d35400";
      ctx.fillText("REWARD: " + reward, 350, 850);

      ctx.font = "italic 24px Arial";
      ctx.fillStyle = "#7f8c8d";
      ctx.fillText("Author: MOHAMMAD AKASH", 350, 890);

      fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg"));

      await message.reply({
        body: `📜 𝗪𝗔𝗡𝗧𝗘𝗗 𝗣𝗢𝗦𝗧𝗘𝗥\n───────────────\n» 👤 𝗡𝗔𝗠𝗘 : ${name}\n» 💣 𝗖𝗥𝗜𝗠𝗘 : ${crime}\n» 💰 𝗥𝗘𝗪𝗔𝗥𝗗 : ${reward}\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        attachment: fs.createReadStream(outputPath)
      });

      // Cleanup files
      if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    } catch (err) {
      console.error("Wanted Error:", err);
      message.reply(`❌ 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗢𝗡 𝗙𝗔𝗜𝗟𝗘𝗗\n───────────────\n» ⚠️ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗰𝗿𝗲𝗮𝘁𝗲 𝘄𝗮𝗻𝘁𝗲𝗱 𝗽𝗼𝘀𝘁𝗲𝗿.\n» ⚙️ 𝗘𝗿𝗿𝗼𝗿 : ${err.message}`);
    }
  }
};
