import { ButtonStyle, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import EventLavalinkMap from '../../structure/EventLavalink.js';
import db from '../../database/models/Setup.js';

export default class extends EventLavalinkMap {
    constructor(client) {
        super(client, {
            name: 'playerCreate'
        });
    }
    run = async (player, track) => {
        let guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;

        this.log(`Player criado em ${guild.name} [ ${guild.id} ]`, 'lavalink')

        const data = await db.findOne({ Guild: guild.id });
        if (!data) return;

        let channel = guild.channels.cache.get(data.Channel);
        if (!channel) return;

        let message;
        try {
            message = await channel.messages.fetch(data.Message);
        } catch (e) { };

        if (!message) return;
        const row = new ActionRowBuilder().addComponents([
            new ButtonBuilder({
                customId: `${message.guildId}pause`,
                emoji: "⏸️",
                style: ButtonStyle.Secondary,
                disabled: false
            }),
            new ButtonBuilder({
                customId: `${message.guildId}skip`,
                emoji: "⏭️",
                style: ButtonStyle.Secondary,
                disabled: false
            }),
            new ButtonBuilder({
                customId: `${message.guildId}voldown`,
                emoji: "🔉",
                style: ButtonStyle.Secondary,
                disabled: false
            }),
            new ButtonBuilder({
                customId: `${message.guildId}volup`,
                emoji: "🔊",
                style: ButtonStyle.Secondary,
                disabled: false
            }),
        ]);

        await message.edit({ content: "__**Entre em um canal de voz e envie o nome / link de uma musica**__\n\n", components: [row] }).catch(() => { });
    }
}