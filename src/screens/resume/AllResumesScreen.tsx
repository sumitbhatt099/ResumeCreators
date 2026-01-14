import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import ResumeCard from '../../components/ResumeCard';
import { Resume, getResumes } from '../../storage/resumeStorage';
import { LightColors, DarkColors } from '../../theme/colors';

const AllResumesScreen = ({ navigation }: any) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : LightColors;
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResumes = async () => {
    try {
      const data = await getResumes();
      setResumes(data || []);
    } catch (error) {
      console.log('Error loading resumes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadResumes);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Resume }) => (
    <ResumeCard
      resume={item}
      onPress={() =>
        navigation.getParent()?.navigate('ResumePreview', {
          resumeId: item.id,
        })
      }
    />
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading resumes...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {resumes.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No resumes created yet
        </Text>
      ) : (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ➕ Floating Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.textPrimary,
          },
        ]}
        onPress={() =>
          navigation.getParent()?.navigate('CreateResume', {
            template: 'default', // 👈 default template id
          })
        }
      >
        <Text style={[styles.fabText, { color: colors.card }]}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AllResumesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    fontSize: 32,
    lineHeight: 34,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
