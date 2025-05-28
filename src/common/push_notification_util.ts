import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo(); // Keep one instance

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
): Promise<{ success: boolean; error?: string }> {
  if (!Expo.isExpoPushToken(token)) {
    console.error('Invalid Expo push token:', token);
    return { success: false, error: 'Invalid Expo push token' };
  }

  const message: ExpoPushMessage = {
    to: token,
    sound: 'default',
    title,
    body,
  };

  try {
    const receipts = await expo.sendPushNotificationsAsync([message]);
    console.log(receipts);
    return { success: true };
  } catch (error) {
    console.error('Failed to send push notification:', error);
    return { success: false, error: error.message };
  }
}

export async function sendBulkPushNotifications(
  tokens: string[],
  title: string,
  body: string,
) {
  const messages: ExpoPushMessage[] = tokens
    .filter(Expo.isExpoPushToken)
    .map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
    }));

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const results = [];

    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      results.push(...receipts);
    }

    return results;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
}
