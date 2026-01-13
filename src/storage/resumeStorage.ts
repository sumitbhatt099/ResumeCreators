import AsyncStorage from '@react-native-async-storage/async-storage';

const RESUME_LIST_KEY = 'RESUMES';

/* ================= TYPES ================= */
export type Resume = {
  id: string;
  name: string;
  title: string;
  template: string;
  updatedAt: string;
};

/* ================= SAVE LIST ITEM ================= */
export const saveResume = async (resume: Resume) => {
  try {
    const data = await AsyncStorage.getItem(RESUME_LIST_KEY);
    const list: Resume[] = data ? JSON.parse(data) : [];

    const index = list.findIndex(r => r.id === resume.id);
    if (index >= 0) {
      list[index] = resume;
    } else {
      list.push(resume);
    }

    await AsyncStorage.setItem(RESUME_LIST_KEY, JSON.stringify(list));
  } catch (e) {
    console.log('saveResume error', e);
  }
};

/* ================= GET ALL RESUMES (🔥 MISSING FUNCTION) ================= */
export const getResumes = async (): Promise<Resume[]> => {
  try {
    const data = await AsyncStorage.getItem(RESUME_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log('getResumes error', e);
    return [];
  }
};

/* ================= FULL RESUME ================= */
export const saveFullResume = async (resume: any) => {
  await AsyncStorage.setItem(
    `RESUME_${resume.id}`,
    JSON.stringify(resume)
  );
};

export const getFullResumeById = async (id: string) => {
  const data = await AsyncStorage.getItem(`RESUME_${id}`);
  return data ? JSON.parse(data) : null;
};
