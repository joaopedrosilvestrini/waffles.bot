import { SlashCommandBuilder } from "discord.js";
import SlashCommands from "../../structure/SlashCommands.js";

export default class extends SlashCommands {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('[Information] Veja minha velocidade')
            .setDMPermission(false)
        });
    }

    run = async(interaction) => {
        await interaction.reply({
            content: `${this.client.ws.ping}ms!`,
            ephemeral: true
        })
    }
}