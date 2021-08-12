# llama-bot-web-api

![License: MIT](https://img.shields.io/github/license/llama-bot/llama-bot-web-api?style=flat-square)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Firebase http API for the [llama bot](https://github.com/llama-bot/llama-bot)

> **WARNING: STILL UNDER DEVELOPMENT. NOT USABLE IN PRODUCTION.**

## Endpoints

`/users/new`:<br />
Create a new user

`/users/find`:<br />
Find a user

`/users`:<br />
List all users in the database

`/login`:<br />
Login using discord OAuth2

`/logout`:<br />
Logout from account

`/auth`:<br />
Discord OAuth2 callback

`/list-servers`:<br />
List all servers in the database

## Setting up

1. Clone this repository
2. Install Node.js (comes with npm)

### Discord

1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create an application/select one if you already have it. Using the application used by your discord bot is recommended.
2.  Go to the OAuth2 tab.
3.  Add the following redirect URIs:

    - localhost for testing
      - `http://localhost:5001/<project-id>/us-central1/api`
      - `http://localhost:5001/<project-id>/us-central1/api/auth`
    - http
      - `http://us-central1-<project-id>.cloudfunctions.net/api`
      - `http://us-central1-<project-id>.cloudfunctions.net/api/auth`
    - https
      - `https://us-central1-<project-id>.cloudfunctions.net/api`
      - `https://us-central1-<project-id>.cloudfunctions.net/api/auth`

4.  Create `functions/src/secret.json` file and fill in the data.

    ```json
    {
    	"projectID": "FIREBASE_PROJECT_ID_HERE", // Firebase project ID
    	"clientID": "DISCORD_CLIENT_ID_HERE", // Discord OAuth2 Client ID
    	"clientSecret": "DISCORD_CLIENT_SECRET_HERE", // Discord OAuth2 Client Secret
    	"secret": "SECRET_COOKIE_KEY_HERE" // secret to be used for express session
    }
    ```

5.  Create `functions/src/config.json` and fill in the data.

    ```json
    {
    	"region": "FIREBASE_FUNCTIONS_REGION_HERE", // Region where firebase functions is hosted in. Example: us-central1
    	"scopes": ["DISCORD", "SCOPES", "HERE"] // Discord OAuth2 scopes. Example: ["identify", "email"]
    }
    ```

### Firebase

- must be the same project that the llama bot is using

1.  Go to the Google Firebase [Console](https://console.firebase.google.com).
2.  Create/Select a project. Make sure it is using the [blaze plan](https://firebase.google.com/pricing).
3.  Go to the `Authentication` tab and enable Email/Password authentication.
4.  Go to the `Firestore Database` tab and enable it.
5.  Install firebase cli tools on your system: `npm install -g firebase-tools`
6.  Run `firebase use <firebase-project-id>` in the root directory of the repository.
7.  Go to `functions` directory and install necessary dependencies: `npm install`.

### Testing

1. Run `npm run serve` to start a local test server and open `http://localhost:5001/<firebase-project-id>/us-central1/api/login` and log in.
2. If everything is set up correctly, this should have added a new user in the firebase `Authentication` tab.

### Deploying

1. Run `firebase deploy` in the root of the project to deploy the project to production. The API link should be: `https://us-central1-<firebase-project-id>.cloudfunctions.net/api`.

## Special thanks

- [luizkc](https://github.com/luizkc) for discord oauth2 authentication ([repo](https://github.com/luizkc/firebase-discord-oauth2-example))
