import { EmbedBuilder } from 'discord.js';
import EventLavalinkMap from '../../structure/EventLavalink.js';
import db from '../../database/models/Setup.js';
import { trackStartEventHandler } from '../../utils/functions/trackStartEventHandler.js';

export default class extends EventLavalinkMap {
    constructor(client) {
        super(client, {
            name: 'trackStart'
        });
    }
    run = async (player, track) => {
        let guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;

        this.client.log(`Usuário ${track.requester.id} iniciou uma musica em ${guild.name}/${guild.id}`, 'lavalink');
        let channel = guild.channels.cache.get(player.textChannelId);
        if (!channel) return;

        let data = await db.findOne({ Guild: guild.id });

        if (data && data.Channel) {
            let textChannel = guild.channels.cache.get(data.Channel);
            const id = data.Message;
            if (channel === textChannel) {
                return await trackStartEventHandler(id, textChannel, player, track, this.client)
            } else {
                await trackStartEventHandler(id, textChannel, player, track, this.client)
            };
        }
    }
}