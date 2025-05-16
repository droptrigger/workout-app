import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Exercise, Pattern } from "../types/types";
import i18n from "../localization/i18n";
import { useTheme } from "../theme/ThemeContext";


interface PatternCardProps {
    pattern: Pattern;
    onDelete: () => void;
    onEdit: () => void;
}
   
const PatternCard: React.FC<PatternCardProps> = ({ pattern, onDelete, onEdit }) => {
    const { mode, setMode, theme } = useTheme();

    const styles = StyleSheet.create({
        patternCard: {
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
        },
        patternName: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.primary
        },
        exerciseRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        checkbox: {
            width: 16,
            height: 16,
            borderWidth: 2,
            borderColor: '#ccc',
            borderRadius: 50,
            marginRight: 8,
        },
        exerciseText: {
            flex: 1,
            fontSize: 14,
            color: theme.header
        },
        buttonContainer: {
            marginTop: 7,
        },
        actionButton: {
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 16,
            marginVertical: 4,
        },
        editButton: {
            backgroundColor: '#4CAF50',
        },
        deleteButton: {
            backgroundColor: '#ff4444',
        },
        actionButtonText: {
            color: 'white',
            textAlign: 'center',
            fontSize: 14,
            fontWeight: '500',
        },
    })

    return (
        <View style={styles.patternCard}>
            <Text style={styles.patternName}>{pattern.name}</Text>
            {pattern.exercises.map((ex: Exercise) => (
                <View key={ex.id} style={styles.exerciseRow}>
                    <View style={styles.checkbox} />
                    <Text style={styles.exerciseText}>{ex.exercise}</Text>
                </View>
            ))}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={onEdit}
                >
                    <Text style={styles.actionButtonText}>{i18n.t('editTemplate')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={onDelete}
                >
                    <Text style={styles.actionButtonText}>{i18n.t('delete')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PatternCard;