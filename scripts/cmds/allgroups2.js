const fs = require("fs");
const path = require("path");

// স্মার্ট লোকাল ডাটাবেস পাথ (বটের মেইন ডিরেক্টরিতে সেভ হবে)
const dbPath = path.join(__dirname, "banned_groups.json");

// ডাটাবেস ফাইল চেক এবং রিড করার ফাংশন
function getBannedGroups() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } catch (e) {
    return [];
  }
}

// ডাটাবেসে সেভ করার ফাংশন
function saveBannedGroups(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "allgroups2",
    version: "2.0.0",
    role: 2, // শুধুমাত্র বট অ্যাডমিনদের জন্য
    author: "Milon & Gemini",
    description: "স্মার্ট গ্রুপ কন্ট্রোলার: গ্রুপ টোটাল ব্লক/ব্যান এবং ম্যানেজমেন্ট সিস্টেম।",
    category: "admin",
    guide: "{pn} অথবা {pn} banlist",
    countDown: 3
  },

  // 🛡️ স্মার্ট গ্লোবাল লিসেনার (গ্রুপের প্রতিটা মেসেজ/কমান্ড রিয়েল-টাইমে স্ক্যান করবে)
  onChat: async function ({ api, event }) {
    if (!event.isGroup || !event.body) return;

    const bannedList = getBannedGroups();
    // যদি বর্তমান গ্রুপটি ব্যান তালিকায় থাকে
    const isBanned = bannedList.some(g => g.id === event.threadID);

    if (isBanned) {
      const prefix = global.GoatBot?.config?.prefix || "/";
      
      // গ্রুপের কেউ বটের কোনো কমান্ড বা প্রিফিক্স ব্যবহার করার চেষ্টা করলেই লক নোটিফিকেশন দেবে
      if (event.body.startsWith(prefix)) {
        try {
          // গ্রুপের বর্তমান নাম জানার চেষ্টা
          const threadInfo = await api.getThreadInfo(event.threadID);
          const groupName = threadInfo.threadName || "এই গ্রুপটি";

          return api.sendMessage(
            `🚫 **[গ্রুপ লক নোটিফিকেশন]**\n\n` +
            `🔹 গ্রুপ: "${groupName}"\n` +
            `⚠️ স্ট্যাটাস: টোটাল ব্লক/ব্যান করা হয়েছে।\n\n` +
            `❌ এই গ্রুপে বটের কোনো প্রকার কমান্ড, এআই (AI), অটো-রিপ্লাই বা বট অ্যাডমিন কমান্ড কাজ করবে না। আনব্যান করতে বট অ্যাডমিনের সাথে যোগাযোগ করুন।`,
            event.threadID,
            event.messageID
          );
        } catch (e) {
          // যদি threadInfo এরর দেয় তবুও মেসেজ লক করে দেবে
          return api.sendMessage(`🚫 এই গ্রুপটি বর্তমানে টোটাল ব্যান/ব্লক অবস্থায় আছে। বটের কোনো কমান্ড এখানে চলবে না।`, event.threadID, event.messageID);
        }
      }
    }
  },

  // 🚀 মেইন কমান্ড স্টার্ট
  onStart: async function ({ api, event, message, args }) {
    const bannedList = getBannedGroups();

    // 📌 অপশন ১: ব্যানলিস্ট দেখা (allgroups banlist)
    if (args[0] && args[0].toLowerCase() === "banlist") {
      if (bannedList.length === 0) {
        return message.reply("💡 বর্তমানে কোনো গ্রুপ টোটাল ব্লক বা ব্যান তালিকায় নেই।");
      }

      let bannedMsg = "🚫 **টোটাল ব্লক করা গ্রুপসমূহের তালিকা:**\n\n";
      let bannedGroups = [];
      let i = 1;

      for (const group of bannedList) {
        bannedMsg += `${i++}. 🏷️ নাম: ${group.name}\n🆔 ID: ${group.id}\n📅 তারিখ: ${group.date}\n\n`;
        bannedGroups.push(group.id);
      }

      return message.reply(bannedMsg + '👉 এই মেসেজে "unban <নম্বর>" রিপ্লাই দিয়ে গ্রুপটি আনব্যান করতে পারবেন।', (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          groupid: bannedGroups,
          type: "unban_action"
        });
      });
    }

    // 📌 অপশন ২: সক্রিয় সব গ্রুপের লিস্ট দেখানো
    try {
      let threadList = await api.getThreadList(70, null, ["INBOX"]);
      let list = threadList.filter(group => group.isSubscribed && group.isGroup);
      
      let msg = "👥 **বটের সক্রিয় গ্রুপসমূহের তালিকা:**\n\n";  
      let groupid = [];  
      let i = 1;  

      for (const group of list) {  
        msg += `${i++}. 👥 ${group.name || "Unknown Group"}\n🆔 ID: ${group.threadID}\n👥 মেম্বার: ${group.participantIDs.length} জন\n\n`;  
        groupid.push({ id: group.threadID, name: group.name || "Unknown Group" });  
      }  

      if (groupid.length === 0) return message.reply("বট বর্তমানে কোনো সক্রিয় গ্রুপে নেই।");

      return message.reply(msg + '👉 অ্যাকশন নিতে রিপ্লাই দিন:\n▶ "out <নম্বর>" (লিভ নিতে)\n▶ "ban <নম্বর>" (টোটাল ব্লক করতে)', (err, info) => {  
        global.GoatBot.onReply.set(info.messageID, {  
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          groupid,
          type: "group_action"
        });  
      });
    } catch (e) {
      return message.reply("❌ ফেসবুক এপিআই থেকে গ্রুপের লিস্ট লোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
    }
  },

  // 🔄 রিপ্লাই হ্যান্ডলার (অ্যাকশন নেওয়ার জন্য)
  onReply: async function ({ api, event, Reply, message }) {
    const { author, groupid, type } = Reply;
    if (event.senderID != author) return;

    const args = event.body.split(" ");  
    const action = args[0].toLowerCase();  
    const index = parseInt(args[1]) - 1;  
    
    // 🔓 ব্যানলিস্ট থেকে আনব্যান করা
    if (type === "unban_action" && action === "unban") {
      const targetID = groupid[index];
      if (!targetID) return message.reply("❌ সঠিক সিরিয়াল নম্বর দিন।");

      let bannedList = getBannedGroups();
      const updatedList = bannedList.filter(g => g.id !== targetID);
      saveBannedGroups(updatedList);

      // ওই গ্রুপে সচল হওয়ার মেসেজ পাঠানো
      try {
        await api.sendMessage("✅ **[আনলক নোটিফিকেশন]**\n\nএই গ্রুপটি বট অ্যাডমিন কর্তৃক আনব্যান করা হয়েছে। বটের সকল এআই, অটো-রিপ্লাই এবং কমান্ড এখন থেকে আবার কাজ করবে।", targetID);
      } catch (e) {}

      return message.reply(`✅ গ্রুপ (ID: ${targetID}) সফলভাবে আনব্যান করা হয়েছে এবং সেখানে নোটিফিকেশন পাঠানো হয়েছে।`);
    }

    // ⚙️ মেইন লিস্ট থেকে আউট বা ব্যান করা
    if (type === "group_action") {
      const targetGroup = groupid[index];
      if (!targetGroup) return message.reply("❌ সঠিক সিরিয়াল নম্বর দিন।");

      // ১. লিভ নেওয়ার অপশন
      if (action === "out") {  
        try {  
          await api.removeUserFromGroup(api.getCurrentUserID(), targetGroup.id);  
          return message.reply(`👋 সফলভাবে "${targetGroup.name}" গ্রুপ থেকে বের হয়ে গেছি।`);  
        } catch (e) {  
          return message.reply("❌ গ্রুপ থেকে লিভ নিতে সমস্যা হচ্ছে।");  
        }  
      }  

      // ২. টোটাল লক/ব্যান করার অপশন
      if (action === "ban") {  
        let bannedList = getBannedGroups();
        
        // অলরেডি ব্যানড কি না চেক
        if (bannedList.some(g => g.id === targetGroup.id)) {
          return message.reply("⚠️ এই গ্রুপটি অলরেডি ব্যান তালিকায় রয়েছে।");
        }

        // নতুন ডেটা পুশ
        bannedList.push({
          id: targetGroup.id,
          name: targetGroup.name,
          date: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })
        });
        saveBannedGroups(bannedList);

        // ওই গ্রুপে সরাসরি নোটিফিকেশন পাঠানো
        try {
          await api.sendMessage(`🚫 **[গ্রুপ ব্যান নোটিফিকেশন]**\n\nএই "${targetGroup.name}" গ্রুপটি ব্যান করা হলো। এখন থেকে এই গ্রুপে বটের কোনো কমান্ড বা অটো-রিপ্লাই কাজ করবে না। এমনকি অ্যাডমিনরা চেষ্টা করলেও বট রেসপন্স করবে না।`, targetGroup.id);
        } catch (e) {}
        
        return message.reply(`🚫 সফলভাবে "${targetGroup.name}" গ্রুপটি টোটাল লক করা হয়েছে। বট গ্রুপেই থাকবে কিন্তু সম্পূর্ণ নিরব হয়ে যাবে।`);  
      }  
    }
  }
};
