# yylabCheck
## _a slack bot for check in/out, report body tempreture_

## How to deploy
- Creat a new bot application in your slack workspace.
- Under linux, make sure you have Node.js, Docker and Git been installed.
- Run command:
    ```sh
    git clone https://github.com/gzfrozen/yylabCheck.git
    ```
    to get the source code.
- Run command:
    ```sh
    cd yylabCheck
    npm install
    ```
- Edit docker-compose.yml, change the value of [SLACK_SIGNING_SECRET](https://api.slack.com/authentication/verifying-requests-from-slack#verification_token_deprecation) and [SLACK_BOT_TOKEN](https://api.slack.com/authentication/token-types#verification_tokens). You can get these from slack API setting page of your bot application.
- Edit src/app.js, change the value of `const channelID = 'C01BRSL1Y9G'` to your target channel ID.
- Run command:
    ```sh
    docker-compose up -d
    ```
    and now the bot is ready.
- Open the port 3000 to internet of your server if the server is behind a router.
- Edit Interactivity & Shortcuts/Request URL at your bot application setting page. Something like http://111.222.333.444:3000/slack/events. `111.222.333.444` would be the public IP of your server.
- That's it. Add your bot to the channel and try!
