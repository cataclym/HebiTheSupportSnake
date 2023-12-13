export default {
    tables: [{
        name: "embeds",
        columns: [{
            name: "id",
            type: "INTEGER PRIMARY KEY",
        },
        {
            name: "keyword",
            type: "TEXT",
        },
        {
            name: "embedData",
            type: "TEXT",
        }],
    }]
}
