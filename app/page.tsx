"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, Cloud, Star, Send, Bot, User, MapPin } from "lucide-react"
import { WeatherCard } from "@/components/weather-card"
// import { SetupGuide } from "@/components/setup-guide" // SetupGuide 임포트 제거

export default function WeatherFortuneChatbot() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState(true)
  const [userLocation, setUserLocation] = useState<string>("서울")

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    maxSteps: 5,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // 특정 시간에 자동으로 날씨와 운세 요청
    const checkScheduledTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // 매일 오전 8시와 오후 6시에 자동 알림
      if (notifications && minutes === 0 && (hours === 8 || hours === 18)) {
        // 자동으로 날씨와 운세 요청
        const event = {
          preventDefault: () => {},
          target: { value: `${userLocation} 오늘의 날씨와 운세를 알려주세요` },
        } as any

        handleSubmit(event)
      }
    }

    const interval = setInterval(checkScheduledTime, 60000) // 1분마다 체크
    return () => clearInterval(interval)
  }, [notifications, handleSubmit, userLocation])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  const quickQuestions = [
    `${userLocation} 오늘 날씨 어때?`,
    "오늘 운세 알려줘",
    `${userLocation} 내일 날씨는?`,
    "이번 주 운세는?",
  ]

  // 빠른 질문 클릭 핸들러
  const handleQuickQuestionClick = (question: string) => {
    // useChat의 handleInputChange를 사용하여 input 상태 업데이트
    handleInputChange({
      target: { value: question },
      // React.ChangeEvent<HTMLInputElement> 타입에 맞추기 위해 필요한 다른 속성들
      // 실제 이벤트 객체가 아니므로, 필요한 최소한의 속성만 제공
      currentTarget: { value: question },
      nativeEvent: new Event("input") as any, // 더미 nativeEvent
      preventDefault: () => {},
      stopPropagation: () => {},
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {},
      type: "change",
    } as React.ChangeEvent<HTMLInputElement>)

    // handleSubmit을 호출하여 바로 질문 전송
    handleSubmit(new Event("submit") as any) // 더미 submit 이벤트
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Cloud className="h-6 w-6 text-blue-500" />
              <Star className="h-6 w-6 text-yellow-500" />
              날씨 & 운세 챗봇
            </CardTitle>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(currentTime)}
              </div>
              <div>{formatDate(currentTime)}</div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <select
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="bg-transparent border-none text-sm focus:outline-none"
                >
                  <option value="서울">서울</option>
                  <option value="부산">부산</option>
                  <option value="대구">대구</option>
                  <option value="인천">인천</option>
                  <option value="광주">광주</option>
                  <option value="대전">대전</option>
                  <option value="울산">울산</option>
                  <option value="수원">수원</option>
                  <option value="제주">제주</option>
                </select>
              </div>
              <Badge variant={notifications ? "default" : "secondary"}>알림 {notifications ? "ON" : "OFF"}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Welcome Message (SetupGuide 제거) */}
        {messages.length === 0 && ( // 메시지가 없을 때만 Welcome Message 표시
          <Card className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-4">
                  <Bot className="h-12 w-12 text-blue-500" />
                  <div className="text-4xl">🌤️</div>
                </div>
                <h2 className="text-xl font-semibold text-blue-800 mb-2">안녕하세요! 날씨 & 운세 AI입니다</h2>
                <p className="text-blue-700 mb-4">
                  실시간 날씨 정보와 오늘의 운세를 알려드립니다. 궁금한 것을 물어보세요!
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-white/50">
                    실시간 날씨
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    운세 정보
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    자동 알림
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    맞춤 조언
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">채팅</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setNotifications(!notifications)}>
                알림 {notifications ? "끄기" : "켜기"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div className={`flex-1 max-w-xs lg:max-w-md ${message.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-blue-500 text-white" : "bg-white border shadow-sm"
                      }`}
                    >
                      {message.toolInvocations ? (
                        <div className="space-y-3">
                          {message.toolInvocations.map((tool, index) => (
                            <div key={index}>
                              {tool.toolName === "getWeather" && tool.result ? (
                                <WeatherCard weatherData={tool.result} />
                              ) : tool.toolName === "getFortune" && tool.result ? (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-lg p-4">
                                  <h3 className="font-semibold text-purple-800 mb-2">
                                    🔮 {tool.result.period} {tool.result.category} 운세
                                  </h3>
                                  <p className="text-purple-700 mb-3">{tool.result.advice}</p>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="font-medium text-purple-600">운세:</span>
                                      <span className="ml-2">{tool.result.fortune}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-purple-600">행운의 색:</span>
                                      <span className="ml-2">{tool.result.luckyColor}</span>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="font-medium text-purple-600">행운의 숫자:</span>
                                      <span className="ml-2">{tool.result.luckyNumbers.join(", ")}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs opacity-75 bg-gray-100 rounded px-2 py-1">
                                  🔧 {tool.toolName} 실행 중...
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt || Date.now()).toLocaleTimeString("ko-KR")}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="날씨나 운세에 대해 물어보세요..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">빠른 질문</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestionClick(question)} // 수정된 핸들러 사용
                  disabled={isLoading}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
