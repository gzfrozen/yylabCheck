const { App } = require('@slack/bolt');
const dayjs = require('dayjs');

// const channelID = 'C01JT5WV6NS'; //debug
const channelID = 'C01BRSL1Y9G'; //come

const return_home = (id) => {
  return {
    "type": "home",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `What do you want to do <@${id}> ?`
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": "Check In",
              "emoji": true
            },
            "action_id": "checkIn"
          },
          {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": "Check Out",
              "emoji": true
            },
            "action_id": "checkOut"
          }
        ]
      }
    ]
  };
};

const return_checkin = () => {
  return {
    "type": "modal",
    "callback_id": "view_checkin",
    "title": {
      "type": "plain_text",
      "text": ":microscope:Check In"
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "input_a",
        "label": {
          "type": "plain_text",
          "text": "What is your body temperature today?"
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "temp"
        }
      }
    ],
    "submit": {
      "type": "plain_text",
      "text": "Check In"
    }
  };
};

const return_checkout = () => {
  return {
    "type": "modal",
    "callback_id": "view_checkout",
    "title": {
      "type": "plain_text",
      "text": ":coffee:Check Out"
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Check Out?"
        }
      }
    ],
    "submit": {
      "type": "plain_text",
      "text": "Check Out"
    }
  };
};

const return_success = () => {
  return {
    "type": "modal",
    "callback_id": "view_success",
    "title": {
      "type": "plain_text",
      "text": ":thumbsup:Success!"
    },
    "blocks": [
      {
        "type": "image",
        "image_url": "https://media.giphy.com/media/10Y2YMUNmQa9a0/giphy.gif",
        "alt_text": "Success!"
      }
    ]
  };
};

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  // console.log(message);
  say(`Hey there <@${message.user}>!`);
});

app.command('/hello', async ({ command, ack, say }) => {
  // console.log(command);
  ack();
  say(`Hey there <@${command.user_id}>!`);
});

app.event('app_home_opened', async ({ event, context, client }) => {
  // console.log(event);
  const home_view = return_home(event.user);

  client.views.publish({
    token: context.botToken,
    user_id: event.user,
    view: home_view
  });
});

app.action('checkIn', async ({ ack, body, client }) => {
  ack();
  // console.log(body);
  const modal_checkin = return_checkin();

  client.views.open({
    trigger_id: body.trigger_id,
    view: modal_checkin
  });
});

app.action('checkOut', async ({ ack, body, client }) => {
  ack();
  // console.log(body);
  const modal_checkout = return_checkout();

  client.views.open({
    trigger_id: body.trigger_id,
    view: modal_checkout
  });
});

app.view('view_checkin', async ({ ack, body, view, client }) => {
  const response = {
    "response_action": "update",
    "view": return_success()
  };

  ack(response);

  const body_temp = view['state']['values']['input_a']['temp']['value'];
  const now = dayjs();

  client.chat.postMessage({
    channel: channelID,
    text: `<@${body.user.id}> Check In`,
    blocks: [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `<@${body.user.id}> Check In`
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Temp: ${body_temp}, came at ${dayjs(now).format('HH:mm')}`
      }
    }
    ]
  });
});

app.view('view_checkout', async ({ ack, body, client }) => {
  const response = {
    "response_action": "update",
    "view": return_success()
  };

  ack(response);

  const now = dayjs();

  client.chat.postMessage({
    channel: channelID,
    text: `<@${body.user.id}> Check Out`,
    blocks: [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `<@${body.user.id}> Check Out`
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Left at ${dayjs(now).format('HH:mm')}`
      }
    }
    ]
  });
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
