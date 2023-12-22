import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import converTime from "./getTimeout.js";
import db from "../../database/models/Setup.js";

export async function trackStartEventHandler(msgId, channel, player, track, client) {
    try {
        let icon = `${track.thumbnail ? track.thumbnail : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`}` || null;
        let message;
        try {
            message = await channel.messages.fetch(msgId);
        } catch(error) { };
        if(!message) {
            let embed1 = new EmbedBuilder({
                description: `**[${track.title}](${track.uri})** - ${track.isStream ? '[**◉ LIVE**]' : `\`${converTime(player.current.duration)}\``}`,
                image: { url: icon }
            })

            const row = new ActionRowBuilder().addComponents([
                new ButtonBuilder({
                    customId: `${player.guildId}pause`,
                    emoji: "⏸️",
                    style: ButtonStyle.Secondary,
                    disabled
                }),
                new ButtonBuilder({
                    customId: `${player.guildId}skip`,
                    emoji: "⏭️",
                    style: ButtonStyle.Secondary,
                    disabled
                }),
                new ButtonBuilder({
                    customId: `${player.guildId}voldown`,
                    emoji: "🔉",
                    style: ButtonStyle.Secondary,
                    disabled
                }),
                new ButtonBuilder({
                    customId: `${player.guildId}volup`,
                    emoji: "🔊",
                    style: ButtonStyle.Secondary,
                    disabled
                }),
            ]);

            const m = await channel.send({
                content: "__**Entre em um canal de voz e envie o nome / link de uma musica**__\n\n",
                embeds: [embed1],
                components: [row]
            })

            return await db.findOneAndUpdate({ Guild: channel.guildId }, { Message: m.id });
        } else {
            let embed2 = new EmbedBuilder({
                description: `**${track.title.substr(0, 25) + "..."}** - ${track.isStream ? '[**◉ LIVE**]' : `\`${converTime(player.current.duration)}\``}`,
                image: { url: icon }
            })

            await message.edit({
                content: `__**Entre em um canal de voz e envie o nome / link de uma musica**__\n\n`,
                embeds: [embed2]
            })
        }
    } catch(error) {
        return console.error(error)
    }
}