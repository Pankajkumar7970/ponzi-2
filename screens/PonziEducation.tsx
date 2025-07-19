import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

const PonziEducation = () => {
  const { theme } = useTheme();
  const warningFlags = [
    'Guaranteed high returns with little or no risk',
    'Focus on recruiting others instead of real products/services',
    'No clear info about how the business earns money',
    'Pressure to act fast ("limited slots", "urgent")',
    'No registered business or regulatory license',
  ];

  const dangers = [
    { icon: '💸', text: 'You will likely lose your money when it collapses' },
    { icon: '🧑‍⚖️', text: "It's illegal – you can be held responsible" },
    { icon: '👥', text: 'You might unknowingly scam your friends and family' },
    { icon: '💔', text: 'It destroys trust and damages lives' },
  ];

  const safeAlternatives = [
    'Invest in legal, regulated platforms (mutual funds, SIPs, etc.)',
    'Learn financial literacy',
    'Use trusted financial apps and advisors',
    'Report suspicious schemes to SEBI or your local cybercrime cell',
  ];

  const openSEBI = () => {
    Linking.openURL('https://www.sebi.gov.in');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <LinearGradient colors={[theme.colors.background, theme.colors.card]} style={styles.hero}>
          <View style={[styles.alertBadge, { backgroundColor: theme.colors.warning, borderColor: theme.colors.warning }]}>
            <Text style={[styles.alertBadgeText, { color: theme.colors.text }]}>⚠️ Financial Security Alert</Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>What is a Ponzi Scheme?</Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
            A Ponzi scheme is a fake investment plan where money from new investors is used
            to pay returns to earlier investors — not from actual profits, but from
            deception.
          </Text>

          <View style={[styles.exampleCard, { backgroundColor: theme.colors.loss, borderColor: theme.colors.error }]}>
            <View style={styles.exampleHeader}>
              <Text style={styles.exampleIcon}>🔗</Text>
              <View>
                <Text style={[styles.exampleTitle, { color: theme.colors.text }]}>Typical Example</Text>
                <Text style={[styles.exampleSubtitle, { color: theme.colors.textSecondary }]}>How these schemes lure victims</Text>
              </View>
            </View>
            <View style={[styles.exampleQuote, { backgroundColor: theme.colors.error, borderColor: theme.colors.error }]}>
              <Text style={[styles.exampleQuoteText, { color: 'white' }]}>
                "Invest ₹10,000 and get ₹20,000 in 30 days. Bring 2 friends and earn 5%
                commission!"
              </Text>
            </View>
            <Text style={[styles.exampleWarning, { color: theme.colors.error }]}>🎯 That's not investing. That's a trap.</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Warning Signs */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>⚠️ How to Spot a Ponzi Scheme</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
              Recognize these red flags before it's too late
            </Text>

            {warningFlags.map((flag, index) => (
              <View key={index} style={[styles.warningCard, { backgroundColor: theme.colors.warning, borderColor: theme.colors.warning }]}>
                <Text style={styles.warningIcon}>🚩</Text>
                <Text style={[styles.warningText, { color: theme.colors.text }]}>{flag}</Text>
              </View>
            ))}
          </View>

          {/* Dangers */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>💥 Why You Should Avoid Ponzi Schemes</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
              The devastating consequences of getting involved
            </Text>

            {dangers.map((danger, index) => (
              <View key={index} style={[styles.dangerCard, { backgroundColor: theme.colors.loss, borderColor: theme.colors.error }]}>
                <Text style={styles.dangerIcon}>{danger.icon}</Text>
                <Text style={[styles.dangerText, { color: theme.colors.text }]}>{danger.text}</Text>
              </View>
            ))}
          </View>

          {/* Safe Alternatives */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>✅ What to Do Instead</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
              Safe and legitimate ways to grow your wealth
            </Text>

            {safeAlternatives.map((alternative, index) => (
              <View key={index} style={[styles.alternativeCard, { backgroundColor: theme.colors.profit, borderColor: theme.colors.success }]}>
                <Text style={styles.alternativeIcon}>
                  {index === 0 && '📈'}
                  {index === 1 && '📚'}
                  {index === 2 && '👥'}
                  {index === 3 && '🛡️'}
                </Text>
                <Text style={[styles.alternativeText, { color: theme.colors.text }]}>{alternative}</Text>
              </View>
            ))}
          </View>

          {/* Call to Action */}
          <LinearGradient colors={[theme.colors.card, theme.colors.profit]} style={styles.ctaSection}>
            <View style={styles.ctaIcons}>
              <Text style={styles.ctaIcon}>🛡️</Text>
              <Text style={styles.ctaIcon}>📢</Text>
              <Text style={styles.ctaIcon}>🚫</Text>
            </View>
            <Text style={[styles.ctaTitle, { color: theme.colors.text }]}>
              Protect yourself. Spread awareness. Say no to scams.
            </Text>
            <Text style={[styles.ctaSubtitle, { color: theme.colors.textSecondary }]}>
              Real growth takes time and honesty. Choose legitimate investments and help
              others avoid these traps.
            </Text>

            <View style={styles.ctaButtons}>
              <TouchableOpacity style={[styles.primaryCtaButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.primaryCtaButtonText}>
                  Learn More About Safe Investing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryCtaButton, { borderColor: theme.colors.success }]} onPress={openSEBI}>
                <Text style={[styles.secondaryCtaButtonText, { color: theme.colors.success }]}>Report to SEBI 🔗</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    padding: 20,
    alignItems: 'center',
  },
  alertBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  exampleCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    width: '100%',
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exampleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exampleSubtitle: {
    fontSize: 12,
  },
  exampleQuote: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  exampleQuoteText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exampleWarning: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  warningCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  dangerCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  dangerIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  alternativeCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  alternativeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  alternativeText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  ctaSection: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaIcons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ctaIcon: {
    fontSize: 32,
    marginHorizontal: 8,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButtons: {
    width: '100%',
  },
  primaryCtaButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryCtaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryCtaButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  secondaryCtaButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PonziEducation;