import { useEffect, useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Target, 
  BookOpen, 
  Brain,
  Trophy,
  TrendingUp,
  Plus
} from "lucide-react"

const statsData = [
  {
    title: "Horas de Estudo Hoje",
    value: "2.5h",
    subtitle: "hoje",
    icon: Clock
  },
  {
    title: "Dias Seguidos",
    value: "12",
    subtitle: "dias seguidos",
    icon: Target
  },
  {
    title: "Questões Respondidas",
    value: "80",
    subtitle: "questões",
    icon: Brain
  },
  {
    title: "Matérias Estudadas",
    value: "6",
    subtitle: "matérias estudadas",
    icon: BookOpen
  }
]

const todayActivities = [
  {
    subject: "Matemática",
    topic: "Funções Quadráticas",
    progress: 75,
    time: "09:00"
  },
  {
    subject: "Português", 
    topic: "Análise Sintática",
    progress: 100,
    time: "10:30"
  },
  {
    subject: "Física",
    topic: "Cinemática",
    progress: 45,
    time: "14:00"
  }
]

export default function Dashboard() {
  const [showContent, setShowContent] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => {
      setShowContent(true)
      setProgressWidth(68)
    }, 100)

    // Load Anime.js and trigger animations
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
    script.onload = () => {
      // @ts-ignore
      if (window.anime) {
        // Cards fade in animation
        // @ts-ignore
        window.anime({
          targets: '.animate-card',
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 800,
          easing: 'easeOutExpo',
          delay: (el: any, i: number) => i * 100
        })

        // Progress bar animation
        // @ts-ignore
        window.anime({
          targets: '.progress-fill',
          width: '68%',
          easing: 'easeInOutQuart',
          duration: 1200,
          delay: 500
        })

        // Button pulse animation
        // @ts-ignore
        window.anime({
          targets: '.btn-pulse',
          scale: [1, 1.05],
          direction: 'alternate',
          loop: true,
          easing: 'easeInOutSine',
          duration: 1500
        })
      }
    }
    document.head.appendChild(script)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Continue seu progresso de estudos</h1>
            <p className="text-gray-600 mt-1">Mantenha o foco e alcance seus objetivos</p>
          </div>
          <Button className="btn-minimal btn-pulse">
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>

        {/* Progress Section */}
        <div className="animate-card">
          <div className="card-minimal p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-black">Progresso Geral</h3>
                <p className="text-gray-600">68% do cronograma concluído</p>
              </div>
              <Badge variant="outline" className="border-gray-800/20 text-gray-700">
                4 meses restantes
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso</span>
                <span className="font-medium text-black">68%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="progress-fill bg-black h-2 rounded-full"
                  style={{width: '0%'}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <div key={index} className="animate-card">
              <div className="card-minimal p-6 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-gray-700" />
                <p className="text-2xl font-bold text-black mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Activities */}
        <div className="animate-card">
          <div className="card-minimal p-6">
            <h3 className="text-lg font-semibold text-black mb-6">Atividades de Hoje</h3>
            
            <div className="space-y-4">
              {todayActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-800/10 hover:border-gray-800/20 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-black">{activity.subject}</span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{activity.topic}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-black h-1.5 rounded-full transition-all duration-500"
                          style={{width: `${activity.progress}%`}}
                        />
                      </div>
                      <span className="text-xs font-medium text-black">{activity.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-card">
          <div className="card-minimal p-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Continue estudando</h3>
                <p className="text-gray-600">Você está no caminho certo para atingir suas metas.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-gray-800/20 hover:bg-gray-50">
                  <Trophy className="h-4 w-4 mr-2" />
                  Ver Conquistas
                </Button>
                <Button className="btn-minimal">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Relatório
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}