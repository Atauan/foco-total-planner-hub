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
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bom dia! 👋</h1>
            <p className="text-muted-foreground">Continue seu progresso de estudos</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Progress Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Progresso do Plano de Estudos</h2>
            <Badge variant="outline" className="text-warning border-warning/50">
              4 meses e 15 dias até o ENEM
            </Badge>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-foreground">Progresso Geral</h3>
                <p className="text-sm text-muted-foreground">32% concluído do cronograma</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">32%</p>
                <p className="text-sm text-success">+8% esta semana</p>
              </div>
            </div>
            <Progress value={32} className="h-3" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Horas de Estudo Hoje"
            value="2.5h"
            icon={Clock}
            variant="primary"
            trend={{ value: 15, label: "vs ontem", isPositive: true }}
          />
          <StatsCard
            title="Matérias Estudadas"
            value="8"
            icon={BookOpen}
            variant="success"
            trend={{ value: 2, label: "esta semana", isPositive: true }}
          />
          <StatsCard
            title="Sequência de Dias"
            value="12"
            icon={Target}
            variant="warning"
          />
          <StatsCard
            title="Questões Respondidas"
            value="247"
            icon={Brain}
            trend={{ value: 23, label: "esta semana", isPositive: true }}
          />
        </div>

        {/* Today's Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Cronograma de Hoje
            </h2>
            <Button variant="outline" size="sm">
              Ver Cronograma Completo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayStudies.map((study, index) => (
              <StudyCard key={index} {...study} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-focus rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Continue seus estudos</h3>
              <p className="opacity-90">Você está indo muito bem! Continue assim.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                Ver Conquistas
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
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