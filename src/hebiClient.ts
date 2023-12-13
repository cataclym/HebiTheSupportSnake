import {
    type Awaitable,
    Client,
    Collection, Events,
    GatewayIntentBits,
    type Interaction,
    type Snowflake,
    REST,
    Routes,
    SlashCommandBuilder, type ChatInputCommandInteraction
} from "discord.js"
import * as path from "path"
import * as fs from "fs"
import SlashCommand from "./slashCommand"
import Sqlite from "./db/sqlite"
import NadekoCommand from "./NadekoCommand"

export class HebiClient extends Client<true> {
    private readonly serverID: Snowflake
    private helpChannelID: Snowflake
    private slashCommands!: Collection<string, SlashCommand>
    SQLite: Sqlite
    private readonly _jsonURL: string
    public nadekoCommands!: {
        [category: string]: NadekoCommand[]
    }

    public constructor(botToken: string, serverID: Snowflake, helpChannelID: Snowflake, jsonURL: string) {
        super({
            intents: [
                GatewayIntentBits.Guilds
            ]
        })

        this.serverID = serverID
        this.helpChannelID = helpChannelID
        this._jsonURL = jsonURL

        this.SQLite = new Sqlite()

        this.on(Events.InteractionCreate, async (i) => {
            await this.handleInteraction(i)
        })

        void this.login(botToken)

    }

    async login(botToken: string) {
        const str = await super.login(botToken)
        await this.fetchNadekoCommands()
        await this.deployCommands()
        return str
    }

    private async handleInteraction(interaction: Interaction): Promise<Awaitable<void>> {
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
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                })
            } else {
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
            }
        }
    }

    private async loadCommands(): Promise<void> {
        this.slashCommands = new Collection<string, SlashCommand>()

        const foldersPath = path.join(__dirname, "slashCommands")
        const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(".js"))

        for (const file of commandFiles) {
            const filePath = path.join(foldersPath, file)
            const { data, execute }: {
                data: (client: HebiClient) => SlashCommandBuilder | Promise<SlashCommandBuilder>,
                execute: (i: ChatInputCommandInteraction) => any
            } = require(filePath).default

            if (data && execute) {

                const slashCommand = new SlashCommand(await data(this), execute)
                this.slashCommands.set(slashCommand.data.name, slashCommand)

            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
        }
    }

    private async deployCommands() {

        const body = this.slashCommands.map(cmd => cmd.data.toJSON())

        const rest = new REST().setToken(this.token)

        console.log(`Started refreshing ${body.length} application (/) commands.`)

        await rest.put(
            Routes.applicationGuildCommands(this.user.id, this.serverID),
            { body },
        )
        console.log("Finished refreshing (/) commands.")
    }

    private async fetchNadekoCommands() {
        const res = await fetch(this._jsonURL)

        if (!res.ok) throw new Error(`${res.url} ${res.statusText}`)

        this.nadekoCommands = await res.json()

        await this.loadCommands()
    }
}
