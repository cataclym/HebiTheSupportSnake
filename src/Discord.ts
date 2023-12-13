import {HebiClient} from "./hebiClient"
import {EmbedBuilder} from "discord.js"

declare module "discord.js" {
    export interface Guild {
        client: HebiClient;
    }

    export interface GuildMember {
        client: HebiClient;
    }

    export interface Message {
        client: HebiClient;
    }

    export interface ChatInputCommandInteraction {
        client: HebiClient
    }

    export interface EmbedBuilder {
        withNadekoColor(): this
    }
}

EmbedBuilder.prototype.withNadekoColor = function() {
    return this.setColor("#e91e63")
}
