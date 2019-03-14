import { Audio } from 'expo'

export function getRandom (min, max, rounded) {
  if (rounded) {
    return Math.round(min + Math.random() * (max - min))
  } else {
    return min + Math.random() * (max - min)
  }
}

export async function setupAudio (audioConfig) {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
  })
  audioConfig.map(async sample => {
    sample.audioObject = new Audio.Sound()
    try {
      await sample.audioObject.loadAsync(sample.sound)
    } catch (error) {
      console.error('Error while loading audio objects')
    }
  })
}
