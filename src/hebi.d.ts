import {HebiClient} from "./hebiClient"

declare module "discord.js" {
    export interface Base {
        client: HebiClient<true>
    }

    export interface ChatInputCommandInteraction<CacheType> {
        client: HebiClient<CacheType>
    }
}
