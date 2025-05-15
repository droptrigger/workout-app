import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MonthSlider from '../components/MonthSlider';
import TodayWorkoutList from '../components/TodayWorkoutList';
import { NavigationProp } from '@react-navigation/native';
import { getPatternById, getPatternWithExercises } from '../db/patternUtils';
import { createWorkout } from '../db/workoutUtils';
import { Pattern } from '../types/types';
import i18n from '../localization/i18n';

type WorkoutsScreenProps = {
  navigation: NavigationProp<any>;
};

const WorkoutsScreen = ({ navigation }: WorkoutsScreenProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleCreateWorkout = async (patternId: number, date: Date) => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const exercises = await getPatternWithExercises(patternId);
      const pattern = await getPatternById(patternId);

      await createWorkout(
        dateStr,
        patternId,
        pattern.name,
        exercises.map(ex => ex.exercise)
      );
    } catch (error) {
      console.error('Ошибка создания тренировки:', error);
      Alert.alert(i18n.t('error'), (i18n.t('failedCreateWorkout')));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <MonthSlider onDateSelect={setSelectedDate} />
      </View>
      <View style={styles.listContainer}>
        <TodayWorkoutList
          selectedDate={selectedDate}
          onCreateWorkout={() =>
            navigation.navigate('SelectPattern', {
              onSelect: (pattern: Pattern) => {
                handleCreateWorkout(pattern.id, selectedDate).then(() => {
                  setRefreshFlag(prev => prev + 1);
                });
              },
            })
          }
          refreshFlag={refreshFlag} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sliderContainer: {
    paddingHorizontal: 15,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

export default WorkoutsScreen;