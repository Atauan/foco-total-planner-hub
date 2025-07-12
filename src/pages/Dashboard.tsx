import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StudyCard } from "@/components/StudyCard"
import { StatsCard } from "@/components/StatsCard"
import { 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Brain,
  Trophy,
  TrendingUp,
  Plus
} from "lucide-react"
import { useEffect, useState } from "react"

const todayStudies = [
  {
    subject: "Matemática",
    topic: "Funções Quadráticas",
    duration: "45min",
    progress: 0,
    type: "new" as const,
    time: "09:00"
  },
  {
    subject: "Português", 
    topic: "Análise Sintática",
    duration: "30min",
    progress: 100,
    type: "revision" as const,
    time: "10:00"
  },
  {
    subject: "Física",
    topic: "Cinemática - Exercícios",
    duration: "60min", 
    progress: 45,
    type: "practice" as const,
    time: "14:00"
  }
]

export default function Dashboard() {
  const [showContent, setShowContent] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => {
      setShowContent(true);
      setProgressWidth(32);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`border-b bg-card shadow-sm transition-all duration-700 ease-out ${showContent ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Bom dia! 👋</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Continue seu progresso de estudos</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 w-full sm:w-auto animate-pulse">
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Progress Overview */}
        <div className={`space-y-4 transition-all duration-700 ease-out delay-100 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Progresso do Plano de Estudos</h2>
            <Badge variant="outline" className="text-warning border-warning/50 text-xs sm:text-sm w-fit">
              4 meses e 15 dias até o ENEM
            </Badge>
          </div>
          
          <div className="bg-card rounded-xl p-4 sm:p-6 shadow-elevated hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-medium text-foreground">Progresso Geral</h3>
                <p className="text-sm text-muted-foreground">32% concluído do cronograma</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xl sm:text-2xl font-bold text-foreground">32%</p>
                <p className="text-sm text-success">+8% esta semana</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
                style={{width: `${progressWidth}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className={`transition-all duration-700 ease-out delay-200 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <StatsCard
              title="Horas de Estudo Hoje"
              value="2.5h"
              icon={Clock}
              variant="primary"
              trend={{ value: 15, label: "vs ontem", isPositive: true }}
            />
          </div>
          <div className={`transition-all duration-700 ease-out delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <StatsCard
              title="Matérias Estudadas"
              value="8"
              icon={BookOpen}
              variant="success"
              trend={{ value: 2, label: "esta semana", isPositive: true }}
            />
          </div>
          <div className={`transition-all duration-700 ease-out delay-400 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <StatsCard
              title="Sequência de Dias"
              value="12"
              icon={Target}
              variant="warning"
            />
          </div>
          <div className={`transition-all duration-700 ease-out delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <StatsCard
              title="Questões Respondidas"
              value="247"
              icon={Brain}
              trend={{ value: 23, label: "esta semana", isPositive: true }}
            />
          </div>
        </div>

        {/* Today's Schedule */}
        <div className={`space-y-4 transition-all duration-700 ease-out delay-600 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Cronograma de Hoje
            </h2>
            <Button variant="outline" size="sm" className="w-fit hover:bg-muted transition-colors">
              Ver Cronograma Completo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {todayStudies.map((study, index) => (
              <div 
                key={index} 
                className={`transition-all duration-700 ease-out ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{transitionDelay: `${700 + index * 100}ms`}}
              >
                <StudyCard {...study} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`bg-gradient-focus rounded-xl p-4 sm:p-6 text-white transition-all duration-700 ease-out delay-1000 hover:scale-[1.02] ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Continue seus estudos</h3>
              <p className="opacity-90 text-sm sm:text-base">Você está indo muito bem! Continue assim.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto hover:scale-105 transition-transform">
                <Trophy className="h-4 w-4 mr-2" />
                Ver Conquistas
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-all w-full sm:w-auto">
                <TrendingUp className="h-4 w-4 mr-2" />
                Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}