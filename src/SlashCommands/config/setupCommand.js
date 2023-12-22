import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, GuildPremiumTier, SlashCommandBuilder } from "discord.js";
import SlashCommands from "../../structure/SlashCommands.js";
import db from '../../database/models/Setup.js'

export default class extends SlashCommands {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName('setup')
                .setDescription('[Config] Inicie a configuração de musica.')
                .setDMPermission(false)
                .addSubcommand(subcommand => subcommand
                    .setName('setar')
                    .setDescription('[Config] Sete o canal')
                )
        });
    }

    run = async (interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const data = await db.findOne({ Guild: interaction.guildId });

        switch (subcommand) {
            case "setar": {
                if (data) return await interaction.reply({
                    content: `O setup já foi feito nesse servidor.`,
                    ephemeral: true
                });

                const parent = await interaction.guild.channels.create({
                    name: "Zona de Musica",
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: this.client.user.id,
                            allow: ["Connect", "Speak", "ViewChannel", "SendMessages", "EmbedLinks"]
                        }
                    ]
                });

                const textChannel = await interaction.guild.channels.create({
                    name: "pedir-musica",
                    type: ChannelType.GuildText,
                    parent: parent.id,
                    permissionOverwrites: [
                        {
                            id: this.client.user.id,
                            allow: ["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"]
                        }
                    ]
                });

                let rates = [1000 * 64, 1000 * 96, 1000 * 128, 1000 * 256, 1000 * 384];
                let rate = rates[0];

                switch (interaction.guild.premiumTier) {
                    case GuildPremiumTier.None:
                        rate = rates[1];
                        break;

                    case GuildPremiumTier.Tier1:
                        rate = rates[2];
                        break;

                    case GuildPremiumTier.Tier2:
                        rate = rates[3];
                        break;

                    case GuildPremiumTier.Tier3:
                        rate = rates[4];
                        break;
                };

                const voiceChannel = await interaction.guild.channels.create({
                    name: "🎶",
                    parent: parent.id,
                    type: ChannelType.GuildVoice,
                    bitrate: rate,
                    userLimit: 35,
                    permissionOverwrites: [
                        {
                            id: this.client.user.id,
                            allow: ["Connect", "Speak", "ViewChannel", "RequestToSpeak"]
                        }
                    ]
                })


                let disabled = true;
                let player = this.client.manager.players.get(interaction.guildId);
                if(player) disabled = false;

                const title = player && player.queue && player.current ? "Tocando agora" : "Nada tocando agora";
                const desc = player && player.queue && player.current ? `[${player.current.title}](${player.current.uri})` : `**[Convidar-me](https://discord.com/api/oauth2/authorize?client_id=1147552651169513633&permissions=8&scope=bot+applications.commands)**`;
                const footer = {
                    text: player && player.queue && player.current ? `Pedido por ${player.current.requester}` : "",
                    iconURL: `${this.client.user.avatarURL()}`
                };

                let embed1 = new EmbedBuilder({
                    title,
                    desc,
                    footer: { text: footer.text, iconURL: footer.iconURL }
                });
                const row = new ActionRowBuilder().addComponents([
                    new ButtonBuilder({
                        customId: `${interaction.guildId}pause`,
                        emoji: "⏸️",
                        style: ButtonStyle.Secondary,
                        disabled
                    }),
                    new ButtonBuilder({
                        customId: `${interaction.guildId}skip`,
                        emoji: "⏭️",
                        style: ButtonStyle.Secondary,
                        disabled
                    }),
                    new ButtonBuilder({
                        customId: `${interaction.guildId}voldown`,
                        emoji: "🔉",
                        style: ButtonStyle.Secondary,
                        disabled
                    }),
                    new ButtonBuilder({
                        customId: `${interaction.guildId}volup`,
                        emoji: "🔊",
                        style: ButtonStyle.Secondary,
                        disabled
                    }),
                ]);

                const msg = await textChannel.send({
                    content: `__**Digite algo no chat para criar o player, antes de tocar uma musica**__\n\n`,
                    embeds: [embed1],
                    components: [row],
                });

                const NData = new db({
                    Guild: interaction.guildId,
                    Channel: textChannel.id,
                    Message: msg.id,
                    voiceChannel: voiceChannel.id,
                });

                await NData.save();
                return await interaction.reply({
                    content: `Setup finalizado\n**Canal para pedir musicas foi criado com sucesso! ${textChannel}**`
                })
            }
        }
    }
}