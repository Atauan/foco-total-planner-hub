import { Card, CardContent } from "@/components/ui/card"
import { DivideIcon as LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  variant?: "default" | "primary" | "success" | "warning"
}

const variantClasses = {
  default: "border-gray-200 bg-white",
  primary: "border-indigo-200 bg-indigo-50",
  success: "border-green-200 bg-green-50",
  warning: "border-amber-200 bg-amber-50"
}

const iconClasses = {
  default: "text-gray-500",
  primary: "text-indigo-600",
  success: "text-green-600",
  warning: "text-amber-600"
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = "default" 
}: StatsCardProps) {
  return (
    <Card className={`shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border ${variantClasses[variant]}`}>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-black">{value}</p>
            {trend && (
              <p className="text-xs text-gray-600">
                <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>{" "}
                <span className="hidden sm:inline">{trend.label}</span>
              </p>
            )}
          </div>
          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${iconClasses[variant]} flex-shrink-0`} />
        </div>
      </CardContent>
    </Card>
  )
}