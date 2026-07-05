const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "wl",
		version: "2.5",
		author: "siyam",
		countDown: 5,
		role: 2,
		longDescription: {
			en: "Manage whiteListIds"
		},
		category: "owner",
		guide: {
			en:
				"{pn} add <uid | @tag>\n" +
				"{pn} remove <uid | @tag>\n" +
				"{pn} list\n" +
				"{pn} on / off"
		}
	},

	langs: {
		en: {
			added: "───────────────\n» ✅ 𝗔𝗱𝗱𝗲𝗱:\n%1\n───────────────\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
			removed: "───────────────\n» ✅ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱:\n%1\n───────────────\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
			listAdmin: "───────────────\n» 👑 𝗪𝗵𝗶𝘁𝗲𝗟𝗶𝘀𝘁 𝗨𝘀𝗲𝗿𝘀:\n%1\n───────────────\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
			missingIdAdd: "───────────────\n» ⚠️ 𝗚𝗶𝘃𝗲 𝗜𝗗 𝗼𝗿 𝘁𝗮𝗴\n───────────────\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
			missingIdRemove: "───────────────\n» ⚠️ 𝗚𝗶𝘃𝗲 𝗜𝗗 𝗼𝗿 𝘁𝗮𝗴\n───────────────\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {

		switch (args[0]) {

			// ================= ADD =================
			case "add":
			case "-a": {
				if (!args[1]) return message.reply(getLang("missingIdAdd"));

				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				const added = [];

				for (const uid of uids) {
					if (!config.whiteListMode.whiteListIds.includes(uid)) {
						config.whiteListMode.whiteListIds.push(uid);
						added.push(uid);
					}
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const names = await Promise.all(
					added.map(uid => usersData.getName(uid).then(name => `• ${name} (${uid})`))
				);

				return message.reply(getLang("added", names.join("\n")));
			}

			// ================= REMOVE =================
			case "remove":
			case "-r": {
				if (!args[1]) return message.reply(getLang("missingIdRemove"));

				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else
					uids = args.filter(arg => !isNaN(arg));

				const removed = [];

				for (const uid of uids) {
					if (config.whiteListMode.whiteListIds.includes(uid)) {
						config.whiteListMode.whiteListIds.splice(
							config.whiteListMode.whiteListIds.indexOf(uid),
							1
						);
						removed.push(uid);
					}
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const names = await Promise.all(
					removed.map(uid => usersData.getName(uid).then(name => `• ${name} (${uid})`))
				);

				return message.reply(getLang("removed", names.join("\n")));
			}

			// ================= LIST =================
			case "list":
			case "-l": {
				const names = await Promise.all(
					config.whiteListMode.whiteListIds.map(uid =>
						usersData.getName(uid).then(name => `• ${name} (${uid})`)
					)
				);

				return message.reply(getLang("listAdmin", names.join("\n")));
			}

			// ================= ON =================
			case "on": {
				config.whiteListMode.enable = true;
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const imgUrl = "https://files.catbox.moe/q76rmd.jpg";
				let attachment;
				try {
					attachment = await getStreamFromURL(imgUrl);
				} catch (e) {
					console.log("Image load failed:", e.message);
				}

				const msg = {
					body: `───────────────
🔐  𝆠፝𝐀𝐂𝐂𝐄𝐒𝐒 :
   𝆠፝🐸এখন শুধু আমার বস সিয়াম🪬
   𝆠፝বট ব্যবহার করতে পারবে 👑
───────────────`
				};

				if (attachment) msg.attachment = attachment;
				return message.reply(msg);
			}

			// ================= OFF =================
			case "off": {
				config.whiteListMode.enable = false;
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const imgUrl = "https://files.catbox.moe/5e00ob.jpg";
				let attachment;
				try {
					attachment = await getStreamFromURL(imgUrl);
				} catch (e) {
					console.log("Image load failed:", e.message);
				}

				const msg = {
					body: `───────────────
🌐  𝆠፝𝐀𝐂𝐂𝐄𝐒𝐒 :
   𝆠፝এখন সবাই বট ব্যবহার
   𝆠፝করতে পারবে 🎉
───────────────`
				};

				if (attachment) msg.attachment = attachment;
				return message.reply(msg);
			}

			default:
				return message.SyntaxError();
		}
	}
};
