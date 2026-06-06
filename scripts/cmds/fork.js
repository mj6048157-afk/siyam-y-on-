,cmd install fork.js module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "link"],
    version: "4.2",
    author: "SIYAM",
    countDown: 3,
    role: 0,
    shortDescription: "GOAT BOT V2 Information",
    longDescription: "Shows GOAT BOT V2 information and contact details",
    category: "info",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, args, api }) {
    const validPasswords = ["19602", "24245653", "01608043961"];
    const userPassword = args[0];

    if (!userPassword)
      return message.reply("🔐 দয়া করে সিয়াম ভাই তোমার পার্সোনাল পাসওয়ার্ড দাও। উদাহরণ: fork 196122");

    if (!validPasswords.includes(userPassword))
      return message.reply("🖕এ মাদারচোদ বট তোর বাপের! 😌আবার চেষ্টা করো যদি সিয়াম বস হও 🤧");

    // লোডিং মেসেজ পাঠানো
    let loadingMsg = await message.reply("⏳ 𝗟𝗢𝗔𝗗𝗜𝗡𝗚 · 𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧.....");

    // ৩ সেকেন্ড ওয়েট করার পর লোডিং মেসেজটি ডিলিট হবে
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // মেসেজ ডিলিট করার চেষ্টা
    try {
      if (loadingMsg.unsend) {
        await loadingMsg.unsend();
      } else if (api && loadingMsg.messageID) {
        await api.unsendMessage(loadingMsg.messageID);
      }
    } catch (e) {
      console.error("Error deleting loading message:", e);
    }

    // মেইন ফর্ক তথ্য দেখানো
    return message.reply(`
╭━━━━━━━━━━━━━━━╮
🚀 𝐆𝐎𝐀𝐓 𝐁𝐎𝐓 ⚡ 𝐕𝟐 ⚡
╰━━━━━━━━━━━━━━━╯
👑 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 :
𓆩👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑𓆪
━━━━━━━━━━━━━━
📢 গুরুত্বপূর্ণ নোট 📢
🎬 আপাতত টাইটেল ভিডিও নেই।
⏳ পরবর্তীতে টাইটেল ভিডিও দেওয়া হবে।
📂 Fork-এর ভিতরে প্রয়োজনীয় ফাইল/রিসোর্স দেওয়া আছে।
🔍 সেগুলো দেখে নিজে ট্রাই করে নিতে পারেন।
💡 কোনো সমস্যা হলে অথবা সাহায্যের প্রয়োজন
🤗 হলে নিচে দেওয়া হোয়াটসঅ্যাপ
🛸 নাম্বার অথবা ফেসবুকে যোগাযোগ করুন।
🙏 ধন্যবাদ সবাইকে।
━━━━━━━━━━━━━━━
💎 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
𝐔𝐒𝐈𝐍𝐆 𝐆𝐎𝐀𝐓-𝐁𝐎𝐓 ⚡ 𝐕𝟐 ⚡
━━━━━━━━━━━━━━━
🔰 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐑𝐄𝐏𝐎 ➜ https://github.com/siyam-crypto/mdsiyam-God--Bot-v5.git

★━━━━━━━━━━━━━★
📱 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 : +8801789138157
⫷━━━━━━━━━━━━━⫸

🌐 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋
https://www.facebook.com/profile.php?id=100037154624637
`);
  }
};
