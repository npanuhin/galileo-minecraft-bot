import {getEnv} from '../telegram/utils/envManager'

const PLAYER_COUNT_KEY = 'lastPlayerCount'
const MESSAGE_ID_KEY = 'statusMessageId'
const MESSAGE_TEXT_KEY = 'statusMessageText'

interface PlayerState {
	playerCount: number
	messageId: number | null
	messageText: string | null
}

export async function getPlayerState(): Promise<PlayerState> {
	const env = getEnv()

	const playerCountStr = await env.GALILEO_MINECRAFT_BOT_DATA.get(PLAYER_COUNT_KEY)
	const messageIdStr = await env.GALILEO_MINECRAFT_BOT_DATA.get(MESSAGE_ID_KEY)
	const messageText = await env.GALILEO_MINECRAFT_BOT_DATA.get(MESSAGE_TEXT_KEY)

	return {
		playerCount: playerCountStr ? parseInt(playerCountStr, 10) : 0,
		messageId: messageIdStr ? parseInt(messageIdStr, 10) : null,
		messageText,
	}
}

export async function setPlayerState(playerCount?: number, messageId?: number, messageText?: string): Promise<void> {
	const env = getEnv()

	if (playerCount !== undefined) {
		await env.GALILEO_MINECRAFT_BOT_DATA.put(PLAYER_COUNT_KEY, playerCount.toString())
	} else {
		await env.GALILEO_MINECRAFT_BOT_DATA.delete(PLAYER_COUNT_KEY)
	}

	if (messageId !== undefined) {
		await env.GALILEO_MINECRAFT_BOT_DATA.put(MESSAGE_ID_KEY, messageId.toString())
	} else {
		await env.GALILEO_MINECRAFT_BOT_DATA.delete(MESSAGE_ID_KEY)
	}

	if (messageText !== undefined) {
		await env.GALILEO_MINECRAFT_BOT_DATA.put(MESSAGE_TEXT_KEY, messageText)
	} else {
		await env.GALILEO_MINECRAFT_BOT_DATA.delete(MESSAGE_TEXT_KEY)
	}
}
