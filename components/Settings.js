import React from 'react'
import { View, Switch, StyleSheet } from 'react-native'
import NumericInput from 'react-native-numeric-input'
import { BoldText } from '../components/utils'
import Colors from '../constants/Colors'

export default class Settings extends React.Component {
  updateReminderValue (value) {
    this.props.onUpdateReminderValue(value)
  }

  toggleReminders (value) {
    this.props.onToggleReminders(value)
  }

  render () {
    return <View style={styles.settings}>
      <View style={styles.row}>
        <Switch
          value={this.props.reminderEnabled}
          onValueChange={this.toggleReminders.bind(this)}
        />
        <BoldText style={styles.settingsLabel}>Break reminders</BoldText>
      </View>
      { this.props.reminderEnabled && <View style={{
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <BoldText style={styles.settingsLabel}>
          Set here how many minutes to wait (after completed session) before break reminder notification.
          {'\n'}
        </BoldText>
        <NumericInput
          minValue={1}
          maxValue={180}
          initValue={this.props.reminderAfter}
          onChange={this.updateReminderValue.bind(this)}
          totalHeight={48}
          iconSize={16}
          step={1}
          type='plus-minus'
          valueType='integer'
          rounded
          editable
          textColor='white'
          iconStyle={{ color: 'white' }}
          leftButtonBackgroundColor='transparent'
          rightButtonBackgroundColor='transparent'
        />
      </View> }
    </View>
  }
}

const styles = StyleSheet.create({
  settings: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    padding: 40,
    paddingTop: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  settingsLabel: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center'
  }
})
