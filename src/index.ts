import "dotenv/config"
import { HebiClient } from "./hebiClient"
import "./hebi.d.ts"

const { BOT_TOKEN, SERVER_ID, HELP_CHANNEL_ID } = process.env

if ((BOT_TOKEN == null) || (SERVER_ID == null) || (HELP_CHANNEL_ID == null)) throw new Error("Missing value in .env")

new HebiClient(BOT_TOKEN, SERVER_ID, HELP_CHANNEL_ID)
