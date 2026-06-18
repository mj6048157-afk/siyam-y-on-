const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");
const moment = require("moment-timezone");

// 🔒 আপনার অন/অফ মেসেজের সম্পূর্ণ ডিজাইনকে ডিজিটাল লক করা হয়েছে। 
// ফাইলের ভেতর কেউ আপনার টেক্সট বা স্টাইলিশ ফন্ট খুঁজে পাবে না।
const _0x3a19 = [10, 240, 159, 145, 145, 32, 32, 240, 157, 134, 160, 240, 157, 135, 15, 240, 157, 135, 132, 240, 157, 135, 148, 240, 157, 135, 134, 45, 240, 157, 135, 131, 240, 157, 135, 134, 240, 157, 135, 142, 240, 157, 135, 137, 32, 32, 240, 159, 145, 145, 10, 10, 240, 157, 135, 136, 240, 157, 135, 131, 240, 157, 135, 138, 240, 157, 135, 143, 240, 157, 135, 134, 32, 240, 157, 135, 135, 240, 157, 135, 134, 240, 157, 135, 142, 240, 157, 135, 143, 32, 240, 157, 135, 136, 240, 157, 135, 142, 240, 157, 135, 137, 240, 157, 135, 138, 240, 157, 135, 134, 10, 10, 240, 159, 148, 144, 32, 32, 240, 157, 135, 131, 240, 157, 135, 134, 240, 157, 135, 136, 240, 157, 135, 136, 240, 157, 135, 138, 240, 157, 135, 142, 240, 157, 135, 142, 32, 58, 10, 32, 32, 32, 240, 157, 134, 160, 240, 159, 144, 184, 224, a6, 149, 224, a6, 149, 224, a6, a8, 32, 224, a6, a2, 224, a7, 129, 224, a6, a6, 224, a6, a9, 32, 224, a6, 133, 224, a6, aMessage, 224, a6, aarg, 224, a6, a8, 32, 224, a6, a2, 224, a6, a8, 32, 224, a6, b8, 224, a6, bf, 224, a6, bF, 224, a6, bY, 240, 159, 16a, 172, 10, 32, 32, 32, 240, 157, 134, 160, 224, a6, a2, 224, a6, aF, 32, 224, a6, ac, 224, a7, 135, 224, a6, ac, 224, a6, b9, 224, a6, bF, 224, a6, b0, 32, 224, a6, a5, 224, a6, b0, 224, a6, a4, 224, a6, ac, 224, a7, 135, 32, 224, a6, aA, 224, a6, b0, 224, a6, ac, 224, a7, 135, 32, 240, 157, 134, 160, 10, 10, 240, 159, 147, 133, 32, 32, 240, 157, 135, 137, 240, 157, 135, 134, 240, 157, 135, 141, 240, 157, 135, 138, 32, 58, 32, 37, 49, 10, 240, 159, 14timer, 170, 32, 32, 240, 157, 135, 143, 240, 157, 135, 137, 240, 157, 135, 140, 240, 157, 135, 138, 32, 58, 32, 37, 50, 10, 10, 240, 157, 134, 160, 32, 32, 240, 157, 135, 137, 240, 157, 135, 134, 240, 157, 135, 141, 240, 157, 135, 138, 240, 157, 135, 143, 240, 157, 135, 140, 32, 240, 157, 135, 132, 240, 157, 135, 137, 240, 157, 135, 134, 240, 157, 135, 143, 32, 240, 157, 135, 131, 240, 157, 135, 138, 240, 157, 135, 143, 32, 240, 157, 134, 160, 10];
const _0x2c0f = [10, 240, 159, 145, 145, 32, 32, 240, 157, 134, 160, 240, 157, 135, 15, 240, 157, 135, 132, 240, 157, 135, 148, 240, 157, 135, 134, 45, 240, 157, 135, 131, 240, 157, 135, 134, 240, 157, 135, 142, 240, 157, 135, 137, 32, 32, 240, 159, 145, 145, 10, 10, 240, 157, 135, 136, 240, 157, 135, 131, 240, 157, 135, 138, 240, 157, 135, 143, 240, 157, 135, 134, 32, 240, 157, 135, 135, 240, 157, 135, 134, 240, 157, 135, 142, 240, 157, 135, 143, 32, 240, 157, 135, 137, 240, 157, 135, 134, 240, 157, 135, 137, 240, 157, 135, 135, 240, 157, 135, 135, 240, 157, 135, 134, 240, 157, 135, 137, 10, 10, 240, 159, 140, 144, 32, 32, 240, 157, 135, 131, 240, 157, 135, 134, 240, 157, 135, 136, 240, 157, 135, 136, 240, 157, 135, 138, 240, 157, 135, 142, 240, 157, 135, 142, 32, 58, 10, 32, 32, 32, 240, 157, 134, 160, 224, a6, a4, 224, a6, a7, 224, a6, a8, 32, 224, a6, b8, 224, a6, ac, 224, a6, b0, 224, a6, bMessage, 224, a6, aF, 32, 224, a6, ac, 224, a7, 135, 224, a6, ac, 224, a6, b9, 224, a6, bF, 224, a6, b0, 240, 159, 16a, 172, 10, 32, 32, 32, 240, 157, 134, 160, 224, a6, a5, 224, a6, b0, 224, a6, a4, 224, a6, ac, 224, a7, 135, 32, 224, a6, aA, 224, a6, b0, 224, a6, ac, 224, a7, 135, 32, 240, 159, 142, a9, 10, 10, 240, 159, 147, 133, 32, 32, 240, 157, 135, 137, 240, 157, 135, 134, 240, 157, 135, 141, 240, 157, 135, 138, 32, 58, 32, 37, 49, 10, 240, 159, 14timer, 170, 32, 10, 240, 157, 134, 160, 240, 157, 135, 143, 240, 157, 135, 137, 240, 157, 135, 140, 240, 157, 135, 138, 32, 58, 32, 37, 50, 10, 10, 240, 157, 134, 160, 32, 32, 240, 157, 135, 137, 240, 157, 135, 134, 240, 157, 135, 141, 240, 157, 135, 138, 240, 157, 135, 143, 240, 157, 135, 140, 32, 240, 157, 135, 132, 240, 157, 135, 137, 240, 157, 135, 134, 240, 157, 135, 143, 32, 240, 157, 135, 131, 240, 157, 135, 138, 240, 157, 135, 143, 32, 240, 157, 134, 160, 10];

// 🔓 ডিক্রিপশন মেথড যা রানটাইমে মেসেজ তৈরি করবে
function _parseMsg(arr, d, t) {
	let s = Buffer.from(arr).toString('utf-8');
	return s.replace("%1", d).replace("%2", t);
}

module.exports = {
	config: {
		name: "wl",
		version: "2.0",
		author: "MR_FARHAN + SIYAM EDIT",
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
			added: "✅ Added:\n%1",
			removed: "✅ Removed:\n%1",
			listAdmin: "👑 WhiteList Users:\n%1",
			missingIdAdd: "⚠️ Give ID or tag",
			missingIdRemove: "⚠️ Give ID or tag"
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

				const time = moment().tz("Asia/Dhaka").format("hh:mm A");
				const date = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");

				// 🔓 প্রোটেক্টেড অ্যারে থেকে মেসেজ লোড করা হচ্ছে
				const msg = _parseMsg(_0x3a19, date, time);
				return message.reply(msg);
			}

			// ================= OFF =================
			case "off": {
				config.whiteListMode.enable = false;
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const time = moment().tz("Asia/Dhaka").format("hh:mm A");
				const date = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");

				// 🔓 প্রোটেক্টেড অ্যারে থেকে মেসেজ লোড করা হচ্ছে
				const msg = _parseMsg(_0x2c0f, date, time);
				return message.reply(msg);
			}

			default:
				return message.SyntaxError();
		}
	}
};
