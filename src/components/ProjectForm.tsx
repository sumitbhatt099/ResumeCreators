import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Project } from '../types/resume';

interface Props {
  data: Project;
  onChange: (key: keyof Project, value: string) => void;
  onRemove: () => void;
}

const ProjectForm: React.FC<Props> = ({ data, onChange, onRemove }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Project</Text>

      <TextInput
        placeholder="Project Title"
        style={styles.input}
        value={data.title}
        onChangeText={text => onChange('title', text)}
      />

      <TextInput
        placeholder="Short Description"
        style={[styles.input, { height: 70 }]}
        multiline
        value={data.description}
        onChangeText={text => onChange('description', text)}
      />

      <TextInput
        placeholder="Tools / Technologies Used"
        style={styles.input}
        value={data.technologies}
        onChangeText={text => onChange('technologies', text)}
      />

      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectForm;

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
