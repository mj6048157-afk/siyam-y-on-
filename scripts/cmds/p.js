module.exports = { 
  config: { 
    name: "p", 
    version: "3.1", 
    author: "Badhon", 
    countDown: 5, 
    role: 2, 
    category: "Admin",
    guide: "{pn} - view pending list\nReply: 1 2 - approve\nReply: c 1 2 - cancel\nReply: -all - approve all"
  },

  langs: { 
    en: { 
      invalidNumber: "『 𝐄𝐑𝐑𝐎𝐑 』\n\n✦ %1 is not a valid number\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪",
      cancelSuccess: "『 𝐂𝐀𝐍𝐂𝐄𝐋𝐋𝐄𝐃 』\n\n✦ Refused %1 thread(s)\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪",
      approveSuccess: "『 𝐀𝐏𝐏𝐑𝐎𝐕𝐄𝐃 』\n\n✦ Approved %1 thread(s)\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪",
      cantGetPendingList: "『 𝐄𝐑𝐑𝐎𝐑 』\n\n✦ Unable to retrieve pending list\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪",
      returnListClean: "『 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 』\n\n✦ No pending requests found\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪",
      approveAllSuccess: "『 𝐀𝐏𝐏𝐑𝐎𝐕𝐄𝐃 𝐀𝐋𝐋 』\n\n✦ Approved ALL %1 threads\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪"
    } 
  },

  onReply: async function ({ api, event, Reply, getLang }) {
    if (event.senderID != Reply.author) return;

    const body = event.body.toLowerCase();
    const isAll = body === "-all";
    const isCancel = body.startsWith("c");
    const list = isAll ? Reply.pending.map((_,i)=>i+1) : body.replace(/^c\s*/,"").split(/\s+/);

    let count = 0;

    for (const i of list) {
      const num = parseInt(i);
      if (!isAll && (isNaN(num) || num < 1 || num > Reply.pending.length)) {
        try { await api.unsendMessage(event.messageReply.messageID); } catch (e) {}
        try { await api.unsendMessage(event.messageID); } catch (e) {}
        return api.sendMessage(getLang("invalidNumber", i), event.threadID);
      }

      const group = Reply.pending[num-1];
      if (isCancel) {
        api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
      } else {
        api.sendMessage("『 👑 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧 』\n\n✦ Bot activated successfully\n✦ Group: " + group.name + "\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪", group.threadID);
      }
      count++;
    }

    try { await api.unsendMessage(event.messageReply.messageID); } catch (e) {}
    try { await api.unsendMessage(event.messageID); } catch (e) {}

    return api.sendMessage(
      isAll ? getLang("approveAllSuccess", count)
      : isCancel ? getLang("cancelSuccess", count)
      : getLang("approveSuccess", count),
      event.threadID
    );
  },

  onStart: async function ({ api, event, getLang, commandName }) {
    try {
      const spam = await api.getThreadList(100, null, ["OTHER"]);
      const pending = await api.getThreadList(100, null, ["PENDING"]);
      const list = [...spam, ...pending].filter(g => g.isGroup && g.isSubscribed);

      if (!list.length)
        return api.sendMessage(getLang("returnListClean"), event.threadID);

      let msg = "『 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐋𝐈𝐒𝐓 』\n\n";
      list.forEach((g,i) => {
        msg += `✦ ${i+1}. ${g.name}\n`;
      });

      msg += "\n› Reply: 1 2 - Approve\n› Reply: c 1 2 - Cancel\n› Reply: -all - Approve All\n\n➤ Owner: 𓆩👑𝐒𝐈𝐘𝐀𝐌-👑𓆪";

      try { await api.unsendMessage(event.messageID); } catch (e) {}

      return api.sendMessage(msg, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID,
          pending: list
        });
      });
    } catch {
      return api.sendMessage(getLang("cantGetPendingList"), event.threadID);
    }
  }
};
