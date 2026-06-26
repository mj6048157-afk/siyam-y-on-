module.exports = {
    config: {
        name: "alllist",
        version: "1.0.0",
        author: "Siyam Hasan",
        countDown: 5,
        role: 2, // শুধুমাত্র বট অ্যাডমিন (Bot Admin Only) ব্যবহার করতে পারবে
        description: "বটের সমস্ত তথ্য এবং কমান্ডের তালিকা দেখায় (শুধুমাত্র অ্যাডমিন)",
        category: "info"
    },

    onStart: async function ({ message, args }) {
        // অতিরিক্ত কোনো অপশন বা আর্গুমেন্ট থাকলে কাজ করবে না (যেমন: ,alllist on/off বা অন্য কিছু লিখলে)
        if (args && args.length > 0) {
            return; 
        }

        const infoText = `────────────────
📊 ALL COMMANDS & BOT INFO LIST
────────────────

🤖 BOT INFO
┠ নি্ঁঝু্ঁম্ঁ চ্যা্ঁট্ঁ ব্ঁট্ঁ • রা্ঁশি্ঁয়া্ঁন্ নি্ঁঝু্ঁম্ • 🤖 𝗡𝗜𝗝𝗛𝗨𝗠 𝗕𝗢𝗧
┖ 𓆩»̶̶͓͓͓̽̽̽𝆠꯭፝֟ɴɪᴊʜᴜᴍ-ᴄʜᴀᴛ-ʙᴏᴛ𝆠꯭፝֟⚜️𓆪

📞 CONTACT & EMAIL
┠ mj6048157@gmail.com • mdsiyam13536@gmail.com
┖ 01741496661 • +𝟴𝟴𝟬𝟭𝟳𝟴𝟵𝟭𝟯𝟴𝟭𝟱𝟳

👥 USERS & NICKNAMES
┠ ヽ｟ᏟᎬϴ｠▁▁ዐዐዐ 🙁😚☺️👿 • সি্ঁয়া্ঁম্ঁ
┠  হ্ঁট্ঁ ভ্ঁই্ঁ পি্ঁচ্চি্ঁ হৃ্ঁদয়্ঁ • পি্ঁচ্চি্ঁ রি্ঁদ্ঁয়্ঁ ত্যা্ঁহ্ঁ
┠ অ্যা্ঁঁটি্ঁঁটি্ঁঁউ্ঁঁড্ঁ কু্ঁঁই্ঁঁন্ সা্ঁঁদি্ঁঁয়া • আ্ঁসো্ঁ সে্ঁক্স্ঁ ক্ঁরি্ঁ
┖ তো্ঁমা্ঁগো্ঁ পি্ঁচ্চি্ মো্ঁহি্ঁনী্ঁ • তো্ঁমা্ঁগো্ঁ তো্ঁমা্ঁগো্ঁ পি্ঁচ্চি্ঁ আ্ঁপু্ঁ

👑 BOT OWNER INFO
┖ নাম: হৃদয় হাসান • বাসা: কিশোরগঞ্জ • বয়স: ১৭+

📊 BOT STATUS
┠ 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
┠ 🔰 𝗣𝗥𝗘𝗙𝗜𝗫 ➜ { , } • 📊 𝗧𝗢𝗧𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ➜ 700+
┠ ⚙️ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 ➜ V2 💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠
┖ 👑-𝐒𝐈𝐘𝐀𝐌-👑 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩2 • 𝟔𝟎𝟗𝟔

⚙️ BOT COMMANDS
🛠 ADMIN & SYSTEM
┖ antiInbox • police • ,wl on • ,autotimer on • ,allnoti hi • /namaz • ban • kick • protect on • autotimer on • senlock • autoseen off • botstatus • rankup on

📦 BOX & GROUP
┖ allgroup • goatstore show 16 • supportgc • allnick • cancelmarry • mentionspam

😂 FUN & ADULT
┖ ,chipay • ,chor • ,nude, • bonk • propose • love • kiss

💖 LOVE & PAIR
┖ .pair • ,pair4 • pairedit

📂 FILES & TOOLS
┖ /File uns • Voicehelp • webss • catbox • imgur • search • xray • chakrun

🖼 MEDIA & PINTEREST
┖ manga • pinterest • pinterestpro • catvideo

ℹ️ INFO & ECONOMY
┖ age 5/05/209 • ,userinfo • balance
────────────────`;

        return message.reply(infoText);
    }
};
