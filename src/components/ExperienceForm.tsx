import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Experience } from '../types/resume';

interface Props {
  data: Experience;
  onChange: (key: keyof Experience, value: string) => void;
  onRemove: () => void;
}

const ExperienceForm: React.FC<Props> = ({ data, onChange, onRemove }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Work Experience</Text>

      <TextInput
        placeholder="Company Name"
        style={styles.input}
        value={data.company}
        onChangeText={text => onChange('company', text)}
      />

      <TextInput
        placeholder="Job Title"
        style={styles.input}
        value={data.jobTitle}
        onChangeText={text => onChange('jobTitle', text)}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="From"
          style={[styles.input, styles.half]}
          value={data.from}
          onChangeText={text => onChange('from', text)}
        />
        <TextInput
          placeholder="To"
          style={[styles.input, styles.half]}
          value={data.to}
          onChangeText={text => onChange('to', text)}
        />
      </View>

      <TextInput
        placeholder="Key Responsibilities / Achievements"
        style={[styles.input, { height: 80 }]}
        multiline
        value={data.responsibilities}
        onChangeText={text => onChange('responsibilities', text)}
      />

      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExperienceForm;

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  remove: {
    color: 'red',
    textAlign: 'right',
    marginTop: 5,
  },
});
