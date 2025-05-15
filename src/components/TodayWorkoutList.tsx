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

  interface Props {
    selectedDate: Date;
    onCreateWorkout: () => void;
    refreshFlag?: number;
  }

  const TodayWorkoutList: React.FC<Props> = ({ selectedDate, onCreateWorkout, refreshFlag }) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

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
        Alert.alert('Ошибка', 'Не удалось загрузить тренировки');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadWorkouts();
    }, [selectedDate, refreshFlag]);

    const handleDelete = async (workoutId: number) => {
      Alert.alert(
        'Удаление тренировки',
        'Вы уверены, что хотите удалить эту тренировку?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Удалить',
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
                Alert.alert('Ошибка', 'Не удалось удалить тренировку');
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
        Alert.alert('Ошибка', 'Не удалось обновить статус упражнения');
      }
    };

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
          Тренировки на {selectedDate.toLocaleDateString('ru-RU')}
        </Text>
        {workouts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет запланированных тренировок</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={onCreateWorkout}
            >
              <Text style={styles.buttonText}>Создать тренировку</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <FlatList
              data={workouts}
              renderItem={renderWorkoutItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContent}
            >
            </FlatList>
            <TouchableOpacity
              style={styles.createButton}
              onPress={onCreateWorkout}
            >
              <Text style={styles.buttonText}>Добавить тренировку</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
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
      color: '#333',
    },
    workoutCard: {
      backgroundColor: '#fff',
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
      color: '#666',
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
      color: '#888',
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
      fontSize: 16,
    },
    listContent: {
      paddingBottom: 0,
    },
  });

  export default TodayWorkoutList;