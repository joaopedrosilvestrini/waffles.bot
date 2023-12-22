import EventMap from '../../structure/EventMap.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'guildDelete',
        });
    }
    run = async (guild) => {
        return this.client.log(`Fui deletado de um servidor`, 'notice')
    };
};