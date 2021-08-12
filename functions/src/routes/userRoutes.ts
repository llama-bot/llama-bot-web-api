/*
 * Handle user data
 */

import { Express } from "express"
import database from "../API/database"

export default (app: Express): void => {
	// List all users in the database
	app.get("/users", async (req, res) => {
		try {
			res.json(await database.getUsers())
		} catch (error) {
			console.error(`Error getting users: ${error.message}`)
			res.status(500).json({ success: false, error: error.message })
		}
	})

	// Create a new user
	app.post("/users/new", async (req, res) => {
		try {
			res.status(201).json({
				success: true,
				user: await database.newUser(req.body),
			})
		} catch (error) {
			console.error(`Error creating a user: ${error.message}`)
			res.status(500).json({ success: false, error: error.message })
		}
	})

	// Find a user
	app.post("/users/find", async (req, res) => {
		try {
			res.status(200).json(await database.findUser(req.body.id))
		} catch (error) {
			console.error(`Error finding a user: ${error.message}`)
			res.status(500).json({ success: false, error: error.message })
		}
	})
}
