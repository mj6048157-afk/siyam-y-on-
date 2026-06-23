const { getStreamsFromAttachment } = global.utils;

const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];
const TARGET_THREAD_ID = "2060810454480041";

module.exports = {
config: {
name: "call",
aliases: ["callad", "called"],
version: "2.0",
author: "Farhan",
countDown: 5,
role: 0,
shortDescription: {
en: "Contact bot support"
},
longDescription: {
en: "Send feedback, reports and support requests"
},
category: "support",
guide: {
en: "{pn} <message>"
}
},

onStart: async function ({ args, message, event, usersData, threadsData, api }) {
	if (!args[0]) {
		return message.reply(
			"❌ | 𝗘𝗡𝗧𝗘𝗥 𝗔 𝗠𝗘𝗦𝗦𝗔𝗚𝗘\n💬 Example: call Hello Admin"
		);
	}

	const { senderID, threadID, isGroup } = event;
	const senderName = await usersData.getName(senderID);

	const msg =
		"╭─❖ 📩 𝗡𝗘𝗪 𝗖𝗔𝗟𝗟 ❖─╮" +
		`\n👤 𝗡𝗔𝗠𝗘 › ${senderName}` +
		`\n🆔 𝗨𝗜𝗗 › ${senderID}` +
		(isGroup
			? `\n👥 𝗚𝗥𝗢𝗨𝗣 › ${(await threadsData.get(threadID)).threadName}`
			: `\n💬 𝗙𝗥𝗢𝗠 › 𝗣𝗥𝗜𝗩𝗔𝗧𝗘`) +
		"\n╰────────────────╯";

	const formMessage = {
		body: msg + `\n\n💭 𝗠𝗘𝗦𝗦𝗔𝗚𝗘\n${args.join(" ")}`,
		mentions: [
			{
				id: senderID,
				tag: senderName
			}
		],
		attachment: await getStreamsFromAttachment(
			[
				...event.attachments,
				...(event.messageReply?.attachments || [])
			].filter(item => mediaTypes.includes(item.type))
		)
	};

	try {
		const info = await api.sendMessage(
			formMessage,
			TARGET_THREAD_ID
		);

		global.GoatBot.onReply.set(info.messageID, {
			commandName: "call",
			messageID: info.messageID,
			threadID: threadID,
			messageIDSender: event.messageID,
			type: "replyToUser"
		});

		return message.reply(
			"✅ | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗦𝗘𝗡𝗧\n💌 Your message has been delivered to support."
		);
	}
	catch (err) {
		console.error(err);
		return message.reply(
			"❌ | 𝗦𝗘𝗡𝗗 𝗙𝗔𝗜𝗟𝗘𝗗\n⚠️ Unable to contact support."
		);
	}
},

onReply: async function ({ event, api, Reply, args }) {
	if (event.threadID != TARGET_THREAD_ID) return;

	const { threadID } = Reply;

	const replyMsg = {
		body:
			"╭─❖ 📬 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗣𝗟𝗬 ❖─╮\n\n" +
			args.join(" ") +
			"\n\n╰─ 🤖 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 ─╯"
	};

	await api.sendMessage(replyMsg, threadID);
}

};
