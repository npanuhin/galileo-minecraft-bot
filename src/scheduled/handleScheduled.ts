import {sendMessage, editMessage, deleteMessage} from '../telegram/telegramApi'
import {getPlayerState, setPlayerState} from '../utils/kvManager'
import {getEnv} from '../telegram/utils/envManager'
import {getServerStatus} from '../exaroton/api'

export async function handleScheduled() {
	const env = getEnv()
	const {playerCount: lastPlayerCount, messageId: lastMessageId} = await getPlayerState()

	let server
	try {
		server = await getServerStatus()
	} catch (error) {
		console.error('Failed to get server status:', error)
		if (lastMessageId) {
			try {
				await deleteMessage(env.TELEGRAM_CHAT_ID, lastMessageId)
			} catch (e) {
				console.error('Failed to delete message on API error:', e)
			} finally {
				await setPlayerState(0, null)
			}
		}
		return
	}

	const currentPlayerCount = server.status === 1 ? server.players.count : 0
	const isServerOnline = [1, 2, 4, 10].includes(server.status)

	if (currentPlayerCount === lastPlayerCount && !!lastMessageId === isServerOnline) {
		// console.log('No change in player count or server status. Exiting.')
		return
	}

	if (isServerOnline) {
		// const messageText = currentPlayerCount > 0
		// 	? `Го майн, ${currentPlayerCount} онлайн 😎`
		// 	: 'Го майн, мы онлайн 😎'

		const messageText = 'Го майн, мы онлайн 😎'

		if (lastMessageId) {
			try {
				// console.log(`Editing message ${lastMessageId} to: "${messageText}"`)
				await editMessage(env.TELEGRAM_CHAT_ID, lastMessageId, messageText)
				await setPlayerState(currentPlayerCount, lastMessageId)
			} catch (error: any) {
				console.error('Failed to edit message:', error)
				// If the message was deleted manually, create a new one
				// if (error.message?.includes('message to edit not found')) {
				// 	console.log('Message not found, sending a new one')
				// 	const newMessage = await sendMessage(env.TELEGRAM_CHAT_ID, messageText)
				// 	await setPlayerState(currentPlayerCount, newMessage.message_id)
				// } else {
				// 	console.error('Failed to edit message:', error)
				// }
			}
		} else {
			console.log(`Sending new status message: "${messageText}"`)
			const newMessage = await sendMessage(env.TELEGRAM_CHAT_ID, messageText, true)
			await setPlayerState(currentPlayerCount, newMessage.message_id)
		}
	} else {
		if (lastMessageId) {
			console.log('Server is offline, deleting status message')
			try {
				await deleteMessage(env.TELEGRAM_CHAT_ID, lastMessageId)
			} catch (e) {
				console.error('Failed to delete status message:', e)
			} finally {
				await setPlayerState(0, null)
			}
		}
		return
	}
}
