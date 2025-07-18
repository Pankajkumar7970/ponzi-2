import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  UserPlus,
  Timer,
  Target,
  Zap
} from "lucide-react";

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

const PonziSimulation = () => {
  const [simulation, setSimulation] = useState<SimulationState>({
    investors: [
      {
        id: 1,
        name: "Founder (You)",
        investment: 1000,
        recruits: [],
        totalEarned: 0,
        netProfit: -1000,
        joinedRound: 0,
        level: 0
      }
    ],
    totalInvested: 1000,
    totalPaidOut: 0,
    currentRound: 0,
    isCollapsed: false,
    newInvestorsPerRound: 2,
    payoutRate: 0.2
  });

  const [investmentAmount, setInvestmentAmount] = useState(500);
  const [autoRunning, setAutoRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Calculate pyramid levels for visualization
  const getPyramidLevels = () => {
    const levels: Investor[][] = [];
    simulation.investors.forEach(investor => {
      if (!levels[investor.level]) {
        levels[investor.level] = [];
      }
      levels[investor.level].push(investor);
    });
    return levels.filter(level => level.length > 0);
  };

  // Add new investors
  const addInvestors = useCallback((count: number) => {
    if (simulation.isCollapsed) return;

    setSimulation(prev => {
      const newInvestors: Investor[] = [];
      const currentLevel = Math.floor(Math.log2(prev.investors.length + count)) + 1;
      
      for (let i = 0; i < count; i++) {
        const newInvestor: Investor = {
          id: prev.investors.length + i + 1,
          name: `Investor ${prev.investors.length + i + 1}`,
          investment: investmentAmount,
          recruits: [],
          totalEarned: 0,
          netProfit: -investmentAmount,
          joinedRound: prev.currentRound + 1,
          level: currentLevel
        };
        newInvestors.push(newInvestor);
      }

      // Calculate payouts to existing investors
      const totalNewMoney = count * investmentAmount;
      const availableForPayouts = totalNewMoney * 0.8; // 20% kept as "profit"
      
      const updatedInvestors = [...prev.investors];
      let remainingPayout = availableForPayouts;

      // Pay earlier investors first (FIFO)
      for (let i = 0; i < updatedInvestors.length && remainingPayout > 0; i++) {
        const payout = Math.min(remainingPayout, updatedInvestors[i].investment * prev.payoutRate);
        updatedInvestors[i].totalEarned += payout;
        updatedInvestors[i].netProfit += payout;
        remainingPayout -= payout;
      }

      return {
        ...prev,
        investors: [...updatedInvestors, ...newInvestors],
        totalInvested: prev.totalInvested + totalNewMoney,
        totalPaidOut: prev.totalPaidOut + (availableForPayouts - remainingPayout),
        currentRound: prev.currentRound + 1
      };
    });
  }, [investmentAmount, simulation.isCollapsed]);

  // Check for collapse conditions
  useEffect(() => {
    const checkCollapse = () => {
      const recentInvestors = simulation.investors.filter(
        inv => inv.joinedRound >= simulation.currentRound - 2
      ).length;
      
      const growthRate = recentInvestors / Math.max(1, simulation.investors.length * 0.3);
      
      if (simulation.currentRound > 5 && (growthRate < 0.1 || Math.random() < 0.15)) {
        setSimulation(prev => ({ ...prev, isCollapsed: true }));
        setAutoRunning(false);
      }
    };

    if (simulation.currentRound > 3 && !simulation.isCollapsed) {
      checkCollapse();
    }
  }, [simulation.currentRound, simulation.investors.length, simulation.isCollapsed]);

  // Auto-run simulation
  useEffect(() => {
    if (autoRunning && !simulation.isCollapsed) {
      const interval = setInterval(() => {
        const newCount = Math.max(1, Math.floor(Math.random() * simulation.newInvestorsPerRound) + 1);
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
          name: "Founder (You)",
          investment: 1000,
          recruits: [],
          totalEarned: 0,
          netProfit: -1000,
          joinedRound: 0,
          level: 0
        }
      ],
      totalInvested: 1000,
      totalPaidOut: 0,
      currentRound: 0,
      isCollapsed: false,
      newInvestorsPerRound: 2,
      payoutRate: 0.2
    });
    setAutoRunning(false);
    setGameStarted(false);
  };

  const pyramidLevels = getPyramidLevels();
  const deficit = simulation.totalInvested - simulation.totalPaidOut;
  const peopleInProfit = simulation.investors.filter(inv => inv.netProfit > 0).length;
  const peopleInLoss = simulation.investors.filter(inv => inv.netProfit < 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full border border-warning/20">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Educational Simulation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            Ponzi Scheme Simulator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how a Ponzi scheme grows rapidly, pays early investors, then inevitably collapses
          </p>
        </div>

        {/* Game Controls */}
        {!gameStarted ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Start Your "Investment Opportunity"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Investment Amount (₹)</Label>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={100}
                  max={5000}
                />
              </div>
              <Button 
                onClick={() => setGameStarted(true)} 
                className="w-full"
                size="lg"
              >
                Launch the "Opportunity" 🚀
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Scheme Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!simulation.isCollapsed && (
                  <>
                    <Button
                      onClick={() => addInvestors(1)}
                      className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add 1 Investor (₹{investmentAmount})
                    </Button>
                    
                    <Button
                      onClick={() => addInvestors(3)}
                      className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Add 3 Investors
                    </Button>

                    <Button
                      onClick={() => setAutoRunning(!autoRunning)}
                      variant={autoRunning ? "destructive" : "default"}
                      className="w-full"
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      {autoRunning ? "Stop Auto-Run" : "Start Auto-Run"}
                    </Button>
                  </>
                )}

                <Button
                  onClick={resetSimulation}
                  variant="outline"
                  className="w-full"
                >
                  Reset Simulation
                </Button>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Round:</span>
                    <Badge variant="outline">{simulation.currentRound}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Investors:</span>
                    <Badge>{simulation.investors.length}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={simulation.isCollapsed ? "destructive" : "default"} 
                           className={simulation.isCollapsed ? "" : "bg-success text-success-foreground"}>
                      {simulation.isCollapsed ? "COLLAPSED" : "Running"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      ₹{simulation.totalInvested.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Invested</div>
                  </div>
                  
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      ₹{simulation.totalPaidOut.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Paid Out</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="text-3xl font-bold text-destructive">
                    ₹{deficit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Money Still Owed</div>
                  <div className="text-xs text-destructive mt-1">
                    {((deficit / simulation.totalInvested) * 100).toFixed(1)}% of investments unpaid
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-success/10 rounded">
                    <div className="font-bold text-success">{peopleInProfit}</div>
                    <div className="text-xs">In Profit</div>
                  </div>
                  <div className="text-center p-2 bg-destructive/10 rounded">
                    <div className="font-bold text-destructive">{peopleInLoss}</div>
                    <div className="text-xs">Lost Money</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pyramid Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Pyramid Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pyramidLevels.map((level, levelIndex) => (
                    <div key={levelIndex} className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Level {levelIndex} ({level.length} investors)
                      </div>
                      <div className="flex justify-center gap-1 flex-wrap">
                        {level.slice(0, 10).map((investor) => (
                          <div
                            key={investor.id}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              investor.netProfit > 0
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }`}
                            title={`${investor.name}: ₹${investor.netProfit}`}
                          >
                            {investor.netProfit > 0 ? "+" : "-"}
                          </div>
                        ))}
                        {level.length > 10 && (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            +{level.length - 10}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-success/20"></div>
                    <span>Profitable</span>
                    <div className="w-3 h-3 rounded-full bg-destructive/20 ml-4"></div>
                    <span>Lost money</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Collapse Alert */}
        {simulation.isCollapsed && (
          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-lg">
              <strong>THE SCHEME HAS COLLAPSED!</strong>
              <div className="mt-2 text-sm space-y-1">
                <div>• New investors stopped joining</div>
                <div>• No money left to pay existing investors</div>
                <div>• {peopleInLoss} people lost their money</div>
                <div>• Only {peopleInProfit} early investors made profit</div>
                <div>• ₹{deficit.toLocaleString()} in losses cannot be recovered</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Educational Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-center text-2xl">What This Simulation Shows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold">Unsustainable Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Ponzi schemes require exponential growth. Each round needs more investors than the last.
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold">Most People Lose</h3>
                <p className="text-sm text-muted-foreground">
                  Only early investors profit. The majority of participants lose their money.
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold">Inevitable Collapse</h3>
                <p className="text-sm text-muted-foreground">
                  All Ponzi schemes eventually collapse when new investors stop joining.
                </p>
              </div>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Key Lessons:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Promises of guaranteed high returns are red flags</li>
                <li>• Legitimate investments create value, not just move money around</li>
                <li>• If it sounds too good to be true, it probably is</li>
                <li>• Real wealth building takes time and carries appropriate risk</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PonziSimulation;