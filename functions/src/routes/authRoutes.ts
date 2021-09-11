/*
 * Handle authentication
 */

import { Express } from "express"
import passport from "passport"

import config from "../config.json"

export default (app: Express): void => {
	app.get(
		"/login",
		passport.authenticate("discord", {
			scope: config.scopes,
		}),
		async function (req, res) {
			if (!req.user) res.status(500).send("Failed to log in with discord")
		}
	)

	app.get("/logout", async (req, res) => {
		req.logout()
		res.status(200).send()
	})

	// OAuth2 callback
	app.get("/auth", passport.authenticate("discord"), (_, res) => {
		res.status(200).send()
	})
}
