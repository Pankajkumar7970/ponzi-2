import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, TrendingUp, Users, ExternalLink } from "lucide-react";

const PonziEducation = () => {
  const warningFlags = [
    "Guaranteed high returns with little or no risk",
    "Focus on recruiting others instead of real products/services",
    "No clear info about how the business earns money",
    "Pressure to act fast ('limited slots', 'urgent')",
    "No registered business or regulatory license"
  ];

  const dangers = [
    { icon: "💸", text: "You will likely lose your money when it collapses" },
    { icon: "🧑‍⚖️", text: "It's illegal – you can be held responsible" },
    { icon: "👥", text: "You might unknowingly scam your friends and family" },
    { icon: "💔", text: "It destroys trust and damages lives" }
  ];

  const safeAlternatives = [
    "Invest in legal, regulated platforms (mutual funds, SIPs, etc.)",
    "Learn financial literacy",
    "Use trusted financial apps and advisors",
    "Report suspicious schemes to SEBI or your local cybercrime cell"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-warning/10 text-warning-foreground px-4 py-2 rounded-full border border-warning/20 mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Financial Security Alert</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            What is a Ponzi Scheme?
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A Ponzi scheme is a fake investment plan where money from new investors is used to pay returns to earlier investors — not from actual profits, but from deception.
          </p>
          
          <Card className="bg-destructive/5 border-destructive/20 p-6 mb-8">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Typical Example</h3>
                  <p className="text-sm text-muted-foreground">How these schemes lure victims</p>
                </div>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <p className="text-lg font-medium text-destructive-foreground">
                  "Invest ₹10,000 and get ₹20,000 in 30 days. Bring 2 friends and earn 5% commission!"
                </p>
              </div>
              <p className="text-lg font-semibold mt-4 text-destructive">
                🎯 That's not investing. That's a trap.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Warning Signs Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-warning">
              ⚠️ How to Spot a Ponzi Scheme
            </h2>
            <p className="text-lg text-muted-foreground">
              Recognize these red flags before it's too late
            </p>
          </div>
          
          <div className="grid gap-4">
            {warningFlags.map((flag, index) => (
              <Card key={index} className="bg-warning/5 border-warning/20 hover:bg-warning/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🚩</span>
                    </div>
                    <p className="text-lg font-medium">{flag}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dangers Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-destructive">
              💥 Why You Should Avoid Ponzi Schemes
            </h2>
            <p className="text-lg text-muted-foreground">
              The devastating consequences of getting involved
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {dangers.map((danger, index) => (
              <Card key={index} className="bg-destructive/5 border-destructive/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{danger.icon}</span>
                    </div>
                    <p className="text-lg font-medium leading-relaxed">{danger.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safe Alternatives Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-success">
              ✅ What to Do Instead
            </h2>
            <p className="text-lg text-muted-foreground">
              Safe and legitimate ways to grow your wealth
            </p>
          </div>
          
          <div className="grid gap-4">
            {safeAlternatives.map((alternative, index) => (
              <Card key={index} className="bg-success/5 border-success/20 hover:bg-success/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      {index === 0 && <TrendingUp className="w-6 h-6 text-success" />}
                      {index === 1 && <span className="text-2xl">📚</span>}
                      {index === 2 && <Users className="w-6 h-6 text-success" />}
                      {index === 3 && <Shield className="w-6 h-6 text-success" />}
                    </div>
                    <p className="text-lg font-medium">{alternative}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <div className="flex justify-center gap-8 text-4xl md:text-5xl">
              <span>🛡️</span>
              <span>📢</span>
              <span>🚫</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Protect yourself. Spread awareness. Say no to scams.
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real growth takes time and honesty. Choose legitimate investments and help others avoid these traps.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Learn More About Safe Investing
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10"
                asChild
              >
                <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer">
                  Report to SEBI <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PonziEducation;