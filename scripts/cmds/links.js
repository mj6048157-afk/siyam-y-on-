// 😼 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 😼

const _0x4f2a = [
  "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  "Author Lock Changed!"
];

(function () {
  const x = _0x4f2a[0];
  if (x !== "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") {
    throw new Error(_0x4f2a[1]);
  }
})();

module.exports = {
  config: {
    name: "links",
    version: "1.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    shortDescription: "Facebook Link Finder",
    longDescription: "Get correct Facebook profile link",
    category: "utility",
    guide: {
      en: "fl / Fl / links / Links"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event, message }) {

    try {

      const body =
        (event.body || "").trim();

      const triggers = [
        "fl",
        "Fl",
        "links",
        "Links"
      ];

      if (!triggers.includes(body)) {
        return;
      }

      let uid;

      if (event.messageReply) {
        uid = event.messageReply.senderID;
      }

      else if (
        Object.keys(event.mentions).length > 0
      ) {
        uid =
          Object.keys(event.mentions)[0];
      }

      else {
        uid = event.senderID;
      }

      const profileLink =
`https://www.facebook.com/profile.php?id=${uid}`;

      const msg =
`Bot Owner: 
 🫶𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍🪽


${profileLink}`;

      return message.reply(msg);

    } catch (e) {

      console.log(e);

      return message.reply(
"❌ Unable to fetch Facebook link"
      );

    }

  }
};
