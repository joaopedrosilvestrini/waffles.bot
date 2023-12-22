import { EmbedBuilder } from 'discord.js';
import EventLavalinkMap from '../../structure/EventLavalink.js';
import db from '../../database/models/Setup.js';
import converTime from '../../utils/functions/getTimeout.js';

export default class extends EventLavalinkMap {
    constructor(client) {
        super(client, {
            name: 'nodeConnect'
        });
    }
    run = async () => {
        this.client.log("Node carregado com sucesso!", "lavalink")
    }
}