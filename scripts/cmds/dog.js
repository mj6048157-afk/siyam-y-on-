const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

// 🔒 AUTHOR LOCK
const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
    config: {
        name: "dog",
        aliases: ["dogs", "kutta"],
        version: "3.0.0",
        author: AUTHOR,
        countDown: 5,
        role: 0,

        shortDescription: {
            en: "Convert someone into a dog"
        },

        longDescription: {
            en: "Put user's profile picture on a dog image using canvas"
        },

        category: "fun",

        guide: {
            en: "{pn} @mention / reply / UID"
        }
    },

    onStart: async function ({ api, event, args }) {

        const {
            threadID,
            messageID,
            mentions,
            type,
            messageReply,
            senderID
        } = event;

        let targetID;

        // REPLY USER
        if (type === "message_reply") {
            targetID = messageReply.senderID;
        }

        // MENTION USER
        else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        }

        // UID
        else if (args.length > 0 && !isNaN(args[0])) {
            targetID = args[0];
        }

        // SELF
        else {
            targetID = senderID;
        }

        const cacheDir = path.join(__dirname, "cache");

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        const imagePath = path.join(cacheDir, `dog_${targetID}.png`);

        try {

            // USER INFO
            const userInfo = await api.getUserInfo(targetID);
            const name = userInfo[targetID].name;

            // IMAGE URL
            const dogImgUrl = "https://i.ibb.co/DDMySDsS/a5f597724c71.jpg";

            const avatarUrl =
                `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            // LOAD IMAGES
            const [dogImg, avatarImg] = await Promise.all([
                loadImage(dogImgUrl),
                loadImage(avatarUrl)
            ]);

            // CREATE CANVAS
            const canvas = createCanvas(dogImg.width, dogImg.height);
            const ctx = canvas.getContext("2d");

            // DRAW BACKGROUND
            ctx.drawImage(
                dogImg,
                0,
                0,
                canvas.width,
                canvas.height
            );

            // AVATAR POSITION
            const x = 290;
            const y = 50;
            const size = 100;

            // ROUND PROFILE
            ctx.save();

            ctx.beginPath();

            ctx.arc(
                x + size / 2,
                y + size / 2,
                size / 2,
                0,
                Math.PI * 2,
                true
            );

            ctx.closePath();
            ctx.clip();

            ctx.drawImage(
                avatarImg,
                x,
                y,
                size,
                size
            );

            ctx.restore();

            // SAVE IMAGE
            fs.writeFileSync(
                imagePath,
                canvas.toBuffer()
            );

            // SEND MESSAGE
            return api.sendMessage(
                {
                    body: `${name}, তোর আসল রূপ 🐕`,
                    attachment: fs.createReadStream(imagePath)
                },

                threadID,

                () => {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                },

                messageID
            );

        } catch (err) {

            console.log(err);

            return api.sendMessage(
                "Error executing command ❌",
                threadID,
                messageID
            );
        }
    }
};
