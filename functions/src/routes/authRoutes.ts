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
			failureRedirect: "/error",
		})
	)

	app.get("/logout", async (req, res) => {
		req.logout()
		res.redirect("/api/user")
	})

	// OAuth2 callback
	app.get(
		"/auth",
		passport.authenticate("discord", { failureRedirect: "/error" }),
		(_, res) => {
			res.redirect("/api/user")
		}
	)
}
