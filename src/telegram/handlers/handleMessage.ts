import {getServerStatus} from '../../exaroton/api'
import {sendMessage} from '../telegramApi'
import {getEnv} from '../utils/envManager'
import {locales} from '../utils/locales'

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

type CommandHandler = (chatId: string | number, env: ReturnType<typeof getEnv>) => Promise<void>

const handleStatusCommand: CommandHandler = async (chatId) => {
	try {
		const server = await getServerStatus()
		const status = server.status
		let replyText: string

		if (status === 1) { // ONLINE
			replyText = locales.status.onlineWithPlayers(status, server.players.count)
		} else {
			replyText = locales.serverStatus[status] || locales.status.unknown
		}

		await sendMessage(chatId, replyText, true)
	} catch (error: any) {
		console.error(error)
		await sendMessage(chatId, locales.errors.generic(error.message), true)
	}
}

const handleBalanceCommand: CommandHandler = async (chatId, env) => {
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
		const replyText = locales.balance.reply(pool.credits, hoursLeft)

		await sendMessage(chatId, replyText, true)
	} catch (error: any) {
		console.error(error)
		await sendMessage(chatId, locales.errors.generic(error.message), true)
	}
}

const handleAliceDeleteCommand: CommandHandler = async (chatId, env) => {
	await sendMessage(chatId, locales.alice.starting, true)
	await new Promise(resolve => setTimeout(resolve, 2500))
	await sendMessage(chatId, locales.alice.done, true)
}

const handleHelpCommand: CommandHandler = async (chatId) => {
	await sendMessage(chatId, locales.help, true)
}

const commandRouter: { regex: RegExp, handler: CommandHandler }[] = [
	{
		regex: /^(\/?(start|старт))(?:@galileo_minecraft_bot)?\?*$/i,
		handler: handleHelpCommand,
	},
	{
		regex: /^(\/?(стат(?:ус)?|stat(?:us)?|сервер|онлайн)|чё как|че как|что как)(?:@galileo_minecraft_bot)?\?*$/i,
		handler: handleStatusCommand,
	},
	{
		regex: /^(\/?(balance|баланс|credits|кредиты))(?:@galileo_minecraft_bot)?\?*$/i,
		handler: handleBalanceCommand,
	},
	{
		regex: /^(\/?(alice|алиса))/i,
		handler: handleAliceDeleteCommand,
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
		? `[ChatID: ${chatId}, UserID: ${user.id}, User: ${user.first_name} ${user.last_name || ''}${user.username ? ` (@${user.username})` : ''}]`
		: `[ChatID: ${chatId}]`

	console.log(`<- Received from ${userIdentifier}: "${messageText}"`)

	for (const command of commandRouter) {
		if (command.regex.test(messageText)) {
			await command.handler(chatId, env)
			return
		}
	}
}
