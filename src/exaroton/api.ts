import {getEnv} from '../telegram/utils/envManager'

export interface ExarotonServer {
	id: string
	name: string
	address: string
	motd: string
	status: number // 0 = OFFLINE, 1 = ONLINE, etc.
	players: {
		max: number
		count: number
		list: string[]
	}
	software: {
		id: string
		name: string
		version: string
	}
}

const API_BASE_URL = 'https://api.exaroton.com/v1'

export async function getServerStatus(): Promise<ExarotonServer> {
	const env = getEnv()
	const response = await fetch(`${API_BASE_URL}/servers/${env.EXAROTON_SERVER_ID}`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${env.EXAROTON_API_TOKEN}`
		}
	})

	if (!response.ok) {
		const errorData = await response.json() as { error?: string }
		throw new Error(`Exaroton API Error: ${response.status} - ${errorData.error || response.statusText}`)
	}

	const jsonResponse = await response.json() as { data: ExarotonServer }
	return jsonResponse.data
}

export const SERVER_STATUS_MAP: { [key: number]: string } = {
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
}
