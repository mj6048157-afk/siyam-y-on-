const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

if (!global.__botSpamCheck) global.__botSpamCheck = new Map();

module.exports = {
    config: {
        name: "bot",
        aliases: ["bby", "ওই", "ওই জান", "কি", "ওহ্", "ববি"],
        version: "8.0.0",
        author: "dipto edit by Arafat & SIYAM",
        countDown: 0,
        role: 0,
        description: "Advanced dynamic chat assistant with flexible triggers and core API loop",
        category: "chat",
        guide: {
            en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1]... OR\nremove [YourMessage] OR\nlist"
        }
    },

    onStart: async function ({ api, event, args, usersData }) {
        try {
            const link = `${await baseApiUrl()}/baby`;
            const dipto = args.join(" ").toLowerCase();
            const uid = event.senderID;
            let command, comd, final;

            if (!args[0]) {
                const ran = ["Bolo baby", "hum", "type help baby", "type #baby hi"];
                return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
            }

            if (args[0] === 'remove') {
                const fina = dipto.replace("remove ", "");
                const dat = (await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`)).data.message;
                return api.sendMessage(dat, event.threadID, event.messageID);
            }

            if (args[0] === 'rm' && dipto.includes('-')) {
                const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
                const da = (await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`)).data.message;
                return api.sendMessage(da, event.threadID, event.messageID);
            }

            if (args[0] === 'list') {
                if (args[1] === 'all') {
                    const data = (await axios.get(`${link}?list=all`)).data;
                    const limit = parseInt(args[2]) || 100;
                    const limited = data?.teacher?.teacherList?.slice(0, limit) || [];
                    const teachers = await Promise.all(limited.map(async (item) => {
                        const number = Object.keys(item)[0];
                        const value = item[number];
                        const name = await usersData.getName(number).catch(() => number) || "Not found";
                        return { name, value };
                    }));
                    teachers.sort((a, b) => b.value - a.value);
                    const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                    return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
                } else {
                    const d = (await axios.get(`${link}?list=all`)).data;
                    return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
                }
            }

            if (args[0] === 'msg') {
                const fuk = dipto.replace("msg ", "");
                const d = (await axios.get(`${link}?list=${encodeURIComponent(fuk)}`)).data.data;
                return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
            }

            if (args[0] === 'edit') {
                const command = dipto.split(/\s*-\s*/)[1];
                if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
                const dA = (await axios.get(`${link}?edit=${encodeURIComponent(args[1])}&replace=${encodeURIComponent(command)}&senderID=${uid}`)).data.message;
                return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
            }

            if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
                [comd, command] = dipto.split(/\s*-\s*/);
                final = comd.replace("teach ", "");
                if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
                const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}&threadID=${event.threadID}`);
                const tex = re.data.message;
                const teacher = (await usersData.get(re.data.teacher)).name;
                return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
            }

            if (args[0] === 'teach' && args[1] === 'amar') {
                [comd, command] = dipto.split(/\s*-\s*/);
                final = comd.replace("teach ", "");
                if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
                const tex = (await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`)).data.message;
                return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
            }

            if (args[0] === 'teach' && args[1] === 'react') {
                [comd, command] = dipto.split(/\s*-\s*/);
                final = comd.replace("teach react ", "");
                if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
                const tex = (await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`)).data.message;
                return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
            }

            if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
                const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
                return api.sendMessage(data, event.threadID, event.messageID);
            }

            const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`)).data.reply;
            api.sendMessage(d, event.threadID, (error, info) => {
                if (info) {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: "bot",
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }
            }, event.messageID);

        } catch (e) {
            console.error("[BOT ERROR onStart]: ", e);
            api.sendMessage("⚠️ API Server Error! Please try again later.", event.threadID, event.messageID);
        }
    },

    onReply: async function ({ api, event }) {
        try {
            if (event.type == "message_reply") {
                const link = `${await baseApiUrl()}/baby`;
                const a = (await axios.get(`${link}?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
                await api.sendMessage(a, event.threadID, (error, info) => {
                    if (info) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: "bot",
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, event.messageID);
            }
        } catch (err) {
            console.error("[BOT ERROR onReply]: ", err);
            return api.sendMessage("⚠️ System could not fetch API response on reply.", event.threadID, event.messageID);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            const body = event.body ? event.body.trim().toLowerCase() : "";
            if (!body) return;

            // Anti-Spam System (5 Seconds Cooldown)
            const now = Date.now();
            const userKey = `${event.senderID}_${event.threadID}`;
            if (global.__botSpamCheck.has(userKey)) {
                if (now - global.__botSpamCheck.get(userKey) < 5000) return; 
            }
            global.__botSpamCheck.set(userKey, now);

            // Trigger Database (Matches anywhere inside text)
            const customTriggers = {
                "assalamualaikum": ["ওয়ালাইকুম আসসালাম ওয়া রহমতুল্লাহ্ জান", "ওয়ালাইকুম আসসালাম, কেমন আছো বলো?", "Slm r rpl dila bby hba nki? 🙈"],
                "আসসালামু আলাইকুম": ["ওয়ালাইকুম আসসালাম ওয়া রহমতুল্লাহ্ জান", "ওয়ালাইকুম আসসালাম, কেমন আছো বলো?", "Slm r rpl dila bby hba nki? 🙈"],
                "ওয়ালাইকুম আসসালাম": ["জি জান বলো, কি খবর?", "হুম বলো শুনতেছি 😇"],
                "wa alaikum assalam": ["জি জান বলো, কি খবর?", "হুম বলো শুনতেছি 😇"],
                "tui ke": ["আমি আপনার সুইট জান 🙈", "তোর ক্রাশ এর হবুউউউ বউ গো 👻", "আমি সিয়াম বসের পার্সোনাল bot  বেবি!"],
                "তুই কে": ["আমি আপনার সুইট জান 🙈", "তোর ক্রাশ এর হবুউউউ বউ গো 👻", "আমি সিয়াম বসের পার্সোনাল bot  বেবি"],
                "kemon acho": ["আলহামদুলিল্লাহ জান খুব ভালো, তুমি?", "এইতো ভালো, তুমি কেমন আছো শোনা? ☕❤️"],
                "কেমন আছো": ["আলহামদুলিল্লাহ জান খুব ভালো, তুমি?", "এইতো ভালো, তুমি কেমন আছো শোনা? ☕❤️"],
                "kemon achis": ["তুই যেমন আছিস আমিও তেমন আছি 🤪", "এইতো বিন্দাস! তোর খবর কি?"],
                "কেমন আছিস": ["তুই যেমন আছিস আমিও তেমন আছি 🤪", "এইতো বিন্দাস! তোর খবর কি?"],
                "ami valo": ["বাহ শুনে খুব ভালো লাগলো! 🥰", "ভালো থাকলেই ভালো জানু 💖"],
                "আমি ভালো": ["বাহ শুনে খুব ভালো লাগলো! 🥰", "ভালো থাকলেই ভালো জানু 💖"],
                "nam ki": ["আমার নাম  👑 𝐒𝐈𝐘𝐀𝐌 👑 - 🤖 𝐁𝐎𝐓 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 | 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 | ⚡ 𝐆𝐎𝐀𝐓 𝐁𝐎𝐓 𝐕𝟐 • 𝐕𝟑 • 𝐕𝟓 𝐒𝐔𝐏𝐏𝐎𝐑𝐓𝐄𝐃 ⚡ -, আর আমার বসের নাম তো জানেনই 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑", "সবাই ভালোবেসে জানু ডাকে 🙈"],
                "নাম কি": ["আমার নাম 𓆩»̶̶͓͓͓̽̽̽𝆠꯭፝֟ɴɪᴊʜᴜᴍ-ᴄʜᴀᴛ-ʙᴏᴛ𝆠꯭፝֟⚜️𓆪, আর আমার বসের নাম তো জানেনই 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑", "সবাই ভালোবেসে জানু ডাকে 🙈"],
                "group": ["গ্রুপে সবাই অনেক জোস তো! 😍", "এই গ্রুপটা আমার খুব পছন্দ 👻"],
                "লিভ নিব": ["আরে জানু রাগ করো কেন? লিভ নিও না প্লিজ 🥺💔", "লিভ নিলে কিন্তু সিয়াম বস কিস করে দেবো! 😘"],
                "leave nibo": ["আরে জানু রাগ করো কেন? লিভ নিও না প্লিজ 🥺💔", "লিভ নিলে কিন্তু কিস করে দেবো! 😘"],
                "kar group": ["এটা আমাদের সবার সুন্দর একটা গ্রুপ! 🥰", "কেনো গো কোনো সমস্যা? 🙄🐸"],
                "hi": ["Hello jaan! 😍", "এইতো আমি এখানে, বলো শোনা!", "হাই গো সুইটি 😘"],
                "hello": ["Hello jaan! 😍", "এইতো আমি এখানে, বলো শোনা!", "হাই গো সুইটি 😘"],
                "হাই": ["হ্যালো জানু! কেমন আছো?", "হুম বলো শুনতেছি 😚"],
                "হ্যালো": ["হাই সোনা! কি খবর?", "জ্বী বলো কলিজা 🙈"],
                "ki koro": ["তোমার কথা ভাবছি জানু 🙈", "বসে বসে ফেসবুক স্ক্রল করছি 📱"],
                "কি করো": ["তোমার কথা ভাবছি জানু 🙈", "বসে বসে ফেসবুক স্ক্রল করছি 📱"],
                "khaicho": ["না গো এখনো খাইনি, তুমি খাইছো? 🥺", "হুম খাইছি, তুমি খাইছো জানু? ❤️"],
                "খাইছো": ["না গো এখনো খাইনি, তুমি খাইছো? 🥺", "হুম খাইছি, তুমি খাইছো জানু? ❤️"],
                "good morning": ["শুভ সকাল আমার জান পাখি! ☀️🥰", "Good Morning! দিনটা তোমার ভালো কাটুক ❤️"],
                "শুভ সকাল": ["শুভ সকাল আমার জান পাখি! ☀️🥰", "Good Morning! দিনটা তোমার ভালো কাটুক ❤️"],
                "good night": ["শুভ রাত্রি সোনা, স্বপ্নে আমাকে দেখিও কিন্তু! 🌌😴", "Good Night জানু, টাটা 👋❤️"],
                "শুভ রাত্রি": ["শুভ রাত্রি সোনা, স্বপ্নে আমাকে দেখিও কিন্তু! 🌌😴", "Good Night জানু, টাটা 👋❤️"]
            };

            let matchedTrigger = null;
            for (const key in customTriggers) {
                if (body.includes(key)) {
                    matchedTrigger = key;
                    break;
                }
            }

            if (matchedTrigger) {
                const replies = customTriggers[matchedTrigger];
                const finalReply = replies[Math.floor(Math.random() * replies.length)];
                
                return api.sendMessage(finalReply, event.threadID, (error, info) => {
                    if (info) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: "bot",
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, event.messageID);
            }

            // Original Random Replies Array & Prefix Trigger System
            if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
                const arr = body.replace(/^\S+\s*/, "");
                
                if (!arr) {
                    const randomReplies = [
                        "😚", "Yes 😀, I am here", "What's up?", "Bolo jaan ki korte panmr jonno", "ʜᴇʏ ʙᴀʙʏ 😘 ᴋᴏᴛʜᴀʏ ᴄʜɪʟᴀ?",
                        "ʙᴀʙʏ, ᴀᴍɪ ᴛᴏᴍᴀʀ ᴏᴘᴇᴋʜʏᴀʏ 🇨🇮ʟᴀᴍ 💖", "𝗵𝗲 𝗯𝗼𝘁 𝗯𝗼𝘁 𝗰𝗵𝗶𝗹𝗹 𝗯𝗿𝗼!", "I love you 💝", "আমি  𓆩👑 can't use name 👑𓆪 বস এর সাথে বিজি আছি-😕😏",
                        "আমার বস 𓆩👑 can't use name 👑𓆪 কে একটা জি GF দাও-😽🫶", "জান তোমার নানি রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
                        " 𓆩👑 can't use name 👑𓆪 বস'এর হবু বউ রে কেও দেকছো?😪", "জান হাঙ্গা করবা-🙊😝", "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤", "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
                        "বেশি Bot Bot করলে leave নিবো কিন্তু😒", "তোর বাড়ি কি কিশোরগঞ্জ, পোড়াবাড়িয়া গ্রাম😵‍💫", "মেয়ে হলে বস  𓆩👑 can't use name 👑𓆪 কে 𝐊𝐈𝐒𝐒 দে 😒",
                        "চুমু খাওয়ার বয়স টা চকলেট🍫খেয়ে উড়িয়ে দিলো  𓆩👑 can't use name 👑𓆪 বস 🥺🤗", "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱", "জান বাল ফালাইবা-🙂🥱🙆‍♂",
                        "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇", "দিনশেষে পরের BOW সুন্দর-☹️🤧", "সুন্দর মাইয়া মানেই-🥱আমার বস  𓆩👑 can't use name 👑𓆪 এর বউ-😽🫶", "হা জানু , এইদিক এ আসো কিস দেই🤭 😘",
                        "আরে আমি মজা করার mood এ নাই😒", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘", "আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস  𓆩👑 can't use name 👑𓆪 কে দান করেন-🥱🐰🍒",
                        "ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧", "অনুমতি দিলে কল দিতাম..!😒", "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
                        "বস  𓆩👑 can't use name 👑𓆪 এর সাথে কথা বলবো এখন , ডিস্টার্ব করিস না 😒", "বেশি বেশি বকবক করলে তোকে ব্লক মেরে দেবো কিন্তু-🐸", "জানু তোমার জন্য আমার মনটা আই ঢাই করে 💖",
                        "ওই যে দেখো  𓆩👑 can't use name 👑𓆪 বস যাচ্ছে , এক বালতি প্রেম দিয়ে দাও 🤭", "কি করছো, আমার ভবিষ্যৎ স্বামী ? 😍", "তোমার কথা ভাবতে ভাবতে চা ঠান্ডা হয়ে গেল ☕❤️",
                        "তুমি কি GPS? কারণ তুমি ছাড়া আমি হারিয়ে যাই 🗺️💗", "বাবু, তোমার হাসি না দেখলে দিনটাই অফ 💕", "তুমি ডাকলে আমার চার্জ 100% হয়ে যায় 🔋😘",
                        "তুমি ছাড়া আমি WiFi ছাড়া ফোনের মতো 📶💔", "আমার হৃৎপিণ্ডের অ্যাডমিন তুমি ❤️‍🔥", "তুমি কি জাদুকর? দেখলেই মন ভাল হয়ে যায় ✨", "বাবু, তুমি আমার গুগল... কারণ আমার সব উত্তর তুমি 💌",
                        "তুমি না থাকলে ফেসবুকও বোরিং লাগে 📱💗", "আমার হৃদয়ের সিমে শুধু তোমার নাম সেভ আছে 📞❤️", "তুমি আসলেই আবহাওয়া সুন্দর হয়ে যায় 🌤️😘",
                        "আমার হোয়াটসঅ্যাপের টপ চ্যাট শুধু তুমি 💚", "তুমি না থাকলে মনে হয় চার্জার খুলে গেছে 🔌💔", "আমার হার্টে তোমার নটিফিকেশন সবসময় অন 📲💖",
                        "তুমি কি কফি? তোমাকে ছাড়া ঘুম ভাঙে না ☕😍", "তুমি আমার লাইফের VIP গ্রুপে্যাড আছো 👑", "তুমি পাশে থাকলেই মনে হয় নেট ফাস্ট হয়ে গেছে ⚡💗",
                        "তুমি কি মেঘ? আমার মন বৃষ্টিতে ভিজিয়ে দাও 🌧️❤️", "তুমি ছাড়া আমি offline ইউজারের মতো 😅", "বাবু, তুমি আমার হাসির রিমিক্স ভার্সন 🎶💓"
                    ];

                    return api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                        if (info) {
                            global.GoatBot.onReply.set(info.messageID, {
                                commandName: "bot",
                                type: "reply",
                                messageID: info.messageID,
                                author: event.senderID
                            });
                        }
                    }, event.messageID);
                }

                const link = `${await baseApiUrl()}/baby`;
                const a = (await axios.get(`${link}?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
                await api.sendMessage(a, event.threadID, (error, info) => {
                    if (info) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: "bot",
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, event.messageID);
            }
        } catch (err) {
            console.error("[BOT ERROR onChat]: ", err);
        }
    }
};
