import { EmbedBuilder } from 'discord.js';
import EventMap from '../../structure/EventMap.js';
import db from '../../database/models/Setup.js';
import converTime from '../../utils/functions/getTimeout.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        });
    }
    run = async (interaction) => {
        if (interaction.isButton()) {
            let data = await db.findOne({ Guild: interaction.guildId });
            if (data && interaction.channelId === data.Channel && interaction.message.id === data.Message) {
                if (!interaction.replied) await interaction.deferReply().catch(() => { });
                if (!interaction.replied) await interaction.deferReply().catch(() => { });
                if (!interaction.member.voice.channel) {
                    await interaction.editReply({ content: `Você não está em um canal de voz.`, ephemeral: true })
                    return;
                };

                let player = this.client.manager.players.get(interaction.guild.id);
                if (!player) return interaction.deleteReply();
                if (!player.queue) return await interaction.deleteReply();
                if (!player.current) return await interaction.deleteReply();

                let message;

                try {
                    message = await interaction.channel.messages.fetch(data.Message);
                } catch (e) { }

                let icon = `${player.current.thumbnail ? player.current.thumbnail : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`}`;
                let nowplaying = new EmbedBuilder({
                    description: `**[${player.current.title})}](${player.current.uri})** • ${player.current.isStream ? '[**◉ LIVE**]' : converTime(player.current.duration)}`,
                    image: { url: icon }
                })
                switch (interaction.customId) {
                    case `${interaction.guild.id}pause`: {
                        if (player.paused) {
                            await player.pause(false)
                            await interaction.deleteReply();
                            if (message) await message.edit({
                                embeds: [nowplaying]
                            }).catch(() => { });
                        } else {
                            await player.pause(true);
                            await interaction.deleteReply();
                            if (message) await message.edit({
                                embeds: [nowplaying]
                            }).catch(() => { });
                        }
                    }
                    case `${interaction.guild.id}skip`: {
                        if (player.queue.length === 0) return await interaction.deleteReply();
                        await player.skip();
                        if (message) await message.edit({
                            embeds: [nowplaying]
                        }).catch(() => { });
                        return await interaction.deleteReply();
                    }
                    case `${interaction.guild.id}voldown`: {
                        let amount = Number(player.volume * 500 - 10);
                        if (amount <= 9) return await interaction.deleteReply();
                        if (message) await message.edit({
                            embeds: [nowplaying]
                        }).catch(() => { });
                        await player.node.send({
                            op: "volume",
                            guildId: interaction.guild.id,
                            volume: amount / 1
                        });
                        await interaction.deleteReply();
                        if (message) await message.edit({
                            embeds: [nowplaying]
                        }).catch(() => { });
                    }
                    case `${interaction.guild.id}volup`: {
                        let amount = Number(player.volume * 500 + 10);
                        if (amount >= 100) return await interaction.deleteReply();
                        await player.node.send({
                            op: "volume",
                            guildId: interaction.guild.id,
                            volume: amount / 1
                        })
                        await interaction.deleteReply();
                        if (message) await message.edit({
                            embeds: [nowplaying]
                        }).catch(() => { });
                    }
                }
            }
        }
    }
}