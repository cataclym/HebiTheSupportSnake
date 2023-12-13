import "dotenv/config"
import { HebiClient } from "./hebiClient"
import "./Discord"

const { BOT_TOKEN, SERVER_ID, HELP_CHANNEL_ID, COMMAND_JSON } = process.env

if ((BOT_TOKEN == null) || (SERVER_ID == null) || (HELP_CHANNEL_ID == null) || (COMMAND_JSON == null)) throw new Error("Missing value in .env")

new HebiClient(BOT_TOKEN, SERVER_ID, HELP_CHANNEL_ID, COMMAND_JSON)
