import EventMap from '../../structure/EventMap.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'raw',
        });
    }
    run = async (packet) => {
        this.client.manager.handleVoiceUpdate(packet);
    };
};