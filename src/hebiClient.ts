import {
    type Awaitable,
    type CacheType,
    Client,
    Collection, Events,
    GatewayIntentBits,
    type Interaction,
    type Snowflake
} from "discord.js"
import * as path from "path"
import * as fs from "fs"
import type SlashCommand from "./slashCommand"

export class HebiClient extends Client {
    serverID: string
    helpChannelID: string
    slashCommands!: Collection<string, SlashCommand>

    constructor (botToken: string, serverID: Snowflake, helpChannelID: Snowflake) {
        super({
            intents: [
                GatewayIntentBits.Guilds
            ]
        })

        this.serverID = serverID
        this.helpChannelID = helpChannelID

        this.loadCommands()

        this.on(Events.InteractionCreate, async (i) => { await this.handleInteraction(i) })

        void this.login(botToken)
    }

    private async handleInteraction (interaction: Interaction<CacheType>): Promise<Awaitable<void>> {
        if (!interaction.isChatInputCommand()) return

        const command = interaction.client.slashCommands.get(interaction.commandName)

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`)
            return
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true })
            } else {
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
            }
        }
    }

    private loadCommands (): void {
        this.slashCommands = new Collection<string, SlashCommand>()

        const foldersPath = path.join(__dirname, "slashCommands")
        const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(".js"))

        for (const file of commandFiles) {
            const filePath = path.join(foldersPath, file)
            const command: SlashCommand = require(filePath)

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ("data" in command && "execute" in command) {
                this.slashCommands.set(command.data.name, command)
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
        }
    }
}
