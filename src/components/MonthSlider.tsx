import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const WEEKDAYS = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

type DayItem = {
  date: Date;
  label: string;
  number: number;
};

const getMonthDays = (): DayItem[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => {
    const date = new Date(year, month, i + 1);
    date.setHours(0, 0, 0, 0);
    
    return {
      date,
      label: WEEKDAYS[date.getDay()],
      number: date.getDate(),
    };
  });
};

type Props = {
  onDateSelect?: (date: Date) => void;
};

export default function MonthSlider({ onDateSelect }: Props) {
  const days = getMonthDays();
  const today = new Date();
  const todayIndex = today.getDate() - 1;

  const [selectedIndex, setSelectedIndex] = useState<number>(todayIndex);

  useEffect(() => {
    onDateSelect?.(days[todayIndex].date);
  }, []);

  return (
    <FlatList
      horizontal
      data={days}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={todayIndex}
      getItemLayout={(_, index) => ({
        length: 56,
        offset: 56 * index,
        index,
      })}
      renderItem={({ item, index }) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            onPress={() => {
              setSelectedIndex(index);
              onDateSelect?.(item.date);
            }}
            style={styles.itemContainer}
          >
            <Text style={styles.dayLabel}>{item.label}</Text>
            <View
              style={[
                styles.circle,
                isSelected && styles.selectedCircle,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.number}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const CIRCLE_SIZE = 36;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 44,
  },
  dayLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    color: '#333',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedCircle: {
    backgroundColor: '#4CAF50',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});