import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from "./src/utils/colors";
import { Timer } from './src/features/timer/Timer'
import { Focus } from "./src/features/focus/Focus";
import { FocusHistory } from "./src/features/focus/FocusHistory";
import { spacing } from './src/utils/sizes';

const STATUSES = {
  COMPLETE: 1,
  CANCELED: 2
}

const App = () => {
  const [ focusSubject, setFocusSubject ] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistory = (subject, status) => {
    setFocusHistory([...focusHistory, { key: String(focusHistory.length + 1), subject , status }])
  }

  const onClear = () => {
    setFocusHistory([]);
  }
  
  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory));
    } catch(e) {
      console.log(e);
    }
  }

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("focusHistory");

      if (history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history));
      }
    } catch(e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
    loadFocusHistory();
  }, [])

  useEffect(() => {
    saveFocusHistory()
  }, [focusHistory])

  return (
    <SafeAreaView style={styles.container}>
      {focusSubject ? (
        <Timer 
          focusSubject={focusSubject} 
          onTimerEnd={() => {
            addFocusHistory(focusSubject, STATUSES.COMPLETE);
            setFocusSubject(null);
          }} 
          clearSubject={() => {
            addFocusHistory(focusSubject, STATUSES.CANCELED);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{ flex: 0.5}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
      {/* <Text>{focusSubject}</Text> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS !== 'ios' ? spacing.md : spacing.lg,
    backgroundColor: colors.darkBlue,
  },
});

export default App;