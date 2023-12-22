import { ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } from 'discord.js';
import EventLavalinkMap from '../../structure/EventLavalink.js';
import db from '../../database/models/Setup.js';
import db2 from '../../database/models/AutoReconnect.js';

export default class extends EventLavalinkMap {
    constructor(client) {
        super(client, {
            name: 'playerDestroy'
        });
    }
    run = async (player, track) => {
        let name = this.client.guilds.cache.get(player.guildId).name;
        this.client.log(`Player destruido em ${name} [ ${player.guildId} ]`, "lavalink");

        let guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;

        const data = await db.findOne({ Guild: guild.id });
        if (!data) return;

        let channel = guild.channels.cache.get(data.Channel);
        if (!channel) return;

        let message;
        try {
            message = await channel.messages.fetch(data.Message);
        } catch (e) { };
        if (!message) return;
        let disabled = true;
        if (player && player.queue && player.queue.current) disabled = false;

        let embed1 = new EmbedBuilder({
            title: `Nada tocando agora`,
            description: `**[Convidar-me](https://discord.com/api/oauth2/authorize?client_id=1147552651169513633&permissions=8&scope=bot+applications.commands)**`
        })

        const row = new ActionRowBuilder().addComponents([
            new ButtonBuilder({
                customId: `${message.guildId}pause`,
                emoji: "⏸️",
                style: ButtonStyle.Secondary,
                disabled
            }),
            new ButtonBuilder({
                customId: `${message.guildId}skip`,
                emoji: "⏭️",
                style: ButtonStyle.Secondary,
                disabled
            }),
            new ButtonBuilder({
                customId: `${message.guildId}voldown`,
                emoji: "🔉",
                style: ButtonStyle.Secondary,
                disabled
            }),
            new ButtonBuilder({
                customId: `${message.guildId}volup`,
                emoji: "🔊",
                style: ButtonStyle.Secondary,
                disabled
            }),
        ]);

        await message.edit({
            content: `__**Digite algo no chat para criar o player, antes de tocar uma musica**__\n\n`,
            embeds: [embed1],
            components: [row]
        });
        const vc = await db2.findOne({ Guild: player.guildId })
        if (vc) await this.client.manager.createPlayer({
            guildId: vc.guild.id,
            voiceChannelId: vc.member.voice.channelId,
            textChannelId: vc.channel.id,
            selfDeaf: true,
            volume: 50
        })
    }
}