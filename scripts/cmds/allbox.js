module.exports = {

  config: {
    name: "allgroup",
    aliases: ["allgc"],
    version: "2.0",
    role: 2,
    author: "亗 SIYAM HASAN 亗",
    description: "Premium All Group Panel",
    category: "admin",
    countDown: 5,
    guide: {
      en: "{pn}"
    }
  },

  // =========================
  // START COMMAND
  // =========================

  onStart: async function ({
    api,
    event,
    message,
    commandName
  }) {

    try {

      const list = await api.getThreadList(
        100,
        null,
        ["INBOX"]
      );

      if (!list || !Array.isArray(list))
        return message.reply(
          "❌ Failed to fetch group list."
        );

      const groups = list.filter(
        item =>
          item.isGroup &&
          item.threadID != event.threadID
      );

      if (!groups.length)
        return message.reply(
          "❌ Bot is not added in any group."
        );

      let msg =
`╔𝐑𝐎𝐘𝐀𝐋 𝐆𝐑𝐎𝐔𝐏 𝐏𝐀𝐍𝐄𝐋╗
┃
┃ 🌟 𝐀𝐋𝐋 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 🌟
┃         👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑
┃
┃      👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
┃
╠═══════════════╣
`;

      const saveGroup = [];

      for (let i = 0; i < groups.length; i++) {

        const group = groups[i];

        const name =
          group.name || "Unnamed Group";

        const members =
          group.participantIDs
            ? group.participantIDs.length
            : 0;

        msg +=
`┃ 💎 ${i + 1} ➤ ${name}
┃ 🆔 𝐆𝐂 𝐈𝐃 ➤ ${group.threadID}
┃ 👥 𝐌𝐄𝐌𝐁𝐄𝐑 ➤ ${members}
┃
`;

        saveGroup.push(group.threadID);

      }

      msg +=
`╠══════════════╣
┃  𝐑𝐄𝐏𝐋𝐘 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 𝐏𝐀𝐍𝐄𝐋 
┃
┃ 🚪 out 1
┃ ➤ Leave Selected Group
┃
┃ ➕ add 2
┃ ➤ Add Yourself In Group
┃
┃ 🚫 ban 3
┃ ➤ Ban & Auto Leave Group
┃
┃  ═══════════════╣
┃ 🤖 𝐁𝐎𝐓   ➤  𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧 
┃ 👑 𝐎𝐖𝐍𝐄𝐑    
┃  ☠️  ➤  𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
┃ 💠 𝐏𝐑𝐄𝐅𝐈𝐗 ➤ 【,】
┃
╚  👑 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧👑 ╝`;

      const info =
        await message.reply(msg);

      global.GoatBot.onReply.set(
        info.messageID,
        {
          commandName,
          author: event.senderID,
          groupData: saveGroup
        }
      );

    }

    catch (err) {

      console.log(err);

      return message.reply(
        "❌ System Error:\n" +
        err.message
      );

    }

  },

  // =========================
  // REPLY SYSTEM
  // =========================

  onReply: async function ({
    api,
    event,
    Reply,
    message,
    threadsData
  }) {

    try {

      if (
        event.senderID != Reply.author
      ) return;

      const args =
        event.body.trim().split(/\s+/);

      const cmd =
        args[0]?.toLowerCase();

      const num =
        parseInt(args[1]);

      if (!cmd || isNaN(num))
        return message.reply(
          "❌ Invalid reply format."
        );

      const threadID =
        Reply.groupData[num - 1];

      if (!threadID)
        return message.reply(
          "❌ Group not found."
        );

      // =====================
      // OUT SYSTEM
      // =====================

      if (cmd === "out") {

        try {

          await api.removeUserFromGroup(
            api.getCurrentUserID(),
            threadID
          );

          return message.reply(
`╔══════════════╗
┃ ✅ LEFT SUCCESS
┃ 🆔 ${threadID}
╚══════════════╝`
          );

        }

        catch {

          return message.reply(
            "❌ Failed to leave group."
          );

        }

      }

      // =====================
      // ADD SYSTEM
      // =====================

      if (cmd === "add") {

        try {

          await api.addUserToGroup(
            event.senderID,
            threadID
          );

          return message.reply(
`╔══════════════╗
┃ ✅ ADD SUCCESS
┃ 🆔 ${threadID}
╚══════════════╝`
          );

        }

        catch {

          return message.reply(
            "❌ Failed to add user."
          );

        }

      }

      // =====================
      // BAN SYSTEM
      // =====================

      if (cmd === "ban") {

        try {

          const oldData =
            await threadsData.get(threadID);

          if (!oldData.data)
            oldData.data = {};

          oldData.data.banned = true;

          await threadsData.set(
            threadID,
            oldData.data,
            "data"
          );

          await api.sendMessage(
            "🚫 This group has been banned.",
            threadID
          );

          await api.removeUserFromGroup(
            api.getCurrentUserID(),
            threadID
          );

          return message.reply(
`╔══════════════╗
┃ 🚫 BAN SUCCESS
┃ 🆔 ${threadID}
╚══════════════╝`
          );

        }

        catch {

          return message.reply(
            "❌ Failed to ban group."
          );

        }

      }

    }

    catch (err) {

      console.log(err);

      return message.reply(
        "❌ Reply Error:\n" +
        err.message
      );

    }

  }

};
