import {getEnv} from '../telegram/utils/envManager'

const PLAYER_COUNT_KEY = 'lastPlayerCount'
const MESSAGE_ID_KEY = 'statusMessageId'

interface PlayerState {
	playerCount: number
	messageId: number | null
}

export async function getPlayerState(): Promise<PlayerState> {
	const env = getEnv()
	const playerCountStr = await env.GALILEO_MINECRAFT_BOT_DATA.get(PLAYER_COUNT_KEY)
	const messageIdStr = await env.GALILEO_MINECRAFT_BOT_DATA.get(MESSAGE_ID_KEY)

	return {
		playerCount: playerCountStr ? parseInt(playerCountStr, 10) : 0,
		messageId: messageIdStr ? parseInt(messageIdStr, 10) : null,
	}
}

export async function setPlayerState(playerCount: number, messageId: number | null): Promise<void> {
	const env = getEnv()
	await env.GALILEO_MINECRAFT_BOT_DATA.put(PLAYER_COUNT_KEY, playerCount.toString())
	if (messageId) {
		await env.GALILEO_MINECRAFT_BOT_DATA.put(MESSAGE_ID_KEY, messageId.toString())
	} else {
		await env.GALILEO_MINECRAFT_BOT_DATA.delete(MESSAGE_ID_KEY)
	}
}
