import {
    APIEmbed, APIEmbedAuthor,
    APIEmbedField, APIEmbedFooter, Embed, EmbedBuilder, MessageCreateOptions
} from "discord.js"

export default class HebiEmbed implements MessageCreateOptions {
    content: string | undefined
    embeds: Embed[] | undefined

    constructor(data: string) {
        const dataObject = JSON.parse(data)

        if (dataObject.embeds) {
            this.embeds = dataObject.embeds.map((e: NadekoEmbed) => {

                const embedData: APIEmbed = {}

                if (e.title) embedData.title = e.title

                if (e.description) embedData.description = e.description

                if (e.author) embedData.author = e.author

                if (e.color && !Number.isInteger(e.color)) {
                    embedData.color = parseInt(String(e.color).replace(/#/g, "").slice(0, 6), 16)
                }

                if (e.footer) embedData.footer = e.footer

                if (e.thumbnail) embedData.thumbnail = { url: e.thumbnail }

                if (e.image) embedData.image = { url: e.image }

                if (e.fields) embedData.fields = e.fields

                return EmbedBuilder.from(embedData)
                    .withNadekoColor()
            })
        }

        if (dataObject.content) this.content = dataObject.content
    }
}

interface NadekoEmbed {

    title?: string;

    description?: string;

    url?: string;

    timestamp?: string;

    color?: number;

    footer?: APIEmbedFooter;

    image?: string;

    thumbnail?: string;

    author?: APIEmbedAuthor;

    fields?: APIEmbedField[];
}
