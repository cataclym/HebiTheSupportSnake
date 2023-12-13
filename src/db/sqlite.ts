import sqlite3, { Database } from "sqlite3"
import Models from "./models"
import predefinedEmbeds from "./predefinedEmbeds"

export default class Sqlite {
    public db: Database
    constructor() {
        this.db = new sqlite3.Database("hebi.sql")
        this.createDB()
    }
    createDB() {
        this.db.serialize(() => {

            for (const table of Models.tables) {
                let sql = `CREATE TABLE IF NOT EXISTS ${table.name} (`

                const parameterArray: string[] = []

                for (const column of table.columns) {
                    parameterArray.push(`${column.name} ${column.type}`)
                }

                sql += parameterArray.join(", ") + ")"

                this.db.run(sql)
            }
        })

        this.db.get("SELECT * FROM embeds", (e, r) => {
            if (!r) {
                for (const e of Object.entries(predefinedEmbeds)) {
                    this.db.run("INSERT INTO embeds VALUES (?, ?, ?)", [undefined, e[0], e[1]])
                }
            }
        })
    }
}
