import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import i18n from '../localization/i18n';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../localization/LanguageContext';

type DayItem = {
  date: Date;
  label: string;
  number: number;
};

type Props = {
  onDateSelect?: (date: Date) => void;
};

export default function MonthSlider({ onDateSelect }: Props) {
  const { mode, setMode, theme } = useTheme();
  const { language } = useLanguage();
  const today = new Date();

  const WEEKDAYS = useMemo(() => [
    i18n.t('sunday'), i18n.t('monday'), i18n.t('tuesday'),
    i18n.t('wednesday'), i18n.t('thursday'), i18n.t('friday'), i18n.t('saturday')
  ], [language]);

  const MONTH_LABELS = useMemo(() => [
    i18n.t('january'), i18n.t('february'), i18n.t('march'), i18n.t('april'), i18n.t('may'), i18n.t('june'),
    i18n.t('july'), i18n.t('august'), i18n.t('september'), i18n.t('october'), i18n.t('november'), i18n.t('december'),
  ], [language]);

  const getMonthDays = (year: number, month: number, weekdays: string[]): DayItem[] => {
    return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => {
      const date = new Date(year, month, i + 1);
      date.setHours(0, 0, 0, 0);
      return {
        date,
        label: weekdays[date.getDay()],
        number: date.getDate(),
      };
    });
  };

  const years = useMemo(() => {
    const startYear = today.getFullYear() - 2;
    const endYear = today.getFullYear() + 1;
    const arr = [];
    for (let y = startYear; y <= endYear; y++) {
      arr.push(y);
    }
    return arr;
  }, []);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const days = useMemo(() => getMonthDays(year, month, WEEKDAYS), [year, month, WEEKDAYS]);

  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (year === today.getFullYear() && month === today.getMonth()) {
      return today.getDate() - 1;
    }
    return 0;
  });

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
    onDateSelect?.(days[0]?.date);
  }, [year, month]);

  useEffect(() => {
    if (year === today.getFullYear() && month === today.getMonth()) {
      const todayIndex = today.getDate() - 1;
      setSelectedIndex(todayIndex);
      onDateSelect?.(days[todayIndex]?.date);
    } else {
      setSelectedIndex(0);
      onDateSelect?.(days[0]?.date);
    }
  }, []);

  const styles = StyleSheet.create({ 
    monthCard: {
      backgroundColor: theme.card,
      borderRadius: 20,
      paddingBottom: 10,
      marginTop: 10
    },
    selectButton: {
      alignSelf: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#4CAF50',
      width: '100%',
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
    },
    selectButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    list: {
      paddingHorizontal: 10,
      paddingTop: 15,
    },
    itemContainer: {
      alignItems: 'center',
      marginHorizontal: 6,
      width: 44,
    },
    dayLabel: {
      color: '#888',
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 4,
    },
    dayNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.dayText,
    },
    circle: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    selectedCircle: {
      backgroundColor: '#4CAF50',
      borderRadius: 100,
    },
    selectedText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: theme.background,
      borderRadius: 15,
      padding: 20,
      maxHeight: '80%',
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 5,
      color: theme.text
    },
    modalItem: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginHorizontal: 3,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: '#ddd',
      backgroundColor: theme.backgroundModalItem,
    },
    modalItemSelected: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
    },
    modalItemText: {
      color: '#555',
      fontWeight: '500'
    },
    modalItemTextSelected: {
      color: 'white',
      fontWeight: 'bold',
    },
    modalButton: {
      marginTop: 15,
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: 'center',
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.monthCard}>
      <View>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.selectButtonText}>{`${MONTH_LABELS[month].toUpperCase()} ${year}`}</Text>
        </TouchableOpacity>

        <FlatList
          horizontal
          data={days}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={selectedIndex}
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
      </View>


      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t('selectAMonth')}</Text>
            <FlatList
              horizontal
              data={MONTH_LABELS}
              keyExtractor={(_, i) => i.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setMonth(index)}
                  style={[
                    styles.modalItem,
                    month === index && styles.modalItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      month === index && styles.modalItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text style={[styles.modalTitle, { marginTop: 20 }]}>{i18n.t('selectAYear')}</Text>
            <FlatList
              horizontal
              data={years}
              keyExtractor={(item) => item.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setYear(item)}
                  style={[
                    styles.modalItem,
                    year === item && styles.modalItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      year === item && styles.modalItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{i18n.t('done')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const CIRCLE_SIZE = 36;

