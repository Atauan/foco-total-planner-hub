import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen } from "lucide-react"

interface StudyCardProps {
  subject: string
  topic: string
  duration: string
  progress: number
  type: "revision" | "new" | "practice"
  time: string
}

const typeColors = {
  revision: "bg-warning text-warning-foreground",
  new: "bg-info text-info-foreground", 
  practice: "bg-success text-success-foreground"
}

const typeLabels = {
  revision: "Revisão",
  new: "Novo",
  practice: "Prática"
}

export function StudyCard({ subject, topic, duration, progress, type, time }: StudyCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{subject}</CardTitle>
          </div>
          <Badge className={typeColors[type]} variant="secondary">
            {typeLabels[type]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-medium text-foreground">{topic}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
            <span>{time}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}