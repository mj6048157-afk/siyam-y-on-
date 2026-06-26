const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// গিটহাব থেকে ডাইনামিকালি মেইন এপিআই নেওয়া (১ নম্বর API)
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

// ৫টি হাই-স্পিড এপিআই এর নতুন পাওয়ারফুল লিস্ট
const apiList = async () => {
  const base = await baseApiUrl();
  return [
    base,                                       // ১. গিটহাব থেকে আসা মেইন এপিআই
    "https://mahmudx7-api.vercel.app",          // ২. ভেরсел ব্যাকআপ এপিআই
    "https://api.sandipbaruwal.xyz",            // ৩. এক্সট্রা গ্লোবাল ব্যাকআপ এপিআই-১
    "https://api.samir.xyz",                    // ৪. এক্সট্রা গ্লোবাল ব্যাকআপ এপিআই-২
    "https://backup-api.example.com"            // ৫. ফাইনাল ইমার্জেন্সি ব্যাকআপ এপিআই
  ];
};

// এপিআই ফেইল হলে অটোমেটিক পরের এপিআই ট্রাই করার সুপার লজিক
async function fetchWithFallback(urlBuilder) {
  const apis = await apiList();
  let lastError;

  for (let base of apis) {
    try {
      const url = urlBuilder(base);
      const res = await axios.get(url, { timeout: 20000 }); // ২০ সেকেন্ড টাইমআউট
      if (res?.data) return res.data;
    } catch (e) {
      lastError = e;
    }
  }

  throw new Error(lastError ? lastError.message : "All 5 APIs failed to respond");
}

module.exports = {
  config: {
    name: "siyam2", // সম্পূর্ণ নতুন কমান্ড নেম
    aliases: [
      "sh", "siyam-boss", "play", "বক্স", "প্লে",
      "বট ভিডিও দাও", "ভিডিও দাও", "ভিডিও দে", 
      "bot video dao", "video dao", "video de"
    ], // আপনার দেওয়া নতুন বাংলা ও ইংরেজি মিক্সড ট্রিগার লিস্ট অ্যাড করা হলো
    version: "5.0.0",
    author: "SIYAM HASAN",
    countDown: 4,
    role: 0,
    description: {
      bn: "সিয়াম বসের স্পেশাল ৫-সার্ভার ইউটিউব ভিডিও ও অডিও ডাউনলোডার",
      en: "Siyam Boss's special 5-server YouTube media downloader"
    },
    category: "media"
  },

  onStart: async function ({ api, args, event }) {
    const { threadID, messageID } = event;
    const fullInput = args.join(" ").trim();

    if (!fullInput) {
      return api.sendMessage("👉 ব্যবহার করতে লিখুন:\n• siyam গান <গানের নাম>\n• siyam ভিডিও <ভিডিওর নাম>", threadID, messageID);
    }

    // ইউজার কি ভিডিও চাচ্ছে নাকি গান চাচ্ছে তা নিখুঁতভাবে ডিটেক্ট করা
    const lowerInput = fullInput.toLowerCase();
    let isVideo = true; // বাই-ডিফল্ট ভিডিও হিসেবে ধরবে
    
    if (lowerInput.startsWith("গান") || lowerInput.startsWith("song") || lowerInput.startsWith("music") || lowerInput.startsWith("mp3") || lowerInput.startsWith("অডিও")) {
      isVideo = false;
    }

    // ইনপুটের শুরু থেকে 'ভিডিও' বা 'গান' শব্দগুলো বাদ দিয়ে মূল নামটা ফিল্টার করা
    let searchQuery = fullInput.replace(/^(ভিডিও|video|গান|song|music|mp3|অডিও)\s+/i, "").trim();
    if (!searchQuery) searchQuery = fullInput; // যদি ফিল্টার করার পর কিছু না থাকে

    const type = isVideo ? "video" : "audio";
    const fileExt = isVideo ? "mp4" : "mp3";
    const textType = isVideo ? "ভিডিওটি" : "গানটি (MP3)";

    try {
      api.setMessageReaction("🔎", messageID, () => {}, true);

      // ১. ৫টি এপিআই এর সাহায্যে যেকোনো একটি থেকে সার্চ রেজাল্ট বের করা
      const searchData = await fetchWithFallback((base) =>
        `${base}/api/ytb/search?q=${encodeURIComponent(searchQuery)}`
      );

      const firstResult = searchData?.results?.[0] || searchData?.[0] || searchData?.data?.[0];

      if (!firstResult || (!firstResult.id && !firstResult.url)) {
        return api.sendMessage(`⭕ কোনো কিছু খুঁজে পাওয়া যায়নি: ${searchQuery}`, threadID, messageID);
      }

      // ভিডিও আইডি বা সরাসরি ইউআরএল এক্সট্রাক্ট করা
      const videoID = firstResult.id || firstResult.url;
      const title = firstResult.title || "YouTube Media";

      // প্রসেসিং নোটিশ পাঠানো
      api.sendMessage(`⏳ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂... ৫টি সিকিউর সার্ভার চেক করে আপনার ${textType} ডাউনলোড করা হচ্ছে। অপেক্ষা করুন বস...`, threadID, async (err, info) => {
        
        try {
          api.setMessageReaction("⬇️", messageID, () => {}, true);

          // ২. ডাউনলোড লিংক জেনারেট করার জন্য পুনরায় এপিআই রান করা
          const downloadData = await fetchWithFallback((base) =>
            `${base}/api/ytb/get?id=${encodeURIComponent(videoID)}&type=${type}`
          );

          const downloadLink = downloadData?.data?.downloadLink || downloadData?.downloadLink || downloadData?.url;
          if (!downloadLink) throw new Error("Download link could not be fetched from any API");

          const cacheDir = path.join(__dirname, "cache");
          fs.ensureDirSync(cacheDir);
          const filePath = path.join(cacheDir, `yt_${Date.now()}.${fileExt}`);

          // ৩. ডাউনলোড লিংক থেকে ফাইলটি বটের ক্যাশে স্ট্রীম করা
          const response = await axios({
            url: downloadLink,
            method: "GET",
            responseType: "stream",
            timeout: 60000 // বড় ফাইলের জন্য ৬০ সেকেন্ড টাইমআউট
          });

          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          // ৪. ওনার ক্রেডিট সহ মেসেঞ্জার গ্রুপে সেন্ড করা
          const caption = `👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 <b>🪄 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑</b>\n${title} (${isVideo ? "360p" : "128kbps"})`;

          await api.sendMessage(
            {
              body: caption,
              attachment: fs.createReadStream(filePath)
            },
            threadID,
            () => {
              fs.unlinkSync(filePath); // ক্যাশ ফাইল ডিলিট
              if (info?.messageID) api.unsendMessage(info.messageID); // লোডিং নোটিশ আনসেন্ড
              api.setMessageReaction("✅", messageID, () => {}, true);
            },
            messageID
          );

        } catch (downloadError) {
          console.error("Download Error Details:", downloadError.message);
          if (info?.messageID) api.unsendMessage(info.messageID);
          api.sendMessage(`❌ দুঃখিত বস, ৫টি ব্যাকআপ সার্ভার ট্রাই করার পরেও ফাইলটি ডাউনলোড করা সম্ভব হয়নি।`, threadID, messageID);
          api.setMessageReaction("❌", messageID, () => {}, true);
        }

      }, messageID);

    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ সবকয়টি এপিআই সার্ভার ব্যস্ত বা অফলাইন আছে। এরর: ${e.message}`, threadID, messageID);
    }
  }
};
