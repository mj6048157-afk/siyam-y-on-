const AUTHOR = "SIYAM"; // 🔒 DO NOT CHANGE

module.exports = {
	config: {
		name: "all",
		version: "2.1",
		author: AUTHOR, // 🔒 LOCKED
		countDown: 5,
		role: 1,
		description: {
			en: "Tag all members with stylish message"
		},
		category: "box chat"
	},

	onStart: async function ({ message, event }) {

		// 🔒 AUTHOR LOCK SYSTEM
		if (module.exports.config.author !== AUTHOR) {
			console.log("⛔ AUTHOR MODIFIED! FILE LOCKED.");
			process.exit(1);
		}

		try {

			const { participantIDs } = event;
			const mentions = [];

			// ✅ BOT INFO AUTO UPDATE
			const botName =
				global.GoatBot?.config?.botName ||
				global.config?.BOTNAME ||
				"👑𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧";

			const prefix =
				global.GoatBot?.config?.prefix ||
				global.config?.PREFIX ||
				"/";

			// ✅ REAL TIME & REAL DATE
			const now = new Date();

			const time = now.toLocaleTimeString("en-US", {
				timeZone: "Asia/Dhaka",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: true
			});

			const date = now.toLocaleDateString("en-GB", {
				timeZone: "Asia/Dhaka",
				day: "2-digit",
				month: "2-digit",
				year: "numeric"
			});

			// 🔥 Stylish Message
			let body = `╔𝐑𝐎𝐘𝐀𝐋 𝐕𝐈𝐏 𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓╗
┃
┃ 𝐀𝐓𝐓𝐄𝐍𝐓𝐈𝐎𝐍𝐄𝐕𝐄𝐑𝐘𝐎𝐍𝐄
┃         👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑
┃
┃      👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
╠════════════════╣
┃ 👥 @everyone
┃
┃ 🚨 চিপা থেকে  📣..
┃ 👺 এখনই বের হও 😾🔥
┃
┃ 🌚 একটা করে 🤭
┃ 💍 জামাই দিমু 😽🐸
┃
┃ 🌝 আর একটা করে 🤐
┃ 👰 বউ দিমু 😼✨
┃
┃ 👑 এখনো বের হলি না? 😾
┃ 📢 দাঁড়া আসতেছি 🐸⚡
┃
┃ ❄️ চিপার মধ্যে
┃ 🧊 বরফ দিমু 😼🥶
┃
╠═══════════════
┃ 🤖 𝐁𝐎𝐓 ➤ ${botName}
┃ ⚙️ 𝐏𝐑𝐄𝐅𝐈𝐗   ➤ ${prefix}
┃
┃ ⏰ 𝐓𝐈𝐌𝐄    ➤ ${time}
┃ 📅 𝐃𝐀𝐓𝐄   ➤ ${date}
┃
╠═══════════════╣
┃ 🔗 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊
┃ 🌐 facebook.com/UID: 61589656899295
┃
┃
╚〔 👑 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧 👑 ╝`;

			// ✅ SAFE MENTION
			let index = body.indexOf("@everyone");

			if (index < 0)
				index = 0;

			for (const uid of participantIDs) {

				mentions.push({
					tag: "@",
					id: uid,
					fromIndex: index
				});

			}

			return message.reply({
				body,
				mentions
			});

		}

		catch (err) {

			console.error(err);

			return message.reply(
				"❌ Error:\n" + err.message
			);

		}

	}
};
