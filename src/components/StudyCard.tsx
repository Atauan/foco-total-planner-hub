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
  revision: "bg-amber-100 text-amber-800 border-amber-200",
  new: "bg-blue-100 text-blue-800 border-blue-200", 
  practice: "bg-green-100 text-green-800 border-green-200"
}

const typeLabels = {
  revision: "Revisão",
  new: "Novo",
  practice: "Prática"
}

export function StudyCard({ subject, topic, duration, progress, type, time }: StudyCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] h-full bg-white border border-gray-200">
      <CardHeader className="pb-3 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <CardTitle className="text-sm font-medium truncate text-black">{subject}</CardTitle>
          </div>
          <Badge className={`${typeColors[type]} text-xs px-2 py-1 flex-shrink-0 border`} variant="secondary">
            {typeLabels[type]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 p-3 sm:p-4 pt-0">
        <div>
          <h3 className="font-medium text-black text-sm sm:text-base leading-tight">{topic}</h3>
          <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>{duration}</span>
            </div>
            <span>{time}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium text-black">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{width: `${progress}%`}}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}