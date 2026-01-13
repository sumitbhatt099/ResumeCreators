import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  label: string;
  onRemove: () => void;
}

const SkillTag: React.FC<Props> = ({ label, onRemove }) => {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.remove}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SkillTag;

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  text: { marginRight: 6 },
  remove: { color: 'red', fontWeight: 'bold' },
});
