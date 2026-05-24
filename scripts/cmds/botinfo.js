const os = require("os");
const fs = require("fs");

const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "botinfo",
    version: "9.0",
    author: AUTHOR,
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Premium Bot Information"
    },
    longDescription: {
      en: "Advanced real bot information system"
    },
    category: "owner"
  },

  onStart: async function ({
    message,
    api,
    event,
    usersData,
    threadsData
  }) {

    // 🔒 AUTHOR LOCK
    const content = fs.readFileSync(__filename, "utf8");

    if (
      !content.includes('const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"')
    ) {
      console.log("🚫 AUTHOR LOCK ACTIVATED");
      process.exit(1);
    }

    const start = Date.now();

    // ⏰ DATE & TIME
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    const date = now.toLocaleDateString("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    const hour = now.getHours();

    const mode =
      hour >= 6 && hour < 18
        ? "🌞 DAY MODE"
        : "🌙 NIGHT MODE";

    // 🤖 BOT SYSTEM
    const prefix =
      global.GoatBot?.config?.prefix || "!";

    const commands =
      global.GoatBot?.commands?.size || 0;

    const events =
      global.GoatBot?.eventCommands?.size || 0;

    // 👥 DATABASE INFO
    const allUsers = await usersData.getAll();
    const allThreads = await threadsData.getAll();

    const totalUsers = allUsers.length;
    const totalThreads = allThreads.length;

    // 💬 THREAD INFO
    const threadInfo =
      await api.getThreadInfo(event.threadID);

    const groupName =
      threadInfo.threadName || "Unknown";

    const members =
      threadInfo.participantIDs.length;

    const admins =
      threadInfo.adminIDs.length;

    // 💬 MESSAGE COUNTS
    const threadData =
      await threadsData.get(event.threadID);

    const groupMessages =
      threadData?.messageCount ||
      threadData?.messages ||
      0;

    const botID = api.getCurrentUserID();

    const botData =
      await usersData.get(botID);

    const botMessages =
      botData?.messageCount ||
      botData?.messages ||
      0;

    // ⏱ UPTIME
    const uptime = process.uptime();

    const upDays = Math.floor(uptime / 86400);

    const upHours = Math.floor(
      (uptime % 86400) / 3600
    );

    const upMinutes = Math.floor(
      (uptime % 3600) / 60
    );

    // 💻 SYSTEM INFO
    const cpu = os.cpus()[0].model;

    const cores = os.cpus().length;

    const totalRam = (
      os.totalmem() /
      1024 /
      1024 /
      1024
    ).toFixed(2);

    const freeRam = (
      os.freemem() /
      1024 /
      1024 /
      1024
    ).toFixed(2);

    const usedRam = (
      totalRam - freeRam
    ).toFixed(2);

    const platform = os.platform();

    const hostname = os.hostname();

    const architecture = os.arch();

    const ping = Date.now() - start;

    // 📊 RAM BAR
    const ramPercent = Math.floor(
      (usedRam / totalRam) * 10
    );

    const ramBar =
      "█".repeat(ramPercent) +
      "░".repeat(10 - ramPercent);

    // 🌐 STATUS
    const network =
      ping < 100
        ? "🚀 SUPER FAST"
        : ping < 300
        ? "⚡ FAST"
        : "🐢 SLOW";

    const serverStatus =
      usedRam < totalRam / 2
        ? "🟢 STABLE"
        : "🟠 BUSY";

    const text = `
╔══════════════╗
 👑 𝗦𝗜𝗬𝗔𝗠 𝗕𝗢𝗧 👑
╚══════════════╝

╭━━━━━━━━━━━━━━━━╮
┃ 👑OWNER INFORMATION
╰━━━━━━━━━━━━━━━━╯

👤 𝐎𝐖𝐍𝐄𝐑 ➤ 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
🏠 𝐇𝐎𝐌𝐄 ➤ 𝐊𝐈𝐒𝐇𝐎𝐑𝐄𝐆𝐀𝐍𝐉
📚 𝐂𝐋𝐀𝐒𝐒 ➤ 𝐍𝐄𝐖 𝐓𝐄𝐍
🔥 𝐀𝐆𝐄 ➤ 17+
🏫 𝐒𝐂𝐇𝐎𝐎𝐋 ➤ 𝐌 𝐀 𝐌𝐀𝐍𝐍𝐀𝐍 𝐌𝐀𝐍𝐈𝐊 𝐇𝐈𝐆𝐇 𝐒𝐂𝐇𝐎𝐎𝐋

━━━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━╮
┃ 🤖BOT INFORMATION
╰━━━━━━━━━━━━━━━━╯

⚙️ BOT NAME ➤ 👑𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧
📌 PREFIX ➤ ${prefix}
📦 COMMANDS ➤ ${commands}
🎛 EVENT CMDS ➤ ${events}

👥 TOTAL USERS ➤ ${totalUsers}
💬 TOTAL GROUPS ➤ ${totalThreads}

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━╮
┃💬GROUP INFORMATION
╰━━━━━━━━━━━━━━━━╯

🏷 GROUP NAME ➤ ${groupName}
👤 MEMBERS ➤ ${members}
🛡 ADMINS ➤ ${admins}

📨 GROUP MSG ➤ ${groupMessages}
🤖 BOT MSG ➤ ${botMessages}

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━╮
┃ ⏰ LIVE STATUS
╰━━━━━━━━━━━━━━━╯

📅 DATE ➤ ${date}
⏰ TIME ➤ ${time}
🌍 TIMEZONE ➤ ${timezone}

${mode}

━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━━╮
┃💻SYSTEM INFORMATION
╰━━━━━━━━━━━━━━━━━╯

🖥 PLATFORM ➤ ${platform}
⚙️ ARCH ➤ ${architecture}
🌐 HOSTNAME ➤ ${hostname}

💻 CPU ➤
${cpu}

🧠 CPU CORES ➤ ${cores}

🧠 RAM USAGE ➤
${usedRam}GB / ${totalRam}GB

${ramBar}

━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━╮
┃ 📡 PERFORMANCE
╰━━━━━━━━━━━━━━━━╯

⚡ PING ➤ ${ping}ms
🌐 NETWORK ➤ ${network}
🛡 SERVER ➤ ${serverStatus}

⏱ UPTIME ➤
${upDays}D ${upHours}H ${upMinutes}M

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━╮
┃ 🖥️LIVE BOT STATUS
╰━━━━━━━━━━━━━━━━╯

🟢 BOT STATUS ➤ ONLINE
⚡ RESPONSE ➤ ACTIVE
🚀 SPEED ➤ PERFECT
💎 VERSION ➤ 9.0
🔒 SECURITY ➤ ENABLED

━━━━━━━━━━━━━━━━━━

👑 OWNER ➤ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
`;

    return message.reply(text);
  }
};
