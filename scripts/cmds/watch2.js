const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// নতুন বেস এপিআই ফাংশন
const getBaseApiUrl = async () => {
try {
const base = await axios.get(`https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json`);
return base.data.mahmud;
} catch (e) {
return "https://mahmud-apis.vercel.app"; // ফলব্যাক এপিআই
}
};

module.exports = {
config: {
name: "media",
aliases: ["audio1", "audio2", "watch1", "watch2"],
version: "6.0.0",
author: "Milon Hasan",
countDown: 5,
role: 2,
category: "media",
usePrefix: false
},

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
* 🤖 BOT NAME: MILON BOT
* 👤 OWNER: MILON HASAN (MILON BOSS)
* 🛠️ PROJECT: MILON BOT PROJECT (2026)
* --------------------------------------- */

onChat: async function ({ api, event, message }) {
if (!event.body) return;
const body = event.body.toLowerCase().trim();

// --- [ 🔐 ADMIN ONLY CHECK ] ---
const adminIDs = global.GoatBot.config.adminBot || [];
const isBotAdmin = adminIDs.includes(event.senderID);

const isAudio = body.startsWith("audio1") || body.startsWith("audio2");
const isVideo = body.startsWith("watch1") || body.startsWith("watch2");

if (isAudio || isVideo) {
if (!isBotAdmin) return;

let query = "";
const args = event.body.split(/\s+/);
const command = args.shift();
const inputQuery = args.join(" ");

if (event.messageReply && event.messageReply.body) {
query = event.messageReply.body;
} else {
query = inputQuery;
}

if (!query) {
return message.reply(`❌ Please provide a name or reply to a message with ${command}!`);
}

const waitMsg = await message.reply(`🔍 Searching for "${query}"...\n⏳ Please wait...`);

try {
const apiUrl = await getBaseApiUrl();
let videoID;
let title;

// --- [ 🌐 STEP 1: SEARCH ] ---
const searchType = isAudio ? "music" : "video";
const searchRes = await axios.get(`${apiUrl}/api/${searchType}/search?songName=${encodeURIComponent(query)}`);

if (!searchRes.data || searchRes.data.length === 0) {
return api.editMessage("⚠️ No results found on YouTube.", waitMsg.messageID);
}

videoID = searchRes.data[0].id;
title = searchRes.data[0].title;

await api.editMessage(`🎬 Found: ${title}\n⬇️ Downloading ${isAudio ? 'Audio' : 'Video'}...`, waitMsg.messageID);

// --- [ ⬇️ STEP 2: DOWNLOAD ] ---
const format = isAudio ? "mp3" : "mp4";
const downloadRes = await axios.get(`${apiUrl}/api/${searchType}/download?link=${videoID}&format=${format}`);
const downloadLink = downloadRes.data.downloadLink;

const cacheDir = path.join(process.cwd(), "cache");
if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
const filePath = path.join(cacheDir, `${isAudio ? 'audio' : 'video'}_${Date.now()}.${format}`);

const response = await axios({
method: "get",
url: downloadLink,
responseType: "stream"
});

const writer = fs.createWriteStream(filePath);
response.data.pipe(writer);

writer.on("finish", async () => {
await api.unsendMessage(waitMsg.messageID).catch(() => {});
await message.reply({
body: ` 🟢 ✔ᴰᵒʷⁿˡᵒᵈ ᶜᵒᵐᵖˡᵉᵗˡʸ !\n📌 Title: ${title}\n🖌️ Power by: ×͜× ᵐⁱˡᵒⁿˣ⁷⁰`,
attachment: fs.createReadStream(filePath),
});
if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
});

} catch (err) {
console.error(err);
api.editMessage(`❌ Failed to process. API Error: ${err.message}`, waitMsg.messageID);
}
}
},

onStart: async function () {}
};
