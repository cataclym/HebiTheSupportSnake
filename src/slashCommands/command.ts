import {
    type ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandStringOption, SlashCommandSubcommandBuilder,
} from "discord.js"
import NadekoCommand from "../NadekoCommand"
import { HebiClient } from "../hebiClient"

const data = (client: HebiClient) => {
    const builder = new SlashCommandBuilder()
        .setName("command")
        .setDescription("wip")
        .setDescriptionLocalization("en-US", "English")

    for (const [category, commands] of Object.entries(client.nadekoCommands)) {
        builder.addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(category.toLowerCase())
            .setDescription(`Choose commands from ${category}`)
            .addStringOption(new SlashCommandStringOption()
                .setName("command")
                .setDescription("Choose command to see info about")
                .setChoices(...commands.slice(0, 24).map(cmd => {
                    return {
                        name: cmd.Aliases[0],
                        value: `{ category: ${category} index: ${commands.indexOf(cmd)} }`
                    }
                }))
            )
        )
    }
    return builder
}

async function execute (i: ChatInputCommandInteraction) {

    const json: {category: string, index: string} = JSON.parse(i.options.getString("command", true))

    const cmdObj: NadekoCommand = i.client.nadekoCommands[json.category][parseInt(json.index)]

    const embed = new EmbedBuilder()
        .setTitle(`\`${cmdObj.Aliases.join("` / `")}\``)
        .setDescription(cmdObj.Description)
        .addFields({
            name: "Usage",
            value: `\`${cmdObj.Usage.join("`\n`")}\``
        })
        .setFooter({
            text: `Module: ${cmdObj.Module}`
        })
        .withNadekoColor()

    return await i.reply({ embeds: [embed] })
}

export default { data, execute }
