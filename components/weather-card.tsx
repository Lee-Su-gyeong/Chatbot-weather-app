import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Droplets, Wind, Eye } from "lucide-react"

interface WeatherCardProps {
  weatherData: {
    location: string
    date: string
    condition: string
    temperature: number | null
    feelsLike?: number
    humidity: number | null
    windSpeed: number | null
    icon?: string
    advice: string
    source?: string
    error?: string
  }
}

export function WeatherCard({ weatherData }: WeatherCardProps) {
  const getWeatherIcon = (condition: string, iconCode?: string) => {
    if (iconCode) {
      return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    }

    // 기본 아이콘 매핑
    if (condition.includes("비") || condition.includes("rain")) return "🌧️"
    if (condition.includes("눈") || condition.includes("snow")) return "❄️"
    if (condition.includes("맑") || condition.includes("clear")) return "☀️"
    if (condition.includes("구름") || condition.includes("cloud")) return "☁️"
    if (condition.includes("안개") || condition.includes("mist")) return "🌫️"
    return "🌤️"
  }

  if (weatherData.error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Cloud className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <p className="text-red-600 font-medium">날씨 정보 오류</p>
            <p className="text-sm text-red-500 mt-2">{weatherData.advice}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{weatherData.location} 날씨</span>
          {weatherData.source && (
            <Badge variant="secondary" className="text-xs">
              {weatherData.source}
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{weatherData.date}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 메인 날씨 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {weatherData.icon ? (
              <img
                src={getWeatherIcon(weatherData.condition, weatherData.icon) || "/placeholder.svg"}
                alt={weatherData.condition}
                className="w-16 h-16"
              />
            ) : (
              <span className="text-4xl">{getWeatherIcon(weatherData.condition)}</span>
            )}
            <div>
              <p className="text-2xl font-bold">
                {weatherData.temperature !== null ? `${weatherData.temperature}°C` : "정보 없음"}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{weatherData.condition}</p>
              {weatherData.feelsLike && <p className="text-xs text-muted-foreground">체감 {weatherData.feelsLike}°C</p>}
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        {(weatherData.humidity !== null || weatherData.windSpeed !== null) && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-200">
            {weatherData.humidity !== null && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{weatherData.humidity}%</p>
                  <p className="text-xs text-muted-foreground">습도</p>
                </div>
              </div>
            )}

            {weatherData.windSpeed !== null && (
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{weatherData.windSpeed} km/h</p>
                  <p className="text-xs text-muted-foreground">풍속</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 조언 */}
        <div className="bg-white/50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-start gap-2">
            <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">{weatherData.advice}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
