import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  variant?: "default" | "primary" | "success" | "warning"
}

const variantClasses = {
  default: "border-border",
  primary: "border-primary/20 bg-primary/5",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5"
}

const iconClasses = {
  default: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning"
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = "default" 
}: StatsCardProps) {
  return (
    <Card className={`shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] ${variantClasses[variant]}`}>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">
                <span className={trend.isPositive ? "text-success" : "text-destructive"}>
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