const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
    );
    return res.data.mahmud;
  } catch (e) {
    return "https://default-api.example.com";
  }
};

const apiList = async () => {
  const base = await baseApiUrl();
  return [
    base,
    "https://mahmudx7-api.vercel.app",
    "https://backup-api.example.com"
  ];
};

async function fetchWithFallback(urlBuilder) {
  const apis = await apiList();

  for (let base of apis) {
    try {
      const url = urlBuilder(base);
      const res = await axios.get(url, { timeout: 15000 });
      if (res?.data) return res.data;
    } catch (e) {}
  }

  throw new Error("All APIs failed");
}

// ভিডিও সরাসরি ডাউনলোড করার জন্য একটি হেল্পার ফাংশন
async function downloadAndSendVideo({ videoID, title, api, threadID, messageID }) {
  const data = await fetchWithFallback((base) =>
    `${base}/api/ytb/get?id=${videoID}&type=video`
  );

  const downloadLink = data?.data?.downloadLink;
  const videoTitle = data?.data?.title || title;

  if (!downloadLink) throw new Error("Download link not found");

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const filePath = path.join(cacheDir, `yt_${Date.now()}.mp4`);

  const response = await axios({
    url: downloadLink,
    method: "GET",
    responseType: "stream",
    timeout: 30000 // বড় ফাইলের জন্য টাইমআউট বাড়ানো হলো
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      api.sendMessage(
        {
          body: `👑𝗕𝗢𝗧 𝗢𝗪𝗡ＥＲ 🪄 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑 \n${videoTitle}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          try { fs.unlinkSync(filePath); } catch {}
          resolve();
        },
        messageID
      );
    });

    writer.on("error", (err) => {
      try { fs.unlinkSync(filePath); } catch {}
      reject(err);
    });
  });
}

module.exports = {
  config: {
    name: "ytb",
    aliases: ["youtube", "yt", "ytb2", "ভিডিও", "ভিডিও দাও", "video", "video দাও"], 
    version: "2.5",
    author: "Siyam Hasan",
    countDown: 6,
    role: 0,
    description: {
      bn: "YouTube ভিডিও সার্চ ও ডাউনলোড (সরাসরি ভিডিও বা মেনু সিস্টেম)",
      en: "YouTube search & download system (Direct video or menu system)"
    },
    category: "media"
  },

  langs: {
    bn: {
      error: "❌ সমস্যা: %1",
      noResult: "⭕ কিছু পাওয়া যায়নি: %1",
      choose: "📌 নাম্বার দিয়ে রিপ্লাই করো:\n\n%1",
      downloading: "⬇️ ডাউনলোড হচ্ছে: %1 - %2"
    }
  },

  onStart: async function ({ api, args, event, getLang }) {
    const { threadID, messageID, senderID } = event;
    let input = args.join(" ").trim();

    // ইউজার কোন কি-ওয়ার্ড দিয়ে কমান্ড ট্রিগার করেছে তা বের করা
    const bodyText = event.body.toLowerCase();
    
    // ভিডিও দাও / ভিডিও দে / ভিডিও / video ইত্যাদি ম্যাচ করার কাস্টম লজিক
    const directDownloadPattern = /^(ভিডিও\s*দাও|ভিডিও\s*দে|ভিডিও|video\s*daw|video\s*de|video)\s*(.*)/i;
    const match = bodyText.match(directDownloadPattern);

    let isDirect = false;
    if (match) {
      isDirect = true;
      input = match[2].trim(); // কি-ওয়ার্ড বাদে শুধু গানের নামটুকু আলাদা করা হলো
    }

    if (!input) {
      return api.sendMessage("👉 ব্যবহার: ytb song name অথবা ভিডিও [গানের নাম]", threadID, messageID);
    }

    const usedCommand = event.body.split(" ")[0].toLowerCase();
    const isYtb2 = usedCommand.includes("ytb2");

    try {
      api.setMessageReaction("🔎", messageID, () => {}, true);

      const data = await fetchWithFallback((base) =>
        `${base}/api/ytb/search?q=${encodeURIComponent(input)}`
      );

      const results = data?.results?.slice(0, 6);

      if (!results?.length) {
        return api.sendMessage(getLang("noResult", input), threadID, messageID);
      }

      // 🚀 সরাসরি ডাউনলোড মোড (যদি ইউজার "ভিডিও দাও/দে" বলে থাকে)
      if (isDirect) {
        const firstVideo = results[0];
        // লোডিং মেসেজ পাঠানো হচ্ছে
        const loadingMsg = await new Promise((resolve) => {
          api.sendMessage(`📥 "${firstVideo.title}" ভিডিওটি ডাউনলোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।`, threadID, (err, info) => resolve(info), messageID);
        });

        try {
          api.setMessageReaction("⬇️", messageID, () => {}, true);
          await downloadAndSendVideo({
            videoID: firstVideo.id,
            title: firstVideo.title,
            api,
            threadID,
            messageID
          });
          
          // সফলভাবে ডাউনলোড হলে লোডিং মেসেজটি আনসেন্ড করে দেওয়া হবে
          if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
        } catch (downloadError) {
          if (loadingMsg?.messageID) api.unsendMessage(loadingMsg.messageID);
          return api.sendMessage(`❌ সরাসরি ডাউনলোড ব্যর্থ হয়েছে: ${downloadError.message}`, threadID, messageID);
        }
        return;
      }

      // 📋 আগের মতো সাধারণ মেনু মোড (ytb / ytb2 এর জন্য)
      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);

      let msg = "";
      let attachments = [];

      if (!isYtb2) {
        const thumbs = await Promise.all(
          results.map(async (r, i) => {
            try {
              const thumbPath = path.join(
                cacheDir,
                `thumb_${senderID}_${Date.now()}_${i}.jpg`
              );

              const res = await axios.get(r.thumbnail, {
                responseType: "arraybuffer",
                timeout: 10000
              });

              fs.writeFileSync(thumbPath, Buffer.from(res.data));
              return fs.createReadStream(thumbPath);
            } catch {
              return null;
            }
          })
        );
        attachments = thumbs.filter(Boolean);
      }

      results.forEach((r, i) => {
        msg += `${i + 1}. ${r.title}\n⏱ ${r.time}\n\n`;
      });

      return api.sendMessage(
        {
          body: `📌 নাম্বার দিয়ে রিপ্লাই করো:\n\n${msg}`,
          attachment: attachments.length ? attachments : undefined
        },
        threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: senderID,
            results,
            menuMsgID: info.messageID
          });
        },
        messageID
      );

    } catch (e) {
      return api.sendMessage(`❌ API সমস্যা: ${e.message}`, threadID, messageID);
    }
  },

  onReply: async function ({ event, api, Reply }) {
    const { results, author, menuMsgID } = Reply;

    if (event.senderID !== author) return;

    const choice = parseInt(event.body);
    if (!choice || choice < 1 || choice > results.length) return;

    const selectedVideo = results[choice - 1];

    try {
      api.setMessageReaction("⬇️", event.messageID, () => {}, true);

      try {
        if (menuMsgID) api.unsendMessage(menuMsgID);
      } catch {}

      // মেনু থেকে সিলেক্ট করার পরও হেল্পার ফাংশন দিয়ে ভিডিও পাঠানো হচ্ছে
      await downloadAndSendVideo({
        videoID: selectedVideo.id,
        title: selectedVideo.title,
        api,
        threadID: event.threadID,
        messageID: event.messageID
      });

    } catch (e) {
      api.sendMessage(`❌ সমস্যা: ${e.message}`, event.threadID, event.messageID);
    }
  }
};
