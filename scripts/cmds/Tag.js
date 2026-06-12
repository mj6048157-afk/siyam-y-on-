let tagStates = {};

// 🔒 [HARD LOCK 1] - গ্লোবাল অথর নেম ভেরিফিকেশন (এখানে হাত দিলেই বট ডেড)
const CORE_AUTHOR = "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑";
if (CORE_AUTHOR !== "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑") {
    console.error("❌ AUTHOR NAME MODIFIED! SECURITY BREACH DETECTED. CLOSING BOT...");
    process.exit(1);
}

module.exports = {
    config: {
        name: "tag",
        version: "7.5",
        author: "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑", // 🔒 [HARD LOCK 2] - কনফিগ অথর লক
        role: 0,
        category: "GROUP",
        shortDescription: "Auto tag members with custom premium styles",
        longDescription: "tag on = চালু, tag off = বন্ধ।",
        guide: "tag on / tag off"
    },

    onStart: async function () {},

    onChat: async function ({ api, event }) {
        // 🔒 [HARD LOCK 3] - রান-টাইম সিকিউরিটি চেক (কোনোভাবেই বাইপাস করা সম্ভব না)
        if (this.config.author !== "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑" || CORE_AUTHOR !== "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑") {
            console.error("❌ CRITICAL: Unauthorized credit change detected! Stopping process...");
            return process.exit(1);
        }

        try {
            const body = event.body?.toLowerCase().trim();
            const threadID = event.threadID;

            if (body === "tag on") {  
                if (tagStates[threadID]?.running) {
                    return api.sendMessage("☺️আমার বস🫶 সিয়াম 😃!", threadID);  
                }
                tagStates[threadID] = { running: true, manualStop: false };  
                api.sendMessage("👑 সিয়াম ভাই, আপনার ট্যাগ সিস্টেম চালু হয়েছে!\n🚫 বন্ধ করতে 'tag off' লিখুন।", threadID);  
                this.startTagLoop(api, threadID);  
                return;  
            }  

            if (body === "tag off") {  
                if (tagStates[threadID]) {
                    tagStates[threadID].running = false;  
                    tagStates[threadID].manualStop = true; // ম্যানুয়াল স্টপ ফ্ল্যাগ অন
                }
                return api.sendMessage("❌ সিয়াম ভাই, ট্যাগ সিস্টেমটি সফলভাবে বন্ধ করা হয়েছে। 👑", threadID);  
            }  
        } catch (err) { 
            api.sendMessage("Error: " + err.message, event.threadID); 
        }
    },

    startTagLoop: async function (api, threadID) {
        // 💫 সিয়াম ভাইয়ের জন্য স্পেশাল ২০টি প্রিমিয়াম রাজকীয় ডিজাইন টেক্সট
        const baseMessages = [
            "╭〔 亗 𝗦𝗜𝗬𝗔𝗠 𝗫 𝗛𝗔𝗦𝗔𝗡 亗 〕╮\n┃ ⚡ এইযে মহাশয়! গ্রুপে একটু হাজিরা দিন!\n┃ 🔥 শুধু সিন করলে কিন্তু খবর আছে!\n╰───────────────•",
            "╭〔 🦅 𝔖𝔦𝔶𝔞𝔪 𝔛 ℌ𝔞𝔰𝔞𝔫 🦅 〕╮\n┃ 💎 আড্ডায় আপনার উপস্থিতি একান্ত প্রয়োজন!\n┃ ✨ দ্রুত অনলাইনে চলে আসুন বস!\n╰───────────────•",
            "╭〔 𓆩👑𓆪 𝕊𝕚𝕪𝕒𝕞 𝕂𝕙𝕒𝕟 𓆩👑𓆪 〕╮\n┃ 📢 কিং এর গ্রুপে নীরবতা একদম নিষিদ্ধ!\n┃ 💥 জলদি সবাই ইনবক্স কাঁপাতে চলে এসো!\n╰───────────────•",
            "╭〔 🥀 𝓢𝓲𝔂𝓪𝓶 𝓗𝓪𝔰𝔞𝔫 🥀 〕╮\n┃ 🎯 আপনার মূল্যবান সময়টা গ্রুপে দিন!\n┃ 💌 আড্ডা কিন্তু অলরেডি জমে উঠেছে!\n╰───────────────•",
            "╭〔 ⚔️ 𝘚𝘐𝘠𝘈𝘔 𝘉𝘖𝘚𝘚 ⚔️ 〕╮\n┃ 🚨 কিরে ভাই? সবাই কি ঘুমায় গেছো নাকি?\n┃ 🥶 জলদি এসে গ্রুপে রেসপন্স করো!\n╰───────────────•",
            "╭〔 𓆩🔥𓆪 𝓢𝓲𝔂𝓪𝓶_𝓥𝓲𝓹 𓆩🔥𓆪 〕╮\n┃ 🪐 গ্রুপটা পুরো ফাঁকা ফাঁকা লাগতেছে!\n┃ 🎭 সবাই এসে একটু আগুন জ্বালাও তো!\n╰───────────────•",
            "╭〔 🌀 𝖲𝖨𝖸𝖠𝖬 𝖪𝖨𝖭𝖦 😂 〕╮\n┃ 👑 ভিআইপি মেম্বারকে সিয়াম বসের গ্রুপে স্মরণ করা হচ্ছে!\n┃ 💬 এসে এক কাপ চা খেয়ে যান!\n╰───────────────•",
            "╭〔 🔮 𝓢𝓲𝔂𝓪𝓶 Custom 🔮 〕╮\n┃ ⭐ এত এটিটিউড না দেখিয়ে একটু কথা বলো!\n┃ 🤍 তোমার একটা মেসেজে আড্ডা পূর্ণ হবে!\n╰───────────────•",
            "╭〔 🎭 𝔖𝔦𝔶𝔞𝔪 ℌ𝔞𝔰𝔞𝔫 🎭 〕╮\n┃ 🚀 রকেট গতিতে সবাই গ্রুপে ব্যাক করো!\n┃ 🥳 আজকে ধামাকা আড্ডা হবে সবার সাথে!\n╰───────────────•",
            "╭〔 🔱 👑𝐒𝐈𝐘𝐀𝐌_𝐗_𝐁𝐎𝐒𝐒👑 🔱 〕╮\n┃ 🔊 বস অর্ডার করেছে, নো ইগনোরিং!\n┃ ⚡ সাথে সাথে গ্রুপে একটিভ হও!\n╰───────────────•",
            "╭〔 🦾 𝘚𝘪𝘺𝘢𝘮 𝘏𝘢𝔰𝘢𝘯 🦾 〕╮\n┃ ⛓️ জং ধরা আড্ডায় একটু তুফান আনো!\n┃ 💥 চুপচাপ থাকা মেম্বারদের লাথি দেওয়া হবে!\n╰───────────────•",
            "╭〔 👾 𝕊𝕚𝕪𝕒𝕞 𝕏 𝔹𝕠𝕤𝕤 👾 〕╮\n┃ 🛸 এলিয়েনের মতো লুকিয়ে না থেকে সামনে আসো!\n┃ ✨ গ্রুপে একটু নিজের রূপ দেখাও!\n╰───────────────•",
            "╭〔 🦁 𝕾𝖎𝖞𝖆𝖒 𝕶𝖍𝖆𝖓 🦁 〕╮\n┃ 🩸 রিয়েল আড্ডাবাজ হলে মাঠে নেমে পড়ো!\n┃ 📣 কিং এর গ্রুপে ব্যাক করার টাইম শেষ!\n╰───────────────•",
            "╭〔 🎸 𝓢𝓲𝔂𝓪𝓶 𝓑𝓸𝓼𝓼 🎸 〕╮\n┃ 🎶 মিউজিকের তালে তালে আড্ডা শুরু করা যাক!\n┃ 🕺 জলদি সবাই অনলাইন লাইনে চলে এসো!\n╰───────────────•",
            "╭〔 🃏 𝔖𝔦𝔶𝔞𝔪 𝔛 𝔅𝔬𝔰𝔰 🃏 〕╮\n┃ 🎭 জোকারদের মতো আড়ালে থেকো না!\n┃ 💎 রিয়েল মেম্বার হয়ে গ্রুপে ঝড় তোলো!\n╰───────────────•",
            "╭〔 🦅 𝘚𝘐𝘠𝘈𝘔 𝘒𝘐𝘕𝘎 🦅 〕╮\n┃ 🔔 সিয়াম ভাইয়ের স্পেশাল নোটিফিকেশন গেছে!\n┃ 🚨 এটা দেখার পর অফলাইন থাকলে শাস্তি নিশ্চিত!\n╰───────────────•",
            "╭〔 👑 𝕊𝕚𝕪𝕒𝕞 ℍ𝔞𝔰𝔞ℕ 👑 〕╮\n┃ 🎯 আপনার মতো কিউট মেম্বার গ্রুপে দরকার!\n┃ 🥰 লজ্জা না পেয়ে কথা বলা শুরু করুন!\n╰───────────────•",
            "╭〔 ⚡ 𝓢𝓲𝔂𝓪𝓶_𝓥𝓲𝓹 ⚡ 〕╮\n┃ 📢 এটেনশন প্লিজ! বস আপনাকে ডেকেছে!\n┃ 💥 কোনোরকম অজুহাত ছাড়া একটিভ হন!\n╰───────────────•",
            "╭〔 🖤 𝕾𝖎𝖞𝖆𝖒 𝕶𝖍𝖆𝖓 🖤 〕╮\n┃ 🌌 রাত যত গভীর হয়, আড্ডা তত রঙিন হয়!\n┃ ⭐ জলদি এসে আড্ডার পার্টনার হয়ে যাও!\n╰───────────────•",
            "╭〔 ⚜️ 𝔖𝔦𝔶𝔞𝔪 ℌ𝔞𝔰𝔞𝔫 ⚜️ 〕╮\n┃ 💎 আপনি আমাদের গ্রুপের স্পেশাল পার্ট!\n┃ 👑 তাই চুপ না থেকে গ্রুপে রেসপন্স দিন!\n╰───────────────•"
        ];

        try {  
            const threadInfo = await api.getThreadInfo(threadID);  
            const members = threadInfo.participantIDs || [];  
            const userInfo = Array.isArray(threadInfo.userInfo) ? threadInfo.userInfo : [];  

            // 👑 নিখুঁত লুপ: প্রতি মেম্বারকে শুধু ১ বার ট্যাগ করবে
            for (const uid of members) {  
                // যদি আপনি ম্যানুয়ালি 'tag off' লিখে দেন, তবে লুপ সাথে সাথে বন্ধ হবে
                if (!tagStates[threadID]?.running) break;  

                // বটের নিজের আইডি বাদ দেওয়ার জন্য যেন বট নিজেকে ট্যাগ না করে
                if (uid == api.getCurrentUserID()) continue;

                const baseMsg = baseMessages[Math.floor(Math.random() * baseMessages.length)];  
                const user = userInfo.find(u => String(u.id) === String(uid));
                const userName = user?.name || "সম্মানিত সদস্য";  
                
                const msg = `${baseMsg}\n👉 『 @${userName} 』`;  

                await api.sendMessage({  
                    body: msg,  
                    mentions: [{  
                        tag: `@${userName}`,  
                        id: uid  
                    }]  
                }, threadID);  

                // স্প্যাম ব্লক এড়াতে প্রতি ট্যাগের মাঝে ৪ সেকেন্ডের নিখুঁত বিরতি
                await new Promise(resolve => setTimeout(resolve, 4000));  
            }  
            
            // 🤖 লুপ শেষ হওয়ার পর অটোমেটিক সিস্টেম অফ করার লজিক (ম্যানুয়ালি অফ না করা হলে)
            if (tagStates[threadID]?.running && !tagStates[threadID]?.manualStop) {
                tagStates[threadID].running = false;
                api.sendMessage("✅ সিয়াম ভাই, গ্রুপের সকল সদস্যকে একবার করে ট্যাগ করা সম্পন্ন হয়েছে। সিস্টেম এখন অটো-অফ। 👑", threadID);
            }

        } catch (err) {  
            console.error(err);  
            if (tagStates[threadID]) tagStates[threadID].running = false;  
            api.sendMessage("❌ ট্যাগ লুপে কোনো সমস্যা হয়েছে বা মেম্বার ডাটা পাওয়া যায়নি।", threadID);
        }
    }
};
