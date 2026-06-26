const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");

// পাথের কনফিগারেশন
const dbPath = path.join(__dirname, "spam_db.json");
const dbBackupPath = path.join(__dirname, "spam_db.bak.json");
const cacheDir = path.join(__dirname, "spam_cache");
const logPath = path.join(__dirname, "spam.log");

// ইন-মেমরি ট্র্যাকার্স (মেমরি লিক প্রুফ করার জন্য Map ব্যবহার করা হয়েছে)
if (!global.spamMsgCache) global.spamMsgCache = new Map();
if (!global.spamSettings) global.spamSettings = new Map();
if (!global.spamQueue) global.spamQueue = [];
if (!global.spamProcessingQueue) global.spamProcessingQueue = false;

// প্রোটেকশন ও কুলডাউন ট্র্যাকার্স
const userCooldowns = new Map();
const threadCooldowns = new Map();
let globalCooldownTime = 0;

const userMsgCount = new Map();
const threadMsgCount = new Map();
let globalMsgCount = [];

// রেট লিমিট অ্যাডাপ্টিভ ডিলে
let rateLimitDelayModifier = 0;

// লগার সিস্টেম
function logError(errorText) {
    const time = new Date().toLocaleString();
    const logMessage = `[${time}] ${errorText}\n`;
    console.error(`[SPAM ERROR] ${errorText}`);
    fs.appendFile(logPath, logMessage, () => {});
}

// স্টার্টআপ ক্লিনার এবং ডিরেক্টরি তৈরি
try {
    fs.ensureDirSync(cacheDir);
    // ২৫. Startup Cleaner: বটের পুরনো টেম্পোরারি ফাইল বুট হওয়ার সময় ডিলিট করা
    fs.emptyDirSync(cacheDir);
} catch (e) {
    logError(`Startup clean fail: ${e.message}`);
}

// ২০. JSON Protection & ২১. Atomic Save (ফল্ট টলারেন্ট ডাটাবেজ মেকানিজম)
function loadDatabase() {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readJsonSync(dbPath, { throws: false });
            if (data) {
                Object.keys(data).forEach(k => global.spamSettings.set(k, data[k]));
                return;
            }
        }
        if (fs.existsSync(dbBackupPath)) {
            const data = fs.readJsonSync(dbBackupPath, { throws: false });
            if (data) {
                Object.keys(data).forEach(k => global.spamSettings.set(k, data[k]));
                fs.writeJsonSync(dbPath, data);
                return;
            }
        }
    } catch (e) {
        logError(`Database corrupt, re-creating... Error: ${e.message}`);
    }
    fs.writeJsonSync(dbPath, {});
}

function saveDatabase() {
    const tempPath = `${dbPath}.tmp`;
    try {
        const obj = Object.fromEntries(global.spamSettings);
        fs.writeJsonSync(tempPath, obj, { spaces: 2 });
        fs.renameSync(tempPath, dbPath);
        fs.writeJsonSync(dbBackupPath, obj, { spaces: 2 });
    } catch (e) {
        logError(`Atomic save failed: ${e.message}`);
        if (fs.existsSync(tempPath)) fs.removeSync(tempPath);
    }
}

loadDatabase();

// এক্সটেনশন ডিটেক্টর (MIME Type অনুযায়ী সঠিক ফাইল এক্সটেনশন)
function getExtFromMime(mimeType) {
    if (!mimeType) return "bin";
    const map = {
        "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp",
        "video/mp4": "mp4", "video/quicktime": "mov", "audio/mpeg": "mp3", "audio/aac": "aac",
        "audio/ogg": "ogg", "application/pdf": "pdf", "application/zip": "zip", 
        "application/x-rar-compressed": "rar", "text/plain": "txt", "text/html": "html",
        "application/json": "json", "application/javascript": "js"
    };
    return map[mimeType.toLowerCase()] || mimeType.split("/")[1] || "bin";
}

// হেভী ডিউটি ১৩. Queue System & ১৪. Dynamic Delay
async function processQueue() {
    if (global.spamProcessingQueue || global.spamQueue.length === 0) return;
    global.spamProcessingQueue = true;

    while (global.spamQueue.length > 0) {
        const task = global.spamQueue.shift();
        try {
            // ২০০-৫০০ms ডাইনামিক ডিলে + রেট লিমিট পেনাল্টি ডিলে
            const baseDelay = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
            await new Promise(r => setTimeout(r, baseDelay + rateLimitDelayModifier));
            await task();
            if (rateLimitDelayModifier > 0) rateLimitDelayModifier -= 50; // ধীরে ধীরে ডিলে কমানো
        } catch (err) {
            logError(`Queue execution error: ${err.message}`);
        }
    }
    global.spamProcessingQueue = false;
}

module.exports = {
    config: {
        name: "spam",
        version: "6.0.0",
        author: "SIYAM-HASAN",
        countDown: 0,
        role: 0, // ৩২. Role 0 সবার জন্য উন্মুক্ত
        description: "Enterprise Grade Anti-Unsend & Spam Protection",
        category: "utility",
        guide: "{pn} on | {pn} off"
    },

    // ৩১. Command & Chat trigger Handling
    onStart: async function ({ message, args, event }) {
        try {
            const tID = event.threadID;
            const input = (args[0] || event.body || "").toLowerCase();

            if (input.includes("off")) {
                global.spamSettings.set(tID, false);
                saveDatabase();
                return message.reply("❌ 𝗦𝗣𝗔𝗠 𝗦𝗬𝗦𝗧𝗘𝗠 𝗧𝗨𝗥𝗡𝗘𝗗 𝗢𝗙𝗙!");
            } else if (input.includes("on")) {
                global.spamSettings.set(tID, true);
                saveDatabase();
                return message.reply("✅ 𝗦𝗣𝗔𝗠 𝗦𝗬𝗦𝗧𝗘𝗠 𝗧𝗨𝗥𝗡𝗘𝗗 𝗢𝗡!");
            } else {
                return message.reply("💡 ব্যবহার পদ্ধতি:\n» 'spam off' - বন্ধের জন্য\n» 'spam on' - চালুর জন্য");
            }
        } catch (e) {
            logError(`Command error: ${e.message}`);
        }
    },

    onEvent: async function ({ message, event, usersData }) {
        try {
            if (!event) return;
            const tID = event.threadID;
            const sID = event.senderID;
            
            // ১. Messenger Compatibility: সব ধরনের ইউনিক ডিলিট আইডি ডিটেক্ট করা
            const mID = event.messageID || event.deletedMessageID || (event.messageReply && event.messageReply.messageID);

            // চ্যাটে সাধারণ টেক্সট ডিটেকশন সমর্থন করা
            if (event.body && (event.body.toLowerCase() === "spam off" || event.body.toLowerCase() === "spam on")) {
                global.spamSettings.set(tID, event.body.toLowerCase() === "spam on");
                saveDatabase();
                return message.reply(event.body.toLowerCase() === "spam on" ? "✅ 𝗦𝗣𝗔𝗠 𝗦𝗬𝗦𝗧𝗘𝗠 𝗧𝗨𝗥𝗡𝗘𝗗 𝗢𝗡!" : "❌ 𝗦𝗣𝗔𝗠 𝗦𝗬𝗦𝗧𝗘𝗠 𝗧𝗨𝗥𝗡𝗘𝗗 𝗢𝗙𝗙!");
            }

            // ২৯. Auto Enable: ডিফল্টভাবে সব গ্রুপে অন রাখা
            const isEnabled = global.spamSettings.has(tID) ? global.spamSettings.get(tID) : true;
            if (!isEnabled) return;

            // চ্যাট ড্যাশবোর্ড ব্যাকআপ (মেসেজ ক্যাশ সংরক্ষণ)
            if (event.type === "message" || event.type === "message_reply") {
                const cacheData = {
                    mID: mID, tID: tID, sID: sID,
                    body: event.body || "",
                    mentions: event.mentions || {},
                    timestamp: Date.now(),
                    attachments: [],
                    replyInfo: event.messageReply ? { sID: event.messageReply.senderID, body: event.messageReply.body } : null
                };

                // ৯. Group ভিত্তিক ৯. Cache Limit (প্রতি গ্রুপে সর্বোচ্চ ১০০০ মেসেজ)
                let groupCacheKeys = Array.from(global.spamMsgCache.values()).filter(x => x.tID === tID).map(x => x.mID);
                if (groupCacheKeys.length >= 1000) {
                    const oldKey = groupCacheKeys[0];
                    const oldData = global.spamMsgCache.get(oldKey);
                    if (oldData && oldData.attachments) {
                        oldData.attachments.forEach(a => fs.remove(a.localPath).catch(() => {}));
                    }
                    global.spamMsgCache.delete(oldKey);
                }

                if (event.attachments && event.attachments.length > 0) {
                    for (const att of event.attachments) {
                        // ২৬. Large File Protection (২৫ এমবির বেশি ফাইল ক্যাশ না করা)
                        if (att.size && att.size > 25 * 1024 * 1024) continue;

                        let ext = getExtFromMime(att.mimeType);
                        let randName = `att_${crypto.randomBytes(4).toString("hex")}.${ext}`;
                        let localPath = path.join(cacheDir, randName);

                        const attObj = {
                            type: att.type ? att.type.toUpperCase() : "FILE",
                            url: att.url, localPath: localPath,
                            downloadPromise: null, isDownloaded: false,
                            size: att.size || 0, ext: ext
                        };

                        // ৫. Download Race Condition: মেসেজ আসার সাথে সাথে ডাউনলোড শুরু করা
                        if (att.url) {
                            attObj.downloadPromise = (async () => {
                                // ৬. Retry System: ৩ বার রিট্রাই লজিক
                                for (let r = 1; r <= 3; r++) {
                                    try {
                                        const res = await axios({ method: "get", url: att.url, responseType: "stream", timeout: 10000 });
                                        const writer = fs.createWriteStream(localPath);
                                        res.data.pipe(writer);
                                        await new Promise((res, rej) => { writer.on("finish", res); writer.on("error", rej); });
                                        
                                        // ৭. Attachment Integrity Check
                                        if (fs.existsSync(localPath) && fs.statSync(localPath).size > 0) {
                                            attObj.isDownloaded = true;
                                            break;
                                        }
                                    } catch (err) {
                                        if (r === 3) logError(`Failed downloading attachment after 3 retries: ${err.message}`);
                                        await new Promise(resolve => setTimeout(resolve, 1000)); // ১ সেকেন্ড ডিলে
                                    }
                                }
                            })();
                        }
                        cacheData.attachments.push(attObj);
                    }
                }

                global.spamMsgCache.set(mID, cacheData);

                // ১০. Cache Expire (১ ঘণ্টা পর মেমরি ও লোকাল ড্রাইভ ফাইল ফ্লাশ করা)
                setTimeout(() => {
                    const data = global.spamMsgCache.get(mID);
                    if (data) {
                        if (data.attachments) data.attachments.forEach(a => fs.remove(a.localPath).catch(() => {}));
                        global.spamMsgCache.delete(mID);
                    }
                }, 60 * 60 * 1000);
                return;
            }

            // ডিলিট ইভেন্ট স্ক্যান (সব সম্ভাব্য ভ্যারিয়েন্ট চেক করা)
            if (event.type === "message_unsend" || event.logMessageType === "message_unsend" || event.action === "message_unsend" || !event.body && mID && global.spamMsgCache.has(mID)) {
                
                const savedMsg = global.spamMsgCache.get(mID);
                if (!savedMsg) return;

                const now = Date.now();

                // 🛑 ৩-স্তরের অ্যাডভান্সড অ্যান্টি-স্প্যাম প্রটেকশন
                if (now < globalCooldownTime) return;
                if (threadCooldowns.has(tID) && now < threadCooldowns.get(tID)) return;
                if (userCooldowns.has(sID) && now < userCooldowns.get(sID)) return;

                // ১৮. Global Cooldown (১০ সেকেন্ডে ১৫+ ডিলিট হলে ৩ মিনিট ব্লক)
                globalMsgCount.push(now);
                globalMsgCount = globalMsgCount.filter(t => now - t < 10000);
                if (globalMsgCount.length > 15) {
                    globalCooldownTime = now + (3 * 60 * 1000);
                    return message.reply("🚨 𝗚𝗟𝗢𝗕𝗔𝗟 𝗙𝗟𝗢𝗢𝗗 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗!\nবটের আইডি ও মেমরি সুরক্ষার্থে বৈশ্বিক রিকভারি ৩ মিনিটের জন্য বন্ধ করা হলো।");
                }

                // ১৭. Thread Cooldown (৫ সেকেন্ডে ৫+ ডিলিট হলে ৩ মিনিট থ্রেড লক)
                let tCount = threadMsgCount.get(tID) || [];
                tCount.push(now);
                tCount = tCount.filter(t => now - t < 5000);
                threadMsgCount.set(tID, tCount);
                if (tCount.length > 5) {
                    threadCooldowns.set(tID, now + (3 * 60 * 1000));
                    return message.reply("⚠️ 𝗧𝗛𝗥𝗘𝗔𝗗 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗!\nএই গ্রুপে ফ্লাড ডিটেক্ট হওয়ায় আগামী ৩ মিনিটের জন্য রিকভারি পজ করা হলো।");
                }

                // ১৬. User Cooldown (৫ সেকেন্ডে ৩+ ডিলিট হলে ৩ মিনিট ইউজার লক)
                let uCount = userMsgCount.get(sID) || [];
                uCount.push(now);
                uCount = uCount.filter(t => now - t < 5000);
                userMsgCount.set(sID, uCount);
                if (uCount.length > 3) {
                    userCooldowns.set(sID, now + (3 * 60 * 1000));
                    return message.reply(`🛑 𝗨𝗦𝗘𝗥 𝗕𝗟𝗢𝗖𝗞𝗘𝗗!\nঅতিরিক্ত মেসেজ আনসেন্ড করার জন্য আপনাকে ৩ মিনিটের জন্য ব্লক করা হলো।`);
                }

                // ১২. Duplicate Protection (একই মেসেজ সেকেন্ড টাইম প্রোসেস হবে না)
                global.spamMsgCache.delete(mID);

                // কিউ টাস্ক পুশ (Sequential Processing)
                global.spamQueue.push(async () => {
                    try {
                        const name = await usersData.getNameUser(savedMsg.sID) || "Facebook User";
                        let mainAtt = savedMsg.attachments.length > 0 ? savedMsg.attachments[0].type : "TEXT";

                        // ৩৩. Message Design & ৩৪. Footer
                        let recoveryMsg = `╭━━━━━━━━━━━━━━╮\n🚨 𝗦𝗣𝗔𝗠 𝗕𝗟𝗢𝗖𝗞𝗘𝗗\n╰━━━━━━━━━━━━━━╯\n👤 USER : ${name}\n🗑️ Deleted : ${mainAtt}\n📩 Restored Successfully\n😏 ভাবছস ডিলিট দিলে বাঁচবি?\nআমি থাকতে তোর msg গায়েব হবে না!\nপি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ.alllist\n💬 Type "spam off" to disable in this group.\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝗔𝗡 👑`;

                        if (savedMsg.body) {
                            recoveryMsg += `\n\n📝 CONTENT:\n${savedMsg.body}`;
                        }
                        if (savedMsg.replyInfo) {
                            recoveryMsg += `\n\n↩️ REPLIED TO:\n👤 Sender: ${savedMsg.replyInfo.sID}\n💬 Msg: ${savedMsg.replyInfo.body || "[Media Attachment]"}`;
                        }

                        const payload = { body: recoveryMsg, attachment: [] };

                        if (savedMsg.attachments && savedMsg.attachments.length > 0) {
                            // রেট লিমিট অ্যাডাপ্টিভ ডিলে মডিফায়ার আপডেট
                            rateLimitDelayModifier += (savedMsg.attachments.length * 150);

                            for (const att of savedMsg.attachments) {
                                // যদি ডাউনলোড প্রমিস এখনো চলমান থাকে তবে অপেক্ষা করা (Download Race Condition ফিক্স)
                                if (att.downloadPromise) await att.downloadPromise;

                                if (att.isDownloaded && fs.existsSync(att.localPath)) {
                                    payload.attachment.push(fs.createReadStream(att.localPath));
                                } else if (att.url) {
                                    // ২৭. Attachment Fallback (লোকাল ফাইল করাপ্ট হলে অরিজিনাল ইউআরএল স্ট্রিম করা)
                                    try {
                                        payload.attachment.push(await global.utils.getStreamFromURL(att.url));
                                    } catch (e) {
                                        logError(`Fallback stream fail: ${e.message}`);
                                    }
                                }
                            }
                        }

                        if (payload.attachment.length === 0) delete payload.attachment;

                        // ফেসবুক সার্ভারে রেসপন্স সেন্ড করা
                        await message.reply(payload);

                        // ২৪. Temporary File Cleaner: রেস্টোর কমপ্লিট হলে সাথে সাথে ফাইল ডিলিট
                        if (savedMsg.attachments) {
                            savedMsg.attachments.forEach(a => fs.remove(a.localPath).catch(() => {}));
                        }

                    } catch (err) {
                        logError(`Critical restore failure: ${err.message}`);
                        // ১৫. Adaptive Rate Limit (ফেসবুক রেট লিমিট ধরলে অটো ডিলে ৩০০০০ms বাড়িয়ে দেবে)
                        if (err.message && err.message.includes("429")) {
                            rateLimitDelayModifier += 30000;
                        }
                    }
                });

                // কিউ প্রসেসর ট্রিগার করা
                processQueue();
            }
        } catch (error) {
            logError(`Critical event failure: ${error.message}`);
        }
    }
};
