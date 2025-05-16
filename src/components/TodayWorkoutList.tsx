import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Workout, WorkoutExercise } from '../types/types';
import { getWorkoutsByDate, deleteWorkout } from '../db/workoutUtils';
import Checkbox from 'expo-checkbox';
import { toggleExerciseDone } from '../db/workoutUtils';
import i18n from '../localization/i18n';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  selectedDate: Date;
  onCreateWorkout: () => void;
  refreshFlag?: number;
}

const TodayWorkoutList: React.FC<Props> = ({ selectedDate, onCreateWorkout, refreshFlag }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { mode, setMode, theme } = useTheme();

  const loadWorkouts = async () => {
    try {
      setLoading(true);

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const data = await getWorkoutsByDate(dateStr);
      setWorkouts(data);
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('failedToLoadWorkouts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [selectedDate, refreshFlag]);

  const handleDelete = async (workoutId: number) => {
    Alert.alert(
      i18n.t('deletingWorkout'),
      i18n.t('deletingWorkoutMessage'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkout(workoutId);
              
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const day = String(selectedDate.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              const updatedWorkouts = await getWorkoutsByDate(dateStr);
              setWorkouts(updatedWorkouts);
            } catch (error) {
              Alert.alert(i18n.t('error'), i18n.t('failedDeletingWorkout'));
            }
          }
        }
      ]
    );
  };

  const handleToggleExercise = async (exerciseId: number, done: boolean) => {
    try {
      await toggleExerciseDone(exerciseId, done);

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const updatedWorkouts = await getWorkoutsByDate(dateStr);
      setWorkouts(updatedWorkouts);
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('failedUpdateStatusExercise'));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      marginTop: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.header,
    },
    workoutCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    workoutTitle: {
      fontSize: 16,
      width: '90%',
      fontWeight: '600',
      color: '#4CAF50',
    },
    exerciseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    exerciseText: {
      marginLeft: 8,
      fontSize: 14,
      width: '90%',
      color: theme.text,
    },
    deleteButton: {
      padding: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: theme.emptyText,
      marginBottom: 20,
    },
    createButton: {
      backgroundColor: '#4CAF50',
      padding: 12,
      borderRadius: 8,
      width: '100%',
    },
    buttonText: {
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
    },
    listContent: {
      paddingBottom: 48,
    },
  });


  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <View style={styles.workoutCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.workoutTitle}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Icon name="delete" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
      {item.exercises.map((ex: WorkoutExercise) => (
        <View key={ex.id} style={styles.exerciseRow}>
          <Checkbox
            value={ex.done ? true : false}
            onValueChange={(value) => handleToggleExercise(ex.id, value)}
            color={ex.done ? '#4CAF50' : '#BDBDBD'}
          />
          <Text style={styles.exerciseText}>
            {typeof ex.exercise === 'string' ? ex.exercise : ex.exercise}
          </Text>
        </View>
      ))}
    </View>
  );

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    return selected.getTime() < today.getTime();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {i18n.t('workoutsFor')}{selectedDate.toLocaleDateString('ru-RU')}
      </Text>
      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{i18n.t('emptyWorkout')}</Text>
          {!isPastDate(selectedDate) && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={onCreateWorkout}
            >
              <Text style={styles.buttonText}>{i18n.t('createWorkout')}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View>
          <FlatList
            data={workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              !isPastDate(selectedDate) ? (
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={onCreateWorkout}
                >
                  <Text style={styles.buttonText}>{i18n.t('addWorkout')}</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};


export default TodayWorkoutList;