import EventMap from '../../structure/EventMap.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'voiceStateUpdate',
        });
    }
    run = async (oldS, newS) => {
        let guildId = newS.guild.id;
        const player = this.client.manager.players.get(guildId);
        if(!player) return;

        if(!newS.guild.members.cache.get(this.client.user.id).voice.channelId) {
            await player.destroy();
        }
    };
};