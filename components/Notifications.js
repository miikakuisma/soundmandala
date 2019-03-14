import { Platform } from 'react-native'
import { Notifications, Permissions } from 'expo'

let notificationID

export async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}

export function listenForNotifications () {
  Notifications.addListener(notification => {
    if (notification.origin === 'received' && Platform.OS === 'ios') {
      // Alert.alert('Notification was triggered')
      // console.log(notification)
    }
  })
}

export function createNotification (minutes) {
  const localNotification = {
    title: 'Sound Mandala',
    body: 'Timer finished',
    data: {
      somekey: 'some value'
    },
    android: {
      sound: true
    },
    ios: {
      sound: true
    }
  }
  let sendAfter = Date.now()
  sendAfter += minutes * 1000 * 60

  const schedulingOptions = { time: sendAfter }
  Notifications.scheduleLocalNotificationAsync(
    localNotification,
    schedulingOptions
  ).then((response) => {
    notificationID = response
  })
}

export function cancelNotification () {
  Notifications.cancelScheduledNotificationAsync(notificationID)
}
