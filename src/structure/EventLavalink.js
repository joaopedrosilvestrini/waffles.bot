class EventLavalinkMap {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.log = this.client.log;
        this.emoji = this.client.emoji;
    }
}

export default EventLavalinkMap;