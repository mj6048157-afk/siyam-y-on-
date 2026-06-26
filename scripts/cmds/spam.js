const fs = require("fs");

module.exports = {
  config: {
    name: "gcmanage",
    aliases: ["gc", "group", "গ্রুপ"],
    version: "7.0",
    author: "SIYAM",
    role: 2, // ওনার/এডমিন অনলি
    category: "admin",
    shortDescription: "স্মার্ট গ্রুপ নোটিশ ও প্রফেশনাল লিভ সিস্টেম"
  },

  onStart: async function ({ message, args, api, event }) {
    const input = args.join(" ").toLowerCase().trim();
    global.GoatBot.onReply = global.GoatBot.onReply || new Map();

    if (input === "list" || input === "লিস্ট") {
      try {
        const inbox = await api.getThreadList(100, null, ["INBOX"]);
        const groups = inbox.filter(t => t.isGroup);
        if (groups.length === 0) return message.reply("⚠️ বটের কোনো একটিভ গ্রুপ চ্যাট পাওয়া যায়নি।");

        let msg = "✨ 🌐 𝐁𝐎𝐓 𝐀𝐂𝐓𝐈𝐕𝐄 𝐂𝐇𝐀𝐍𝐍𝐄𝐋𝐒 🌐 ✨\n━━━━━━━━━━━━━━━━━━\n", reps = [];
        groups.forEach((g, i) => {
          msg += `[ ${i + 1} ] 👥 ${g.name || "Unnamed Group"}\n🆔 𝖨𝖣: ${g.threadID}\n━━━━━━━━━━━━━━━━━━\n`;
          reps.push({ num: i + 1, id: g.threadID, name: g.name || "Unnamed Group" });
        });
        msg += `\n⚡ 𝖦𝖴𝖨𝖣𝖤𝖫𝖨𝖭𝖤:\n» লিভ ও নোটিশ দিতে লিখুন: "out <নাম্বার>"\n» গ্রুপে জয়েন হতে লিখুন: "add <নাম্বার>"\n(এই মেসেজে রিপ্লাই দিন)`;

        return message.reply(msg, (e, info) => {
          if (!e) {
            global.GoatBot.onReply.set(info.messageID, { 
              commandName: "gcmanage", 
              author: event.senderID, 
              data: reps,
              msgIds: [info.messageID, event.messageID] // ইনিশিয়াল মেসেজ এবং ইউজারের কমান্ড ট্র্যাক
            });
          }
        });
      } catch (e) { return message.reply("❌ এরর: " + e.message); }
    }
    return message.reply("💡 ব্যবহার করতে লিখুন: gc list অথবা gc লিস্ট");
  },

  onReply: async function ({ message, Reply, event, api }) {
    if (event.senderID !== Reply.author) return;
    const text = event.body.trim().toLowerCase();
    const cmdChannel = event.threadID;

    // আগের জমানো মেসেজ আইডি রিকভার করা বা নতুন অ্যারে নেওয়া
    let trackedIds = Reply.msgIds || [];
    trackedIds.push(event.messageID); // বর্তমান ইউজারের রিপ্লাই আইডি পুশ করা হলো

    // গ্লোবাল ডিলিট ফাংশন (যেকোনো স্টেজে সব জমানো মেসেজ এক ক্লিকে রিমুভ করবে)
    const cleanupMessages = async (idsArray) => {
      if (idsArray && idsArray.length > 0) {
        // ডুপ্লিকেট আইডি রিমুভ করা
        const uniqueIds = [...new Set(idsArray)];
        for (const id of uniqueIds) {
          try { await api.unsendMessage(id); } catch(e){}
        }
      }
    };

    // ================= [ ADD FEATURE ] =================
    if (text.startsWith("add")) {
      const num = parseInt(text.replace("add", "").trim());
      if (isNaN(num)) return message.reply("❌ অনুগ্রহ করে সঠিক নাম্বার টাইপ করুন। (উদা: add 1)");

      const target = Reply.data.find(g => g.num === num);
      if (!target) return message.reply("❌ এই নাম্বারের কোনো গ্রুপ খুঁজে পাওয়া যায়নি।");

      try {
        await api.addUserToGroup(event.senderID, target.id);
        message.reply(`✅ আপনাকে সফলভাবে "${target.name}" গ্রুপে যুক্ত করা হয়েছে।`);
        await cleanupMessages(trackedIds);
      } catch (err) {
        return message.reply(`❌ গ্রুপে অ্যাড করা যায়নি। হতে পারে গ্রুপের মেম্বার ফুল বা বটের পারমিশন নেই।`);
      }
      return;
    }

    // ================= [ OUT FEATURE ] =================
    if (text.startsWith("out")) {
      const num = parseInt(text.replace("out", "").trim());
      if (isNaN(num)) return message.reply("❌ অনুগ্রহ করে সঠিক নাম্বার টাইপ করুন। (উদা: out 1)");

      // এখানে অবজেক্ট ক্লোনিং করে টার্গেটের ডেটা সুরক্ষিত করা হয়েছে
      const target = Reply.data.find(g => g.num === num);
      if (!target) return message.reply("❌ এই নাম্বারের কোনো গ্রুপ খুঁজে পাওয়া যায়নি।");
      
      try {
        const currentThread = await api.getThreadInfo(cmdChannel);
        const currentName = currentThread.threadName || "Админ Снαииєℓ";
        const targetName = target.name;
        const targetId = target.id;

        // নোটিশ প্রসেসিং মেসেজ পাঠানো এবং সেটির আইডিও ট্র্যাকিং লিস্টে রাখা
        api.sendMessage(`⏳ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀... "${targetName}" গ্রুপে মডার্ন নোটিশ পাঠানো হচ্ছে।`, cmdChannel, async (err, procInfo) => {
          if (!err) trackedIds.push(procInfo.messageID);
        });

        // ১ নম্বর নোটিশ (টার্গেট গ্রুপে)
        const noticeMsg = `╭─────── 🪐 ───────╮\n│   ⚠️ 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐍𝐎𝐓𝐈𝐂𝐄 ⚠️   \n╰───────────────────╯\n` +
          `  আসসালামু আলাইকুম।\n\n` +
          `📢 এই গ্রুপটিকে (${targetName}) আগামী ২ মিনিটের মধ্যে ব্যান করা হচ্ছে।\n\n` +
          `📌 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖲𝗈𝗎𝗋𝖼𝖾:\n` +
          `💬 এই নোটিশটি সরাসরি "${currentName}" গ্রুপ থেকে ওনার দ্বারা ইস্যু করা হয়েছে।\n\n` +
          `📞 যদি আপনাদের এই বটটি পুনরায় ব্যবহার করার প্রয়োজন হয়, তবে অবিলম্বে নিচে দেওয়া অফিশিয়াল নাম্বারে যোগাযোগ করুন:\n` +
          `━━━━━━━━━━━━━━━━━\n` +
          `☎️ 𝖮𝖥𝖥𝖨𝖢𝖨𝖠𝖫: 01789138157\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `✨ Powered by SIYAM-BOS ✨`;
        
        await api.sendMessage(noticeMsg, targetId);

        // ওনারের গ্রুপে পারমিশন মেসেজ পাঠানো
        const askMsg = `🔔 সিয়াম বস লিভ নেব?\n\n` +
          `👉 টার্গেট গ্রুপ: "${targetName}"\n` +
          `👉 লিভ কনফার্ম করতে রিপ্লাই দিন: "ass"\n` +
          `👉 বাতিল করতে রিপ্লাই দিন: "no"\n\n` +
          `⏳ সময়সীমা: ২ মিনিট (১২০ সেকেন্ড)`;

        // আগের ইভেন্ট ডিলিট করে নতুন চেইনে সম্পূর্ণ ডেটা ট্রান্সফার
        global.GoatBot.onReply.delete(event.messageReply.messageID);

        api.sendMessage(askMsg, cmdChannel, (err, info) => {
          if (!err) {
            trackedIds.push(info.messageID); // এই পারমিশন মেসেজ আইডিও পুশ হলো
            
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "gcmanage",
              author: Reply.author,
              action: "confirm_leave",
              msgIds: trackedIds, // আগের সব আইডি এখানে পাস হলো
              targetName: targetName,
              targetId: targetId,
              currentName: currentName
            });

            // ২ মিনিট টাইমআউট হ্যান্ডেলার
            setTimeout(() => {
              if (global.GoatBot.onReply.has(info.messageID)) {
                global.GoatBot.onReply.delete(info.messageID);
                api.sendMessage(`⏱️ ২ মিনিট পার হয়ে গেছে! কোনো রেসপন্স না পাওয়ায় অপারেশন বাতিল করা হলো।`, cmdChannel);
              }
            }, 120000);
          }
        });

      } catch (e) {
        return message.reply(`❌ অপারেশন ব্যর্থ! টার্গেট গ্রুপে মেসেজ ব্লক অথবা বটকে মিউট করা হয়েছে।`);
      }
      return;
    }

    // ================= [ CONFIRMATION HANDLER ] =================
    if (Reply.action === "confirm_leave") {
      const targetName = Reply.targetName;
      const targetId = Reply.targetId;
      const currentName = Reply.currentName;

      // যদি ওনার "ass" লেখে (লিভ কনফার্ম)
      if (text === "ass") {
        // লোডিং মেসেজ পাঠানো এবং ট্র্যাকিং লিস্টে এড করা
        api.sendMessage(`⏳ 𝖫𝗈𝖺𝖽𝗂𝗇𝗀... লিভ প্রসেসটি চূড়ান্ত করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন...`, cmdChannel, async (err, loadInfo) => {
          if (!err) trackedIds.push(loadInfo.messageID);
        });
        
        global.GoatBot.onReply.delete(event.messageReply.messageID); // ডুপ্লিকেট রোধ

        // টার্গেট গ্রুপে বিদায় মেসেজ
        try {
          const leaveMsg = `╭───────────────────╮\n` +
            `  🚨 𝐒𝐘𝐒𝐓𝐄𝐌 𝐋𝐄𝐀𝐕𝐈𝐍𝐆...   \n` +
            `╰───────────────────╯\n` +
            `👋 আবে এই গ্রুপ থেকে লিভ নিলাম!\n` +
            `👑 সিয়াম বস সরাসরি "${targetName}" গ্রুপটিকে ব্যান লিস্টিং করেছেন।\n\n` +
            `🎈 আমাদের সার্ভিসটি উপভোগ করার জন্য ধন্যবাদ। 𝖦𝗈𝗈𝖽𝖻𝗒𝖾!`;
          
          await api.sendMessage(leaveMsg, targetId);

          // ৫ সেকেন্ড পর লিভ ও ফাইনাল ক্লিনআপ
          setTimeout(async () => {
            try {
              await api.removeUserFromGroup(api.getCurrentUserID(), targetId);
              
              const successMsg = `✅ 𝗧𝗔𝗦𝗞 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗 💲
──────────────────
🚀 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗘𝘅𝗲𝗰𝘂𝘁𝗲𝗱!

🎯 𝗧𝗮𝗿𝗴𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 : "${targetName}"
📡 𝗦𝗲𝗻𝗱 𝗚𝗿𝗼𝘂𝗽 : "${currentName}"

📊 স্ট্যাটাস: বট সফলভাবে লিভ নিয়েছে এবং
আগের সব মেসেজ রিমুভ করা হচ্ছে..⏳

──────────────────
👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`;
              
              await api.sendMessage(successMsg, cmdChannel);
              
              // এইবার সব লোডিং মেসেজসহ আগের সব মেসেজ একবারে ভ্যানিশ হবে
              await cleanupMessages(trackedIds);

            } catch (err) {
              return api.sendMessage(`❌ "${targetName}" থেকে লিভ নিতে সমস্যা হয়েছে বা বট অলরেডি রিমুভড।`, cmdChannel);
            }
          }, 5000);

        } catch (err) {
          return api.sendMessage(`❌ "${targetName}" গ্রুপে বিদায় মেসেজ পাঠানো যায়নি।`, cmdChannel);
        }
      } 
      // যদি ওনার "no" লেখে (লিভ বাতিল)
      else if (text === "no") {
        global.GoatBot.onReply.delete(event.messageReply.messageID);

        try {
          // টার্গেট গ্রুপে মেসেজ পাঠানো
          await api.sendMessage(`❌ সিয়াম বস এই গ্রুপ থেকে বটের লিভ নিতে নিষেধ করেছেন। আপনাদের গ্রুপটি আনবেন আছে।`, targetId);
          
          // মূল গ্রুপে মেসেজ
          await api.sendMessage(`❌ বস লিভ নিতে নিষেধ করছে! অপারেশন বাতিল করা হলো..⏳।`, cmdChannel);
          
          // প্রসেস বাতিল হলেও সব ফালতু মেসেজ ক্লিনআপ হবে
          await cleanupMessages(trackedIds);

        } catch (e) {
          return api.sendMessage(`❌ প্রসেস বাতিল করার সময় কিছু সমস্যা হয়েছে।`, cmdChannel);
        }
      } else {
        return message.reply(`❌ ভুল অপশন! অনুগ্রহ করে সঠিক গাইডলাইন মেনে শুধু "ass" অথবা "no" লিখে রিপ্লাই দিন।`);
      }
    }
  }
};
