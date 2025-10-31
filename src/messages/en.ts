import { t } from './utils'


export const messages = {
	serverStatus: {
		0: t`😴 Оффлайн`,
		1: t`✅ Онлайн`,
		2: t`⏳ Запускается...`,
		3: t`⏳ Останавливается...`,
		4: t`🔄 Перезапускается...`,
		5: t`💾 Сохранение...`,
		6: t`⏳ Загрузка...`,
		7: t`💥 Упал 😢`,
		8: t`⌛ В ожидании...`,
		9: t`↔️ Перенос...`,
		10: t`🛠️ Подготовка...`,
	} as Record<number, string>,
	status: {
		onlineWithPlayers: (status: number, playerCount: number) => t`${messages.serverStatus[status]}: ${playerCount}`,
		unknown: t`❓ Неизвестный статус`,
	},
	balance: {
		reply: (credits: number, hoursLeft: number) => t`💰 ${credits} кредитов\nХватит на ≈${hoursLeft} часов`,
	},
	alice: {
		starting: t`Хорошо, удаляю файл сохранений...`,
		done: t`Файл сохранений успешно удалён 👍`,
	},
	help: t`
Список команд:
/status — Что по серверу?
/balance — Сколько кредитов осталось?
`,
	errors: {
		generic: (message: string) => t`❌ Ошибка: ${message}`,
		api: (status: number, message: string) => t`API Error: ${status} - ${message}`,
		markdownV2: t`❌ Ошибка при отправке сообщения MarkdownV2`,
	},
	scheduled: {
		goMine: (playerCount: number) => playerCount > 0
			? t`🚀 Го майн, ${playerCount} онлайн`
			: t`🚀 Го майн, мы онлайн`,
	},
	webhook: {
		registered: t`Webhook registered.`,
		registerFailed: t`Failed to register webhook.`,
		unregistered: t`Webhook unregistered.`,
		unregisterFailed: t`Failed to unregister webhook.`,
		error: (error: any) => t`Error: ${error}`,
	},
	http: {
		notFound: t`Not found`,
		unauthorized: t`Unauthorized`,
	},
}
