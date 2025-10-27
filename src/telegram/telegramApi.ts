import {tg} from './lib/methods'

export async function sendMessage(chatId: string | number, text: string, disableNotification: boolean = true): Promise<tgTypes.Message> {
	const trimmedText = text.trim()
	console.log(`-> Replying to [ChatID: ${chatId}]: "${trimmedText.replace(/\n/g, '\\n')}"`)
	return tg.sendMessage({chat_id: chatId, text: trimmedText, disable_notification: disableNotification})
}

export async function editMessage(chatId: string | number, messageId: number, text: string): Promise<tgTypes.Message | boolean> {
	const trimmedText = text.trim()
	console.log(`-> Editing message ${messageId} in [ChatID: ${chatId}]: "${trimmedText.replace(/\n/g, '\\n')}"`)
	return tg.editMessageText({chat_id: chatId, message_id: messageId, text: trimmedText})
}

export async function deleteMessage(chatId: string | number, messageId: number): Promise<boolean> {
	console.log(`-> Deleting message ${messageId} in [ChatID: ${chatId}]`)
	return tg.deleteMessage({chat_id: chatId, message_id: messageId})
}
