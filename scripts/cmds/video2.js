const axios = require('axios');
const yts = require("yt-search");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
    );
    return base.data.api;
};

(async () => {
    global.apis = {
        diptoApi: await baseApiUrl()
    };
})();

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
    getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
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
    version: "1.0.0",
    role: 0,
    hasPermssion: 0,
    description: "Download YouTube videos or search by name",
    usePrefix: true,
    prefix: true,
    category: "media",
    commandCategory: "media",
    cooldowns: 5,
    countDown: 5,
};

async function onStart({ api, args, event }) {
    try {
        let videoID, w;
        const url = args[0];

        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            videoID = getVideoID(url);
            if (!videoID) {
                return await api.sendMessage(`⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗟𝗜𝗡𝗞\n───────────────\n» ❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗨𝗥𝗟.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, event.threadID, event.messageID);
            }
        } else {
            const songName = args.join(' ');
            if (!songName) {
                return api.sendMessage(`⚠️ 𝗠𝗜𝗦𝗦𝗜𝗡𝗚 𝗜𝗡𝗣𝗨𝗧\n───────────────\n» 📝 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗶𝗱𝗲𝗼 𝗻𝗮𝗺𝗲 𝗼𝗿 𝗹𝗶𝗻𝗸.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, event.threadID, event.messageID);
            }
            w = await api.sendMessage(`🔍 𝗦𝗘𝗔𝗥𝗖𝗛𝗜𝗡𝗚 𝗩𝗜𝗗𝗘𝗢\n───────────────\n» 🌐 𝗤𝘂𝗲𝗿𝘆 : "${songName}"\n» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, event.threadID);
            const r = await yts(songName);
            const videos = r.videos.slice(0, 50);

            if (videos.length === 0) {
                if (w) api.unsendMessage(w.messageID);
                return api.sendMessage(`❌ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n───────────────\n» 🔍 𝗡𝗼 𝘃𝗶𝗱𝗲𝗼 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗾𝘂𝗲𝗿𝘆.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, event.threadID, event.messageID);
            }

            const videoData = videos[Math.floor(Math.random() * videos.length)];
            videoID = videoData.videoId;
        }

        const { data: { title, quality, downloadLink } } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp4`);

        if (w) api.unsendMessage(w.messageID);
        
        const o = '.php';
        const shortenedLink = (await axios.get(`https://tinyurl.com/api-create${o}?url=${encodeURIComponent(downloadLink)}`)).data;

        await api.sendMessage({
            body: `🎬 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n───────────────\n» 📌 𝗧𝗜𝗧𝗟𝗘 : ${title}\n» ✨ 𝗤𝗨𝗔𝗟𝗜𝗧𝗬 : ${quality}\n» 🔗 𝗟𝗜𝗡𝗞 : ${shortenedLink}\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            attachment: await global.utils.getStreamFromURL(downloadLink, title+'.mp4')
        }, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(`❌ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗙𝗔𝗜𝗟𝗘𝗗\n───────────────\n» ⚙️ 𝗘𝗿𝗿𝗼𝗿 : ${e.message || "An error occurred."}\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`, event.threadID, event.messageID);
    }
}

module.exports = {
    config,
    onStart,
    run: onStart
};
