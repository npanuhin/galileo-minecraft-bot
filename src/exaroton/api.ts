import { getEnv } from '../telegram/utils/envManager'
import { messages } from '../messages/en'

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
			'Authorization': `Bearer ${env.EXAROTON_API_TOKEN}`,
		},
	})

	if (!response.ok) {
		const errorData = await response.json() as { error?: string }
		throw new Error(messages.errors.api(response.status, errorData.error || response.statusText))
	}

	const jsonResponse = await response.json() as { data: ExarotonServer }
	return jsonResponse.data
}
