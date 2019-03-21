import { Platform } from 'react-native'
import { Notifications, Permissions } from 'expo'

let timerEndedNotificationID
let comeBackNotificationID

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

export function createTimerEndNotification (minutes) {
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
    timerEndedNotificationID = response
  })
}

export function cancelTimerEndNotification () {
  Notifications.cancelScheduledNotificationAsync(timerEndedNotificationID)
}

export function createComeBackNotification (minutes) {
  const localNotification = {
    title: 'Sound Mandala',
    body: 'Time to take a little break?',
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
    comeBackNotificationID = response
  })
}

export function cancelComeBackNotification () {
  Notifications.cancelScheduledNotificationAsync(comeBackNotificationID)
}
