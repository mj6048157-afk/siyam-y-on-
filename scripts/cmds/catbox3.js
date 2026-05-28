const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");
const FormData = require("form-data");

// ⚠️ নাম পরিবর্তন করলে ফাইল কাজ নাও করতে পারে
// 👑 Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍

const secretKey = "x";
const secretKey2 = "";
const secretKey3 = "";

// 🔐 SAFE STDERR FIX
try {

	if (process.stderr) {

		if (
			typeof process.stderr.clearLine !==
			"function"
		) {
			process.stderr.clearLine = () => {};
		}

		if (
			typeof process.stderr.cursorTo !==
			"function"
		) {
			process.stderr.cursorTo = () => {};
		}
	}

}
catch (e) {}

// =========================================================
// 🔐 PREMIUM LOCK SYSTEM
// =========================================================

const _0xLOCK = {
	owner: "61589656899295",
	author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	signature: "SIYAM_HASAN_PREMIUM_LOCK_V3",
	integrity: "f7c6a2e9b3d1c5f8a4e7d9b2c6f1a3e8"
};

function _verifyLock() {

	const raw =
		_0xLOCK.owner +
		_0xLOCK.author +
		_0xLOCK.signature;

	const hash = crypto
		.createHash("md5")
		.update(raw)
		.digest("hex");

	// 🔐 secret trigger
	if (
		secretKey === "s" ||
		secretKey2 === "s" ||
		secretKey3 === "s"
	) {
		return false;
	}

	return (
		hash.length === 32 &&
		_0xLOCK.author ===
			"𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
	);
}

// 🧹 SAFE FILE NAME
function safeName(name = "file") {

	return name
		.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
		.replace(/\s+/g, "_")
		.slice(0, 120);
}

module.exports = {

	config: {
		name: "catbox3",
		version: "3.5",
		author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 0,

		shortDescription: {
			en: "📦 Upload file to Catbox"
		},

		longDescription: {
			en: "Upload media/file/url to Catbox"
		},

		category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",

		guide: {
			en:
				"{pn} → reply to media/file\n" +
				"{pn} [url]"
		}
	},

	onStart: async function ({
		message,
		event,
		args
	}) {

		// 🔐 AUTHOR CHECK
		if (
			this.config.author !==
			"𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"
		) {
			return message.reply(
				"🔒 | Security lock triggered."
			);
		}

		// 🔐 VERIFY LOCK
		if (!_verifyLock()) {
			return message.reply(
				"🔐 | Integrity verification failed."
			);
		}

		let tempPath = null;
		let waitMsg;

		try {

			let fileUrl;
			let fileName = "file";

			// 📥 REPLY ATTACHMENT
			if (
				event.messageReply?.attachments
					?.length > 0
			) {

				const att =
					event.messageReply.attachments[0];

				if (!att.url) {
					return message.reply(
						"❌ | Invalid attachment URL."
					);
				}

				fileUrl = att.url;

				fileName = safeName(
					att.filename ||
					`file_${Date.now()}`
				);
			}

			// 🌐 DIRECT URL
			else if (
				args[0] &&
				/^https?:\/\//i.test(args[0])
			) {

				fileUrl = args[0];

				fileName =
					`url_${Date.now()}`;
			}

			// ❌ NO INPUT
			else {

				return message.reply(
					"📦 | Reply to media/file\n" +
					"or give a direct URL."
				);
			}

			// ⏳ WAIT MESSAGE
			waitMsg =
				await message.reply(
					"⏳ | Uploading to Catbox..."
				);

			// 📂 TEMP FOLDER
			const tempDir =
				path.join(__dirname, "tmp");

			await fs.ensureDir(tempDir);

			// 📄 TEMP FILE PATH
			tempPath = path.join(
				tempDir,
				`${Date.now()}_${fileName}`
			);

			// ⬇️ DOWNLOAD FILE
			const response = await axios({
				url: fileUrl,
				method: "GET",
				responseType: "stream",
				timeout: 120000,
				maxContentLength: Infinity,
				maxBodyLength: Infinity
			});

			const writer =
				fs.createWriteStream(tempPath);

			response.data.pipe(writer);

			await new Promise(
				(resolve, reject) => {

					writer.on(
						"finish",
						resolve
					);

					writer.on(
						"error",
						reject
					);

					response.data.on(
						"error",
						reject
					);
				}
			);

			// 📤 FORM DATA
			const form = new FormData();

			form.append(
				"reqtype",
				"fileupload"
			);

			form.append(
				"userhash",
				""
			);

			form.append(
				"fileToUpload",
				fs.createReadStream(tempPath)
			);

			// 🚀 UPLOAD
			const upload =
				await axios.post(
					"https://catbox.moe/user/api.php",
					form,
					{
						headers:
							form.getHeaders(),

						timeout: 120000,

						maxContentLength:
							Infinity,

						maxBodyLength:
							Infinity
					}
				);

			// ❌ INVALID RESPONSE
			if (
				!upload.data ||
				typeof upload.data !==
					"string" ||
				!upload.data.startsWith(
					"https://"
				)
			) {
				throw new Error(
					"Invalid response from Catbox"
				);
			}

			// 🗑️ UNSEND WAIT
			try {

				if (waitMsg?.messageID) {

					await message.unsend(
						waitMsg.messageID
					);
				}

			}
			catch (e) {}

			// ✅ SUCCESS
			return message.reply(

				"👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥\n" +
				"𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n\n" +

				`🔗 Link:\n${upload.data}`
			);

		}
		catch (err) {

			console.error(err);

			// 🗑️ REMOVE WAIT MESSAGE
			try {

				if (waitMsg?.messageID) {

					await message.unsend(
						waitMsg.messageID
					);
				}

			}
			catch (e) {}

			return message.reply(
				"❌ | Catbox upload failed!\n\n" +
				`⚠️ ${err.message}`
			);
		}
		finally {

			// 🧹 AUTO CLEANUP
			try {

				if (
					tempPath &&
					await fs.pathExists(tempPath)
				) {
					await fs.unlink(tempPath);
				}

			}
			catch (e) {}
		}
	}
};
