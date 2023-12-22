import EventMap from '../../structure/EventMap.js';
import terminal from '../../utils/functions/createMosaic.js';

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'ready',
            once: true
        });
    }
    run = async () => {
        console.log(terminal)

        await this.client.registerCommands();
        await this.client.manager.start(this.client.user.id);
        this.log(`O client ${`${this.client.user.tag}`.blue} ${`(${this.client.user.id})`.blue} foi iniciado com êxito!`, 'client');
    };
};