import SlashCommand from "../slashCommand"
import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

const data = new SlashCommandBuilder()

async function execute (i: ChatInputCommandInteraction<"cached", true>) {
    return await i.reply({ ephemeral: true, content: "Hello" })
}

export default new SlashCommand(data, execute)
