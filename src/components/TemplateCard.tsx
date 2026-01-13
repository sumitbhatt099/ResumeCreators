import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ResumeTemplate } from '../templates/templates';

interface Props {
  template: ResumeTemplate;
  onSelect: () => void;
}

const TemplateCard: React.FC<Props> = ({ template, onSelect }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onSelect}>
      <View
        style={[
          styles.preview,
          { backgroundColor: template.previewColor },
        ]}
      />
      <Text style={styles.name}>{template.name}</Text>
      <Text style={styles.desc}>{template.description}</Text>
    </TouchableOpacity>
  );
};

export default TemplateCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  preview: {
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    color: '#555',
    marginTop: 4,
  },
});
