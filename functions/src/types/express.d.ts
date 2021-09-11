// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auth } from "firebase-admin"
import PassportDiscord from "passport-discord"

declare global {
	namespace Express {
		export interface User extends PassportDiscord.Profile {
			token: string
			refreshToken: string
		}
	}
}

export {}
