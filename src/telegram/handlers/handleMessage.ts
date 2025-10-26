import {getEnv} from '../utils/envManager'
import {tg} from '../lib/methods'
import {getServerStatus, SERVER_STATUS_MAP} from '../../exaroton/api'

interface ExarotonBillingPool {
	id: string
	name: string
	credits: number
	servers: number
	owner: string
	isOwner: boolean
	members: number
	ownShare: number
	ownCredits: number
}

const API_BASE_URL = 'https://api.exaroton.com/v1'

type CommandHandler = (sendMessage: (text: string) => Promise<void>, env: ReturnType<typeof getEnv>) => Promise<void>

const handleStatusCommand: CommandHandler = async (sendMessage) => {
	try {
		const server = await getServerStatus()
		const status = server.status
		let replyText: string

		if (status === 1) { // ONLINE
			replyText = `${SERVER_STATUS_MAP[status]}: ${server.players.count}`
		} else {
			replyText = SERVER_STATUS_MAP[status] || '❓ Неизвестный статус'
		}

		await sendMessage(replyText)
	} catch (error: any) {
		console.error(error)
		await sendMessage(`❌ Ошибка: ${error.message}`)
	}
}

const handleBalanceCommand: CommandHandler = async (sendMessage, env) => {
	try {
		const response = await fetch(`${API_BASE_URL}/billing/pools/${env.EXAROTON_POOL_ID}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${env.EXAROTON_API_TOKEN}`,
			},
		})

		if (!response.ok) {
			const errorData = await response.json() as { error?: string }
			throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`)
		}

		const jsonResponse = await response.json() as { data: ExarotonBillingPool }
		const pool = jsonResponse.data

		const hoursLeft = Math.round((pool.credits / 7) * 10) / 10
		const replyText = `💰 ${pool.credits} кредитов\nХватит на ≈${hoursLeft} часов`

		await sendMessage(replyText)
	} catch (error: any) {
		console.error(error)
		await sendMessage(`❌ Ошибка: ${error.message}`)
	}
}

const commandRouter: { regex: RegExp, handler: CommandHandler }[] = [
	{
		regex: /^(\/?статус|\/?status|\/?сервер|\/?онлайн|чё как|че как|что как)(?:@galileo_minecraft_bot)?\?*$/i,
		handler: handleStatusCommand,
	},
	{
		regex: /^(\/?(balance|баланс|credits|кредиты))(?:@galileo_minecraft_bot)?\?*$/i,
		handler: handleBalanceCommand,
	},
]

export async function handleMessage(message: tgTypes.Message) {
	if (!message.text) {
		return
	}

	const messageText = message.text.trim()
	const chatId = message.chat.id
	const env = getEnv()

	// --- Logging & User Identification ---
	// User-friendly identifier for logs: first + last name + @username if available.
	const user = message.from
	const userIdentifier = user
		? `[ChatID: ${chatId}, UserID: ${user.id}, User: ${user.first_name} ${user.last_name || ''}${user.username ? ` (@${user.username})` : ''}]`.trim()
		: `[ChatID: ${chatId}]`

	console.log(`<- Received from ${userIdentifier}: "${messageText}"`)

	/**
	 * Helper function to send messages to the current chat and log the reply.
	 * @param text The message text to send.
	 */
	const sendMessage = async (text: string) => {
		const trimmedText = text.trim()
		console.log(`-> Replying to ${userIdentifier}: "${trimmedText.replace(/\n/g, '\\n')}"`)
		await tg.sendMessage({
			chat_id: chatId,
			text: trimmedText,
		})
	}

	for (const command of commandRouter) {
		if (command.regex.test(messageText)) {
			await command.handler(sendMessage, env)
			return
		}
	}
}
