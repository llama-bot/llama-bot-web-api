import { initializeApp, credential, ServiceAccount } from "firebase-admin"
import { https } from "firebase-functions"

import express from "express"
import expressSession from "express-session"
import passport from "passport"
import cors from "cors"

import authRoutes from "./routes/authRoutes"
import dataRoutes from "./routes/dataRoutes"

import secret from "./secret.json"

import serviceAccountKey from "./firebase-adminsdk.json"

import "./services/discordOauth"

const app = express()

const sessionOption = {
	secret: secret.session,
	resave: true,
	saveUninitialized: false,
	cookie: {},
}

if (process.env.FUNCTIONS_EMULATOR === "true") {
	app.use(
		cors({
			origin: ["http://localhost"],
		})
	)
} else {
	app.set("trust proxy", 1)
	app.use(
		cors({
			origin: [
				"https://llama-bot.github.io",
				"https://llama-bot.developomp.com",
			],
		})
	)

	sessionOption.cookie = { secure: true }
}

app.use(expressSession(sessionOption))

app.use(passport.initialize())
app.use(passport.session())

dataRoutes(app)
authRoutes(app)

initializeApp({
	credential: credential.cert(serviceAccountKey as ServiceAccount),
})

exports.api = https.onRequest(app)
