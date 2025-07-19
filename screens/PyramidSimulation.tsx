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

interface PyramidMember {
  id: number;
  name: string;
  level: number;
  recruiter: number | null;
  recruits: number[];
  investment: number;
  totalEarned: number;
  netProfit: number;
  joinedRound: number;
  isActive: boolean;
  status: 'profit' | 'loss' | 'break-even';
}

interface PyramidState {
  members: PyramidMember[];
  totalInvested: number;
  totalPaidOut: number;
  currentRound: number;
  isCollapsed: boolean;
  membershipFee: number;
  commissionRate: number;
  levelsDeep: number;
}

const { width } = Dimensions.get('window');

const PyramidSimulation = ({ navigation }: any) => {
  const [simulation, setSimulation] = useState<PyramidState>({
    members: [
      {
        id: 1,
        name: 'Founder (You)',
        level: 0,
        recruiter: null,
        recruits: [],
        investment: 500,
        totalEarned: 0,
        netProfit: -500,
        joinedRound: 0,
        isActive: true,
        status: 'loss',
      },
    ],
    totalInvested: 500,
    totalPaidOut: 0,
    currentRound: 0,
    isCollapsed: false,
    membershipFee: 500,
    commissionRate: 0.3,
    levelsDeep: 3,
  });

  const [membershipFee, setMembershipFee] = useState('500');
  const [autoRunning, setAutoRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const updateMemberStatus = (member: PyramidMember): PyramidMember => {
    let status: 'profit' | 'loss' | 'break-even' = 'loss';
    if (member.netProfit > 0) status = 'profit';
    else if (member.netProfit === 0) status = 'break-even';
    return { ...member, status };
  };

  const renderPyramidTree = () => {
    const maxLevel = Math.max(...simulation.members.map(m => m.level));
    const membersByLevel: { [key: number]: PyramidMember[] } = {};
    
    simulation.members.forEach(member => {
      const level = member.level;
      if (!membersByLevel[level]) membersByLevel[level] = [];
      membersByLevel[level].push(updateMemberStatus(member));
    });

    const renderMemberNode = (member: PyramidMember, isCollapsed: boolean) => (
      <View key={member.id} style={styles.memberNodeContainer}>
        <View style={[
          styles.memberNode,
          member.status === 'profit' && styles.profitNode,
          member.status === 'loss' && styles.lossNode,
          member.status === 'break-even' && styles.breakEvenNode,
          isCollapsed && styles.collapsedNode,
        ]}>
          <Text style={styles.memberNodeText}>
            {member.id === 1 ? 'YOU' : `#${member.id}`}
          </Text>
          <Text style={styles.memberAmount}>₹{member.investment}</Text>
          <Text style={[
            styles.memberProfit,
            member.netProfit >= 0 ? styles.profitText : styles.lossText
          ]}>
            {member.netProfit >= 0 ? '+' : ''}₹{member.netProfit}
          </Text>
          <Text style={styles.memberRecruits}>
            👥 {member.recruits.length}
          </Text>
        </View>
        
        {/* Connection lines to recruits */}
        {member.recruits.length > 0 && (
          <View style={styles.connectionLine} />
        )}
      </View>
    );

    return (
      <View style={styles.pyramidContainer}>
        <Text style={styles.pyramidTitle}>Pyramid Structure</Text>
        <Text style={styles.pyramidSubtitle}>How recruitment creates the pyramid</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pyramidScroll}>
          <View style={styles.pyramidContent}>
            {Array.from({ length: maxLevel + 1 }, (_, levelIndex) => {
              const levelMembers = membersByLevel[levelIndex] || [];
              const membersPerRow = Math.ceil(Math.sqrt(levelMembers.length));
              
              return (
                <View key={levelIndex} style={styles.pyramidLevel}>
                  <Text style={styles.levelLabel}>
                    Level {levelIndex} {levelIndex === 0 ? '(Top)' : ''}
                  </Text>
                  
                  <View style={styles.levelMembersContainer}>
                    {levelMembers.map(member => 
                      renderMemberNode(member, simulation.isCollapsed)
                    )}
                  </View>
                  
                  {/* Commission flow indicator */}
                  {levelIndex > 0 && (
                    <View style={styles.commissionFlow}>
                      <Text style={styles.commissionFlowText}>
                        💰 Pays commissions upward
                      </Text>
                    </View>
                  )}
                  
                  {/* Arrow to next level */}
                  {levelIndex < maxLevel && (
                    <View style={styles.levelArrow}>
                      <Text style={styles.arrowDown}>↓</Text>
                      <Text style={styles.arrowText}>Recruits</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
        
        <View style={styles.pyramidLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.profitNode]} />
            <Text style={styles.legendText}>Making Money</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.lossNode]} />
            <Text style={styles.legendText}>Lost Money</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.breakEvenNode]} />
            <Text style={styles.legendText}>Break Even</Text>
          </View>
        </View>
        
        {simulation.isCollapsed && (
          <View style={styles.collapseIndicator}>
            <Text style={styles.collapseText}>💥 PYRAMID COLLAPSED</Text>
            <Text style={styles.collapseSubtext}>No new recruits joining</Text>
          </View>
        )}
      </View>
    );
  };

  const calculateCommissions = useCallback((newMemberId: number, fee: number) => {
    const newMember = simulation.members.find(m => m.id === newMemberId);
    if (!newMember || !newMember.recruiter) return [];

    const commissions: { memberId: number; amount: number; level: number }[] = [];
    let currentRecruiterId = newMember.recruiter;
    let level = 1;

    while (currentRecruiterId && level <= simulation.levelsDeep) {
      const recruiter = simulation.members.find(m => m.id === currentRecruiterId);
      if (!recruiter || !recruiter.isActive) break;

      const commissionAmount = fee * simulation.commissionRate * (1 / level); // Decreasing commission per level
      commissions.push({
        memberId: currentRecruiterId,
        amount: commissionAmount,
        level: level,
      });

      currentRecruiterId = recruiter.recruiter;
      level++;
    }

    return commissions;
  }, [simulation.members, simulation.levelsDeep, simulation.commissionRate]);

  const addMembers = useCallback((count: number) => {
    if (simulation.isCollapsed) return;

    setSimulation(prev => {
      const newMembers: PyramidMember[] = [];
      const updatedMembers = [...prev.members];
      let totalCommissionsPaid = 0;

      // Find potential recruiters (active members)
      const activeMembers = updatedMembers.filter(m => m.isActive);
      
      for (let i = 0; i < count; i++) {
        // Randomly assign to an active member as recruiter
        const recruiterIndex = Math.floor(Math.random() * activeMembers.length);
        const recruiter = activeMembers[recruiterIndex];

        const newMember: PyramidMember = {
          id: prev.members.length + i + 1,
          name: `Member ${prev.members.length + i + 1}`,
          level: recruiter.level + 1,
          recruiter: recruiter.id,
          recruits: [],
          investment: parseInt(membershipFee),
          totalEarned: 0,
          netProfit: -parseInt(membershipFee),
          joinedRound: prev.currentRound + 1,
          isActive: true,
          status: 'loss',
        };

        newMembers.push(newMember);

        // Add to recruiter's recruits list
        const recruiterInUpdated = updatedMembers.find(m => m.id === recruiter.id);
        if (recruiterInUpdated) {
          recruiterInUpdated.recruits.push(newMember.id);
        }

        // Calculate and distribute commissions
        const commissions = calculateCommissions(newMember.id, parseInt(membershipFee));
        commissions.forEach(commission => {
          const member = updatedMembers.find(m => m.id === commission.memberId);
          if (member) {
            member.totalEarned += commission.amount;
            member.netProfit += commission.amount;
            totalCommissionsPaid += commission.amount;
          }
        });
      }

      return {
        ...prev,
        members: [...updatedMembers, ...newMembers],
        totalInvested: prev.totalInvested + (count * parseInt(membershipFee)),
        totalPaidOut: prev.totalPaidOut + totalCommissionsPaid,
        currentRound: prev.currentRound + 1,
      };
    });
  }, [membershipFee, simulation.isCollapsed, calculateCommissions]);

  useEffect(() => {
    const checkCollapse = () => {
      const recentMembers = simulation.members.filter(
        m => m.joinedRound >= simulation.currentRound - 2
      ).length;

      const totalMembers = simulation.members.length;
      const membersInProfit = simulation.members.filter(m => m.netProfit > 0).length;
      const saturationRate = membersInProfit / totalMembers;

      // Pyramid collapses when recruitment slows or market saturates
      if (simulation.currentRound > 4 && (recentMembers < 2 || saturationRate < 0.1 || Math.random() < 0.12)) {
        setSimulation(prev => ({ ...prev, isCollapsed: true }));
        setAutoRunning(false);
        
        const losers = simulation.members.filter(m => m.netProfit < 0).length;
        Alert.alert(
          'PYRAMID COLLAPSED!',
          `The pyramid scheme has collapsed! ${losers} people lost their money. Only those at the top made profits.`
        );
      }
    };

    if (simulation.currentRound > 3 && !simulation.isCollapsed) {
      checkCollapse();
    }
  }, [simulation.currentRound, simulation.members.length, simulation.isCollapsed]);

  useEffect(() => {
    if (autoRunning && !simulation.isCollapsed) {
      const interval = setInterval(() => {
        // Simulate decreasing recruitment over time
        const baseRecruits = Math.max(1, 5 - Math.floor(simulation.currentRound / 2));
        const newCount = Math.floor(Math.random() * baseRecruits) + 1;
        addMembers(newCount);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [autoRunning, simulation.isCollapsed, addMembers, simulation.currentRound]);

  const resetSimulation = () => {
    setSimulation({
      members: [
        {
          id: 1,
          name: 'Founder (You)',
          level: 0,
          recruiter: null,
          recruits: [],
          investment: 500,
          totalEarned: 0,
          netProfit: -500,
          joinedRound: 0,
          isActive: true,
          status: 'loss',
        },
      ],
      totalInvested: 500,
      totalPaidOut: 0,
      currentRound: 0,
      isCollapsed: false,
      membershipFee: 500,
      commissionRate: 0.3,
      levelsDeep: 3,
    });
    setAutoRunning(false);
    setGameStarted(false);
  };

  const getLevelCounts = () => {
    const levelCounts: { [key: number]: number } = {};
    simulation.members.forEach(member => {
      levelCounts[member.level] = (levelCounts[member.level] || 0) + 1;
    });
    return levelCounts;
  };

  const deficit = simulation.totalInvested - simulation.totalPaidOut;
  const peopleInProfit = simulation.members.filter(m => m.netProfit > 0).length;
  const peopleInLoss = simulation.members.filter(m => m.netProfit < 0).length;
  const levelCounts = getLevelCounts();

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.startCard}>
              <Text style={styles.title}>Start Your "MLM Business"</Text>
              <Text style={styles.subtitle}>
                Experience how pyramid schemes disguised as MLM businesses recruit members and inevitably collapse
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Membership Fee (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={membershipFee}
                  onChangeText={setMembershipFee}
                  keyboardType="numeric"
                  placeholder="500"
                />
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setGameStarted(true)}>
                <Text style={styles.startButtonText}>Launch the "Business" 🏢</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.educationButton}
                onPress={() => navigation.navigate('PonziEducation')}>
                <Text style={styles.educationButtonText}>Learn About MLM Scams</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.educationButton, { backgroundColor: '#2563eb', marginTop: 12 }]}
                onPress={() => navigation.navigate('PonziSimulation')}>
                <Text style={styles.educationButtonText}>Try Ponzi Simulator</Text>
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
          <Text style={styles.headerTitle}>Pyramid/MLM Simulator</Text>
          <Text style={styles.headerSubtitle}>Educational Simulation</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Visual Pyramid Structure */}
          <View style={styles.card}>
            {renderPyramidTree()}
          </View>

          {/* Controls */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Business Controls</Text>
            {!simulation.isCollapsed && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={() => addMembers(1)}>
                  <Text style={styles.buttonText}>
                    Recruit 1 Member (₹{membershipFee})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={() => addMembers(3)}>
                  <Text style={styles.buttonText}>Recruit 3 Members</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    autoRunning ? styles.destructiveButton : styles.primaryButton,
                  ]}
                  onPress={() => setAutoRunning(!autoRunning)}>
                  <Text style={styles.buttonText}>
                    {autoRunning ? 'Stop Auto-Recruit' : 'Start Auto-Recruit'}
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
                <Text style={styles.statLabel}>Total Members:</Text>
                <Text style={styles.statValue}>{simulation.members.length}</Text>
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

          {/* Pyramid Structure */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pyramid Structure</Text>
            {Object.entries(levelCounts).map(([level, count]) => (
              <View key={level} style={styles.levelRow}>
                <Text style={styles.levelLabel}>Level {level}:</Text>
                <Text style={styles.levelCount}>{count} members</Text>
                <View style={styles.levelBar}>
                  <View 
                    style={[
                      styles.levelBarFill, 
                      { width: `${Math.min(100, (count / Math.max(...Object.values(levelCounts))) * 100)}%` }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Financial Metrics */}
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
                <Text style={styles.metricLabel}>Commissions Paid</Text>
              </View>
            </View>

            <View style={[styles.metricCard, styles.destructiveMetric]}>
              <Text style={styles.deficitValue}>₹{deficit.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Money Lost by Members</Text>
              <Text style={styles.deficitPercent}>
                {((deficit / simulation.totalInvested) * 100).toFixed(1)}% of investments lost
              </Text>
            </View>

            <View style={styles.peopleGrid}>
              <View style={[styles.peopleCard, styles.successMetric]}>
                <Text style={styles.peopleValue}>{peopleInProfit}</Text>
                <Text style={styles.peopleLabel}>Making Money</Text>
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
              <Text style={styles.alertTitle}>THE PYRAMID HAS COLLAPSED!</Text>
              <Text style={styles.alertText}>• Recruitment slowed down dramatically</Text>
              <Text style={styles.alertText}>• Market became saturated</Text>
              <Text style={styles.alertText}>• {peopleInLoss} people lost their money</Text>
              <Text style={styles.alertText}>• Only {peopleInProfit} top-level members made profit</Text>
              <Text style={styles.alertText}>
                • ₹{deficit.toLocaleString()} in total losses
              </Text>
            </View>
          )}

          {/* Educational Section */}
          <View style={styles.educationalCard}>
            <Text style={styles.educationalTitle}>How Pyramid/MLM Schemes Work</Text>
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>🏢 Disguised as Business</Text>
              <Text style={styles.lessonText}>
                They claim to sell products but focus on recruiting new members who pay fees.
              </Text>
            </View>
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>💰 Commission Structure</Text>
              <Text style={styles.lessonText}>
                Members earn commissions from recruiting others, creating a pyramid structure.
              </Text>
            </View>
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>📈 Unsustainable Growth</Text>
              <Text style={styles.lessonText}>
                Requires exponential recruitment. Eventually runs out of new people to recruit.
              </Text>
            </View>

            <View style={styles.keyLessons}>
              <Text style={styles.keyLessonsTitle}>Warning Signs:</Text>
              <Text style={styles.keyLessonText}>
                • Focus on recruiting rather than selling products
              </Text>
              <Text style={styles.keyLessonText}>
                • High upfront fees or "starter packages"
              </Text>
              <Text style={styles.keyLessonText}>
                • Promises of easy money through recruitment
              </Text>
              <Text style={styles.keyLessonText}>
                • Complex commission structures favoring top levels
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
    backgroundColor: '#7c3aed',
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
    backgroundColor: '#ec4899',
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
  pyramidContainer: {
    marginBottom: 16,
  },
  pyramidTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1f2937',
  },
  pyramidSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 16,
  },
  pyramidScroll: {
    marginBottom: 16,
  },
  pyramidContent: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  pyramidLevel: {
    alignItems: 'center',
    marginBottom: 16,
    minWidth: width - 64,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  levelMembersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberNodeContainer: {
    alignItems: 'center',
    margin: 4,
  },
  memberNode: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  profitNode: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  lossNode: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  breakEvenNode: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  collapsedNode: {
    opacity: 0.6,
    borderStyle: 'dashed',
  },
  memberNodeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  memberAmount: {
    fontSize: 8,
    color: '#6b7280',
  },
  memberProfit: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  memberRecruits: {
    fontSize: 8,
    color: '#6b7280',
  },
  profitText: {
    color: '#16a34a',
  },
  lossText: {
    color: '#dc2626',
  },
  connectionLine: {
    width: 1,
    height: 12,
    backgroundColor: '#9ca3af',
    marginTop: 2,
  },
  commissionFlow: {
    marginTop: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 4,
    padding: 4,
  },
  commissionFlowText: {
    fontSize: 10,
    color: '#1e40af',
    textAlign: 'center',
  },
  levelArrow: {
    alignItems: 'center',
    marginTop: 8,
  },
  arrowDown: {
    fontSize: 20,
    color: '#6b7280',
  },
  arrowText: {
    fontSize: 10,
    color: '#6b7280',
  },
  pyramidLegend: {
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
    color: '#6b7280',
  },
  collapseIndicator: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  collapseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  collapseSubtext: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 2,
  },
  card: {
    backgroundColor: 'white',
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
    backgroundColor: '#7c3aed',
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
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelCount: {
    fontSize: 14,
    color: '#6b7280',
    width: 80,
  },
  levelBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginLeft: 8,
  },
  levelBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
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

export default PyramidSimulation;