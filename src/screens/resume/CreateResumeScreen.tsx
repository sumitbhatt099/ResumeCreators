import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';

import { saveResume, saveFullResume } from '../../storage/resumeStorage';

import {
  Education,
  Skills,
  Experience,
  Project,
  Certification,
} from '../../types/resume';

import EducationForm from '../../components/EducationForm';
import SkillTag from '../../components/SkillTag';
import ExperienceForm from '../../components/ExperienceForm';
import ProjectForm from '../../components/ProjectForm';
import CertificationForm from '../../components/CertificationForm';

// Import your color constants from separate file
import { LightColors, DarkColors } from '../../theme/colors'; // Update path as needed

const CreateResumeScreen = ({ route, navigation }: any) => {
  const { template } = route.params;

  /* ================= PERSONAL ================= */
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState<string | undefined>();

  const [location, setLocation] =
    useState<{ lat: number; lng: number } | undefined>();
  const [locationText, setLocationText] = useState('');

  /* ================= EDUCATION ================= */
  const [educationList, setEducationList] = useState<Education[]>([]);

  /* ================= SKILLS ================= */
  const [technicalSkill, setTechnicalSkill] = useState('');
  const [softSkill, setSoftSkill] = useState('');
  const [skills, setSkills] = useState<Skills>({
    technical: [],
    soft: [],
  });

  /* ================= EXPERIENCE ================= */
  const [experienceList, setExperienceList] = useState<Experience[]>([]);

  /* ================= PROJECTS ================= */
  const [projectList, setProjectList] = useState<Project[]>([]);

  /* ================= CERTIFICATIONS ================= */
  const [certifications, setCertifications] = useState<Certification[]>([]);

  /* ================= LANGUAGES ================= */
  const languageOptions = ['Hindi', 'English', 'Gujarati', 'Marathi', 'Punjabi', 'Urdu'];
  const [languages, setLanguages] = useState<string[]>([]);

  /* ================= DECLARATION ================= */
  const [declaration, setDeclaration] = useState(
    'I hereby declare that the above information is true to the best of my knowledge.'
  );

  /* ================= IMAGE ================= */
  const selectPhoto = () => {
    Alert.alert('Select Photo', 'Choose option', [
      {
        text: 'Camera',
        onPress: async () => {
         const res = await launchCamera({ mediaType: 'photo' });
         if (res.assets?.length) setImage(res.assets[0].uri);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
         const res = await launchImageLibrary({ mediaType: 'photo' });
         if (res.assets?.length) setImage(res.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  /* ================= DOB ================= */
  const onDobChange = (_: any, selectedDate?: Date) => {
    setShowDobPicker(false);
    if (selectedDate) {
      setDobDate(selectedDate);
      setDob(selectedDate.toDateString());
    }
  };

  /* ================= LOCATION (AREA DETAILS) ================= */
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          const a = data.address || {};

          const text = [
            a.suburb,
            a.city || a.town || a.village,
            a.state,
            a.country,
          ]
            .filter(Boolean)
            .join(', ');

          setLocationText(text);
          Alert.alert('Location Saved', text);
        } catch {
          setLocationText(`Lat: ${lat}, Lng: ${lng}`);
        }
      },
      err => Alert.alert('Location Error', err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  /* ================= HELPERS ================= */
  const addItem = <T,>(list: T[], set: any, item: T) => set([...list, item]);
  const updateItem = <T,>(list: T[], set: any, index: number, obj: Partial<T>) => {
    const arr = [...list];
    arr[index] = { ...arr[index], ...obj };
    set(arr);
  };
  const removeItem = <T,>(list: T[], set: any, index: number) =>
    set(list.filter((_, i) => i !== index));

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!fullName || !mobile || !email) {
      Alert.alert('Validation', 'Name, Mobile & Email required');
      return;
    }

    const resumeId = uuid.v4() as string;

    await saveFullResume({
      id: resumeId,
      template,
      createdAt: new Date().toISOString(),
      personal: {
        fullName,
        mobile,
        email,
        dob,
        summary,
        image,
        locationText,
        latitude: location?.lat,
        longitude: location?.lng,
      },
      education: educationList,
      skills,
      experience: experienceList,
      projects: projectList,
      certifications,
      languages,
      declaration,
    });

    await saveResume({
      id: resumeId,
      name: fullName,
      title: summary || 'My Resume',
      template,
      updatedAt: new Date().toDateString(),
    });

    Alert.alert('Success', 'Resume saved successfully');
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>
        <Icon name="person-outline" size={22} /> Personal Details
      </Text>

      <TouchableOpacity onPress={selectPhoto} style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <>
            <Icon name="camera-outline" size={30} />
            <Text style={styles.imagePlaceholderText}>Select Photo</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Full Name */}
      <View style={styles.inputWithIcon}>
        <Icon name="person-outline" size={20} style={styles.inputIcon} />
        <TextInput
          style={styles.inputInner}
          placeholder="Full Name"
          placeholderTextColor={LightColors.textSecondary}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Mobile */}
      <View style={styles.inputWithIcon}>
        <Icon name="call-outline" size={20} style={styles.inputIcon} />
        <TextInput
          style={styles.inputInner}
          placeholder="Mobile"
          placeholderTextColor={LightColors.textSecondary}
          keyboardType="number-pad"
          value={mobile}
          onChangeText={setMobile}
        />
      </View>

      {/* Email */}
      <View style={styles.inputWithIcon}>
        <Icon name="mail-outline" size={20} style={styles.inputIcon} />
        <TextInput
          style={styles.inputInner}
          placeholder="Email"
          placeholderTextColor={LightColors.textSecondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* DOB */}
      <TouchableOpacity onPress={() => setShowDobPicker(true)}>
        <View style={styles.inputWithIcon}>
          <Icon name="calendar-outline" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.inputInner}
            placeholder="Date of Birth"
            placeholderTextColor={LightColors.textSecondary}
            value={dob}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {showDobPicker && (
        <DateTimePicker
          value={dobDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDobChange}
        />
      )}

      {/* Career Objective */}
      <View style={styles.inputWithIcon}>
        <Icon name="document-text-outline" size={20} style={styles.inputIcon} />
        <TextInput
          style={[styles.inputInner, styles.textArea]}
          multiline
          placeholder="Career Objective"
          placeholderTextColor={LightColors.textSecondary}
          value={summary}
          onChangeText={setSummary}
        />
      </View>

      {/* Location */}
      <TouchableOpacity style={styles.locBtn} onPress={getLocation}>
        <Icon name="location-outline" size={18} color={LightColors.card} />
        <Text style={styles.locBtnText}>
          {locationText ? 'Location Saved' : 'Get Location'}
        </Text>
      </TouchableOpacity>

      {locationText ? (
        <Text style={styles.locationText}>{locationText}</Text>
      ) : null}

      {/* ================= EDUCATION ================= */}
      <Text style={styles.heading}><Icon name="school-outline" size={22} /> Education</Text>
      {educationList.map((e, i) => (
        <EducationForm
          key={e.id}
          data={e}
          onChange={(k, v) => updateItem(educationList, setEducationList, i, { [k]: v })}
          onRemove={() => removeItem(educationList, setEducationList, i)}
        />
      ))}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          addItem(educationList, setEducationList, {
            id: Date.now().toString(),
            degree: '',
            institute: '',
            board: '',
            passingYear: '',
            percentage: '',
          })
        }>
        <Text style={styles.addText}>+ Add Education</Text>
      </TouchableOpacity>

      {/* ================= SKILLS ================= */}
      <Text style={styles.heading}><Icon name="construct-outline" size={22} /> Skills</Text>

      <View style={styles.row}>
        {skills.technical.map((s, i) => (
          <SkillTag
            key={i}
            label={s}
            onRemove={() =>
              setSkills(p => ({
                ...p,
                technical: p.technical.filter((_, idx) => idx !== i),
              }))
            }
          />
        ))}
      </View>

      <View style={styles.inputWithIcon}>
        <Icon name="hammer-outline" size={20} style={styles.inputIcon} />
        <TextInput
          style={styles.inputInner}
          placeholder="Technical Skill"
          placeholderTextColor={LightColors.textSecondary}
          value={technicalSkill}
          onChangeText={setTechnicalSkill}
        />
        <TouchableOpacity
          style={styles.addSmallBtn}
          onPress={() => {
            if (technicalSkill) {
              setSkills(p => ({ ...p, technical: [...p.technical, technicalSkill] }));
              setTechnicalSkill('');
            }
          }}>
          <Text style={styles.addSmallText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* ================= EXPERIENCE ================= */}
      <Text style={styles.heading}><Icon name="briefcase-outline" size={22} /> Experience</Text>
      {experienceList.map((e, i) => (
        <ExperienceForm
          key={e.id}
          data={e}
          onChange={(k, v) => updateItem(experienceList, setExperienceList, i, { [k]: v })}
          onRemove={() => removeItem(experienceList, setExperienceList, i)}
        />
      ))}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          addItem(experienceList, setExperienceList, {
            id: Date.now().toString(),
            company: '',
            jobTitle: '',
            from: '',
            to: '',
            responsibilities: '',
          })
        }>
        <Text style={styles.addText}>+ Add Experience</Text>
      </TouchableOpacity>

      {/* ================= PROJECTS ================= */}
      <Text style={styles.heading}><Icon name="layers-outline" size={22} /> Projects</Text>
      {projectList.map((p, i) => (
        <ProjectForm
          key={p.id}
          data={p}
          onChange={(k, v) => updateItem(projectList, setProjectList, i, { [k]: v })}
          onRemove={() => removeItem(projectList, setProjectList, i)}
        />
      ))}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          addItem(projectList, setProjectList, {
            id: Date.now().toString(),
            title: '',
            description: '',
            technologies: '',
          })
        }>
        <Text style={styles.addText}>+ Add Project</Text>
      </TouchableOpacity>

      {/* ================= CERTIFICATIONS ================= */}
      <Text style={styles.heading}><Icon name="ribbon-outline" size={22} /> Certifications</Text>
      {certifications.map((c, i) => (
        <CertificationForm
          key={c.id}
          data={c}
          onChange={(k, v) => updateItem(certifications, setCertifications, i, { [k]: v })}
          onRemove={() => removeItem(certifications, setCertifications, i)}
        />
      ))}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          addItem(certifications, setCertifications, {
            id: Date.now().toString(),
            name: '',
            institute: '',
          })
        }>
        <Text style={styles.addText}>+ Add Certification</Text>
      </TouchableOpacity>

      {/* ================= LANGUAGES ================= */}
      <Text style={styles.heading}><Icon name="language-outline" size={22} /> Languages</Text>
      <View style={styles.row}>
        {languageOptions.map(l => (
          <TouchableOpacity
            key={l}
            style={[
              styles.langChip,
              languages.includes(l) && styles.langChipActive,
            ]}
            onPress={() =>
              setLanguages(p =>
                p.includes(l) ? p.filter(x => x !== l) : [...p, l]
              )
            }>
            <Text style={languages.includes(l) ? styles.langTextActive : styles.langText}>
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= DECLARATION ================= */}
      <Text style={styles.heading}><Icon name="document-text-outline" size={22} /> Declaration</Text>
      <View style={styles.inputWithIcon}>
        <Icon name="document-outline" size={20} style={styles.inputIcon} />
        <TextInput
          style={[styles.inputInner, styles.textArea]}
          multiline
          placeholder="Declaration text"
          placeholderTextColor={LightColors.textSecondary}
          value={declaration}
          onChangeText={setDeclaration}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Icon name="save-outline" size={20} color={LightColors.card} />
        <Text style={styles.saveText}> Save Resume</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default CreateResumeScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: LightColors.background 
  },
  heading: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginVertical: 12,
    color: LightColors.textPrimary 
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: LightColors.card
  },
  inputIcon: { 
    marginRight: 8, 
    color: LightColors.textSecondary 
  },
  inputInner: { 
    flex: 1, 
    paddingVertical: 10,
    color: LightColors.textPrimary 
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10
  },

  row: { flexDirection: 'row', flexWrap: 'wrap' },

  addBtn: {
    backgroundColor: `${LightColors.success}20`,
    borderWidth: 1,
    borderColor: LightColors.success,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addText: { 
    color: LightColors.success, 
    fontWeight: 'bold' 
  },

  addSmallBtn: {
    backgroundColor: LightColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  addSmallText: { 
    color: LightColors.card, 
    fontWeight: 'bold' 
  },

  imageBox: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: LightColors.border,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: LightColors.card
  },
  image: { 
    height: 120, 
    width: 120, 
    borderRadius: 60 
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: LightColors.textSecondary,
    fontSize: 12
  },

  locBtn: {
    backgroundColor: LightColors.secondary,
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locBtnText: {
    color: LightColors.card,
    marginLeft: 6,
    fontWeight: '500'
  },

  locationText: {
    textAlign: 'center', 
    color: LightColors.textSecondary,
    marginBottom: 20
  },

  langChip: {
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: LightColors.card
  },
  langChipActive: {
    backgroundColor: LightColors.primary,
    borderColor: LightColors.primary,
  },
  langText: { 
    color: LightColors.textPrimary 
  },
  langTextActive: { 
    color: LightColors.card,
    fontWeight: '500'
  },

  saveBtn: {
    backgroundColor: LightColors.primary,
    padding: 15,
    borderRadius: 8,
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: { 
    color: LightColors.card, 
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
});
