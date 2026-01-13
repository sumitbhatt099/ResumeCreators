import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import ResumeCard from '../../components/ResumeCard';
import { Resume, getResumes } from '../../storage/resumeStorage';

const AllResumesScreen = ({ navigation }: any) => {
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
      <View style={styles.center}>
        <Text>Loading resumes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {resumes.length === 0 ? (
        <Text style={styles.empty}>No resumes created yet</Text>
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
  style={styles.fab}
  onPress={() =>
    navigation.getParent()?.navigate('CreateResume', {
      template: 'default', // 👈 default template id
    })
  }
>

        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AllResumesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    color: '#777',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 34,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
