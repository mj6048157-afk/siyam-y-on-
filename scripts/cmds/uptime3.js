const fs = require("fs-extra");
const moment = require("moment-timezone");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports = {
  config: {
    name: "uptime3",
    aliases: ["up3"],
    version: "12.0.0",
    author: "SIYAM",
    role: 0,
    shortDescription: "Premium Uptime GIF",
    longDescription: "Ultra Premium Animated Uptime Card",
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {

    try {

      const loading =
        await api.sendMessage(
          "🦅 | 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐔𝐩𝐭𝐢𝐦𝐞 ⚡🪬",
          event.threadID
        );

      const width = 720;
      const height = 980;

      const encoder =
        new GIFEncoder(width, height);

      const cacheFolder =
        __dirname + "/cache";

      if (!fs.existsSync(cacheFolder)) {

        fs.mkdirSync(cacheFolder, {
          recursive: true
        });
      }

      const gifPath =
        cacheFolder + "/uptime3.gif";

      const stream = encoder
        .createReadStream()
        .pipe(
          fs.createWriteStream(gifPath)
        );

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(60);
      encoder.setQuality(10);

      // PROFILE
      const profile =
        await loadImage(
          "https://i.imgur.com/3j6kz0F.jpeg"
        );

      // COLORS
      const colors = [
        "#ff0000",
        "#00ff00",
        "#00ffff",
        "#ff00ff",
        "#ffff00",
        "#ff8800",
        "#0088ff",
        "#ffffff",
        "#00ff88"
      ];

      // OWNER UID
      const ownerUID =
        global.GoatBot?.config?.admins?.[0]
        || "100087654321";

      for (
        let frame = 0;
        frame < 65;
        frame++
      ) {

        const canvas =
          createCanvas(
            width,
            height
          );

        const ctx =
          canvas.getContext("2d");

        // BACKGROUND
        ctx.fillStyle =
          "#000000";

        ctx.fillRect(
          0,
          0,
          width,
          height
        );

        // BIG EAGLE WATERMARK
        ctx.save();

        ctx.globalAlpha = 0.06;

        ctx.font =
          "bold 250px Sans";

        ctx.fillStyle =
          "#ffffff";

        ctx.fillText(
          "🦅",
          170,
          470
        );

        ctx.restore();

        // MAIN CARD
        ctx.fillStyle =
          "#050505";

        roundRect(
          ctx,
          35,
          35,
          650,
          900,
          30,
          true
        );

        // RGB MOVING FRAME
        const borderSize = 18;

        for (
          let i = 0;
          i < 9;
          i++
        ) {

          ctx.strokeStyle =
            colors[
              (frame + i)
              % colors.length
            ];

          ctx.lineWidth =
            borderSize;

          ctx.shadowBlur = 30;

          ctx.shadowColor =
            colors[
              (frame + i)
              % colors.length
            ];

          ctx.strokeRect(
            35 + (i * 2),
            35 + (i * 2),
            650 - (i * 4),
            900 - (i * 4)
          );
        }

        ctx.shadowBlur = 0;

        // SIDE EAGLES
        ctx.save();

        ctx.globalAlpha = 0.28;

        ctx.font =
          "bold 100px Sans";

        // LEFT
        ctx.fillText(
          "🦅",
          15,
          390
        );

        // RIGHT
        ctx.fillText(
          "🦅",
          615,
          390
        );

        ctx.restore();

        // TITLE
        ctx.fillStyle =
          "#ffffff";

        ctx.font =
          "bold 28px Sans";

        ctx.fillText(
          "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
          110,
          95
        );

        // PROFILE
        const px = 360;
        const py = 230;
        const radius = 95;

        ctx.save();

        ctx.beginPath();

        ctx.arc(
          px,
          py,
          radius,
          0,
          Math.PI * 2
        );

        ctx.closePath();

        ctx.clip();

        ctx.drawImage(
          profile,
          px - radius,
          py - radius,
          radius * 2,
          radius * 2
        );

        ctx.restore();

        // PROFILE RGB RING
        for (
          let i = 0;
          i < 8;
          i++
        ) {

          ctx.strokeStyle =
            colors[
              (frame + i)
              % colors.length
            ];

          ctx.lineWidth = 10;

          ctx.beginPath();

          ctx.arc(
            px,
            py,
            radius + 15,

            ((Math.PI * 2) / 8)
            * i
            + frame * 0.12,

            ((Math.PI * 2) / 8)
            * i
            + 0.45
            + frame * 0.12
          );

          ctx.stroke();
        }

        // UPTIME
        const uptime =
          process.uptime();

        const days =
          Math.floor(
            uptime / 86400
          );

        const hours =
          Math.floor(
            (uptime % 86400)
            / 3600
          );

        const minutes =
          Math.floor(
            (uptime % 3600)
            / 60
          );

        const seconds =
          Math.floor(
            uptime % 60
          );

        // UPTIME BOX
        ctx.fillStyle =
          "#0d0d0d";

        roundRect(
          ctx,
          75,
          390,
          570,
          90,
          20,
          true
        );

        ctx.strokeStyle =
          colors[
            frame
            % colors.length
          ];

        ctx.lineWidth = 5;

        roundRect(
          ctx,
          75,
          390,
          570,
          90,
          20,
          false
        );

        ctx.fillStyle =
          "#ffffff";

        ctx.font =
          "bold 25px Sans";

        ctx.fillText(
          `⏳ ${days}D  ${hours}H  ${minutes}M  ${seconds}S`,
          145,
          445
        );

        // DATE TIME
        const now =
          moment()
          .tz(
            "Asia/Dhaka"
          );

        const date =
          now.format(
            "DD MMM YYYY"
          );

        const time =
          now.format(
            "hh:mm:ss A"
          );

        // DATE BOX
        ctx.fillStyle =
          "#0d0d0d";

        roundRect(
          ctx,
          75,
          525,
          570,
          100,
          20,
          true
        );

        ctx.strokeStyle =
          "#bb66ff";

        ctx.lineWidth = 5;

        roundRect(
          ctx,
          75,
          525,
          570,
          100,
          20,
          false
        );

        ctx.fillStyle =
          "#ffffff";

        ctx.font =
          "bold 22px Sans";

        ctx.fillText(
          `📅 ${date}`,
          110,
          570
        );

        ctx.fillStyle =
          "#00ffff";

        ctx.fillText(
          `🕒 ${time}`,
          110,
          610
        );

        // UID BOX
        ctx.fillStyle =
          "#0d0d0d";

        roundRect(
          ctx,
          75,
          670,
          570,
          100,
          20,
          true
        );

        ctx.strokeStyle =
          "#00ff88";

        ctx.lineWidth = 5;

        roundRect(
          ctx,
          75,
          670,
          570,
          100,
          20,
          false
        );

        ctx.fillStyle =
          "#ffffff";

        ctx.font =
          "bold 24px Sans";

        ctx.fillText(
          "👑 OWNER UID",
          105,
          730
        );

        ctx.fillStyle =
          "#ffff00";

        ctx.fillText(
          ownerUID,
          330,
          730
        );

        // COMMANDS
        ctx.fillStyle =
          "#00ff88";

        ctx.font =
          "bold 24px Sans";

        ctx.fillText(
          "⚡ COMMANDS ⚡",
          235,
          825
        );

        const commands = [
          "📡 ,hel",
          "👑 ,owner",
          "🪬 ,fork"
        ];

        commands.forEach(
          (cmd, i) => {

            const x =
              80 + (i * 185);

            const y = 850;

            ctx.fillStyle =
              "#0d0d0d";

            roundRect(
              ctx,
              x,
              y,
              160,
              55,
              16,
              true
            );

            ctx.strokeStyle =
              colors[
                (frame + i)
                % colors.length
              ];

            ctx.lineWidth = 4;

            roundRect(
              ctx,
              x,
              y,
              160,
              55,
              16,
              false
            );

            ctx.fillStyle =
              "#ffffff";

            ctx.font =
              "bold 18px Sans";

            ctx.textAlign =
              "center";

            ctx.fillText(
              cmd,
              x + 80,
              y + 35
            );

            ctx.textAlign =
              "start";
          }
        );

        encoder.addFrame(ctx);
      }

      encoder.finish();

      stream.on(
        "finish",

        async () => {

          api.unsendMessage(
            loading.messageID
          );

          await api.sendMessage(
            {
              body:
                "🦅 | 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐔𝐏𝐓𝐈𝐌𝐄 𝐒𝐘𝐒𝐓𝐄𝐌 ⚡",

              attachment:
                fs.createReadStream(
                  gifPath
                )
            },

            event.threadID,

            () => {

              if (
                fs.existsSync(gifPath)
              ) {

                fs.unlinkSync(
                  gifPath
                );
              }
            },

            event.messageID
          );
        }
      );

    } catch (e) {

      console.log(e);

      api.sendMessage(
        "❌ | Premium uptime failed",
        event.threadID
      );
    }
  }
};

// ROUND RECT
function roundRect(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  fill
) {

  ctx.beginPath();

  ctx.moveTo(
    x + radius,
    y
  );

  ctx.lineTo(
    x + width - radius,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  ctx.lineTo(
    x + width,
    y + height - radius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  ctx.lineTo(
    x + radius,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  ctx.lineTo(
    x,
    y + radius
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();

  if (fill) ctx.fill();
  else ctx.stroke();
}
