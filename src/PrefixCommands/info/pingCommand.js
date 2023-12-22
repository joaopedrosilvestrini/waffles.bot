import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import PrefixCommands from '../../structure/PrefixCommands.js';

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['ms']
        });
    }
    run = (message, args) => {
        return message.reply({
            content: `${this.client.ws.ping}ms!`
        })
    }
}