import EventMap from '../../structure/EventMap.js';
import db from '../../database/models/Setup.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'messageCreate'
        });
    }
    run = async (message) => {
        if (message.author.bot) return;
        if(!message.guild) return;
        let data = await db.findOne({ Guild: message.guildId });
        if (data && data.Channel && message.channelId === data.Channel) {
            if (!message.member.voice.channel) {
                await message.reply({ content: `Você não está em um canal de voz.` }).then((a) => {
                    setTimeout(() => { a.delete() }, 10000)
                });
                if (message) await message.delete().catch(() => { });
                return;
            };
            let cc;
            if(message.attachments.size > 0) {
                cc = message.attachments.first().url
            } else {
                cc = message.content
            };

            const res = await this.client.manager.search(cc);
            const player = await this.client.manager.createPlayer({
                guildId: message.guild.id,
                voiceChannelId: message.member.voice.channelId,
                textChannelId: message.channel.id,
                selfDeaf: true,
                volume: 50
            })

            player.connect();

            if (res.loadType === 'PLAYLIST_LOADED') {
                for (const track of res.tracks) {
                    track.setRequester(message.author);
                    player.queue.add(track);
                }
            } else {
                const track = res.tracks[0];
                track.setRequester(message.author);
                player.queue.add(track);
            }

            if (!player.playing && !player.paused) player.play();
            if (message) await message.delete().catch(() => { });
        }
    }
}