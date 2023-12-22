import mongoose from "mongoose";

export default class {
    constructor(client) {
        this.client = client;
        this.instance = client.instance
    }
    run() {
        const dbOptions = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        }

        mongoose.connect(process.env.MONGO_DB, dbOptions)
        mongoose.set('useFindAndModify', false);

        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            this.client.log('MongoDB conectado com sucesso', 'database')
        });
    }
}