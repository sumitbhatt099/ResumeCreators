import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getFullResumeById } from '../../storage/resumeStorage';

const ResumePreviewScreen = ({ route }: any) => {
  const resumeId = route?.params?.resumeId;
  const [resume, setResume] = useState<any>(null);
  const [showPrint, setShowPrint] = useState(false);
  const webRef = useRef<WebView>(null);

  useEffect(() => {
    if (resumeId) {
      getFullResumeById(resumeId).then(setResume);
    }
  }, [resumeId]);

  if (!resume) {
    return (
      <View style={styles.center}>
        <Text>Loading resume...</Text>
      </View>
    );
  }

  const { personal, skills } = resume;

  /* ================= HTML FOR PDF ================= */
  const html = `
  <html>
    <body style="font-family: Arial; padding:20px">
      <h1 style="text-align:center">${personal.fullName}</h1>
      <p style="text-align:center">${personal.email} | ${personal.mobile}</p>
      ${personal.locationText ? `<p style="text-align:center">${personal.locationText}</p>` : ''}

      <h3>Career Objective</h3>
      <p>${personal.summary || '-'}</p>

      <h3>Education</h3>
      ${resume.education.map((e:any)=>`
        <p>${e.degree} - ${e.institute} (${e.passingYear})</p>
      `).join('')}

      <h3>Skills</h3>
      <p>Technical: ${skills.technical.join(', ')}</p>
      <p>Soft: ${skills.soft.join(', ')}</p>

      <h3>Experience</h3>
      ${resume.experience.map((e:any)=>`
        <p><b>${e.jobTitle}</b> - ${e.company}</p>
        <p>${e.from} - ${e.to}</p>
        <p>${e.responsibilities || ''}</p>
      `).join('')}

      <h3>Projects</h3>
      ${resume.projects.map((p:any)=>`
        <p><b>${p.title}</b></p>
        <p>${p.description}</p>
        <p>Tech: ${p.technologies || '-'}</p>
      `).join('')}

      <h3>Certifications</h3>
      ${resume.certifications.map((c:any)=>`
        <p>${c.name} (${c.institute})</p>
      `).join('')}

      <h3>Languages</h3>
      <p>${resume.languages.join(', ')}</p>

      <h3>Declaration</h3>
      <p>${resume.declaration}</p>
    </body>
  </html>
  `;

  /* ================= UI CV ================= */
  return (
    <View style={{ flex: 1 }}>
      {!showPrint ? (
        <>
          <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
            
            {/* HEADER */}
            <View style={styles.header}>
              {personal.image && (
                <Image source={{ uri: personal.image }} style={styles.profileImage} />
              )}
              <Text style={styles.name}>{personal.fullName}</Text>
              <Text>{personal.email} | {personal.mobile}</Text>
              {personal.dob && <Text>DOB: {personal.dob}</Text>}
              {personal.locationText && (
                <Text style={{ marginTop: 4 }}>📍 {personal.locationText}</Text>
              )}
            </View>

            {/* CAREER OBJECTIVE */}
            <Section title="Career Objective">
              <Text>{personal.summary || '-'}</Text>
            </Section>

            {/* EDUCATION */}
            <Section title="Education">
              {resume.education.map((e:any, i:number) => (
                <Text key={i}>
                  • {e.degree} - {e.institute} ({e.passingYear})
                </Text>
              ))}
            </Section>

            {/* SKILLS */}
            <Section title="Skills">
              <Text>Technical: {skills.technical.join(', ') || '-'}</Text>
              <Text>Soft: {skills.soft.join(', ') || '-'}</Text>
            </Section>

            {/* EXPERIENCE */}
            <Section title="Work Experience">
              {resume.experience.map((e:any, i:number) => (
                <View key={i} style={styles.block}>
                  <Text style={styles.bold}>{e.jobTitle}</Text>
                  <Text>{e.company}</Text>
                  <Text>{e.from} - {e.to}</Text>
                  {e.responsibilities && <Text>{e.responsibilities}</Text>}
                </View>
              ))}
            </Section>

            {/* PROJECTS */}
            <Section title="Projects">
              {resume.projects.map((p:any, i:number) => (
                <View key={i} style={styles.block}>
                  <Text style={styles.bold}>{p.title}</Text>
                  <Text>{p.description}</Text>
                  <Text>Tech: {p.technologies || '-'}</Text>
                </View>
              ))}
            </Section>

            {/* CERTIFICATIONS */}
            <Section title="Certifications">
              {resume.certifications.map((c:any, i:number) => (
                <Text key={i}>• {c.name} ({c.institute})</Text>
              ))}
            </Section>

            {/* LANGUAGES */}
            <Section title="Languages">
              <Text>{resume.languages.join(', ')}</Text>
            </Section>

            {/* DECLARATION */}
            <Section title="Declaration">
              <Text>{resume.declaration}</Text>
            </Section>

          </ScrollView>

          {/* PDF BUTTON */}
          <TouchableOpacity style={styles.pdfBtn} onPress={() => setShowPrint(true)}>
            <Text style={styles.pdfText}>Download PDF</Text>
          </TouchableOpacity>
        </>
      ) : (
        <WebView
          ref={webRef}
          originWhitelist={['*']}
          source={{ html }}
          onLoadEnd={() => {
            webRef.current?.injectJavaScript(`
              setTimeout(() => { window.print(); }, 300);
              true;
            `);
          }}
        />
      )}
    </View>
  );
};

export default ResumePreviewScreen;

/* ================= UI COMPONENT ================= */
const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },

  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    marginBottom: 6,
  },

  block: { marginBottom: 8 },
  bold: { fontWeight: 'bold' },

  pdfBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  pdfText: { color: '#fff', fontSize: 16 },
});
