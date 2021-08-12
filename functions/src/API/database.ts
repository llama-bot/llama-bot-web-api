import admin, { auth, firestore } from "firebase-admin"

interface DatabaseResult {
	success: boolean
	error?: string
}

interface UsersResult extends DatabaseResult {
	users?: FirebaseFirestore.DocumentData[]
}

interface UserResult extends DatabaseResult {
	user?: auth.UserRecord | FirebaseFirestore.DocumentData
}

export default {
	getUsers: async (): Promise<UsersResult> => {
		let result
		try {
			const users: FirebaseFirestore.DocumentData[] = []

			await admin
				.firestore()
				.collection("users")
				.orderBy("createdAt", "desc")
				.get()
				.then((data) =>
					data.forEach((user) => {
						users.push(user.data())
					})
				)

			result = { success: true, users: users }
		} catch (error) {
			console.error(`Error getting users: ${error}`)
			result = { success: false, error: error.message }
		}

		return result
	},
	findUser: async (uid: string): Promise<UserResult> => {
		let result
		try {
			const user = await admin.firestore().collection("users").doc(uid).get()

			result = user.exists
				? { success: true, user: user.data() }
				: { success: false, error: `user with uid ${uid} does not exist` }
		} catch (error) {
			console.log(`SEARCH USER ERROR: ${error.message}`)
			result = { success: false, error: error.message }
			console.log("RETURNING OBJECT:")
			console.log(result)
		}

		return result
	},
	newUser: async (profile: auth.CreateRequest): Promise<UserResult> => {
		let result
		try {
			const userRecord = await admin.auth().createUser(profile)
			await firestore().doc(`/users/${profile.uid}`).set(profile)
			result = { success: true, user: userRecord }
		} catch (error) {
			console.error(`Error creating a user: ${error}`)
			result = { success: false, error: error.message }
		}
		return result
	},
}
