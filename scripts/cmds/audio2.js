const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "media",
    aliases: ["audio1", "audio2", "watch1", "watch2"],
    version: "5.5.0",
    author: "Milon",
    countDown: 5,
    role: 0, // 0 = সাধারণ ইউজারসহ সবাই ব্যবহার করতে পারবে 
    category: "media",
    usePrefix: false 
  },

  /* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
  * 🤖 BOT NAME: MILON BOT
  * 👤 OWNER: MILON HASAN 
  * 📍 LOCATION: NARAYANGANJ, BANGLADESH
  * 🛠️ PROJECT: MILON BOT PROJECT (2026)
  * --------------------------------------- */

  onChat: async function ({ api, event, message }) {
    if (!event.body) return;
    const body = event.body.toLowerCase().trim();

    // কমান্ডের ট্রিগার চেক
    const isAudio = body.startsWith("audio1") || body.startsWith("audio2");
    const isVideo = body.startsWith("watch1") || body.startsWith("watch2");

    if (isAudio || isVideo) {
      let query = "";
      
      // মূল ইনপুট টেক্সট বের করা
      const args = event.body.split(/\s+/);
      const commandUsed = args.shift(); // প্রথম শব্দ (কমান্ড) বাদ দেওয়া হলো
      const inputQuery = args.join(" ").trim();

      // --- [ 🔄 REPLY LOGIC ] ---
      if (event.messageReply && event.messageReply.body) {
        query = event.messageReply.body.trim();
      } else {
        query = inputQuery;
      }

      // যদি গান বা ভিডিওর নাম না থাকে
      if (!query) {
        return message.reply(`❌ মামা, গানের নাম দাও অথবা কোনো মেসেজে রিপ্লাই দিয়ে ${commandUsed} লেখো!`);
      }

      const waitMsg = await message.reply(`🔍 Searching for "${query}"...\n⏳ Please wait...`);

      try {
        // --- [ 🌐 STEP 1: YOUTUBE SEARCH ] ---
        // সার্চের জন্য ২টি এপিআই ব্যাকআপ রাখা হলো
        let searchRes;
        try {
          searchRes = await axios.get(`https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`);
        } catch(e) {
          searchRes = await axios.get(`https://samirxpikachu.onrender.com/youtube?search=${encodeURIComponent(query)}`);
        }

        const data = searchRes.data[0] || searchRes.data.results?.[0];
        if (!data || !data.url) {
          return api.editMessage("⚠️ No results found on YouTube. একটু অন্য নাম দিয়ে চেষ্টা করো!", waitMsg.messageID);
        }

        const ytUrl = data.url;
        const title = data.title || "YouTube Media";
        await api.editMessage(`🎬 Found: ${title}\n⬇️ Downloading ${isAudio ? 'Audio' : 'Video'}...`, waitMsg.messageID);

        const cacheDir = path.join(process.cwd(), "cache");
        if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
        const filePath = path.join(cacheDir, `${isAudio ? 'audio' : 'video'}_${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`);

        let downloadUrl = null;

        // --- [ 🎶 MULTI-API FALLBACK LOGIC ] ---
        if (isAudio) {
          // অডিওর জন্য ৩টি ব্যাকআপ এপিআই ট্রাই করবে
          try {
            const res1 = await axios.get(`https://yt-mp3-imran.vercel.app/api?url=${encodeURIComponent(ytUrl)}`);
            downloadUrl = res1.data.downloadUrl;
          } catch (e) {
            try {
              const res2 = await axios.get(`https://mahabub-apis.fun/mahabub/ytmp3v2?url=${encodeURIComponent(ytUrl)}`);
              downloadUrl = res2.data.data.link;
            } catch (e2) {
              const res3 = await axios.get(`https://sandipbaruwal.onrender.com/ytdl?url=${encodeURIComponent(ytUrl)}`);
              downloadUrl = res3.data.audio;
            }
          }
        } else {
          // ভিডিওর জন্য ৩টি ব্যাকআপ এপিআই ট্রাই করবে
          try {
            const res1 = await axios.get(`https://yt-api-imran.vercel.app/api?url=${encodeURIComponent(ytUrl)}`);
            downloadUrl = res1.data.downloadUrl;
          } catch (e) {
            try {
              const res2 = await axios.get(`https://mahabub-apis.fun/mahabub/ytmp4?url=${encodeURIComponent(ytUrl)}`);
              downloadUrl = res2.data.formats.find(f => f.quality === "360p")?.url || res2.data.formats[0].url;
            } catch (e2) {
              const res3 = await axios.get(`https://sandipbaruwal.onrender.com/ytdl?url=${encodeURIComponent(ytUrl)}`);
              downloadUrl = res3.data.video;
            }
          }
        }

        if (!downloadUrl) throw new Error("All APIs are down.");

        // --- [ ⬇️ STEP 2: DOWNLOAD & SEND ] ---
        const response = await axios({ method: "get", url: downloadUrl, responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
          await api.unsendMessage(waitMsg.messageID).catch(() => {});
          await message.reply({
            body: `⬇️ 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝘾𝙊𝙈𝙋𝙇𝙀𝙏𝙀 ⬇️\n\n📌 𝙏𝙞𝙩𝙡𝙚: ${title}\n\n⚡ 𝙋𝙊𝙒𝙀𝙍 𝘽𝙔 𝙈𝙄𝙇𝙊𝙉 𝘽𝙊𝙏 ⚡`,
            attachment: fs.createReadStream(filePath),
          });
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });

        writer.on("error", (err) => {
          throw err;
        });

      } catch (err) {
        console.error(err);
        api.editMessage(`❌ দুঃখিত মামা! সবকয়টি সার্ভার/এপিআই এই মুহূর্তে ব্যস্ত আছে। পরে আবার চেষ্টা করো।`, waitMsg.messageID);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
  },

  onStart: async function () {} 
};
