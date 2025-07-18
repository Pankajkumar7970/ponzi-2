import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const PonziEducation = () => {
  const warningFlags = [
    'Guaranteed high returns with little or no risk',
    'Focus on recruiting others instead of real products/services',
    'No clear info about how the business earns money',
    'Pressure to act fast ("limited slots", "urgent")',
    'No registered business or regulatory license',
  ];

  const dangers = [
    {icon: '💸', text: 'You will likely lose your money when it collapses'},
    {icon: '🧑‍⚖️', text: "It's illegal – you can be held responsible"},
    {icon: '👥', text: 'You might unknowingly scam your friends and family'},
    {icon: '💔', text: 'It destroys trust and damages lives'},
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <LinearGradient colors={['#f8fafc', '#e2e8f0']} style={styles.hero}>
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>⚠️ Financial Security Alert</Text>
          </View>
          <Text style={styles.heroTitle}>What is a Ponzi Scheme?</Text>
          <Text style={styles.heroSubtitle}>
            A Ponzi scheme is a fake investment plan where money from new investors is used
            to pay returns to earlier investors — not from actual profits, but from
            deception.
          </Text>

          <View style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <Text style={styles.exampleIcon}>🔗</Text>
              <View>
                <Text style={styles.exampleTitle}>Typical Example</Text>
                <Text style={styles.exampleSubtitle}>How these schemes lure victims</Text>
              </View>
            </View>
            <View style={styles.exampleQuote}>
              <Text style={styles.exampleQuoteText}>
                "Invest ₹10,000 and get ₹20,000 in 30 days. Bring 2 friends and earn 5%
                commission!"
              </Text>
            </View>
            <Text style={styles.exampleWarning}>🎯 That's not investing. That's a trap.</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Warning Signs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ How to Spot a Ponzi Scheme</Text>
            <Text style={styles.sectionSubtitle}>
              Recognize these red flags before it's too late
            </Text>

            {warningFlags.map((flag, index) => (
              <View key={index} style={styles.warningCard}>
                <Text style={styles.warningIcon}>🚩</Text>
                <Text style={styles.warningText}>{flag}</Text>
              </View>
            ))}
          </View>

          {/* Dangers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💥 Why You Should Avoid Ponzi Schemes</Text>
            <Text style={styles.sectionSubtitle}>
              The devastating consequences of getting involved
            </Text>

            {dangers.map((danger, index) => (
              <View key={index} style={styles.dangerCard}>
                <Text style={styles.dangerIcon}>{danger.icon}</Text>
                <Text style={styles.dangerText}>{danger.text}</Text>
              </View>
            ))}
          </View>

          {/* Safe Alternatives */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ What to Do Instead</Text>
            <Text style={styles.sectionSubtitle}>
              Safe and legitimate ways to grow your wealth
            </Text>

            {safeAlternatives.map((alternative, index) => (
              <View key={index} style={styles.alternativeCard}>
                <Text style={styles.alternativeIcon}>
                  {index === 0 && '📈'}
                  {index === 1 && '📚'}
                  {index === 2 && '👥'}
                  {index === 3 && '🛡️'}
                </Text>
                <Text style={styles.alternativeText}>{alternative}</Text>
              </View>
            ))}
          </View>

          {/* Call to Action */}
          <LinearGradient colors={['#dbeafe', '#dcfce7']} style={styles.ctaSection}>
            <View style={styles.ctaIcons}>
              <Text style={styles.ctaIcon}>🛡️</Text>
              <Text style={styles.ctaIcon}>📢</Text>
              <Text style={styles.ctaIcon}>🚫</Text>
            </View>
            <Text style={styles.ctaTitle}>
              Protect yourself. Spread awareness. Say no to scams.
            </Text>
            <Text style={styles.ctaSubtitle}>
              Real growth takes time and honesty. Choose legitimate investments and help
              others avoid these traps.
            </Text>

            <View style={styles.ctaButtons}>
              <TouchableOpacity style={styles.primaryCtaButton}>
                <Text style={styles.primaryCtaButtonText}>
                  Learn More About Safe Investing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCtaButton} onPress={openSEBI}>
                <Text style={styles.secondaryCtaButtonText}>Report to SEBI 🔗</Text>
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
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    padding: 20,
    alignItems: 'center',
  },
  alertBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fbbf24',
    marginBottom: 16,
  },
  alertBadgeText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 26,
  },
  exampleCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
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
    color: '#1f2937',
  },
  exampleSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  exampleQuote: {
    backgroundColor: '#fecaca',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f87171',
    marginBottom: 12,
  },
  exampleQuoteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  exampleWarning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
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
    color: '#1f2937',
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  dangerCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
    lineHeight: 22,
  },
  alternativeCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  alternativeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  alternativeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
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
    color: '#1f2937',
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButtons: {
    width: '100%',
  },
  primaryCtaButton: {
    backgroundColor: '#2563eb',
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
    borderColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  secondaryCtaButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PonziEducation;