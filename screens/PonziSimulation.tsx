import React, { useState, useEffect, useCallback } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface Investor {
  id: number;
  name: string;
  investment: number;
  recruits: number[];
  totalEarned: number;
  netProfit: number;
  joinedRound: number;
  level: number;
  status: 'profit' | 'loss' | 'break-even';
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

const { width } = Dimensions.get('window');

const PonziSimulation = ({ navigation }: any) => {
  const { theme } = useTheme();
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
        status: 'loss',
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

  const updateInvestorStatus = (investor: Investor): Investor => {
    let status: 'profit' | 'loss' | 'break-even' = 'loss';
    if (investor.netProfit > 0) status = 'profit';
    else if (investor.netProfit === 0) status = 'break-even';
    return { ...investor, status };
  };

  const renderInvestorTree = () => {
    const rounds = Math.max(1, simulation.currentRound + 1);
    const investorsPerRound: { [key: number]: Investor[] } = {};
    
    simulation.investors.forEach(investor => {
      const round = investor.joinedRound;
      if (!investorsPerRound[round]) investorsPerRound[round] = [];
      investorsPerRound[round].push(updateInvestorStatus(investor));
    });

    return (
      <View style={styles.treeContainer}>
        <Text style={styles.treeTitle}>Investor Flow Chart</Text>
        <Text style={styles.treeSubtitle}>How money flows from new to old investors</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.treeScroll}>
          <View style={styles.treeContent}>
            {Array.from({ length: rounds }, (_, roundIndex) => {
              const roundInvestors = investorsPerRound[roundIndex] || [];
              return (
                <View key={roundIndex} style={styles.roundColumn}>
                  <Text style={styles.roundLabel}>
                    {roundIndex === 0 ? 'Start' : `Round ${roundIndex}`}
                  </Text>
                  
                  {roundInvestors.map((investor, index) => (
                    <View key={investor.id} style={styles.investorNodeContainer}>
                      <View style={[
                        styles.investorNode,
                        investor.status === 'profit' && { backgroundColor: theme.colors.profit, borderColor: theme.colors.success },
                        investor.status === 'loss' && { backgroundColor: theme.colors.loss, borderColor: theme.colors.error },
                        investor.status === 'break-even' && { backgroundColor: theme.colors.breakEven, borderColor: theme.colors.warning },
                        simulation.isCollapsed && styles.collapsedNode,
                        { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
                      ]}>
                        <Text style={[styles.investorNodeText, { color: theme.colors.text }]}>
                          {investor.id === 1 ? 'YOU' : `#${investor.id}`}
                        </Text>
                        <Text style={[styles.investorAmount, { color: theme.colors.textSecondary }]}>
                          ₹{investor.investment}
                        </Text>
                        <Text style={[
                          styles.investorProfit,
                          investor.netProfit >= 0 ? { color: theme.colors.success } : { color: theme.colors.error }
                        ]}>
                          {investor.netProfit >= 0 ? '+' : ''}₹{investor.netProfit}
                        </Text>
                      </View>
                      
                      {/* Arrow to next round */}
                      {roundIndex < rounds - 1 && (
                        <View style={styles.arrowContainer}>
                          <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>→</Text>
                        </View>
                      )}
                    </View>
                  ))}
                  
                  {/* Money flow indicator */}
                  {roundIndex > 0 && (
                    <View style={styles.moneyFlow}>
                      <Text style={[styles.moneyFlowText, { color: theme.colors.primary }]}>
                        💰 Pays earlier investors
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
        
        <View style={styles.treeLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.profit, borderColor: theme.colors.success }]} />
            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Making Profit</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.loss, borderColor: theme.colors.error }]} />
            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Lost Money</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.breakEven, borderColor: theme.colors.warning }]} />
            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Break Even</Text>
          </View>
        </View>
      </View>
    );
  };
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
            status: 'loss',
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
        setSimulation(prev => ({ ...prev, isCollapsed: true }));
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
          status: 'loss',
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
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LinearGradient colors={[theme.colors.gradientStart, theme.colors.gradientEnd]} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.startCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.title, { color: theme.colors.text }]}>Start Your "Investment Opportunity"</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Watch how a Ponzi scheme grows rapidly, pays early investors, then inevitably
                collapses
              </Text>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Investment Amount (₹)</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: theme.colors.border, 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text
                  }]}
                  value={investmentAmount}
                  onChangeText={setInvestmentAmount}
                  keyboardType="numeric"
                  placeholder="500"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setGameStarted(true)}>
                <Text style={styles.startButtonText}>Launch the "Opportunity" 🚀</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.educationButton, { backgroundColor: theme.colors.success }]}
                onPress={() => navigation.navigate('PonziEducation')}>
                <Text style={styles.educationButtonText}>Learn About Ponzi Schemes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.educationButton, { backgroundColor: '#7c3aed', marginTop: 12 }]}
                onPress={() => navigation.navigate('PyramidSimulation')}>
                <Text style={styles.educationButtonText}>Try Pyramid/MLM Simulator</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient colors={[theme.colors.background, theme.colors.card]} style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Ponzi Scheme Simulator</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Educational Simulation</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Visual Tree Structure */}
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            {renderInvestorTree()}
          </View>

          {/* Controls */}
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Scheme Controls</Text>
            {!simulation.isCollapsed && (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.success }]}
                  onPress={() => addInvestors(1)}>
                  <Text style={styles.buttonText}>
                    Add 1 Investor (₹{investmentAmount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.success }]}
                  onPress={() => addInvestors(3)}>
                  <Text style={styles.buttonText}>Add 3 Investors</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: autoRunning ? theme.colors.error : theme.colors.primary },
                  ]}
                  onPress={() => setAutoRunning(!autoRunning)}>
                  <Text style={styles.buttonText}>
                    {autoRunning ? 'Stop Auto-Run' : 'Start Auto-Run'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border }]}
              onPress={resetSimulation}>
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                Reset Simulation
              </Text>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Round:</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{simulation.currentRound}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Investors:</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{simulation.investors.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Status:</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: simulation.isCollapsed ? theme.colors.error : theme.colors.success },
                  ]}>
                  {simulation.isCollapsed ? 'COLLAPSED' : 'Running'}
                </Text>
              </View>
            </View>
          </View>

          {/* Metrics */}
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Financial Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: theme.colors.profit }]}>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  ₹{simulation.totalInvested.toLocaleString()}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Total Invested</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  ₹{simulation.totalPaidOut.toLocaleString()}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Total Paid Out</Text>
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.colors.loss }]}>
              <Text style={[styles.deficitValue, { color: theme.colors.error }]}>₹{deficit.toLocaleString()}</Text>
              <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Money Still Owed</Text>
              <Text style={[styles.deficitPercent, { color: theme.colors.error }]}>
                {((deficit / simulation.totalInvested) * 100).toFixed(1)}% of investments
                unpaid
              </Text>
            </View>

            <View style={styles.peopleGrid}>
              <View style={[styles.peopleCard, { backgroundColor: theme.colors.profit }]}>
                <Text style={[styles.peopleValue, { color: theme.colors.text }]}>{peopleInProfit}</Text>
                <Text style={[styles.peopleLabel, { color: theme.colors.textSecondary }]}>In Profit</Text>
              </View>
              <View style={[styles.peopleCard, { backgroundColor: theme.colors.loss }]}>
                <Text style={[styles.peopleValue, { color: theme.colors.text }]}>{peopleInLoss}</Text>
                <Text style={[styles.peopleLabel, { color: theme.colors.textSecondary }]}>Lost Money</Text>
              </View>
            </View>
          </View>

          {/* Collapse Alert */}
          {simulation.isCollapsed && (
            <View style={[styles.alertCard, { backgroundColor: theme.colors.loss, borderColor: theme.colors.error }]}>
              <Text style={[styles.alertTitle, { color: theme.colors.error }]}>THE SCHEME HAS COLLAPSED!</Text>
              <Text style={[styles.alertText, { color: theme.colors.error }]}>• New investors stopped joining</Text>
              <Text style={[styles.alertText, { color: theme.colors.error }]}>• No money left to pay existing investors</Text>
              <Text style={[styles.alertText, { color: theme.colors.error }]}>• {peopleInLoss} people lost their money</Text>
              <Text style={[styles.alertText, { color: theme.colors.error }]}>• Only {peopleInProfit} early investors made profit</Text>
              <Text style={[styles.alertText, { color: theme.colors.error }]}>
                • ₹{deficit.toLocaleString()} in losses cannot be recovered
              </Text>
            </View>
          )}

          {/* Educational Section */}
          <View style={[styles.educationalCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.educationalTitle, { color: theme.colors.text }]}>What This Simulation Shows</Text>
            <View style={[styles.lessonCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>📈 Unsustainable Growth</Text>
              <Text style={[styles.lessonText, { color: theme.colors.textSecondary }]}>
                Ponzi schemes require exponential growth. Each round needs more investors than
                the last.
              </Text>
            </View>
            <View style={[styles.lessonCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>👥 Most People Lose</Text>
              <Text style={[styles.lessonText, { color: theme.colors.textSecondary }]}>
                Only early investors profit. The majority of participants lose their money.
              </Text>
            </View>
            <View style={[styles.lessonCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>⚡ Inevitable Collapse</Text>
              <Text style={[styles.lessonText, { color: theme.colors.textSecondary }]}>
                All Ponzi schemes eventually collapse when new investors stop joining.
              </Text>
            </View>

            <View style={[styles.keyLessons, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.keyLessonsTitle, { color: theme.colors.text }]}>Key Lessons:</Text>
              <Text style={[styles.keyLessonText, { color: theme.colors.textSecondary }]}>
                • Promises of guaranteed high returns are red flags
              </Text>
              <Text style={[styles.keyLessonText, { color: theme.colors.textSecondary }]}>
                • Legitimate investments create value, not just move money around
              </Text>
              <Text style={[styles.keyLessonText, { color: theme.colors.textSecondary }]}>
                • If it sounds too good to be true, it probably is
              </Text>
              <Text style={[styles.keyLessonText, { color: theme.colors.textSecondary }]}>
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
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  startButton: {
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  treeContainer: {
    marginBottom: 16,
  },
  treeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  treeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  treeScroll: {
    marginBottom: 16,
  },
  treeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  roundColumn: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 100,
  },
  roundLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  investorNodeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  investorNode: {
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
  },
  collapsedNode: {
    opacity: 0.6,
    borderStyle: 'dashed',
  },
  investorNodeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  investorAmount: {
    fontSize: 9,
  },
  investorProfit: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  arrowContainer: {
    marginTop: 4,
  },
  arrow: {
    fontSize: 16,
  },
  moneyFlow: {
    marginTop: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 4,
    padding: 4,
  },
  moneyFlowText: {
    fontSize: 8,
    textAlign: 'center',
  },
  treeLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 10,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
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
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  deficitValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deficitPercent: {
    fontSize: 12,
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
  },
  peopleLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  alertText: {
    fontSize: 14,
    marginBottom: 4,
  },
  educationalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  educationalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  lessonCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lessonText: {
    fontSize: 14,
    lineHeight: 20,
  },
  keyLessons: {
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  keyLessonsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  keyLessonText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default PonziSimulation;