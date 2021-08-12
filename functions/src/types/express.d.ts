// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auth } from "firebase-admin"

declare global {
	namespace Express {
		export interface User extends auth.DecodedIdToken {
			name?: string
		}
	}
}

export {}
