import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getFullResumeById } from '../../storage/resumeStorage';
import { LightColors, DarkColors } from '../../theme/colors';

const ResumePreviewScreen = ({ route }: any) => {
  const resumeId = route?.params?.resumeId;
  const [resume, setResume] = useState<any>(null);
  const [showPrint, setShowPrint] = useState(false);
  const webRef = useRef<WebView>(null);

  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? DarkColors : LightColors;

  useEffect(() => {
    if (resumeId) {
      getFullResumeById(resumeId).then(async (resumeData) => {
        let updatedResume = { ...resumeData };
        
        // Fix: Convert image to base64 for PDF WebView
        if (resumeData.personal?.image) {
          try {
            const response = await fetch(resumeData.personal.image);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              updatedResume.personal.imageBase64 = reader.result as string;
              setResume(updatedResume);
            };
            return; // Wait for image conversion
          } catch (error) {
            console.log('Image conversion failed:', error);
          }
        }
        setResume(updatedResume);
      });
    }
  }, [resumeId]);

  if (!resume) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Loading resume...</Text>
      </View>
    );
  }

  const { personal, skills } = resume;

  // Fix: Add image to HTML and always show location
  const imageHtml = personal.imageBase64 ? 
    `<img src="${personal.imageBase64}" style="width:120px;height:120px;border-radius:60px;margin:0 auto 10px auto;display:block;">` : '';

  const html = `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding:20px; margin:0; background:white; line-height:1.4; }
        h1 { margin-top:0; }
        h3 { color:#333; margin-top:25px; }
        p { margin:5px 0; }
      </style>
    </head>
    <body>
      ${imageHtml}
      <h1 style="text-align:center">${personal.fullName}</h1>
      <p style="text-align:center">${personal.email} | ${personal.mobile}</p>
      <p style="text-align:center">${personal.locationText || 'Location not specified'}</p>

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

  /* ================= UI ================= */
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!showPrint ? (
        <>
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* HEADER */}
            <View style={styles.header}>
              {personal.image && (
                <Image
                  source={{ uri: personal.image }}
                  style={styles.profileImage}
                />
              )}

              <Text style={[styles.name, { color: colors.textPrimary }]}>
                {personal.fullName}
              </Text>

              <Text style={{ color: colors.textSecondary }}>
                {personal.email} | {personal.mobile}
              </Text>

              {personal.dob && (
                <Text style={{ color: colors.textSecondary }}>
                  DOB: {personal.dob}
                </Text>
              )}

              {/* Fix: Location always shows with fallback */}
              <Text style={{ marginTop: 4, color: colors.textSecondary }}>
                📍 {personal.locationText || 'Location not specified'}
              </Text>
            </View>

            <Section title="Career Objective" colors={colors}>
              <Text style={{ color: colors.textPrimary }}>
                {personal.summary || '-'}
              </Text>
            </Section>

            <Section title="Education" colors={colors}>
              {resume.education.map((e:any, i:number) => (
                <Text key={i} style={{ color: colors.textPrimary }}>
                  • {e.degree} - {e.institute} ({e.passingYear})
                </Text>
              ))}
            </Section>

            <Section title="Skills" colors={colors}>
              <Text style={{ color: colors.textPrimary }}>
                Technical: {skills.technical.join(', ') || '-'}
              </Text>
              <Text style={{ color: colors.textPrimary }}>
                Soft: {skills.soft.join(', ') || '-'}
              </Text>
            </Section>

            <Section title="Work Experience" colors={colors}>
              {resume.experience.map((e:any, i:number) => (
                <View key={i} style={styles.block}>
                  <Text style={[styles.bold, { color: colors.textPrimary }]}>
                    {e.jobTitle}
                  </Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {e.company}
                  </Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {e.from} - {e.to}
                  </Text>
                  {e.responsibilities && (
                    <Text style={{ color: colors.textPrimary }}>
                      {e.responsibilities}
                    </Text>
                  )}
                </View>
              ))}
            </Section>

            <Section title="Projects" colors={colors}>
              {resume.projects.map((p:any, i:number) => (
                <View key={i} style={styles.block}>
                  <Text style={[styles.bold, { color: colors.textPrimary }]}>
                    {p.title}
                  </Text>
                  <Text style={{ color: colors.textPrimary }}>
                    {p.description}
                  </Text>
                  <Text style={{ color: colors.textSecondary }}>
                    Tech: {p.technologies || '-'}
                  </Text>
                </View>
              ))}
            </Section>

            <Section title="Certifications" colors={colors}>
              {resume.certifications.map((c:any, i:number) => (
                <Text key={i} style={{ color: colors.textPrimary }}>
                  • {c.name} ({c.institute})
                </Text>
              ))}
            </Section>

            <Section title="Languages" colors={colors}>
              <Text style={{ color: colors.textPrimary }}>
                {resume.languages.join(', ')}
              </Text>
            </Section>

            <Section title="Declaration" colors={colors}>
              <Text style={{ color: colors.textPrimary }}>
                {resume.declaration}
              </Text>
            </Section>
          </ScrollView>

          {/* PDF BUTTON */}
          <TouchableOpacity
            style={[styles.pdfBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowPrint(true)}
          >
            <Text style={[styles.pdfText, { color: colors.card }]}>
              Show Prev
            </Text>
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

/* ================= SECTION COMPONENT ================= */
const Section = ({ title, children, colors }: any) => (
  <View style={styles.section}>
    <Text
      style={[
        styles.sectionTitle,
        { color: colors.primary, borderBottomColor: colors.border },
      ]}
    >
      {title}
    </Text>
    {children}
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    marginBottom: 6,
  },

  block: {
    marginBottom: 8,
  },

  bold: {
    fontWeight: 'bold',
  },

  pdfBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  pdfText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
