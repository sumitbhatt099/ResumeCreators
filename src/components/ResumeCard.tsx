import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Resume } from '../storage/resumeStorage';

interface Props {
  resume: Resume;
  onPress: () => void;
}

const ResumeCard: React.FC<Props> = ({ resume, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* LEFT */}
      <View style={styles.left}>
        {/* Avatar */}
        <View style={styles.avatarBox}>
          <Icon name="document-text-outline" size={26} color="#4CAF50" />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {resume.name}
          </Text>

          <Text style={styles.title} numberOfLines={1}>
            {resume.title}
          </Text>

          <View style={styles.metaRow}>
            <Icon name="calendar-outline" size={14} color="#777" />
            <Text style={styles.metaText}>
              Updated {resume.updatedAt}
            </Text>
          </View>

          {/* Optional: Location placeholder */}
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={14} color="#777" />
            <Text style={styles.metaText}>Location added</Text>
          </View>
        </View>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        <View style={styles.viewBtn}>
          <Text style={styles.viewText}>View</Text>
          <Icon name="chevron-forward-outline" size={18} color="#4CAF50" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ResumeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
  },

  left: {
    flexDirection: 'row',
    flex: 1,
  },

  avatarBox: {
    height: 46,
    width: 46,
    borderRadius: 23,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },

  title: {
    color: '#555',
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  metaText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },

  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 2,
  },
});
