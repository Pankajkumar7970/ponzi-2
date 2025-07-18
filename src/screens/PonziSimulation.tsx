import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface Investor {
  id: number;
  name: string;
  investment: number;
  recruits: number[];
  totalEarned: number;
  netProfit: number;
  joinedRound: number;
  level: number;
}

interface SimulationState {
  investors: Investor[];
  totalInvested: number;
  totalPaidOut: number;
  currentRound: number;
  isCollapsed: boolean;
  newInvestorsPerRound: number;
  payoutRate: number;
}

const {width} = Dimensions.get('window');

const PonziSimulation = ({navigation}: any) => {
  const [simulation, setSimulation] = useState<SimulationState>({
    investors: [
      {
        id: 1,
        name: 'Founder (You)',
        investment: 1000,
        recruits: [],
        totalEarned: 0,
        netProfit: -1000,
        joinedRound: 0,
        level: 0,
      },
    ],
    totalInvested: 1000,
    totalPaidOut: 0,
    currentRound: 0,
    isCollapsed: false,
    newInvestorsPerRound: 2,
    payoutRate: 0.2,
  });

  const [investmentAmount, setInvestmentAmount] = useState('500');
  const [autoRunning, setAutoRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const addInvestors = useCallback(
    (count: number) => {
      if (simulation.isCollapsed) return;

      setSimulation(prev => {
        const newInvestors: Investor[] = [];
        const currentLevel = Math.floor(Math.log2(prev.investors.length + count)) + 1;

        for (let i = 0; i < count; i++) {
          const newInvestor: Investor = {
            id: prev.investors.length + i + 1,
            name: `Investor ${prev.investors.length + i + 1}`,
            investment: parseInt(investmentAmount),
            recruits: [],
            totalEarned: 0,
            netProfit: -parseInt(investmentAmount),
            joinedRound: prev.currentRound + 1,
            level: currentLevel,
          };
          newInvestors.push(newInvestor);
        }

        const totalNewMoney = count * parseInt(investmentAmount);
        const availableForPayouts = totalNewMoney * 0.8;

        const updatedInvestors = [...prev.investors];
        let remainingPayout = availableForPayouts;

        for (let i = 0; i < updatedInvestors.length && remainingPayout > 0; i++) {
          const payout = Math.min(
            remainingPayout,
            updatedInvestors[i].investment * prev.payoutRate,
          );
          updatedInvestors[i].totalEarned += payout;
          updatedInvestors[i].netProfit += payout;
          remainingPayout -= payout;
        }

        return {
          ...prev,
          investors: [...updatedInvestors, ...newInvestors],
          totalInvested: prev.totalInvested + totalNewMoney,
          totalPaidOut: prev.totalPaidOut + (availableForPayouts - remainingPayout),
          currentRound: prev.currentRound + 1,
        };
      });
    },
    [investmentAmount, simulation.isCollapsed],
  );

  useEffect(() => {
    const checkCollapse = () => {
      const recentInvestors = simulation.investors.filter(
        inv => inv.joinedRound >= simulation.currentRound - 2,
      ).length;

      const growthRate = recentInvestors / Math.max(1, simulation.investors.length * 0.3);

      if (simulation.currentRound > 5 && (growthRate < 0.1 || Math.random() < 0.15)) {
        setSimulation(prev => ({...prev, isCollapsed: true}));
        setAutoRunning(false);
        Alert.alert(
          'SCHEME COLLAPSED!',
          `The Ponzi scheme has collapsed! ${
            simulation.investors.filter(inv => inv.netProfit < 0).length
          } people lost their money.`,
        );
      }
    };

    if (simulation.currentRound > 3 && !simulation.isCollapsed) {
      checkCollapse();
    }
  }, [simulation.currentRound, simulation.investors.length, simulation.isCollapsed]);

  useEffect(() => {
    if (autoRunning && !simulation.isCollapsed) {
      const interval = setInterval(() => {
        const newCount = Math.max(
          1,
          Math.floor(Math.random() * simulation.newInvestorsPerRound) + 1,
        );
        addInvestors(newCount);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [autoRunning, simulation.isCollapsed, addInvestors, simulation.newInvestorsPerRound]);

  const resetSimulation = () => {
    setSimulation({
      investors: [
        {
          id: 1,
          name: 'Founder (You)',
          investment: 1000,
          recruits: [],
          totalEarned: 0,
          netProfit: -1000,
          joinedRound: 0,
          level: 0,
        },
      ],
      totalInvested: 1000,
      totalPaidOut: 0,
      currentRound: 0,
      isCollapsed: false,
      newInvestorsPerRound: 2,
      payoutRate: 0.2,
    });
    setAutoRunning(false);
    setGameStarted(false);
  };

  const deficit = simulation.totalInvested - simulation.totalPaidOut;
  const peopleInProfit = simulation.investors.filter(inv => inv.netProfit > 0).length;
  const peopleInLoss = simulation.investors.filter(inv => inv.netProfit < 0).length;

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#2563eb', '#10b981']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.startCard}>
              <Text style={styles.title}>Start Your "Investment Opportunity"</Text>
              <Text style={styles.subtitle}>
                Watch how a Ponzi scheme grows rapidly, pays early investors, then inevitably
                collapses
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Investment Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={investmentAmount}
                  onChangeText={setInvestmentAmount}
                  keyboardType="numeric"
                  placeholder="500"
                />
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setGameStarted(true)}>
                <Text style={styles.startButtonText}>Launch the "Opportunity" 🚀</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.educationButton}
                onPress={() => navigation.navigate('PonziEducation')}>
                <Text style={styles.educationButtonText}>Learn About Ponzi Schemes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient colors={['#f8fafc', '#e2e8f0']} style={styles.header}>
          <Text style={styles.headerTitle}>Ponzi Scheme Simulator</Text>
          <Text style={styles.headerSubtitle}>Educational Simulation</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Controls */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Scheme Controls</Text>
            {!simulation.isCollapsed && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={() => addInvestors(1)}>
                  <Text style={styles.buttonText}>
                    Add 1 Investor (₹{investmentAmount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={() => addInvestors(3)}>
                  <Text style={styles.buttonText}>Add 3 Investors</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    autoRunning ? styles.destructiveButton : styles.primaryButton,
                  ]}
                  onPress={() => setAutoRunning(!autoRunning)}>
                  <Text style={styles.buttonText}>
                    {autoRunning ? 'Stop Auto-Run' : 'Start Auto-Run'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={resetSimulation}>
              <Text style={[styles.buttonText, styles.outlineButtonText]}>
                Reset Simulation
              </Text>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Round:</Text>
                <Text style={styles.statValue}>{simulation.currentRound}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Investors:</Text>
                <Text style={styles.statValue}>{simulation.investors.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Status:</Text>
                <Text
                  style={[
                    styles.statValue,
                    simulation.isCollapsed ? styles.collapsed : styles.running,
                  ]}>
                  {simulation.isCollapsed ? 'COLLAPSED' : 'Running'}
                </Text>
              </View>
            </View>
          </View>

          {/* Metrics */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Financial Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, styles.successMetric]}>
                <Text style={styles.metricValue}>
                  ₹{simulation.totalInvested.toLocaleString()}
                </Text>
                <Text style={styles.metricLabel}>Total Invested</Text>
              </View>
              <View style={[styles.metricCard, styles.primaryMetric]}>
                <Text style={styles.metricValue}>
                  ₹{simulation.totalPaidOut.toLocaleString()}
                </Text>
                <Text style={styles.metricLabel}>Total Paid Out</Text>
              </View>
            </View>

            <View style={[styles.metricCard, styles.destructiveMetric]}>
              <Text style={styles.deficitValue}>₹{deficit.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Money Still Owed</Text>
              <Text style={styles.deficitPercent}>
                {((deficit / simulation.totalInvested) * 100).toFixed(1)}% of investments
                unpaid
              </Text>
            </View>

            <View style={styles.peopleGrid}>
              <View style={[styles.peopleCard, styles.successMetric]}>
                <Text style={styles.peopleValue}>{peopleInProfit}</Text>
                <Text style={styles.peopleLabel}>In Profit</Text>
              </View>
              <View style={[styles.peopleCard, styles.destructiveMetric]}>
                <Text style={styles.peopleValue}>{peopleInLoss}</Text>
                <Text style={styles.peopleLabel}>Lost Money</Text>
              </View>
            </View>
          </View>

          {/* Collapse Alert */}
          {simulation.isCollapsed && (
            <View style={styles.alertCard}>
              <Text style={styles.alertTitle}>THE SCHEME HAS COLLAPSED!</Text>
              <Text style={styles.alertText}>• New investors stopped joining</Text>
              <Text style={styles.alertText}>• No money left to pay existing investors</Text>
              <Text style={styles.alertText}>• {peopleInLoss} people lost their money</Text>
              <Text style={styles.alertText}>• Only {peopleInProfit} early investors made profit</Text>
              <Text style={styles.alertText}>
                • ₹{deficit.toLocaleString()} in losses cannot be recovered
              </Text>
            </View>
          )}

          {/* Educational Section */}
          <View style={styles.educationalCard}>
            <Text style={styles.educationalTitle}>What This Simulation Shows</Text>
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>📈 Unsustainable Growth</Text>
              <Text style={styles.lessonText}>
                Ponzi schemes require exponential growth. Each round needs more investors than
                the last.
              </Text>
            </View>
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>👥 Most People Lose</Text>
              <Text style={styles.lessonText}>
                Only early investors profit. The majority of participants lose their money.
              </Text>
            </View>
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>⚡ Inevitable Collapse</Text>
              <Text style={styles.lessonText}>
                All Ponzi schemes eventually collapse when new investors stop joining.
              </Text>
            </View>

            <View style={styles.keyLessons}>
              <Text style={styles.keyLessonsTitle}>Key Lessons:</Text>
              <Text style={styles.keyLessonText}>
                • Promises of guaranteed high returns are red flags
              </Text>
              <Text style={styles.keyLessonText}>
                • Legitimate investments create value, not just move money around
              </Text>
              <Text style={styles.keyLessonText}>
                • If it sounds too good to be true, it probably is
              </Text>
              <Text style={styles.keyLessonText}>
                • Real wealth building takes time and carries appropriate risk
              </Text>
            </View>
          </View>
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
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  startCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  startButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  educationButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  educationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  successButton: {
    backgroundColor: '#10b981',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  destructiveButton: {
    backgroundColor: '#dc2626',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#374151',
  },
  statsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  collapsed: {
    color: '#dc2626',
  },
  running: {
    color: '#10b981',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  successMetric: {
    backgroundColor: '#dcfce7',
  },
  primaryMetric: {
    backgroundColor: '#dbeafe',
  },
  destructiveMetric: {
    backgroundColor: '#fee2e2',
    marginHorizontal: 0,
    marginBottom: 16,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  deficitValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  deficitPercent: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  peopleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  peopleCard: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  peopleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  peopleLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  alertCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
  },
  alertText: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 4,
  },
  educationalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  educationalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  lessonCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  lessonText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  keyLessons: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  keyLessonsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  keyLessonText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default PonziSimulation;