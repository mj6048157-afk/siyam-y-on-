// অফ করার জন্য একটি গ্লোবাল অবজেক্ট (লজিক ঠিক রাখার জন্য)
if (!global.yuCommandStatus) {
    global.yuCommandStatus = {};
}

module.exports.config = {
    name: "yu",
    aliases: ["all", "everyone"],
    version: "1.0.9",
    credit: "MOHAMMAD BADOL",
    role: 1, // Admin only - spam যেন না হয়
    prefix: true, // /tagall দিয়ে চালাবে
    description: "গ্রুপের সবাইকে একে একে mention করে",
    category: "group",
    usages: "[custom text]",
    cooldown: 10 // 10 সেকেন্ড দিলাম, spam কম হবে
};

module.exports.onStart = async function ({ api, event, args }) {
    if (!event || !event.threadID) return;

    const { threadID, messageID, senderID } = event;

    // গ্রুপ চেক
    if (!event.isGroup) {
        return api.sendMessage("❌ এই কমান্ড শুধু গ্রুপে কাজ করবে।", threadID, messageID);
    }

    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const allUsers = threadInfo.participantIDs.filter(id => id != api.getCurrentUserID() && id != senderID);
        const customMessage = args.join(" ");

        if (allUsers.length === 0) {
            return api.sendMessage("❌ গ্রুপে mention করার মতো কেউ নাই।", threadID, messageID);
        }

        // মেনশন প্রসেস চালু করা হলো
        global.yuCommandStatus[threadID] = true;

        api.sendMessage(`👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍  👑। ✅ ${allUsers.length} জনকে mention করা শুরু করতেছি... (বন্ধ করতে 'off' বা 'stop' লিখুন)`, threadID, messageID);

        for (let i = 0; i < allUsers.length; i++) {
            // চেক করা হচ্ছে অ্যাডমিন অফ করতে বলেছে কিনা
            if (!global.yuCommandStatus[threadID]) {
                return api.sendMessage("❌ মেনশন করা অফ করা হয়েছে। সিয়াম বস ", threadID);
            }

            const id = allUsers[i];
            try {
                const userInfo = await api.getUserInfo(id);
                const userName = userInfo[id]?.name || "User";
                const body = customMessage ? `@${userName} ${customMessage}` : `@${userName}`;
                
                await api.sendMessage(
                    { body, mentions: [{ tag: `@${userName}`, id }] },
                    threadID
                );
                
                // 1 সেকেন্ড delay দিলাম যেন Facebook block না করে
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.log(`Failed to tag ${id}:`, e.message);
            }
        }

        // শেষ হলে স্ট্যাটাস ডিলিট করে দেওয়া
        delete global.yuCommandStatus[threadID];
        return api.sendMessage("✅ সবাইকে mention করা শেষ।", threadID);

    } catch (e) {
        console.log(e);
        delete global.yuCommandStatus[threadID];
        return api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
    }
};

// অনচ্যাট ফাংশন
module.exports.onChat = async function ({ api, event }) {
    if (!event || !event.threadID || !event.body) return;
    const { threadID, body } = event;

    if ((body.toLowerCase() === "off" || body.toLowerCase() === "stop") && global.yuCommandStatus[threadID]) {
        global.yuCommandStatus[threadID] = false;
    }
};
