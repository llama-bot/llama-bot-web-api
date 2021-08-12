import { logger } from "firebase-functions"

import passport from "passport"
import DiscordStrategy from "passport-discord"

import database from "../API/database"

import secret from "../secret.json"
import config from "../config.json"

passport.serializeUser((user, done) => {
	done(null, user.uid)
})

passport.deserializeUser(async (uid: string, done) => {
	try {
		const user = await database.findUser(uid)
		if (user.success === true) {
			done(null, user.user as Express.User)
		} else {
			done(null)
		}
	} catch (error) {
		logger.log("Error deserializing user", error.message)
		done(error)
	}
	database
		.findUser(uid)
		.then((user) => {
			done(null, user.user as Express.User)
		})
		.catch((error) => {
			logger.log("Error deserializing user", error.message)
		})
})

passport.use(
	new DiscordStrategy.Strategy(
		{
			clientID: secret.clientID,
			clientSecret: secret.clientSecret,

			callbackURL:
				(process.env.FUNCTIONS_EMULATOR
					? `${secret.projectID}/${config.region}`
					: "") + "/api/auth",

			scope: config.scopes,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const searchUserResult = await database.findUser(profile.id)

				// check if user exists already
				if (searchUserResult.success && searchUserResult.user) {
					done(null, searchUserResult.user as Express.User)
					return searchUserResult.user
				} else {
					const newUser = {
						username: profile.username,
						discriminator: profile.discriminator,
						uid: profile.id,
						email: profile.email,
						avatar: profile.avatar,
						guilds: profile.guilds,
						token: accessToken,
						refreshToken: refreshToken,
					}
					await database.newUser(newUser)
					return done(null, newUser as unknown as Express.User)
				}
			} catch (error) {
				return logger.error("Error creating a user", error)
			}
		}
	)
)
