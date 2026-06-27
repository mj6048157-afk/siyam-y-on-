const axios = require('axios');
const yts = require("yt-search");

const baseApiUrl = async () => {
    try {
        const base = await axios.get(
            `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
        );
        return base.data.api;
    } catch (e) {
        return "https://d1pt0.cloud"; // ফলব্যাক এপিআই ইউআরএল
    }
};

async function getStreamFromURL(url, pathName) {
    try {
        const response = await axios.get(url, {
            responseType: "stream"
        });
        response.data.path = pathName;
        return response.data;
    } catch (err) {
        throw err;
    }
}

global.utils = {
    ...global.utils,
    getStreamFromURL: global.utils?.getStreamFromURL || getStreamFromURL
};

function getVideoID(url) {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const match = url.match(checkurl);
    return match ? match[1] : null;
}

const config = {
    name: "video2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    credits: "Mesbah Saxx",
    version: "1.1.0",
    role: 0,
    hasPermssion: 0,
    description: "Download YouTube videos via link or search name",
    usePrefix: true,
    prefix: true,
    category: "media",
    commandCategory: "media",
    cooldowns: 5,
    countDown: 5,
};

async function onStart({ api, args, event }) {
    let waitMsg = null;
    try {
        let videoID;
        const url = args[0];

        if (!url) {
            return api.sendMessage(`⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗤𝗨𝗘𝗥𝗬\n───────────────\n» 📌 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘀𝗼𝗻𝗴 𝗻𝗮𝗺𝗲 𝗼𝗿 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗹𝗶𝗻𝗸!`, event.threadID, event.messageID);
        }

        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            videoID = getVideoID(url);
            if (!videoID) {
                return api.sendMessage(`⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗟𝗜𝗡𝗞\n───────────────\n» ❌ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗽𝗮𝗿𝘀𝗲 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗨𝗥𝗟.`, event.threadID, event.messageID);
            }
            waitMsg = await api.sendMessage(`🔍 𝗔𝗡𝗔𝗟𝗬𝗭𝗜𝗡𝗚 𝗟𝗜𝗡𝗞\n───────────────\n» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...`, event.threadID);
        } else {
            const songName = args.join(' ');
            waitMsg = await api.sendMessage(`🔍 𝗦𝗘𝗔𝗥𝗖𝗛𝗜𝗡𝗚 𝗩𝗜𝗗𝗘𝗢\n───────────────\n» 🌐 𝗤𝘂𝗲𝗿𝘆 : "${songName}"\n» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...`, event.threadID);
            
            const r = await yts(songName);
            const videos = r.videos.slice(0, 10); // প্রথম ১০টি রেজাল্টের মধ্যে লিমিট করা হলো বেটার ম্যাচিংয়ের জন্য
            if (videos.length === 0) {
                if (waitMsg) api.unsendMessage(waitMsg.messageID).catch(() => {});
                return api.sendMessage(`⚠️ 𝗡𝗢 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n───────────────\n» ❌ 𝗡𝗼 𝘃𝗶𝗱𝗲𝗼 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿 "${songName}".`, event.threadID, event.messageID);
            }
            const videoData = videos[Math.floor(Math.random() * videos.length)];
            videoID = videoData.videoId;
        }

        const currentApiUrl = await baseApiUrl();
        const apiRes = await axios.get(`${currentApiUrl}/ytDl3?link=${videoID}&format=mp4`);
        
        if (!apiRes.data || !apiRes.data.downloadLink) {
            throw new Error("Download link not found from API.");
        }

        const { title, quality, downloadLink } = apiRes.data;

        if (waitMsg) api.unsendMessage(waitMsg.messageID).catch(() => {});
        
        const o = '.php';
        let shortenedLink = "N/A";
        try {
            const shortRes = await axios.get(`https://tinyurl.com/api-create${o}?url=${encodeURIComponent(downloadLink)}`);
            shortenedLink = shortRes.data;
        } catch (_) {}

        const stream = await getStreamFromURL(downloadLink, `${title || 'video'}.mp4`);

        await api.sendMessage({
            body: `🎬 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n───────────────\n» 📌 𝗧𝗜𝗧𝗟𝗘 : ${title || "Unknown"}\n» ✨ 𝗤𝗨𝗔𝗟𝗜𝗧𝗬 : ${quality || "Default"}\n» 🔗 𝗟𝗜𝗡𝗞 : ${shortenedLink}\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            attachment: stream
        }, event.threadID, event.messageID);

    } catch (e) {
        console.error(e);
        if (waitMsg) api.unsendMessage(waitMsg.messageID).catch(() => {});
        api.sendMessage(`❌ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗙𝗔𝗜𝗟𝗘𝗗\n───────────────\n» ⚠️ 𝗔𝗣𝗜 𝗘𝗿𝗿𝗼𝗿 𝗼𝗿 𝗳𝗶𝗹𝗲 𝘁𝗼𝗼 𝗹𝗮𝗿𝗴𝗲.\n» ⚙️ 𝗘𝗿𝗿𝗼𝗿 : ${e.message}`, event.threadID, event.messageID);
    }
}

module.exports = {
    config,
    onStart,
    run: onStart
};
