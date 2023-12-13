import {
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption
} from "discord.js"
import HebiEmbed from "../HebiEmbed"
import { HebiClient } from "../hebiClient"

type EmbedRow = {
    id: number,
    keyword: string
}

const data = async (client: HebiClient) => {

    const promise = async () => new Promise<EmbedRow[]>((resolve) => {
        client.SQLite.db.all<EmbedRow>("SELECT id, keyword FROM embeds", (e, r) => {
            return resolve(r)
        })
    })

    const rows =  await promise()

    return new SlashCommandBuilder()
        .setName("help")
        .setDescription("WIP")
        .setDescriptionLocalization("en-US", "English")
        .addStringOption((stringOption: SlashCommandStringOption) => stringOption
            .setName("embed")
            .setDescription("WIP")
            .setDescriptionLocalization("en-US", "English")
            .setRequired(true)
            .setChoices(
                ...rows.map((row) => {
                    console.log(row.keyword)
                    return {
                        name: row.keyword,
                        value: String(row.id)
                    }
                })
            )
        )
}

async function execute (i: ChatInputCommandInteraction) {

    const cmd = i.options.getString("embed", true)

    i.client.SQLite.db.get<{embedData: string}>("SELECT embedData from embeds WHERE id = ?", parseInt(cmd),  (e, row) => {
        if (e || !row) throw new Error("Embed not found!")

        const messageData = new HebiEmbed(row.embedData)

        return i.reply(messageData)
    })
}

export default { data, execute }
