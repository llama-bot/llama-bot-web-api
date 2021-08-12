import { initializeApp } from "firebase-admin"
import { https } from "firebase-functions"

import express from "express"
import expressSession from "express-session"
import passport from "passport"
import cors from "cors"

import authRoutes from "./routes/authRoutes"
import dataRoutes from "./routes/dataRoutes"
import userRoutes from "./routes/userRoutes"

import secret from "./secret.json"

import "./services/discordOauth"

initializeApp()

const app = express()

app.use(cors({ origin: true }))

const sessionOption = {
	secret: secret.session,
	resave: true,
	saveUninitialized: true,
	cookie: {},
}

if (app.get("env") === "production") {
	app.set("trust proxy", 1)
	sessionOption.cookie = { secure: true }
}

app.use(expressSession(sessionOption))

app.use(passport.initialize())
app.use(passport.session())

dataRoutes(app)
authRoutes(app)
userRoutes(app)

exports.api = https.onRequest(app)
