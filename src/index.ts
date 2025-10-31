import { handleScheduled } from './scheduled/handleScheduled'
import { handleWebhook } from './telegram/handleUpdates'
import { setEnv } from './telegram/utils/envManager'
import { tg } from '../lib/telegram/lib/methods'
import { messages } from './messages/en'

// use `npm run gen` to regenerate `worker-configuration.d.ts`
export interface Env {
	TELEGRAM_SECRET: string  // Telegram bot API secret
	TELEGRAM_TOKEN: string   // Telegram bot API token
	TELEGRAM_CHAT_ID: string

	EXAROTON_SERVER_ID: string
	EXAROTON_API_TOKEN: string
	EXAROTON_POOL_ID: string

	GALILEO_MINECRAFT_BOT_DATA: KVNamespace
}

// Define constant paths for webhook management.
const WEBHOOK: string = '/endpoint'
const REGISTER: string = '/registerWebhook'
const UNREGISTER: string = '/unRegisterWebhook'

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		setEnv(env)
		const url: URL = new URL(request.url)

		if (url.pathname === WEBHOOK) {
			return handleWebhook(request)
		} else if (url.pathname === REGISTER) {
			try {
				const result = await tg.setWebhook({
					url: `${url.protocol}//${url.hostname}${WEBHOOK}`,
					secret_token: env.TELEGRAM_SECRET,
				})
				if (result) return new Response(messages.webhook.registered)
				else return new Response(messages.webhook.registerFailed)
			} catch (error) {
				ctx.waitUntil((async () => {
					return new Promise(resolve => {
						console.log(messages.webhook.error(error))
						resolve(error)
					})
				})())
				return new Response(messages.webhook.error(error))
			}
		} else if (url.pathname === UNREGISTER) {
			try {
				const result = await tg.setWebhook({
					url: '',
				})
				if (result) return new Response(messages.webhook.unregistered)
				else return new Response(messages.webhook.unregisterFailed)
			} catch (error) {
				return new Response(messages.webhook.error(error))
			}
		} else {
			return new Response(messages.http.notFound, {status: 404})
		}
	},

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		setEnv(env)
		ctx.waitUntil(handleScheduled())
	},
} satisfies ExportedHandler<Env>
