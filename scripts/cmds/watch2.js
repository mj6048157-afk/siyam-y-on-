const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// নতুন বেস এপিআই ফাংশন
const getBaseApiUrl = async () => {
  try {
    const base = await axios.get(`https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json`);
    return base.data.mahmud;
  } catch (e) {
    return "https://mahmud-apis.vercel.app"; // ফলব্যাক এপিআই
  }
};

module.exports = {
  config: {
    name: "media",
    aliases: ["audio1", "audio2", "watch1", "watch2"],
    version: "6.0.0",
    author: "Milon Hasan",
    countDown: 5,
    role: 2,
    category: "media",
    usePrefix: false
  },

  /* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
  * 🤖 BOT NAME: MILON BOT
  * 👤 OWNER: MILON HASAN (MILON BOSS)
  * 🛠️ PROJECT: MILON BOT PROJECT (2026)
  * --------------------------------------- */

  onChat: async function ({ api, event, message }) {
    if (!event.body) return;
    const body = event.body.toLowerCase().trim();

    // --- [ 🔐 ADMIN ONLY CHECK ] ---
    const adminIDs = global.GoatBot?.config?.adminBot || [];
    const isBotAdmin = adminIDs.includes(event.senderID);

    const isAudio = body.startsWith("audio1") || body.startsWith("audio2");
    const isVideo = body.startsWith("watch1") || body.startsWith("watch2");

    if (isAudio || isVideo) {
      if (!isBotAdmin) return;

      let query = "";
      const args = event.body.split(/\s+/);
      const command = args.shift();
      const inputQuery = args.join(" ");

      if (event.messageReply && event.messageReply.body) {
        query = event.messageReply.body;
      } else {
        query = inputQuery;
      }

      if (!query) {
        return message.reply(`⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗤𝗨𝗘𝗥𝗬\n───────────────\n» 📌 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗻𝗮𝗺𝗲 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘄𝗶𝘁𝗵 ${command}!`);
      }

      const waitMsg = await message.reply(`🔍 𝗦𝗘𝗔𝗥𝗖𝗛𝗜𝗡𝗚\n───────────────\n» 🌐 𝗤𝘂𝗲𝗿𝘆 : "${query}"\n» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...`);

      try {
        const apiUrl = await getBaseApiUrl();
        let videoID;
        let title;

        // --- [ 🌐 STEP 1: SEARCH ] ---
        const searchType = isAudio ? "music" : "video";
        const searchRes = await axios.get(`${apiUrl}/api/${searchType}/search?songName=${encodeURIComponent(query)}`);

        if (!searchRes.data || searchRes.data.length === 0) {
          return api.editMessage(`⚠️ 𝗡𝗢 𝗥𝗘𝗦𝗨𝗟𝗧𝗦 𝗙𝗢𝗨𝗡𝗗\n───────────────\n» ❌ 𝗡𝗼 𝗿𝗲𝘀𝘂𝗹𝘁𝘀 𝗳𝗼𝘂𝗻𝗱 𝗼𝗻 𝗬𝗼𝘂𝗧𝘂𝗯𝗲.`, waitMsg.messageID);
        }

        videoID = searchRes.data[0].id;
        title = searchRes.data[0].title;

        await api.editMessage(`🎬 𝗠𝗘𝗗𝗜𝗔 𝗙𝗢𝗨𝗡𝗗\n───────────────\n» 📌 𝗧𝗶𝘁𝗹𝗲 : ${title}\n» ⬇️ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 ${isAudio ? '𝗔𝘂𝗱𝗶𝗼' : '𝗩𝗶𝗱𝗲𝗼'}...`, waitMsg.messageID);

        // --- [ ⬇️ STEP 2: DOWNLOAD ] ---
        const format = isAudio ? "mp3" : "mp4";
        const downloadRes = await axios.get(`${apiUrl}/api/${searchType}/download?link=${videoID}&format=${format}`);
        const downloadLink = downloadRes.data.downloadLink;

        const cacheDir = path.join(process.cwd(), "cache");
        if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
        const filePath = path.join(cacheDir, `${isAudio ? 'audio' : 'video'}_${Date.now()}.${format}`);

        const response = await axios({
          method: "get",
          url: downloadLink,
          responseType: "stream"
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
          await api.unsendMessage(waitMsg.messageID).catch(() => {});
          await message.reply({
            body: `✅ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘\n───────────────\n» 📌 𝗧𝗶𝘁𝗹𝗲 : ${title}\n───────────────\n» 👑 𝗣𝗼𝘄𝗲𝗿 𝗯𝘆 : ×͜× ᵐⁱˡᵒⁿˣ⁷⁰`,
            attachment: fs.createReadStream(filePath),
          });
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });

      } catch (err) {
        console.error(err);
        api.editMessage(`❌ 𝗦𝗘𝗥𝗩𝗘𝗥 𝗘𝗥𝗥𝗢𝗥\n───────────────\n» ⚠️ 𝗗𝘂𝗲 𝘁𝗼 𝗵𝗶𝗴𝗵 𝘁𝗿𝗮𝗳𝗳𝗶𝗰 𝗼𝗿 𝗔𝗣𝗜 𝗱𝗼𝘄𝗻, 𝗳𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗽𝗿𝗼𝗰𝗲𝘀𝘀.\n» ⚙️ 𝗘𝗿𝗿𝗼𝗿 : ${err.message}`, waitMsg.messageID);
      }
    }
  },

  onStart: async function () {}
};
