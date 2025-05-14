import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MonthSlider from '../components/MonthSlider';
import TodayWorkoutList from '../components/TodayWorkoutList';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { getPatternById, getPatternWithExercises } from '../db/patternUtils';
import { createWorkout } from '../db/workoutUtils';
import { WorkoutRouteParams } from '../types/types';

type WorkoutsScreenProps = {
  navigation: NavigationProp<any>;
};

const WorkoutsScreen = ({ navigation }: WorkoutsScreenProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const route = useRoute<RouteProp<Record<string, WorkoutRouteParams>, string>>();

  useEffect(() => {
    const { patternId } = route.params || {};
    if (patternId) {
      handleCreateWorkout(patternId);
      navigation.setParams({ patternId: undefined });
    }
  }, [route.params]);

  const handleCreateWorkout = async (patternId: number) => {
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
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
      Alert.alert('Ошибка', 'Не удалось создать тренировку');
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
          onCreateWorkout={() => navigation.navigate('SelectPattern')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  sliderContainer: {
    height: 70,
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
});

export default WorkoutsScreen;