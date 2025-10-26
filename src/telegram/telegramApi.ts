import {tg} from './lib/methods'

export async function sendMessage(chatId: string | number, text: string): Promise<tgTypes.Message> {
	return tg.sendMessage({chat_id: chatId, text: text})
}

export async function editMessage(chatId: string | number, messageId: number, text: string): Promise<tgTypes.Message | boolean> {
	return tg.editMessageText({chat_id: chatId, message_id: messageId, text: text})
}

export async function deleteMessage(chatId: string | number, messageId: number): Promise<boolean> {
	return tg.deleteMessage({chat_id: chatId, message_id: messageId})
}
