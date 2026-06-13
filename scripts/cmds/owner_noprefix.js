// 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
// Owner Prefix Bypass & Smart Suggestion System

const OWNER_UID = "61590360434650";

// জ্যাকার্ড সিমিলারিটি অ্যালগরিদম (কাছাকাছি কমান্ড খুঁজে বের করার জন্য সাহায্যকারী ফাংশন)
function getClosestCommand(inputName, allCommands) {
  let closest = "";
  let maxScore = 0;

  for (const cmd of allCommands) {
    let score = 0;
    // ইনপুট করা নামের সাথে কমান্ডের নাম আংশিক মিললে স্কোর বাড়ানো
    if (cmd.startsWith(inputName) || inputName.startsWith(cmd)) score += 0.5;
    
    // কমন ক্যারেক্টার ম্যাচিং লজিক
    const inputSet = new Set(inputName);
    const cmdSet = new Set(cmd);
    const intersection = new Set([...inputSet].filter(x => cmdSet.has(x)));
    const union = new Set([...inputSet, ...cmdSet]);
    const similarity = intersection.size / union.size;
    
    score += similarity;

    if (score > maxScore) {
      maxScore = score;
      closest = cmd;
    }
  }
  // যদি মিলার চান্স ৩০% এর বেশি হয় তবেই সাজেশন দেখাবে
  return maxScore > 0.3 ? closest : null;
}

module.exports = {
  config: {
    name: "owner_noprefix",
    version: "1.3.0",
    author: "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
    role: 0,
    shortDescription: "Owner No Prefix & Prefix Smart Handler",
    longDescription: "Bypass prefix for owner and provides smart command suggestions if not found",
    category: "system"
  },

  onChat: async function (O) {
    const { event, message } = O;
    let body = event.body?.trim();
    if (!body) return;

    const senderID = String(event.senderID);

    // ✅ Owner UID Check
    if (senderID !== OWNER_UID) return;

    try {
      if (!global.GoatBot || !global.GoatBot.commands) {
        console.error("[OWNER_NOPREFIX] CRITICAL: global.GoatBot.commands is undefined");
        return;
      }

      const botPrefix = global.GoatBot?.config?.prefix || "/";
      
      // ✅ প্রিফিক্স দিয়ে লিখুক বা ছাড়া—উভয় ক্ষেত্রেই বডি থেকে প্রিফিক্স রিমুভ করে চেক করা হবে যেন ডাবল রেসপন্স না হয়
      if (body.startsWith(botPrefix)) {
        body = body.slice(botPrefix.length).trim();
      }

      const commands = global.GoatBot.commands;
      const args = body.split(/\s+/);
      const commandName = args.shift().toLowerCase();
      if (!commandName) return;

      // ✅ কমান্ড অথবা অ্যালিয়াস খুঁজে বের করা
      const command =
        commands.get(commandName) ||
        [...commands.values()].find(
          cmd =>
            Array.isArray(cmd.config?.aliases) &&
            cmd.config.aliases.includes(commandName)
        );

      // ✅ কমান্ড না পেলে স্মার্ট সাজেশন লজিক (থেমে থাকবে না, কাছাকাছি কমান্ড খুঁজবে)
      if (!command) {
        // বটের সমস্ত বৈধ কমান্ড এবং অ্যালিয়াসের একটি লিস্ট তৈরি
        const allCommandNames = [];
        commands.forEach(cmd => {
          if (cmd.config?.name) allCommandNames.push(cmd.config.name.toLowerCase());
          if (Array.isArray(cmd.config?.aliases)) {
            cmd.config.aliases.forEach(alias => allCommandNames.push(alias.toLowerCase()));
          }
        });

        const suggestion = getClosestCommand(commandName, allCommandNames);

        console.log(`[OWNER_NOPREFIX] NOT_FOUND: ${commandName}`);
        
        if (suggestion) {
          return message.reply(`❌ Command not found: "${commandName}"\n👉 আপনি কি এটা খুঁজছেন? ➔ ${botPrefix}${suggestion}`);
        } else {
          return message.reply(`❌ Command not found: "${commandName}"`);
        }
      }

      // ✅ Command Disabled চেক
      const disabledCommands = global.GoatBot?.config?.commandDisabled || [];
      if (disabledCommands.includes(command.config?.name)) {
        return message.reply(`⚠️ Command is currently unavailable`);
      }

      // ✅ Missing command.onStart প্রোটেকশন
      if (typeof command.onStart !== "function") {
        console.log(`[OWNER_NOPREFIX] FAILED: ${commandName} (Missing onStart function)`);
        return message.reply(`❌ Command execution failed`);
      }

      const customParams = {
        ...O,
        args,
        commandName: command.config?.name || commandName,
        role: 2 // অনার রোল ফোর্সড
      };

      // ✅ সেফ এক্সিকিউশন
      try {
        await command.onStart(customParams);
        console.log(`[OWNER_NOPREFIX] SUCCESS: ${commandName}`);
      } catch (execError) {
        console.error(`[OWNER_NOPREFIX] FAILED: ${commandName}`, execError);
        return message.reply(`❌ Command execution failed`);
      }

    } catch (err) {
      console.error("[OWNER_NOPREFIX] Global Handler Error:", err.message || err);
    }
  }
};
