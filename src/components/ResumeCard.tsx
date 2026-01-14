import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Resume } from '../storage/resumeStorage';
import { LightColors, DarkColors } from '../theme/colors';

interface Props {
  resume: Resume;
  onPress: () => void;
}

const ResumeCard: React.FC<Props> = ({ resume, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : LightColors;

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={onPress} activeOpacity={0.8}>
      {/* LEFT */}
      <View style={styles.left}>
        {/* Avatar */}
        <View style={[styles.avatarBox, { backgroundColor: colors.success + '20' }]}>
          <Icon name="document-text-outline" size={26} color={colors.primary} />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {resume.name}
          </Text>

          <Text style={[styles.title, { color: colors.textSecondary }]} numberOfLines={1}>
            {resume.title}
          </Text>

          <View style={styles.metaRow}>
            <Icon name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              Updated {resume.updatedAt}
            </Text>
          </View>

          {/* Optional: Location placeholder */}
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>Location added</Text>
          </View>
        </View>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        <View style={styles.viewBtn}>
          <Text style={[styles.viewText, { color: colors.primary }]}>View</Text>
          <Icon name="chevron-forward-outline" size={18} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ResumeCard;

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  left: {
    flexDirection: 'row',
    flex: 1,
  },

  avatarBox: {
    height: 46,
    width: 46,
    borderRadius: 23,
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
  },

  title: {
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  metaText: {
    fontSize: 12,
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
    fontWeight: 'bold',
    marginRight: 2,
  },
});
