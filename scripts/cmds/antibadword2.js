module.exports = {
  config: {
    name: "antibadword2",
    version: "4.1",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "group"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {

      const badWords = [
        "fuck", "bitch", "sex", "shit", "asshole",
        "porn", "bastard",
        "মাগি", "খানকি", "চুদি", "চুদ", "বাল",
        "বোকাচোদা", "মাদারচোদ", "হারামি",
        "madarchod", "bokachoda", "khanki"
      ];

      const body = (event.body || "").toLowerCase();

      if (!body) return;

      const uid = event.senderID;
      const tid = event.threadID;

      // ❌ BAD WORD CHECK
      const match = badWords.some(word => body.includes(word));

      if (!match) return;

      // =========================
      // 👤 USER INFO
      // =========================
      let name = "User";

      try {
        const info = await api.getUserInfo(uid);
        name = info[uid]?.name || "User";
      } catch {}

      // =========================
      // 👑 ADMIN CHECK
      // =========================
      let isAdmin = false;

      try {

        const threadInfo = await api.getThreadInfo(tid);

        // 👑 GROUP ADMINS
        const adminIDs = threadInfo.adminIDs.map(a => a.id);

        // 🤖 BOT ADMINS
        const botAdmins =
          global.GoatBot.config.adminBot || [];

        if (
          adminIDs.includes(uid) ||
          botAdmins.includes(uid)
        ) {
          isAdmin = true;
        }

      } catch (e) {
        console.log("Admin Check Error:", e);
      }

      // =========================
      // ⚠️ WARNING STORAGE
      // =========================
      if (!global.warnCount)
        global.warnCount = {};

      if (!global.warnCount[uid])
        global.warnCount[uid] = 0;

      global.warnCount[uid]++;

      const count = global.warnCount[uid];

      // =================================================
      // 👑 GROUP ADMIN / BOT ADMIN SYSTEM
      // =================================================
      if (isAdmin) {

        // 👑 শুধু ৩ বার নোট দিবে
        if (count <= 3) {

          return api.sendMessage(
`👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

👑 ADMIN NOTICE 👑

🕌 আসসালামু আলাইকুম ${name}

⚠️ আপনি একজন এডমিন🔐 হয়ে 🤷।

🚫 গ্রুপে খারাপ 📢ভাষা ব্যবহার করছেন 😾 এটা ঠিক না।🛡️

💖 সবাইকে 🪬সুন্দরভাবে কথা 🔮বলার 🪤অনুরোধ রইলো📣।

📌 Admin Notice: ${count}/3`,
            tid
          );
        }

        // 👑 ৩ বার পরে কিছু করবে না
        return;
      }

      // =================================================
      // 👤 NORMAL USER SYSTEM
      // =================================================

      // ⚠️ WARNING 1 & 2
      if (count < 3) {

        return api.sendMessage(
`👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

⚠️ WARNING ${count}/3 ⚠️

👤 User : ${name}

🚫 গ্রুপে গালিগালাজ করা নিষিদ্ধ ❎।

📌 Remaining Warning : ${3 - count}

⚡ আবার খারাপ 🔐ভাষা ব্যবহার করলে🪬সম্মানের সহিত🛡️🦶লাথি দিয়ে বাহির করা হবে🙌🫶 ।`,
          tid
        );
      }

      // 🚫 FINAL REMOVE
      api.sendMessage(
`👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

🚫 AUTO REMOVE SYSTEM 🚫

👤 User : ${name}

❌ ৩ বার গালিগালাজ করার কারণে🔐আপনাকে গ্রুপ থেকে🪬Remove করা হচ্ছে🛡️।`,
        tid,

        async () => {

          try {

            await api.removeUserFromGroup(uid, tid);

            // 🗑️ RESET WARNING
            delete global.warnCount[uid];

          } catch (e) {

            api.sendMessage(
`👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

❌ এডমিন ভাইয়া 🫶অথবা আপু 🙌 🪬আগে আমাকে মানে🪤 বট কে 🤷 গ্রুপ এডমিন দাও🛡️🔮.`,
              tid
            );

          }

        }
      );

    } catch (err) {

      console.log("AntiBadword Error:", err);

    }
  }
};
