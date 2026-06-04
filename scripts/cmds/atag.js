if (!global.yuCommandStatus) {
global.yuCommandStatus = {};
}

module.exports = {
config: {
name: "atag",
aliases: ["all", "veryone"],
version: "1.0.9",
credit: "MOHAMMAD BADOL",
role: 1,
prefix: true,
description: "গ্রুপের সবাইকে একে একে mention করে",
category: "group",
usages: "[custom text]",
cooldown: 10
},

onStart: async function ({ api, event, args }) {
	if (!event || !event.threadID)
		return;

	const { threadID, messageID, senderID } = event;

	try {
		const threadInfo = await api.getThreadInfo(threadID);

		if (!threadInfo.isGroup) {
			return api.sendMessage(
				"❌ এই কমান্ড শুধু গ্রুপে কাজ করবে।",
				threadID,
				messageID
			);
		}

		const allUsers = threadInfo.participantIDs.filter(
			id => id != api.getCurrentUserID() && id != senderID
		);

		const customMessage = args.join(" ");

		if (allUsers.length === 0) {
			return api.sendMessage(
				"❌ গ্রুপে mention করার মতো কেউ নাই।",
				threadID,
				messageID
			);
		}

		global.yuCommandStatus[threadID] = true;

		await api.sendMessage(
			`👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n✅ ${allUsers.length} জনকে mention করা শুরু করতেছি...\n⛔ বন্ধ করতে "off" বা "stop" লিখুন`,
			threadID,
			messageID
		);

		for (let i = 0; i < allUsers.length; i++) {
			if (!global.yuCommandStatus[threadID]) {
				delete global.yuCommandStatus[threadID];
				return api.sendMessage(
					"❌ মেনশন করা অফ করা হয়েছে। সিয়াম বস 👑",
					threadID
				);
			}

			const id = allUsers[i];

			try {
				const userInfo = await api.getUserInfo(id);
				const userName = userInfo[id]?.name || "Facebook User";

				const body = customMessage
					? `@${userName} ${customMessage}`
					: `@${userName}`;

				await api.sendMessage(
					{
						body,
						mentions: [
							{
								tag: `@${userName}`,
								id
							}
						]
					},
					threadID
				);

				await new Promise(resolve => setTimeout(resolve, 10000));
			}
			catch (e) {
				console.log(`Failed to tag ${id}:`, e.message);
			}
		}

		delete global.yuCommandStatus[threadID];

		return api.sendMessage(
			"🛸সিয়াম বস ✅ সবাইকে mention করা শেষ।",
			threadID
		);
	}
	catch (e) {
		console.log(e);

		delete global.yuCommandStatus[threadID];

		return api.sendMessage(
			`❌ Error: ${e.message}`,
			threadID,
			messageID
		);
	}
},

onChat: async function ({ event }) {
	if (!event || !event.threadID || !event.body)
		return;

	const { threadID, body } = event;

	if (
		(body.toLowerCase() === "off" ||
			body.toLowerCase() === "stop") &&
		global.yuCommandStatus[threadID]
	) {
		global.yuCommandStatus[threadID] = false;
	}
}

};
