// 👑 Owner: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
// Enterprise-Grade Owner/Admin Prefix Bypass & Smart Suggestion Engine (v3.0.0)

const OWNER_UID = "61590360434650";

// গ্লোবাল মেমোরি স্টেট এবং গার্বেজ কালেকশন ইনিশিয়ালাইজেশন
if (!global.__SiyamSpamRegistry) global.__SiyamSpamRegistry = new Map();
if (!global.__SiyamCacheState) {
  global.__SiyamCacheState = {
    commandsList: [],
    lastCount: 0
  };
}

// পয়েন্ট ৩, ১৪: সিঙ্গেল ইন্টারভাল মেমোরি ক্লিনার (মেমোরি লিক এবং প্রেশার প্রোটেকশন)
if (!global.__SiyamGcInterval) {
  global.__SiyamGcInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of global.__SiyamSpamRegistry.entries()) {
      if (now - timestamp > 10000) {
        global.__SiyamSpamRegistry.delete(key);
      }
    }
  }, 60000); // প্রতি ১ মিনিটে ব্যাকগ্রাউন্ড মেমোরি সুইপ করবে
}

/**
 * পয়েন্ট ১১, ১৭, ২৪: প্রফেশনাল লেভেল-বেসড লগিং সিস্টেম
 */
const logger = {
  info: (msg) => console.log(`\x1b[36m[OWNER_NOPREFIX][INFO]\x1b[0m ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m[OWNER_NOPREFIX][WARN]\x1b[0m ${msg}`),
  error: (msg, err) => console.error(`\x1b[31m[OWNER_NOPREFIX][ERROR]\x1b[0m ${msg}`, err || "")
};

/**
 * পয়েন্ট ২, ৬, ৮, ১৫, ১৬: আল্ট্রা-অপ্টিমাইজড লেভেনস্টাইন ডিসট্যান্স (Unicode & Early Exit)
 */
function getLevenshteinDistance(s1, s2, maxThreshold = 3) {
  if (Math.abs(s1.length - s2.length) >= maxThreshold) return Infinity; // লেন্থ ডিফারেন্স ফিল্টার

  const len1 = s1.length, len2 = s2.length;
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  let prevRow = Array(len2 + 1).fill(0).map((_, i) => i);
  let currRow = Array(len2 + 1).fill(0);

  for (let i = 1; i <= len1; i++) {
    currRow[0] = i;
    let minInRow = currRow[0];

    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1,      // Deletion
        currRow[j - 1] + 1,  // Insertion
        prevRow[j - 1] + cost // Substitution
      );
      if (currRow[j] < minInRow) minInRow = currRow[j];
    }

    // Early Exit: যদি পুরো লাইনের মিনিমাম ভ্যালুই থ্রেশহোল্ড পার করে যায়
    if (minInRow >= maxThreshold) return Infinity;

    prevRow = [...currRow];
  }
  return currRow[len2];
}

/**
 * পয়েন্ট ১, ৯, ১৮: ডাইনামিক এবং ভ্যালিডেটেড ইউনিক কমান্ড ক্যাশ রিফ্রেশার
 */
function validateAndRefreshCache(commands) {
  const currentCount = commands.size;
  
  // যদি কমান্ড কাউন্টে কোনো পরিবর্তন না আসে, তবে রিবিল্ড হবে না (পারফরম্যান্স বুস্ট)
  if (global.__SiyamCacheState.lastCount === currentCount && global.__SiyamCacheState.commandsList.length > 0) {
    return;
  }

  const uniqueCmdSet = new Set();
  commands.forEach((cmd) => {
    const name = cmd.config?.name?.trim()?.toLowerCase();
    if (name) uniqueCmdSet.add(name);

    if (Array.isArray(cmd.config?.aliases)) {
      cmd.config.aliases.forEach((alias) => {
        const cleanAlias = alias?.trim()?.toLowerCase();
        if (cleanAlias) uniqueCmdSet.add(cleanAlias);
      });
    }
  });

  global.__SiyamCacheState.commandsList = Array.from(uniqueCmdSet);
  global.__SiyamCacheState.lastCount = currentCount;
  logger.info(`Dynamic Command Cache Rebuilt. Total Unique Entries: ${uniqueCmdSet.size}`);
}

module.exports = {
  config: {
    name: "owner_noprefix",
    version: "3.0.0",
    author: "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
    role: 0,
    shortDescription: "Enterprise Owner No-Prefix Engine & Suggestion Stack",
    longDescription: "Production ready system with dynamic caching, Levenshtein filters, security boundaries and single cleanup thread.",
    category: "system"
  },

  onStart: async function () {
    return;
  },

  onChat: async function (O) {
    const { event, message } = O;
    const rawBody = event.body;

    // পয়েন্ট ১০: ইনপুট স্যানিটাইজেশন (Empty, Spaces, বা মেসেজ অবজেক্ট মিসিং থাকলে সেফ এক্সিট)
    if (!rawBody || typeof rawBody !== "string") return;
    const body = rawBody.trim();
    if (!body) return;

    const senderID = String(event.senderID);
    const botAdmins = (global.GoatBot?.config?.adminBot || []).map(id => String(id));

    // পয়েন্ট ২, ২৮: অনার বা অ্যাডমিন ছাড়া অন্য কারো মেসেজে ১ মিলিসেকেন্ডও মেমোরি নষ্ট করবে না
    if (senderID !== OWNER_UID && !botAdmins.includes(senderID)) return;

    try {
      if (!global.GoatBot || !global.GoatBot.commands) {
        logger.error("Critical core error: global.GoatBot.commands execution tree is unavailable");
        return;
      }

      // পয়েন্ট ৫: মাল্টিপল ও স্পেশাল ক্যারেক্টার প্রিফিক্স সেফ এস্কেপিং ও রিমুভাল
      const botPrefix = global.GoatBot?.config?.prefix || "/";
      let cleanBody = body;
      
      if (body.startsWith(botPrefix)) {
        cleanBody = body.slice(botPrefix.length).trim();
      }

      // পয়েন্ট ৪, ৫: যদি কোনো মেসেজের মাঝে স্পেস থাকে তবে সাজেশন সম্পূর্ণ ইগনোরড
      const isSingleWord = !cleanBody.includes(" ");
      const args = cleanBody.split(/\s+/);
      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const commands = global.GoatBot.commands;

      // পয়েন্ট ২১, ২২: সম্পূর্ণ কেস-ইনসেনসিটিভ কমান্ড এবং অ্যালিয়াস রেজোলিউশন
      const command = commands.get(commandName) || [...commands.values()].find(
        cmd => Array.isArray(cmd.config?.aliases) && 
        cmd.config.aliases.map(a => String(a).toLowerCase()).includes(commandName)
      );

      // ────────────────────────────────────────────────────────
      // 🚫 COMMAND NOT FOUND (স্মার্ট সাজেশন এবং অ্যান্টি-স্প্যাম লক)
      // ────────────────────────────────────────────────────────
      if (!command) {
        if (!isSingleWord) return; // বাক্যের মাঝের অংশ হলে কোনো সাজেশন ট্রিপ করবে না

        const currentTime = Date.now();
        const spamKey = `${senderID}_${commandName}`;

        // পয়েন্ট ৬, ৭, ১৬, ২৭: ১০ সেকেন্ডের অ্যান্টি-স্প্যাম প্রোটেকশন চেক
        if (global.__SiyamSpamRegistry.has(spamKey)) {
          const lastTime = global.__SiyamSpamRegistry.get(spamKey);
          if (currentTime - lastTime < 10000) {
            return; // সাইলেন্ট ইগনোর, বটের চ্যাটে কোনো স্প্যামিং রেসপন্স যাবে না
          }
        }
        global.__SiyamSpamRegistry.set(spamKey, currentTime);

        // ডাইনামিক ক্যাশ ভ্যালিডেশন অ্যান্ড স্টেট সিঙ্ক
        validateAndRefreshCache(commands);

        let bestMatch = null;
        let minDistance = 3; // থ্রেশহোল্ড (৩ বা তার বেশি অমিল হলে ফলস পজিটিভ আটকাবে)

        const cachedList = global.__SiyamCacheState.commandsList;
        for (let i = 0; i < cachedList.length; i++) {
          const distance = getLevenshteinDistance(commandName, cachedList[i], minDistance);
          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = cachedList[i];
          }
        }

        // পয়েন্ট ২৯, ৩০: প্রিমিয়াম ক্লিন নো-স্পেস মেটেরিয়াল ডিজাইন রেসপন্স
        if (bestMatch) {
          // পয়েন্ট ১২: চেক করা হচ্ছে সাজেস্টেড কমান্ডটি নিজে ডিজেবলড কিনা
          const disabledCommands = global.GoatBot?.config?.commandDisabled || [];
          if (disabledCommands.includes(bestMatch)) bestMatch = null;
        }

        if (bestMatch) {
          return message.reply(
`❌ সিয়াম ভাই
"${commandName}" এইটা নাই।
🔍 তুমি কি এইটা খুঁজছো?
╭─➤💎${botPrefix}${bestMatch}
╰────────`
          );
        } else {
          return message.reply(
`❌ সিয়াম ভাই
"${commandName}" এইটা নাই।`
          );
        }
      }

      // ────────────────────────────────────────────────────────
      // ⚠️ DISABLED COMMAND GATEWAY
      // ────────────────────────────────────────────────────────
      // পয়েন্ট ১২: ডিজেবলড কমান্ড হ্যান্ডলার এবং প্রিমিয়াম রেসপন্স
      const disabledCommands = global.GoatBot?.config?.commandDisabled || [];
      if (disabledCommands.includes(command.config?.name)) {
        return message.reply(`⚠️ সিয়াম ভাই, "${command.config.name}" কমান্ডটি বর্তমানে বটের কনফিগ থেকে ডিজেবল করে রাখা হয়েছে।`);
      }

      // ────────────────────────────────────────────────────────
      // 🚀 SECURE COMMAND EXECUTION PIPELINE
      // ────────────────────────────────────────────────────────
      // পয়েন্ট ১৩: অন-স্টার্ট মেথড ভ্যালিডেশন ক্র্যাশ গার্ড
      if (typeof command.onStart !== "function") {
        logger.warn(`Execution blocked: [${commandName}] মডিউলে অন-স্টার্ট ফাংশন অনুপস্থিত।`);
        return message.reply("❌ কমান্ডটি এক্সিকিউট করা সম্ভব হয়নি কারণ এটির ইন্টারনাল কোর হ্যান্ডলার মিসিং রয়েছে।");
      }

      // পয়েন্ট ৪, ৭: সিকিউরিটি ও কনটেক্সট প্রিজারভেশন। গোটবটের নিজস্ব পারমিশন লেয়ার ও প্যারামিটার চেইন ব্যবহার করা হয়েছে।
      const clonedParams = {
        ...O,
        args,
        commandName: command.config?.name || commandName
      };

      try {
        // পয়েন্ট ১০: কমান্ড রান সাকসেসফুল হলে এটি সাইলেন্টলি এক্সিট করবে, কোনো সাজেশন ইঞ্জিন কল হবে না
        await command.onStart(clonedParams);
        logger.info(`SUCCESS: [${commandName}] successfully invoked by Admin/Owner: ${senderID}`);
      } catch (execError) {
        // পয়েন্ট ১৩: রানটাইম এরর ট্র্যাকিং ও ইউজার ফ্রেন্ডলি মেসেজ মাস্কিং
        logger.error(`Core crash intercepted inside command [${commandName}] ->`, execError);
        return message.reply("❌ কমান্ডটি রান করার সময় একটি ইন্টারনাল মডিউল এরর ঘটেছে। অনুগ্রহ করে কনসোল লগ চেক করুন।");
      }

    } catch (err) {
      // পয়েন্ট ১৩, ২০, ২৬: গ্লোবাল এক্সেপশন রিকভারি শিল্ড
      logger.error("Unhandled runtime exception caught safely inside global wrapper ->", err.message || err);
    }
  }
};
