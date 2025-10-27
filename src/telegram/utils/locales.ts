export const locales = {
	serverStatus: {
		0: '😴 Оффлайн',
		1: '✅ Онлайн',
		2: '⏳ Запускается...',
		3: '⏳ Останавливается...',
		4: '🔄 Перезапускается...',
		5: '💾 Сохранение...',
		6: '⏳ Загрузка...',
		7: '💥 Упал 😢',
		8: '⌛ В ожидании...',
		9: '↔️ Перенос...',
		10: '🛠️ Подготовка...',
	} as Record<number, string>,
	status: {
		onlineWithPlayers: (status: number, playerCount: number) => `${locales.serverStatus[status]}: ${playerCount}`,
		unknown: '❓ Неизвестный статус',
	},
	balance: {
		reply: (credits: number, hoursLeft: number) => `💰 ${credits} кредитов\nХватит на ≈${hoursLeft} часов`,
	},
	alice: {
		starting: 'Хорошо, удаляю файл сохранений...',
		done: 'Файл сохранений успешно удалён 👍',
	},
	help: `Список команд:
/status — Что по серверу?
/balance — Сколько кредитов осталось?`,
	errors: {
		generic: (message: string) => `❌ Ошибка: ${message}`,
		api: (status: number, message: string) => `API Error: ${status} - ${message}`,
	},
	scheduled: {
		goMine: 'Го майн, мы онлайн 😎',
	},
	webhook: {
		registered: 'Webhook registered.',
		registerFailed: 'Failed to register webhook.',
		unregistered: 'Webhook unregistered.',
		unregisterFailed: 'Failed to unregister webhook.',
		error: (error: any) => `Error: ${error}`,
	},
	notFound: 'Not found',
	unauthorized: 'Unauthorized',
}
