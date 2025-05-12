//@ts-nocheck
//@ts-ignore
import admin from 'firebase-admin';
import { getMessaging } from '@firebase/messaging';

// import fs from 'fs';

// const serviceAccount = JSON.parse(fs.readFileSync('./byn2_key.json', 'utf-8'));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
  });
}

export async function sendNotification(newTitle, newBody, fcm_token, type) {
  const message = {
    notification: {
      title: newTitle,
      body: newBody,
    },

    android: {
      notification: {
        sound: 'default',
      },
      data: {
        title: newTitle,
        body: newBody,
      },
    },

    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title: newTitle,
            body: newBody,
          },
          sound: 'default', // This line ensures sound on iOS
        },
      },
    },

    data: {
      type: type || 'type',
      id: '1',
    },

    token: fcm_token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

export async function sendToTopic(topic, title, body, type) {
  const topicName = `/topics/${topic.toString().trim()}`;
  const message = {
    notification: {
      title: title,
      body: body,
    },
    topic: topicName,

    android: {
      notification: {
        sound: 'default',
      },
      data: {
        title: title,
        body: body,
      },
    },

    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title: title,
            body: body,
          },
          sound: 'default', // This line ensures sound on iOS
        },
      },
    },

    data: {
      screen: type || 'type',
    },
  };

  // Send a message to devices subscribed to the provided topic.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

export async function subscribeToTopic(topic, tokens) {
  const topicName = `/topics/${topic.toString().trim()}`;

  admin
    .messaging()
    .subscribeToTopic(tokens, topicName)
    .then((response) => {
      console.log('Successfully subscribed to topic:', response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });
}

export async function unsubscribeFromTopic(topic, tokens) {
  admin
    .messaging()
    .unsubscribeFromTopic(tokens, topic)
    .then((response) => {
      console.log('Successfully unsubscribed from topic:', response);
    })
    .catch((error) => {
      console.log('Error unsubscribing from topic:', error);
    });
}
