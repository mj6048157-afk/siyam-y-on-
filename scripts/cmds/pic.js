const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

if (!global.__PicCommandIndex) global.__PicCommandIndex = 0;

module.exports = {
  config: {
    name: "pic",
    aliases: ["পিক", "পিকদে", "পিআইসিদে", "পিপি", "পিপিদে", "প্রোফাইলপিক", "প্রোফাইলপিকদে"],
    version: "9.0.0",
    author: "SIYAM HASAN",
    countDown: 2,
    role: 0,
    shortDescription: "Sends unique sad images in a strict loop using prefix.",
    longDescription: "Strict prefix execution engine with precise stream management, loading screen, and auto loop.",
    category: "media",
    usePrefix: true, // 🔒 এখানে true করে দেওয়া হয়েছে, তাই প্রিফিক্স (/, !) ছাড়া কাজ করবে না
    guide: {
      en: "{p}{pn} অথবা প্রিফিক্স সহ নির্দিষ্ট অ্যালাইয়াস ব্যবহার করুন।"
    }
  },

  // 🚀 অনলি অনস্টার্টে রান হবে এবং প্রিফিক্স হ্যান্ডেল করবে, ডাবল মেসেজের কোনো সুযোগ নেই
  onStart: async function ({ api, event, message }) {
    let loadingMsg;
    try {
      loadingMsg = await api.sendMessage("⏳ সিয়াম বসের ক্লাউড সার্ভার থেকে ফটো ও ক্যাপশন লোড হচ্ছে...", event.threadID);
    } catch (e) {
      console.error("Loading message failed", e);
    }

    // 🖼️ আপনার দেওয়া সম্পূর্ণ ৮৫টি ফ্রেশ ইমেজ লিংক
    const images = [
      "https://i.imgur.com/yMHlG2M.jpeg", "https://i.imgur.com/IsdReUg.jpeg", "https://i.imgur.com/tvQTeBg.jpeg",
      "https://i.imgur.com/6ReF5in.jpeg", "https://i.imgur.com/ULizhYu.jpeg", "https://i.imgur.com/TVUrWN4.jpeg",
      "https://i.imgur.com/zQpxKFL.jpeg", "https://i.imgur.com/apHsoY6.jpeg", "https://i.imgur.com/HTqYZAE.jpeg",
      "https://i.imgur.com/vLZKvai.jpeg", "https://i.imgur.com/Efyiz36.jpeg", "https://i.imgur.com/jxR6bjp.jpeg",
      "https://i.imgur.com/2HIDgof.jpeg", "https://i.imgur.com/vc8GBZp.jpeg", "https://i.imgur.com/53Z761c.jpeg",
      "https://i.imgur.com/ZTbuzB8.jpeg", "https://i.imgur.com/BHAdsJb.jpeg", "https://i.imgur.com/GgD3RQX.jpeg",
      "https://i.imgur.com/djqJGu7.jpeg", "https://i.imgur.com/25bd3CO.jpeg", "https://i.imgur.com/9wAYXlX.jpeg",
      "https://i.imgur.com/AjJLkQt.jpeg", "https://i.imgur.com/looNcr0.jpeg", "https://i.imgur.com/SmkG7W5.jpeg",
      "https://i.imgur.com/CjpQDna.jpeg", "https://i.imgur.com/2Dirnet.jpeg", "https://i.imgur.com/2Gn9atP.jpeg",
      "https://i.imgur.com/alsMrX0.jpeg", "https://i.imgur.com/BDL5StG.jpeg", "https://i.imgur.com/VBN2ywg.jpeg",
      "https://i.imgur.com/S3Cz0R5.jpeg", "https://i.imgur.com/oN2yhWk.jpeg", "https://i.imgur.com/1zk8THI.jpeg",
      "https://i.imgur.com/KCh363E.jpeg", "https://i.imgur.com/LbvFeoE.jpeg", "https://i.imgur.com/RMBgjgE.jpeg",
      "https://i.imgur.com/7X8IlLl.jpeg", "https://i.imgur.com/PCLL5Vb.jpeg", "https://i.imgur.com/E8jFWkg.jpeg",
      "https://i.imgur.com/bCZGK41.jpeg", "https://i.imgur.com/ATW4RlF.jpeg", "https://i.imgur.com/i7QAcS6.jpeg",
      "https://i.imgur.com/fqAIYoY.jpeg", "https://i.imgur.com/8PebqwL.jpeg", "https://i.imgur.com/4ikszOp.jpeg",
      "https://i.imgur.com/aILaYMc.jpeg", "https://i.imgur.com/T6i2BZK.jpeg", "https://i.imgur.com/DDQ8bkK.jpeg",
      "https://i.imgur.com/XAgrwQ0.jpeg", "https://i.imgur.com/M0Ql5As.jpeg", "https://i.imgur.com/ViHoQW2.jpeg",
      "https://i.imgur.com/aCjWQ9f.jpeg", "https://i.imgur.com/qLOYImK.jpeg", "https://i.imgur.com/zoQyKRR.jpeg",
      "https://i.imgur.com/46Wehox.jpeg", "https://i.imgur.com/WQzGQa9.jpeg", "https://i.imgur.com/pfAZbQV.jpeg",
      "https://i.imgur.com/7SHR1Uu.jpeg", "https://i.imgur.com/vPqr70n.jpeg", "https://i.imgur.com/ldYbFkF.jpeg",
      "https://i.imgur.com/sQCuENR.jpeg", "https://i.imgur.com/YfznQtG.jpeg", "https://i.imgur.com/cnw6Tl5.jpeg",
      "https://i.imgur.com/DJsOvku.jpeg", "https://i.imgur.com/HgHHNHd.jpeg", "https://i.imgur.com/2tAqWtF.jpeg",
      "https://i.imgur.com/yrKYerh.jpeg", "https://i.imgur.com/7gYmuXt.jpeg", "https://i.imgur.com/BTomecr.jpeg",
      "https://i.imgur.com/Ap3OWrv.jpeg", "https://i.imgur.com/fEB6RjC.jpeg", "https://i.imgur.com/wXyIglJ.jpeg",
      "https://i.imgur.com/LMNzO0W.jpeg", "https://i.imgur.com/Cb29vyu.jpeg", "https://i.imgur.com/cPqkUUD.jpeg",
      "https://i.imgur.com/uPShUqZ.jpeg", "https://i.imgur.com/XbLEwth.jpeg", "https://i.imgur.com/2I76IWt.jpeg",
      "https://i.imgur.com/jEG6qxd.jpeg", "https://i.imgur.com/H6iNkGk.jpeg", "https://i.imgur.com/HPmZoox.jpeg",
      "https://i.imgur.com/daP3OMh.jpeg", "https://i.imgur.com/z0UTrDI.jpeg", "https://i.imgur.com/7LEAdQn.jpeg",
      "https://i.imgur.com/e1rM1qg.jpeg", "https://i.imgur.com/Lddd6j0.jpeg", "https://i.imgur.com/EMuwFk8.jpeg",
      "https://i.imgur.com/74hrAaM.jpeg", "https://i.imgur.com/IxsDwAj.jpeg", "https://i.imgur.com/OeVfYct.jpeg",
      "https://i.imgur.com/TYcGGR0.jpeg", "https://i.imgur.com/k57VlEZ.jpeg", "https://i.imgur.com/htKsgTQ.jpeg"
    ];

    // 📝 ৮৫টি আলাদা আলাদা প্রিমিয়াম ইমোশনাল ক্যাপশন ব্যাংক
    const captions = [
      "এক সময় ইনতিয়া আমার সবচেয়ে ভালো বেস্ট ফ্রেন্ড ছিল, অথচ আজ সে অচেনা কোনো মানুষের ভিড়ে হারিয়ে গেছে। 💔",
      "সিয়াম হয়তো সবার সামনে হাসে, কিন্তু বেস্ট ফ্রেন্ড ইনতিয়ার দেওয়া অবহেলাটা আজও তাকে ভেতরে ভেতরে কুঁড়ে খায়। 🥀",
      "সবচেয়ে কাছের বেস্ট ফ্রেন্ড যখন হাতটা ছেড়ে মাঝপথে চলে যায়, তখন ইনতিয়া নামের প্রতিটা স্মৃতি বিষাক্ত লাগে। 🍂",
      "ইনতিয়া, তুই তো শুধু একটা বন্ধু ছিলি না, ছিলি আমার পুরো পৃথিবী। আজ তুই ভালোই আছিস আমাকে একা ফেলে। 🕸️",
      "বেস্ট ফ্রেন্ড ডায়েরির পাতা থেকে আজ ইনতিয়ার নামটা মুছে গেছে ঠিকই, কিন্তু সিয়ামের মন থেকে আজও মোছেনি। 🩹",
      "ইনতিয়াকে নিজের চেয়েও বেশি বিশ্বাস করেছিলাম বেস্ট ফ্রেন্ড হিসেবে, কিন্তু সে প্রমাণ করে দিল দিনশেষে সবাই বদলে যায়। ⏳",
      "আজ সিয়ামের একাকীত্বের গল্পটা অনেক বড়, যেখানে একসময় ইনতিয়া নামের একটা প্রিয় বেস্ট ফ্রেন্ড ছিল। 🚪",
      "তুই তো চলে গেলি ইনতিয়া, কিন্তু বেস্ট ফ্রেন্ড হিসেবে কাটানো সেই পুরোনো দিনগুলো আজও আমার চোখে জল আনে। 🌪️",
      "নিয়তির কি নির্মম পরিহাস, যে ইনতিয়া একসময় সব সিক্রেট জানতো, আজ সে নিজেই একটা অতীত গল্প। 🕯️",
      "ইনতিয়া নামের অধ্যায়টা আজ বন্ধ, সিয়ামের জীবনে প্রিয় বেস্ট ফ্রেন্ডের জায়গাটা এখন শুধুই শূন্যতা। 🌌",
      "সবচেয়ে কাছের বেস্ট ফ্রেন্ড যখন বেইমানি করে চলে যায়, তখন নতুন করে কাউকে বিশ্বাস করার ক্ষমতা হারিয়ে যায়। 🖤",
      "ভালো থাকার অভিনয় করতে করতে আজ সিয়াম ক্লান্ত, কেউ বুঝল না অন্তরালের এই ভাঙা মনটা। 💔",
      "যার চলে যাওয়ার সে তো চলেই যায়, মাঝখান থেকে ফেলে যাওয়া স্মৃতিগুলো কাল হয়ে দাঁড়ায়। 🥀",
      "কিছু শূন্যতা কখনো পূরণ হয় না, কিছু স্মৃতি সারাজীবন কাঁদিয়ে যায়। 🖤",
      "আজকাল নিস্তব্ধ রাতগুলো বড্ড ভারী মনে হয়, যেন চারপাশটা কষ্টের চাদরে ঢাকা। 🌌",
      "ভালো রাখতে না পারো, অন্তত অবহেলার তীব্র বিষাক্ত তীরে কাউকে ক্ষতবিক্ষত করো না। 🏹",
      "হাসিমুখের আড়ালে লুকিয়ে থাকা কান্নাগুলো দেখার চোখ সবার থাকে না। 🎭",
      "স্মৃতিরা তখন বুক ফাটানো কান্নার কারণ হয়, যখন মানুষটা অতীত হয়ে যায়। 🕰️",
      "কাউকে অতিরিক্ত আগলে রাখতে নেই, দিনশেষে সে-ই সবচেয়ে বেশি অবহেলা করে। 💔",
      "নদীর ওপার ভাঙলে যেমন একুল গড়ে, মনের ওপার ভাঙলে শুধু দীর্ঘশ্বাসই পড়ে। 🌊",
      "চিৎকার করে কাঁদার চেয়ে, নীরবে এক ফোঁটা চোখের জল ফেলা অনেক বেশি কষ্টের। 💧",
      "ক্লান্ত আমি এই অভিনয়ের দুনিয়ায়, যেখানে প্রতিটা মানুষ মুখোশধারী। 🎭",
      "অपेक्षाটা তার জন্য করা যায়, যে অন্তত ফেরার তাগিদ অনুভব করে। ⏳",
      "পাবো না জেনেও কাউকে পাগলের মতো ভালোবেসে যাওয়াটাও এক অদ্ভুত নেশা। 🍂",
      "কিছু গল্প অসমাপ্ত থাকাই ভালো, সমাপ্তিটা বড্ড বেশি করুণ হয়। 📜",
      "যে হাতটা কখনো ছাড়বো না বলেছিল, আজ সে অন্য হাত ধরে দিব্যি সুখে আছে। 🤝",
      "অনুভূতিরা যখন মূল্যহীন হয়ে পড়ে, নীরবতাই তখন একমাত্র আশ্রয় হয়। 🤐",
      "কষ্টগুলো বুকের বাম পাশে চেপে রেখে হাসিমুখে বেঁচে থাকাটাই এক যুদ্ধ। 🛡️",
      "আজ ডায়েরির প্রতিটা ছেঁড়া পাতায় লুকিয়ে আছে কোনো এক অপ্রকাশিত কান্না। 📖",
      "মানুষ কখনো মরে না, মরে যায় তার ভেতরে থাকা নিষ্পাপ অনুভূতিগুলো। 🥀",
      "যদি জানতে তোমাকে কতটা চেয়েছিলাম, তবে এভাবে মাঝপথে ফেলে যেতে পারতে না। 👣",
      "হারিয়ে ফেলার ভয় যাকে পেতাম, আজ তাকে হারানোর পর আর কোনো ভয় অবশিষ্ট নেই। 🌪️",
      "যার মনটা পরিষ্কার থাকে, দিনশেষে তার কপালটাই সবচেয়ে বেশি খারাপ হয়। 💔",
      "সময়ের সাথে সাথে পরিস্থিতি বদলায়, আর পরিস্থিতির সাথে সাথে চেনা মানুষগুলো। 🎭",
      "একাকীত্ব এখন আমার সেরা বন্ধু, অন্তত কেউ মাঝপথে ছেড়ে চলে যাওয়ার ভয় দেখায় না। 🌌",
      "তুমি তো ভালোই আছ নতুন কাউকে নিয়ে, শুধু আমিই পারলাম না তোমাকে ভুলতে। 🕯️",
      "যে চোখের ভাষা বুঝতে পারে না, তাকে হাজার লাইনের গল্প শুনিয়েও লাভ নেই। 📝",
      "ইচ্ছে করলেই কি আর সবকিছু ভুলে যাওয়া যায়? স্মৃতিরা তো বুকের ভেতর বাসা বাঁধে। 🕸️",
      "ভালো থাকার কোনো শর্টকাট রাস্তা নেই, বিশেষ করে ভাঙা মন নিয়ে। 🩹",
      "কিছু মানুষ জীবনে আসে শুধু এটা শেখাতে যে, কাউকে অন্ধের মতো বিশ্বাস করতে নেই। 🚷",
      "হৃদয়ের ক্ষতগুলো যদি বাইরে থেকে দেখা যেত, তবে সবাই ফুঁপিয়ে কেঁদে উঠতো। 🩸",
      "মন ভাঙার শব্দ যদি শোনা যেত, তবে এই পৃথিবীটা চিৎকারে বধির হয়ে যেত। 🔊",
      "সবচেয়ে বেশি কষ্ট তখন হয়, যখন নিজের আপন মানুষটাই পর সেজে অভিনয় করে। 👥",
      "যার জন্য পুরো দুনিয়া ছাড়তে রাজি ছিলাম, আজ সে অন্য কারো জন্য আমাকে ছেড়ে দিল। 🚪",
      "ক্ষমা তো বারবার করা যায়, কিন্তু ভেঙে যাওয়া বিশ্বাস আর কখনো জোড়া লাগে না। 🛠️",
      "আজ আমি নিজের কাছেই নিজে অচেনা, কার জন্য নিজেকে এতটা শেষ করলাম? 🔎",
      "ভালোবাসার শেষ পরিণতি যদি শুধুই চোখের জল হয়, তবে কেন মানুষ ভালোবাসে? 🌧️",
      "যে হারিয়ে যায় সে ফিরে আসে, কিন্তু যে বদলে যায় সে আর কখনো আগের মতো হয় না। ⏳",
      "কিছু রাত কাটে ঘুমের ঘোরে, আর কিছু রাত কাটে পুরনো মেসেজ পড়ে। 📱",
      "আঘাতটা যখন খুব কাছের মানুষ দেয়, তখন তীব্র চিৎকারও গলার কাছে আটকে যায়। 🤐",
      "খুব ইচ্ছে করে সবকিছু ভুলে আবার নতুন করে বাঁচতে, কিন্তু স্মৃতিরা পিছু ছাড়ে না। 🕸️",
      "দিনশেষে সবাই নিজের ভালোটা বোঝে, শুধু আমিই পারলাম না স্বার্থপর হতে। 🥀",
      "যাকে ভেবে সারারাত জাগি, সে হয়তো অন্য কারো স্বপ্নে বিভোর হয়ে ঘুমায়। 🛌",
      "তুমি সুখী হও, আমার এই ভাঙা হৃদয়ের প্রতিটা টুকরো থেকে এই প্রার্থনাই রইল। 🤲",
      "অবহেলার চেয়ে বড় কোনো আঘাত নেই, এটা জীবন্ত মানুষকে ভেতর থেকে মেরে ফেলে। 🔥",
      "যে পাখি খাঁচা ভেঙে উড়ে যায়, তাকে আকাশ দিলেও সে আর কখনো ফিরে আসে না। 🦅",
      "আজ শূন্য পকেটের চেয়েও বেশি শূন্য লাগে আমার এই ভাঙা বুকটা। 🕳️",
      "সবাই বলে সময় সব ক্ষত সারিয়ে দেয়, কিন্তু সত্যি বলতে সময় শুধু সহ্য করা শিখিয়ে দেয়। ⏳",
      "কিছু কথা না বলাই থেকে যাক, সব কথা প্রকাশ পেলে গল্পের সৌন্দর্য নষ্ট হয়ে যায়। 🤫",
      "আজ আমার নীরবতাই আমার প্রতিবাদের ভাষা, কারণ কথা বলার যোগ্যতা হারিয়েছি। 🗣️",
      "ভুল মানুষের পেছনে সময় নষ্ট করার চেয়ে, একাকীত্ব নিয়ে বেঁচে থাকা অনেক ভালো। 🚶",
      "আয়নার সামনে দাঁড়িয়ে আজ নিজেকেই প্রশ্ন করলাম—তুই এত বোকা কেন ছিলি? 🪞",
      "তুমি তো চলে গেলে অবলীলায়, কিন্তু আমার এই দীর্ঘশ্বাসের হিসাব কে দেবে? 🧮",
      "আজ রাতের আকাশটা বড্ড মেঘলা, ঠিক আমার এই মেঘে ঢাকা মনের মতো। ☁️",
      "ভালোবাসা মানে যদি শুধুই বিচ্ছেদ হয়, তবে ঈশ্বর কেন এই অনুভূতির সৃষ্টি করলেন? 🏛️",
      "যে ধোঁকা দেয় সে হয়তো জিতে যায়, কিন্তু যে ধোঁকা খায় সে অনেক কিছু শিখে যায়। 🎓",
      "আজ হৃদয়ের ক্যানভাসে শুধুই ধূসর রঙ, কোনো রঙিন স্মৃতির আর অস্তিত্ব নেই। 🎨",
      "কষ্টগুলো নদীর মতো, বাইরে থেকে শান্ত দেখালেও ভেতরে তীব্র স্রোত বয়ে চলে। 🌊",
      "সবাই চলে যায়, শুধু ফেলে যাওয়া দীর্ঘশ্বাস আর চোখের জল বিশ্বস্ত হয়ে পাশে থাকে। 💧",
      "তুমি তো ভুলে গেছ সেকেন্ডের মধ্যে, আর আমি বছরের পর বছর ধরে চেষ্টা করে যাচ্ছি। 🗓️",
      "আজকের পর আর কোনোদিন তোমার পথ চেয়ে বসে থাকবো না, আলবিদা। 🚪",
      "অতিরিক্ত মায়া মানুষকে পঙ্গু করে দেয়, আজ মায়ার জালে ফেঁসে আমি নিজেই শেষ। 🕸️",
      "শেষ পাতাটা বড্ড করুণ ছিল আমাদের গল্পের, যেখানে আমরা দুজনেই আজ অচেনা। 🍂",
      "ভালো থেকো প্রিয়, তোমার দেওয়া প্রতিটা আঘাত বুকে নিয়ে আমি নাহয় একাই চলবো। 🖤"
    ];

    // 🔄 লুপ ট্র্যাকার হ্যান্ডেলিং
    let currentIndex = global.__PicCommandIndex;
    if (currentIndex >= images.length || currentIndex < 0) {
      currentIndex = 0;
    }

    const currentImage = images[currentIndex];
    const currentCaption = captions[currentIndex];

    // পরবর্তী এক্সিকিউশনের জন্য ইনডেক্স সেট করা (শেষ হলে আবার ০ হবে)
    global.__PicCommandIndex = (currentIndex + 1) % images.length;

    const cacheDir = path.join(__dirname, "cache");
    const uniqueFileName = `pic_prefix_${Date.now()}.jpg`;
    const filePath = path.join(cacheDir, uniqueFileName);

    try {
      await fs.ensureDir(cacheDir);

      // 📥 ডাটা স্ট্রিমিং ও বাফার রাইটিং
      const response = await axios.get(currentImage, { responseType: "arraybuffer", timeout: 15000 });
      await fs.writeFile(filePath, Buffer.from(response.data, "utf-8"));

      // আগের লোডিং টেক্সট সফলভাবে রিমুভ করা
      if (loadingMsg && loadingMsg.messageID) {
        try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
      }

      // মূল রেসপন্স ডেলিভারি করা
      await message.reply({
        body: `[সাফল্য নং: ${currentIndex + 1}/৮৫]\n\n${currentCaption}`,
        attachment: fs.createReadStream(filePath)
      });

      // 🧹 মেমোরি ক্যাশ ক্লিনআপ (১ সেকেন্ড ডিলে সেফটিসহ)
      setTimeout(async () => {
        if (await fs.pathExists(filePath)) await fs.unlink(filePath);
      }, 1000);

    } catch (err) {
      console.error("Prefix Pic Engine Error:", err);
      
      if (loadingMsg && loadingMsg.messageID) {
        try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
      }

      if (await fs.pathExists(filePath)) await fs.unlink(filePath);

      // নেটওয়ার্ক ফেইল হলে যাতে সিয়াম ভাই লুপে আটকে না থাকে, পরের ট্রিগারে পরের ফাইল লোড হবে
      return message.reply(`❌ ফেসবুক বা বাফারিং সমস্যার কারণে ${currentIndex + 1} নম্বর ইমেজটি স্কিপ হয়েছে। সিয়াম ভাই, দয়া করে আবার ট্রাই করুন!`);
    }
  }
};
