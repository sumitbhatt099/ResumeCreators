import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Education } from '../types/resume';

interface Props {
  data: Education;
  onChange: (key: keyof Education, value: string) => void;
  onRemove: () => void;
}

const EducationForm: React.FC<Props> = ({ data, onChange, onRemove }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Education</Text>

      <TextInput
        placeholder="Course / Degree"
        style={styles.input}
        value={data.degree}
        onChangeText={(text) => onChange('degree', text)}
      />

      <TextInput
        placeholder="College / School"
        style={styles.input}
        value={data.institute}
        onChangeText={(text) => onChange('institute', text)}
      />

      <TextInput
        placeholder="University / Board"
        style={styles.input}
        value={data.board}
        onChangeText={(text) => onChange('board', text)}
      />

      <TextInput
        placeholder="Passing Year"
        style={styles.input}
        keyboardType="number-pad"
        value={data.passingYear}
        onChangeText={(text) => onChange('passingYear', text)}
      />

      <TextInput
        placeholder="Percentage / CGPA"
        style={styles.input}
        value={data.percentage}
        onChangeText={(text) => onChange('percentage', text)}
      />

      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EducationForm;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  remove: {
    color: 'red',
    textAlign: 'right',
    marginTop: 5,
  },
});
