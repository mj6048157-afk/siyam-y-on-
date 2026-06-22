module.exports = {
  config: {
    name: "gcadmin",
    aliases: ["groupadmin", "admingc", "admingroup"],
    version: "1.5",
    author: "𝐒𝐈𝐘𝐀𝐌",
    countDown: 5,
    role: 1,
    shortDescription: "Manage group admins",
    category: "box chat",
    guide: {
      en: "{p}{n} add [uid/mention/reply/self] | {p}{n} remove [uid/mention/reply/self]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const cmd = args[0];
    const target = args.slice(1).join(" ");
    const tID = event.threadID;

    if (cmd === "add" || cmd === "-a")
      return addAdmin(api, event, tID, target);

    if (cmd === "remove" || cmd === "-r")
      return removeAdmin(api, event, tID, target);

    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗

➥ gcadmin add @user
➥ gcadmin remove @user
➥ gcadmin -a @user
➥ gcadmin -r @user

💡 [ ব্যবহারের নিয়ম ]: 
গ্রুপে কাউকে এডমিন বানাতে চাইলে লিখুন 'gcadmin add' লিখে তাকে মেনশন করুন, অথবা তার মেসেজে রিপ্লাই দিয়ে লিখুন 'gcadmin add'। এডমিন থেকে বাদ দিতে 'gcadmin remove' ব্যবহার করুন।

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`,
      tID
    );
  }
};

async function addAdmin(api, event, tID, target) {
  try {
    const uID = await getUID(api, event, target);
    const userInfo = await api.getUserInfo(uID);
    const name = userInfo[uID]?.name || uID;

    await api.changeAdminStatus(tID, uID, true);

    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦
➥ 𝗣𝗿𝗼𝗺𝗼𝘁𝗲𝗱 𝘁𝗼 𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻
👤 ${name}

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`, 
      tID 
    );
  } catch {
    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

❌ 𝗙𝗔𝗜𝗟𝗘𝗗
➥ 𝗕𝗼𝘁 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗻 𝗔𝗱𝗺𝗶𝗻
🔒 𝗚𝗿𝗮𝗻𝘁 𝗔𝗱𝗺𝗶𝗻 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝗙𝗶𝗿𝘀𝘁

💡 [ মনে রাখুন ]: বটের এই কমান্ডটি কাজ করার জন্য অবশ্যই বটকে প্রথমে ওই গ্রুপের এডমিন (Admin) বানাতে হবে।

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`,
      tID
    );
  }
}

async function removeAdmin(api, event, tID, target) {
  try {
    const uID = await getUID(api, event, target);
    const userInfo = await api.getUserInfo(uID);
    const name = userInfo[uID]?.name || uID;

    await api.changeAdminStatus(tID, uID, false);

    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦
➥ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗙𝗿𝗼𝗺 𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻
👤 ${name}

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`, 
      tID 
    );
  } catch {
    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

❌ 𝗙𝗔𝗜𝗟𝗘𝗗
➥ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗥𝗲𝗺𝗼𝘃𝗲 𝗔𝗱𝗺𝗶𝗻
🔒 🇨🇭𝗲𝗰𝗸 𝗕𝗼𝘁 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻

💡 【 👑-𝐒𝐈𝐘𝐀𝐌-👑 】⚠️ এই সদস্যকে Remove করা গেল না!
🚫 Bot Admin নেই
🔰 অথবা যাকে Remove করা হচ্ছে, সে 🔰এডমিন🔰তার ক্ষমতা 💠Bot-এর চেয়ে বেশি✅।
✅ আগে Bot-কে Admin দিন, তারপর আবার চেষ্টা করুন।

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`,
      tID
    );
  }
}

async function getUID(api, event, target) {
  if (event.type === "message_reply")
    return event.messageReply.senderID;

  if (event.mentions && Object.keys(event.mentions).length > 0)
    return Object.keys(event.mentions)[0];

  if (target)
    return target;

  return event.senderID;
}
