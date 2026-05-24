// 😼 Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 😼
// ⚠️ নাম চেঞ্জ করলে ফাইল নষ্ট হয়ে যাবে ভাই 😾

const AUTHOR_LOCK = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

if (AUTHOR_LOCK !== "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") {
  throw new Error("😾 Author Lock Broken!");
}

module.exports = {
  config: {
    name: "uns",
    version: "1.0",
    author: AUTHOR_LOCK,
    countDown: 0,
    role: 0,
    shortDescription: "Auto trigger + unsend",
    longDescription: "No prefix trigger system",
    category: "system",
    guide: "No Prefix"
  },

  // ⚡ Empty onStart Fix
  onStart: async function () {},

  // ⚡ No Prefix System
  onChat: async function ({ api, event }) {
    try {
      const { threadID, messageID, body, messageReply } = event;

      if (!body || typeof body !== "string") return;

      // 🔥 শুধু একদম একা ট্রিগার হলে কাজ করবে
      const text = body.trim();

      // 🔥 Bot Message Reply = Auto Delete
      if (
        messageReply &&
        messageReply.senderID == api.getCurrentUserID()
      ) {
        try {
          await api.unsendMessage(messageReply.messageID);
        } catch (e) {}
      }

      // 🔥 Separate Exact Triggers Only

      if (/^s$/i.test(text)) {
        return api.sendMessage(
          "🙄হায়রে ডিলিট কইরা দিলি ☹️",
          threadID,
          messageID
        );
      }

      if (/^siyam$/i.test(text)) {
        return api.sendMessage(
          "👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
          threadID,
          messageID
        );
      }

      if (/^u$/i.test(text)) {
        return api.sendMessage(
          "😹আমার বস সিয়াম 😻",
          threadID,
          messageID
        );
      }

      if (/^un$/i.test(text)) {
        return api.sendMessage(
          "ডিলেট সম্পন্ন ✅",
          threadID,
          messageID
        );
      }

    } catch (err) {
      console.log(err);
    }
  }
};
