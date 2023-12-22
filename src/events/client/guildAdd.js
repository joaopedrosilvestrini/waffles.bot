import EventMap from '../../structure/EventMap.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'guildCreate',
        });
    }
    run = async (guild) => {
        return this.client.log(`Fui adicionado em um servidor`, 'notice')
    };
};