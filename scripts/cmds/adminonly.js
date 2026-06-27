const fs = require("fs-extra");
const moment = require("moment-timezone");
const { config } = global.GoatBot;
const { client } = global;

// 🔒 LOCKED AUTHOR
const LOCKED_AUTHOR = "FARHAN-KHAN";

// ✨ Premium Compact Bengali Style
function premiumMsg(title, body) {
	const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
	const date = moment().tz("Asia/Dhaka").format("DD MMM YYYY");

	return `╔═ 👑 𝑺𝑰𝒀𝑨𝑴 👑 ═╗
${title}
━━━━━━━━━━━━
${body}
━━━━━━━━━━━━
📅 ${date} | ⏰ ${time}
🤖 𝑵𝑰𝑱𝑯𝑼𝑴 𝑩𝑶𝑻`;
}

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "5.0",
		author: LOCKED_AUTHOR,
		countDown: 5,
		role: 1,
		description: {
			en: "Toggle global admin mode or manage specific group bans"
		},
		category: "owner"
	},

	onLoad: function () {
		if (!config.adminOnly) config.adminOnly = {};
		if (!Array.isArray(config.adminOnly.bannedThreads)) {
			config.adminOnly.bannedThreads = [];
		}
	},

	onStart: async function ({ args, message, threadsData }) {

		// 🔒 AUTHOR LOCK
		if (module.exports.config.author !== LOCKED_AUTHOR) {
			module.exports.config.author = LOCKED_AUTHOR;
			fs.writeFileSync(__filename, fs.readFileSync(__filename, "utf8"));
		}

		if (!config.adminOnly.bannedThreads) config.adminOnly.bannedThreads = [];

		// 👥 ১. গ্রুপ লিস্ট দেখার সিস্টেম
		if (args[0] == "grouplist") {
			const allThreads = await threadsData.getAll();
			const groupList = allThreads.filter(t => t.isGroup);
			
			if (groupList.length === 0) {
				return message.reply(premiumMsg("👥 গ্রুপ লিস্ট", "❌ বট কোনো গ্রুপে যুক্ত নেই।"));
			}

			let body = `📊 মোট গ্রুপ: ${groupList.length}\n\n`;
			global.client.tempGroupList = {}; 

			groupList.forEach((thread, index) => {
				const num = index + 1;
				global.client.tempGroupList[num] = thread.threadID;
				const isBanned = config.adminOnly.bannedThreads.includes(thread.threadID) ? "❌ [ব্যানড]" : "✅ [সক্রিয়]";
				body += `${num}. ${thread.threadName || "নামহীন গ্রুপ"}\n   ID: ${thread.threadID} ${isBanned}\n`;
			});
			
			body += `\n━━━━━━━━━━━━\n💡 গাইডলাইন: ব্যান করতে লিখুন:\n👉 adminonly ban <নাম্বার>`;
			return message.reply(premiumMsg("👥 গ্রুপ লিস্ট", body));
		}

		// 🚫 ২. নির্দিষ্ট গ্রুপ ব্যান করার সিস্টেম
		if (args[0] == "ban") {
			if (!args[1] || isNaN(args[1])) {
				return message.reply(premiumMsg("⚠️ ভুল ইনপুট", "ব্যান করতে সঠিক গ্রুপ নম্বর দিন।\nযেমন: adminonly ban 1"));
			}

			if (!global.client.tempGroupList || !global.client.tempGroupList[args[1]]) {
				return message.reply(premiumMsg("⚠️ ভুল ইনপุต", "প্রথমে 'adminonly grouplist' লিখে নম্বরটি নিশ্চিত করুন।"));
			}

			const targetThreadID = global.client.tempGroupList[args[1]];

			if (config.adminOnly.bannedThreads.includes(targetThreadID)) {
				return message.reply(premiumMsg("⚠️ সতর্ক বার্তা", "এই গ্রুপটি অলরেডি ব্যান করা আছে।"));
			}

			config.adminOnly.bannedThreads.push(targetThreadID);
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

			// টার্গেট গ্রুপে নোটিফিকেশন পাঠানো
			try {
				await message.send({
					body: premiumMsg("🚫 কমান্ড ব্যান", "⚠️ এই গ্রুপে কোন কমান্ড ইউজ করা যাবে না কমান্ড ব্যান করা হলো।")
				}, targetThreadID);
			} catch (e) {}

			return message.reply(premiumMsg("🔒 গ্রুপ লক সফল", `✅ নির্দিষ্ট গ্রুপটি সফলভাবে লক করা হয়েছে।\n🆔 ID: ${targetThreadID}`));
		}

		// 📑 ৩. ব্যান লিস্ট দেখার সিস্টেম
		if (args[0] == "banlist") {
			if (config.adminOnly.bannedThreads.length === 0) {
				return message.reply(premiumMsg("📑 ব্যান লিস্ট", "❌ বর্তমানে কোনো গ্রুপ ব্যান তালিকায় নেই।"));
			}

			let body = `🚫 মোট ব্যানড গ্রুপ: ${config.adminOnly.bannedThreads.length}\n\n`;
			global.client.tempBanList = {};

			for (let i = 0; i < config.adminOnly.bannedThreads.length; i++) {
				const tID = config.adminOnly.bannedThreads[i];
				global.client.tempBanList[i + 1] = tID;
				let tName = "নামহীন বা অজানা গ্রুপ";
				try {
					const tInfo = await threadsData.get(tID);
					if (tInfo && tInfo.threadName) tName = tInfo.threadName;
				} catch(e){}
				body += `${i + 1}. ${tName}\n   ID: ${tID}\n`;
			}

			body += `\n━━━━━━━━━━━━\n💡 গাইডলাইন: আনব্যান করতে লিখুন:\n👉 adminonly unban <নাম্বার>`;
			return message.reply(premiumMsg("📑 ব্যান লিস্ট", body));
		}

		// 🔓 ৪. নির্দিষ্ট গ্রুপ আনব্যান করার সিস্টেম
		if (args[0] == "unban") {
			if (!args[1] || isNaN(args[1])) {
				return message.reply(premiumMsg("⚠️ ভুল ইনপুট", "আনব্যান করতে সঠিক নম্বর দিন।\nযেমন: adminonly unban 1"));
			}

			if (!global.client.tempBanList || !global.client.tempBanList[args[1]]) {
				return message.reply(premiumMsg("⚠️ ভুল ইনপুট", "প্রথমে 'adminonly banlist' লিখে সঠিক নম্বর দিন।"));
			}

			const targetThreadID = global.client.tempBanList[args[1]];

			config.adminOnly.bannedThreads = config.adminOnly.bannedThreads.filter(id => id !== targetThreadID);
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

			return message.reply(premiumMsg("🔓 আনব্যান সফল", "✅ গ্রুপটি সফলভাবে আনব্যান করা হয়েছে। এখন সবাই ব্যবহার করতে পারবে।"));
		}


		// ---------------------------------------------------------
		// 👑 আপনার আগের মূল এডমিন অনলি লজিক (হুবহু এক রাখা হয়েছে)
		// ---------------------------------------------------------
		let isSetNoti = false;
		let value;
		let indexGetVal = 0;

		if (args[0] == "noti") {
			isSetNoti = true;
			indexGetVal = 1;
		}

		if (args[indexGetVal] == "on") value = true;
		else if (args[indexGetVal] == "off") value = false;
		else return message.SyntaxError();

		// 🔔 Notification Mode
		if (isSetNoti) {
			config.hideNotiMessage.adminOnly = !value;

			return message.reply(
				premiumMsg(
					value ? "🔔 নোটিফিকেশন চালু" : "🔕 নোটিফিকেশন বন্ধ",
					value
						? "⚠️ নন-এডমিন ব্যবহার করলে সতর্ক বার্তা দেখাবে"
						: "🤫 নন-এডমিন ব্যবহার করলে কোনো বার্তা দেখাবে না"
				)
			);
		}

		// 🔐 Admin Mode
		config.adminOnly.enable = value;
		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

		if (value) {
			return message.reply(
				premiumMsg(
					"🔐 এডমিন মোড চালু",
					"🚫 এখন শুধু বস সিয়াম বট ব্যবহার করতে পারবে\n👑 সিয়াম বস ছাড়া কেউ এক্সেস পাবে না"
				)
			);
		} else {
			return message.reply(
				premiumMsg(
					"🔓 এডমিন মোড বন্ধ",
					"✅ এখন সবাই বট ব্যবহার করতে পারবে\n🎉 সবাই এনজয় করো"
				)
			);
		}
	},

	// 🚫 ব্যান হওয়া গ্রুপে ওনার/এডমিন সহ সবার কমান্ড ব্লক করার লজিক 
	onChat: async function ({ message }) {
		if (config.adminOnly && Array.isArray(config.adminOnly.bannedThreads)) {
			if (config.adminOnly.bannedThreads.includes(message.threadID)) {
				const prefix = config.prefix || "/";
				
				// মেসেজটি যদি কমান্ড হয় এবং ইউজার যদি মেইন ওনার (FARHAN-KHAN) না হয়
				if (message.body && message.body.startsWith(prefix)) {
					// GoatBot এর কনফিগারেশন থেকে ওনার আইডি চেক করা (যদি প্রয়োজন হয়)
					const adminIDs = config.adminBot || [];
					if (!adminIDs.includes(message.senderID)) {
						return message.reply(
							premiumMsg("🚫 গ্রুপ লকড", "⚠️ এই গ্রুপে কোন কমান্ড ইউজ করা যাবে না কমান্ড ব্যান করা হলো।")
						);
					}
				}
			}
		}
	}
};
