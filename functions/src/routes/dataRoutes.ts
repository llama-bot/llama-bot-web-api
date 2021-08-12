/*
 * Handle firestore read/writes related to discord bot
 */

import { firestore } from "firebase-admin"
import { logger } from "firebase-functions"

import { Express } from "express"

export default (app: Express): void => {
	// todo: only allow admins to make request
	app.get("/list-servers", (req, res) => {
		logger.log("listing server")

		firestore()
			.collection("llama-bot")
			.doc("servers")
			.listCollections()
			.then((documentSnapshots) => {
				res.status(200).json(documentSnapshots.map((doc) => doc.id))
			})
			.catch((reason) => {
				res.send(reason)
			})
	})
}
