import { EmbedBuilder } from 'discord.js';
import EventLavalinkMap from '../../structure/EventLavalink.js';
import db from '../../database/models/Setup.js';
import converTime from '../../utils/functions/getTimeout.js';

export default class extends EventLavalinkMap {
    constructor(client) {
        super(client, {
            name: 'trackEnd'
        });
    }
    run = async (player) => {
        let guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;
        this.client.log(`Uma musica acabou em ${guild.name} [ ${guild.id} ]`, "lavalink");
        const data = await db.findOne({ Guild: guild.id });
        if (!data) return;
        let channel = guild.channels.cache.get(data.Channel);
        if (!channel) return;

        let message;

        try {
            message = await channel.messages.fetch(data.Message);
        } catch(err) { };

        if(!message) return;
        await message.edit({ embeds: [new EmbedBuilder({
            title: `Nada tocando agora`,
            description: `**[Convidar-me](https://discord.com/api/oauth2/authorize?client_id=1147552651169513633&permissions=8&scope=bot+applications.commands)**`
        })] })
    }
}