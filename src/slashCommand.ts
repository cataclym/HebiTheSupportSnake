import {
    type BooleanCache, type CacheType,
    type ChatInputCommandInteraction,
    type InteractionResponse,
    type SlashCommandBuilder
} from "discord.js"

interface SlashCommandInterface {
  data: SlashCommandBuilder
  execute: (i: ChatInputCommandInteraction<"cached", true>) => any
}

export default class SlashCommand implements SlashCommandInterface {
    data: SlashCommandBuilder
    execute: (i: ChatInputCommandInteraction<"cached", true>) => any
    constructor (data: SlashCommandBuilder, execute: (i: ChatInputCommandInteraction<"cached", true>) => Promise<InteractionResponse<BooleanCache<CacheType>>>) {
        this.data = data
        this.execute = execute
    }
}
