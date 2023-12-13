import {
    type BooleanCache, type CacheType,
    type ChatInputCommandInteraction,
    type InteractionResponse,
    type SlashCommandBuilder
} from "discord.js"

interface SlashCommandInterface {
  data: SlashCommandBuilder
  execute: (i: ChatInputCommandInteraction) => any
}

export default class SlashCommand implements SlashCommandInterface {
    data: SlashCommandBuilder
    execute: (i: ChatInputCommandInteraction) => any

    constructor (data: SlashCommandBuilder, execute: (i: ChatInputCommandInteraction) => Promise<InteractionResponse<BooleanCache<CacheType>>>) {
        this.data = data
        this.execute = execute
    }
}
