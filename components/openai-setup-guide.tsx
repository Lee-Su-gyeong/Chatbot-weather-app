"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Key, CreditCard, AlertTriangle, CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

export function OpenAISetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepNumber)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      title: "OpenAI 계정 생성",
      description: "OpenAI Platform에 가입하세요",
      url: "https://platform.openai.com/signup",
      details: ["이메일 주소로 계정 생성", "전화번호 인증 필요", "신용카드 등록 (사용량 기반 과금)"],
    },
    {
      title: "API 키 생성",
      description: "대시보드에서 새 API 키를 만드세요",
      url: "https://platform.openai.com/api-keys",
      details: [
        "좌측 메뉴에서 'API Keys' 클릭",
        "'Create new secret key' 버튼 클릭",
        "키 이름 설정 (예: 'Weather-Fortune-Bot')",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-blue-800">
            <Key className="h-6 w-6" />
            OpenAI API 키 발급 가이드
          </CardTitle>
          <p className="text-blue-600">ChatGPT API를 사용하기 위한 단계별 안내</p>
        </CardHeader>
      </Card>

      {/* 단계별 가이드 */}
      {steps.map((step, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Badge variant="default" className="w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
                {step.title}
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href={step.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  사이트 열기
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{step.description}</p>
            <ul className="space-y-2">
              {step.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      {/* API 키 설정 */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Badge variant="default" className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600">
              3
            </Badge>
            환경 변수 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-green-700">발급받은 API 키를 프로젝트에 설정하세요:</p>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400"># .env.local 파일에 추가</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("OPENAI_API_KEY=sk-your-api-key-here", 3)}
                className="text-gray-400 hover:text-white"
              >
                {copiedStep === 3 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <code>OPENAI_API_KEY=sk-your-api-key-here</code>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">보안 주의사항</p>
                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                  <li>• API 키를 절대 공개 저장소에 업로드하지 마세요</li>
                  <li>• .env.local 파일은 .gitignore에 포함되어 있습니다</li>
                  <li>• API 키가 노출되면 즉시 재생성하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 비용 정보 */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <CreditCard className="h-5 w-5" />
            비용 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-purple-800 mb-2">GPT-4 Turbo 가격</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 입력: $10.00 / 1M 토큰</li>
                <li>• 출력: $30.00 / 1M 토큰</li>
                <li>• 일반적인 대화: 약 $0.01-0.05</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-2">비용 절약 팁</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 사용량 한도 설정</li>
                <li>• 불필요한 긴 대화 피하기</li>
                <li>• 개발 중에는 GPT-3.5 사용 고려</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 테스트 */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Badge variant="default" className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600">
              4
            </Badge>
            테스트하기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-indigo-700 mb-4">API 키 설정 후 다음 단계를 따라하세요:</p>
          <ol className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </Badge>
              개발 서버 재시작: <code className="bg-indigo-100 px-2 py-1 rounded">npm run dev</code>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                2
              </Badge>
              챗봇에서 "서울 오늘 날씨 어때?" 질문하기
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                3
              </Badge>
              AI 응답이 정상적으로 나오는지 확인
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* 문제 해결 */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            문제 해결
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-red-800">API 키 오류가 발생하는 경우:</h4>
              <ul className="text-sm text-red-700 mt-1 space-y-1">
                <li>• API 키가 올바르게 복사되었는지 확인</li>
                <li>• 환경 변수명이 정확한지 확인 (OPENAI_API_KEY)</li>
                <li>• 서버를 재시작했는지 확인</li>
                <li>• OpenAI 계정에 결제 정보가 등록되어 있는지 확인</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-800">사용량 한도 초과 시:</h4>
              <ul className="text-sm text-red-700 mt-1 space-y-1">
                <li>• OpenAI 대시보드에서 사용량 확인</li>
                <li>• 결제 방법 추가 또는 한도 증액</li>
                <li>• 월별 사용량 한도 설정 고려</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
