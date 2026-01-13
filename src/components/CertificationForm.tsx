import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Certification } from '../types/resume';

interface Props {
  data: Certification;
  onChange: (key: keyof Certification, value: string) => void;
  onRemove: () => void;
}

const CertificationForm: React.FC<Props> = ({ data, onChange, onRemove }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Certification / Course</Text>

      <TextInput
        placeholder="Course Name"
        style={styles.input}
        value={data.name}
        onChangeText={text => onChange('name', text)}
      />

      <TextInput
        placeholder="Institute / Platform (Udemy, ITI, etc.)"
        style={styles.input}
        value={data.institute}
        onChangeText={text => onChange('institute', text)}
      />

      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CertificationForm;

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
