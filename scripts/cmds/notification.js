// ⚠️ নাম পরিবর্তন করলে ফাইল কাজ নাও করতে পারে
// 👑 Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍

const os = require("os");
const { getStreamsFromAttachment } = global.utils;

// 🔐 SECRET LOCK SYSTEM
const _a = "s";
const _b = "s";
const _c = "";
const _d = "s";

// 🔒 Hidden Secret Check
const secretKey = `${_c}${_b}`;

if (
	(secretKey.split("").reverse().join("") !==
	[_a].join(""))
) {

console.log("❌ Invalid Secret Key!");  

module.exports = {  
	config: {  
		name: "notification",  
		version: "5.0",  
		author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"  
	},  

	onStart: async function ({ message }) {  
		return message.reply(

`❌ সিক্রেট কী ভুল!

🔐 মাদারচোদ সিক্রেট কি বসা  তারপর আবার ট্রাই কর ফাইল কি তোর জন্য বানাইছে তোর বাপ সিয়াম 🙄 `
);
}
};

return;

}

module.exports = {

config: {  
	name: "notification",  
	aliases: ["notify", "noti"],  

	version: "5.0",  
	author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",  

	countDown: 5,  
	role: 2,  

	shortDescription: {  
		en: "Premium Notification"  
	},  

	longDescription: {  
		en: "Send notification all groups"  
	},  

	category: "owner",  

	guide: {  
		en: "{pn} [message]"  
	},  

	envConfig: {  
		delayPerGroup: 1200,  
		retryCount: 5  
	}  
},  

langs: {  
	en: {  
		missingMessage: "⚠️ একটি মেসেজ লিখুন"  
	}  
},  

onStart: async function ({  
	api,  
	event,  
	args,  
	message,  
	threadsData,  
	envCommands,  
	commandName,  
	getLang  
}) {  

	try {  

		const { delayPerGroup, retryCount } =  
			envCommands[commandName];  

		if (!args[0]) {  
			return message.reply(  
				getLang("missingMessage")  
			);  
		}  

		// 📦 সব গ্রুপ নেওয়া  
		const allThreads =  
			(await threadsData.getAll())  
			.filter(thread =>  
				thread.isGroup &&  
				thread.members?.find(  
					member =>  
						member.userID ==  
						api.getCurrentUserID()  
				)?.inGroup  
			);  

		if (!allThreads.length) {  
			return message.reply(  
				"❌ কোন গ্রুপ পাওয়া যায়নি"  
			);  
		}  

		// 📎 Attachment Support  
		const attachments =  
			await getStreamsFromAttachment(  
				[  
					...event.attachments,  
					...(event.messageReply?.attachments || [])  
				].filter(item =>  
					[  
						"photo",  
						"video",  
						"audio",  
						"animated_image",  
						"png"  
					].includes(item.type)  
				)  
			);  

		// ✨ Premium Notification Body  
		const body =

`👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥
𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

দয়া করে এই মেসেজের কেউ রিপ্লাই দিবেন না তাহলে কোন রেসপন্স পাবেন না

👑 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧 ✨

────────────────

${args.join(" ")}`;

// 📡 Start Message  
		await message.reply(

`╭────────────────╮
│ 📡 নোটিফিকেশন শুরু হয়েছে
├────────────────┤
│ 👑 Owner: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
│ 📦 মোট গ্রুপ: ${allThreads.length}
│ ⚡ স্ট্যাটাস: Sending...
╰────────────────╯`
);

let success = 0;  
		let failed = [];  

		// 🚀 Better Stable Sending System  
		for (const thread of allThreads) {  

			const threadID = thread.threadID;  

			let delivered = false;  

			for (let retry = 0; retry < retryCount; retry++) {  

				try {  

					await api.sendMessage(  
						{  
							body,  
							attachment: attachments  
						},  
						threadID  
					);  

					delivered = true;  
					success++;  

					// ✅ React  
					try {  
						api.setMessageReaction(  
							"✅",  
							event.messageID,  
							() => {},  
							true  
						);  
					}  
					catch (_) {}  

					break;  

				}  
				catch (err) {  

					if (retry === retryCount - 1) {  

						failed.push({  
							threadID,  
							error:  
								err?.errorDescription ||  
								err?.message ||  
								"Unknown Error"  
						});  
					}  

					// ⏳ Retry Delay  
					await new Promise(resolve =>  
						setTimeout(resolve, 2000)  
					);  
				}  
			}  

			// ⏳ Main Delay  
			await new Promise(resolve =>  
				setTimeout(resolve, delayPerGroup)  
			);  
		}  

		// 📊 Premium Report  
		let report =

`╭────────────────╮
│ 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
├────────────────┤
│ 📡 নোটিফিকেশন রিপোর্ট
├────────────────┤
│ ✅ সফল: ${success} টি গ্রুপ
│ ❌ ব্যর্থ: ${failed.length} টি গ্রুপ
│ 🖥️ Bot: Online
│ ⚡ System: ${os.hostname()}
╰────────────────╯`;

// ❌ Failed List  
		if (failed.length > 0) {  

			report += `\n\n📋 Failed Group List:\n`;  

			for (const item of failed) {  

				report += `

• ${item.threadID}
  ↳ ${item.error}`;
			}
		}

// 🔥 Final Status  
		report += `

────────────────
🔰 Final Status:
${
failed.length === 0
? "সব গ্রুপে সফলভাবে নোটিফিকেশন পাঠানো হয়েছে ✅"
: "কিছু গ্রুপে নোটিফিকেশন যায়নি ❌"
}`;

return message.reply(report);  

	}  
	catch (err) {  

		console.log(err);  

		return message.reply(

`❌ Notification System Error

${err.message}`
);
}
}
};
