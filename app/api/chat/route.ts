import { groq } from "@ai-sdk/groq" // OpenAI 대신 Groq 임포트
import { streamText, convertToCoreMessages, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // --- 디버깅을 위한 console.log 추가 ---
  console.log("--- API Route Called ---")
  console.log("Received messages:", messages.length)
  if (process.env.GROQ_API_KEY) {
    // GROQ_API_KEY 확인
    console.log("GROQ_API_KEY is set (first 5 chars):", process.env.GROQ_API_KEY.substring(0, 5) + "...")
  } else {
    console.log("GROQ_API_KEY is NOT set.")
  }
  if (process.env.OPENWEATHER_API_KEY) {
    console.log("OPENWEATHER_API_KEY is set (first 5 chars):", process.env.OPENWEATHER_API_KEY.substring(0, 5) + "...")
  } else {
    console.log("OPENWEATHER_API_KEY is NOT set.")
  }
  // --- 디버깅 console.log 끝 ---

  try {
    const result = await streamText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"), // 요청하신 Groq 모델로 변경
      system: `당신은 친근하고 도움이 되는 한국어 AI 어시스턴트입니다. 
      사용자에게 날씨 정보와 운세를 제공하는 것이 주요 역할입니다.
      항상 한국어로 대답하고, 친근하고 따뜻한 톤을 사용하세요.
      날씨 정보를 제공할 때는 구체적이고 유용한 조언을 포함하세요.
      운세를 제공할 때는 긍정적이고 격려적인 메시지를 포함하세요.`,
      messages: convertToCoreMessages(messages),
      tools: {
        getWeather: tool({
          description: "특정 지역의 현재 날씨 정보를 가져옵니다",
          parameters: z.object({
            location: z.string().describe("날씨를 확인할 지역 (예: 서울, 부산, 대구, Seoul, Busan)"),
            date: z.string().optional().describe("날짜 (오늘, 내일 등)"),
          }),
          execute: async ({ location, date = "오늘" }) => {
            try {
              const API_KEY = process.env.OPENWEATHER_API_KEY
              if (!API_KEY) {
                console.warn("OpenWeather API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.")
                return {
                  location: location,
                  date: date,
                  condition: "정보 제한",
                  temperature: null,
                  humidity: null,
                  windSpeed: null,
                  advice: "실제 날씨 정보를 위해서는 OpenWeather API 키가 필요합니다.",
                  error: "API 키 없음",
                }
              }

              const cityMap: { [key: string]: string } = {
                서울: "Seoul",
                부산: "Busan",
                대구: "Daegu",
                인천: "Incheon",
                광주: "Gwangju",
                대전: "Daejeon",
                울산: "Ulsan",
                수원: "Suwon",
                창원: "Changwon",
                고양: "Goyang",
                용인: "Yongin",
                성남: "Seongnam",
                청주: "Cheongju",
                안산: "Ansan",
                전주: "Jeonju",
                제주: "Jeju",
                천안: "Cheonan",
                남양주: "Namyangju",
                김해: "Gimhae",
                안양: "Anyang",
                포항: "Pohang", // 추가
                구미: "Gumi", // 추가
                춘천: "Chuncheon", // 추가
                강릉: "Gangneung", // 추가
                원주: "Wonju", // 추가
                여수: "Yeosu", // 추가
                순천: "Suncheon", // 추가
                목포: "Mokpo", // 추가
                군산: "Gunsan", // 추가
                익산: "Iksan", // 추가
                경주: "Gyeongju", // 추가
                안동: "Andong", // 추가
                충주: "Chungju", // 추가
                제천: "Jecheon", // 추가
                동해: "Donghae", // 추가
                속초: "Sokcho", // 추가
                서귀포: "Seogwipo", // 추가
                통영: "Tongyeong", // 추가
                거제: "Geoje", // 추가
                김천: "Gimcheon", // 추가
                양산: "Yangsan", // 추가
                경산: "Gyeongsan", // 추가
                파주: "Paju", // 추가
                의정부: "Uijeongbu", // 추가
                하남: "Hanam", // 추가
                화성: "Hwaseong", // 추가
                평택: "Pyeongtaek", // 추가
                시흥: "Siheung", // 추가
                광명: "Gwangmyeong", // 추가
                군포: "Gunpo", // 추가
                오산: "Osan", // 추가
                이천: "Icheon", // 추가
                안성: "Anseong", // 추가
                양주: "Yangju", // 추가
                구리: "Guri", // 추가
                남원: "Namwon", // 추가
                정읍: "Jeongeup", // 추가
                김제: "Gimje", // 추가
                사천: "Sacheon", // 추가
                밀양: "Miryang", // 추가
                영주: "Yeongju", // 추가
                상주: "Sangju", // 추가
                문경: "Mungyeong", // 추가
                공주: "Gongju", // 추가
                보령: "Boryeong", // 추가
                서산: "Seosan", // 추가
                논산: "Nonsan", // 추가
                계룡: "Gyeryong", // 추가
                당진: "Dangjin", // 추가
                예산: "Yesan", // 추가
                홍성: "Hongseong", // 추가
                청양: "Cheongyang", // 추가
                부여: "Buyeo", // 추가
                서천: "Seocheon", // 추가
                금산: "Geumsan", // 추가
                아산: "Asan", // 추가
                태안: "Taean", // 추가
                음성: "Eumseong", // 추가
                진천: "Jincheon", // 추가
                괴산: "Goesan", // 추가
                단양: "Danyang", // 추가
                영동: "Yeongdong", // 추가
                옥천: "Okcheon", // 추가
                증평: "Jeungpyeong", // 추가
                보은: "Boeun", // 추가
                청원: "Cheongwon", // 추가
                담양: "Damyang", // 추가
                곡성: "Gokseong", // 추가
                구례: "Gurye", // 추가
                고흥: "Goheung", // 추가
                보성: "Boseong", // 추가
                화순: "Hwasun", // 추가
                장흥: "Jangheung", // 추가
                강진: "Gangjin", // 추가
                해남: "Haenam", // 추가
                영암: "Yeongam", // 추가
                무안: "Muan", // 추가
                함평: "Hampyeong", // 추가
                영광: "Yeonggwang", // 추가
                장성: "Jangseong", // 추가
                완도: "Wando", // 추가
                진도: "Jindo", // 추가
                신안: "Sinan", // 추가
                고창: "Gochang", // 추가
                부안: "Buan", // 추가
                순창: "Sunchang", // 추가
                임실: "Imsil", // 추가
                무주: "Muju", // 추가
                진안: "Jinan", // 추가
                장수: "Jangsu", // 추가
                봉화: "Bonghwa", // 추가
                영양: "Yeongyang", // 추가
                청도: "Cheongdo", // 추가
                고령: "Goryeong", // 추가
                성주: "Seongju", // 추가
                칠곡: "Chilgok", // 추가
                예천: "Yecheon", // 추가
                울진: "Uljin", // 추가
                영덕: "Yeongdeok", // 추가
                울릉: "Ulleung", // 추가
                의성: "Uiseong", // 추가
                청송: "Cheongsong", // 추가
                영천: "Yeongcheon", // 추가
                상주: "Sangju", // 추가
                문경: "Mungyeong", // 추가
                거창: "Geochang", // 추가
                함양: "Hamyang", // 추가
                산청: "Sancheong", // 추가
                합천: "Hapcheon", // 추가
                창녕: "Changnyeong", // 추가
                고성: "Goseong", // 추가
                남해: "Namhae", // 추가
                하동: "Hadong", // 추가
                함안: "Haman", // 추가
                의령: "Uiryeong", // 추가
                양평: "Yangpyeong", // 추가
                가평: "Gapyeong", // 추가
                연천: "Yeoncheon", // 추가
                포천: "Pocheon", // 추가
                동두천: "Dongducheon", // 추가
                과천: "Gwacheon", // 추가
                의왕: "Uiwang", // 추가
                하남: "Hanam", // 추가
                광주: "Gwangju", // 추가 (경기도 광주)
                여주: "Yeoju", // 추가
                양주: "Yangju", // 추가
                파주: "Paju", // 추가
                김포: "Gimpo", // 추가
                안성: "Anseong", // 추가
                이천: "Icheon", // 추가
                오산: "Osan", // 추가
                군포: "Gunpo", // 추가
                의왕: "Uiwang", // 추가
                과천: "Gwacheon", // 추가
                동두천: "Dongducheon", // 추가
                포천: "Pocheon", // 추가
                연천: "Yeoncheon", // 추가
                가평: "Gapyeong", // 추가
                양평: "Yangpyeong", // 추가
                철원: "Cheorwon", // 추가
                화천: "Hwacheon", // 추가
                양구: "Yanggu", // 추가
                인제: "Inje", // 추가
                고성: "Goseong", // 추가 (강원도 고성)
                삼척: "Samcheok", // 추가
                태백: "Taebaek", // 추가
                정선: "Jeongseon", // 추가
                평창: "Pyeongchang", // 추가
                횡성: "Hoengseong", // 추가
                영월: "Yeongwol", // 추가
                단양: "Danyang", // 추가
                제천: "Jecheon", // 추가
                음성: "Eumseong", // 추가
                진천: "Jincheon", // 추가
                괴산: "Goesan", // 추가
                증평: "Jeungpyeong", // 추가
                보은: "Boeun", // 추가
                옥천: "Okcheon", // 추가
                영동: "Yeongdong", // 추가
                공주: "Gongju", // 추가
                보령: "Boryeong", // 추가
                서산: "Seosan", // 추가
                논산: "Nonsan", // 추가
                계룡: "Gyeryong", // 추가
                당진: "Dangjin", // 추가
                금산: "Geumsan", // 추가
                부여: "Buyeo", // 추가
                서천: "Seocheon", // 추가
                청양: "Cheongyang", // 추가
                홍성: "Hongseong", // 추가
                예산: "Yesan", // 추가
                태안: "Taean", // 추가
                군산: "Gunsan", // 추가
                익산: "Iksan", // 추가
                정읍: "Jeongeup", // 추가
                남원: "Namwon", // 추가
                김제: "Gimje", // 추가
                완주: "Wanju", // 추가
                진안: "Jinan", // 추가
                무주: "Muju", // 추가
                장수: "Jangsu", // 추가
                임실: "Imsil", // 추가
                순창: "Sunchang", // 추가
                고창: "Gochang", // 추가
                부안: "Buan", // 추가
                담양: "Damyang", // 추가
                곡성: "Gokseong", // 추가
                구례: "Gurye", // 추가
                고흥: "Goheung", // 추가
                보성: "Boseong", // 추가
                화순: "Hwasun", // 추가
                장흥: "Jangheung", // 추가
                강진: "Gangjin", // 추가
                해남: "Haenam", // 추가
                영암: "Yeongam", // 추가
                무안: "Muan", // 추가
                함평: "Hampyeong", // 추가
                영광: "Yeonggwang", // 추가
                장성: "Jangseong", // 추가
                완도: "Wando", // 추가
                진도: "Jindo", // 추가
                신안: "Sinan", // 추가
                경주: "Gyeongju", // 추가
                김천: "Gimcheon", // 추가
                안동: "Andong", // 추가
                구미: "Gumi", // 추가
                영주: "Yeongju", // 추가
                영천: "Yeongcheon", // 추가
                상주: "Sangju", // 추가
                문경: "Mungyeong", // 추가
                경산: "Gyeongsan", // 추가
                군위: "Gunwi", // 추가
                의성: "Uiseong", // 추가
                청송: "Cheongsong", // 추가
                영양: "Yeongyang", // 추가
                영덕: "Yeongdeok", // 추가
                청도: "Cheongdo", // 추가
                고령: "Goryeong", // 추가
                성주: "Seongju", // 추가
                칠곡: "Chilgok", // 추가
                예천: "Yecheon", // 추가
                봉화: "Bonghwa", // 추가
                울진: "Uljin", // 추가
                울릉: "Ulleung", // 추가
                창원: "Changwon", // 추가
                진주: "Jinju", // 추가
                통영: "Tongyeong", // 추가
                사천: "Sacheon", // 추가
                김해: "Gimhae", // 추가
                밀양: "Miryang", // 추가
                거제: "Geoje", // 추가
                양산: "Yangsan", // 추가
                의령: "Uiryeong", // 추가
                함안: "Haman", // 추가
                창녕: "Changnyeong", // 추가
                고성: "Goseong", // 추가 (경남 고성)
                남해: "Namhae", // 추가
                하동: "Hadong", // 추가
                산청: "Sancheong", // 추가
                함양: "Hamyang", // 추가
                거창: "Geochang", // 추가
                합천: "Hapcheon", // 추가
              }
              const cityName = cityMap[location] || location

              // cityMap에 없는 도시이거나, OpenWeatherMap이 인식하지 못하는 도시일 경우
              if (!cityName) {
                return {
                  location: location,
                  date: date,
                  condition: "정보 없음",
                  temperature: null,
                  humidity: null,
                  windSpeed: null,
                  advice: `'${location}' 지역의 날씨 정보를 찾을 수 없습니다. 도시 이름을 다시 확인해주세요.`,
                  error: "City Not Found (Mapped)",
                }
              }

              const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},KR&appid=${API_KEY}&units=metric&lang=kr`
              const currentResponse = await fetch(currentWeatherUrl)

              if (!currentResponse.ok) {
                const errorText = await currentResponse.text()
                console.error(`OpenWeather API 오류: ${currentResponse.status} - ${errorText}`)
                if (currentResponse.status === 401) {
                  throw new Error("API 키가 유효하지 않습니다. OpenWeather API 키를 확인해주세요.")
                } else if (currentResponse.status === 404) {
                  // 404 에러 발생 시 사용자에게 더 명확한 메시지 전달
                  return {
                    location: location,
                    date: date,
                    condition: "정보 없음",
                    temperature: null,
                    humidity: null,
                    windSpeed: null,
                    advice: `'${location}' 지역의 날씨 정보를 찾을 수 없습니다. 도시 이름을 다시 확인해주세요.`,
                    error: "City Not Found (API)",
                  }
                } else {
                  throw new Error(`날씨 정보를 가져올 수 없습니다: ${currentResponse.status}`)
                }
              }
              const currentData = await currentResponse.json()

              let forecastData = null
              if (date.includes("내일") || date.includes("tomorrow")) {
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},KR&appid=${API_KEY}&units=metric&lang=kr`
                const forecastResponse = await fetch(forecastUrl)
                if (forecastResponse.ok) {
                  forecastData = await forecastResponse.json()
                }
              }

              let weatherData
              if (forecastData && (date.includes("내일") || date.includes("tomorrow"))) {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                const tomorrowStr = tomorrow.toISOString().split("T")[0]
                const tomorrowForecast =
                  forecastData.list.find(
                    (item: any) => item.dt_txt.includes(tomorrowStr) && item.dt_txt.includes("15:00"),
                  ) || forecastData.list.find((item: any) => item.dt_txt.includes(tomorrowStr))
                weatherData = tomorrowForecast || currentData
              } else {
                weatherData = currentData
              }

              const temperature = Math.round(weatherData.main?.temp || currentData.main.temp)
              const feelsLike = Math.round(weatherData.main?.feels_like || currentData.main.feels_like)
              const humidity = weatherData.main?.humidity || currentData.main.humidity
              const windSpeed = Math.round((weatherData.wind?.speed || currentData.wind.speed) * 3.6)
              const condition = weatherData.weather?.[0]?.description || currentData.weather[0].description
              const icon = weatherData.weather?.[0]?.icon || currentData.weather[0].icon

              const getWeatherAdvice = (condition: string, temp: number) => {
                if (condition.includes("비") || condition.includes("rain"))
                  return "우산을 꼭 챙기세요! 미끄러운 길을 조심하세요."
                if (condition.includes("눈") || condition.includes("snow"))
                  return "따뜻하게 입고 나가세요! 눈길 운전 조심하세요."
                if (temp >= 30) return "매우 더운 날씨예요. 충분한 수분 섭취와 자외선 차단에 신경 쓰세요!"
                if (temp <= 0) return "매우 추운 날씨예요. 방한용품을 꼭 챙기고 동상에 주의하세요!"
                if (temp <= 10) return "쌀쌀한 날씨예요. 따뜻한 옷을 입고 나가세요."
                if (condition.includes("맑") || condition.includes("clear"))
                  return "야외 활동하기 좋은 날씨예요! 햇볕을 즐겨보세요."
                return "적당한 옷차림으로 나가세요!"
              }

              return {
                location: location,
                date: date,
                condition: condition,
                temperature: temperature,
                feelsLike: feelsLike,
                humidity: humidity,
                windSpeed: windSpeed,
                icon: icon,
                advice: getWeatherAdvice(condition, temperature),
                source: "OpenWeatherMap",
              }
            } catch (error) {
              console.error("날씨 API 오류:", error)
              return {
                location: location,
                date: date,
                condition: "정보 없음",
                temperature: null,
                humidity: null,
                windSpeed: null,
                advice: "죄송합니다. 현재 날씨 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.",
                error: "API 연결 오류",
              }
            }
          },
        }),

        getFortune: tool({
          description: "오늘의 운세나 특정 기간의 운세를 제공합니다",
          parameters: z.object({
            period: z.string().describe("운세 기간 (오늘, 이번주, 이번달 등)"),
            category: z.string().optional().describe("운세 카테고리 (전체, 연애, 직업, 건강, 재물 등)"),
          }),
          execute: async ({ period, category = "전체" }) => {
            const fortuneTypes = {
              전체: ["대길", "길", "중길", "소길", "평"],
              연애: ["새로운 만남", "기존 관계 발전", "소통이 중요", "인내가 필요", "자신에게 집중"],
              직업: ["승진 기회", "새로운 프로젝트", "동료와의 협력", "실력 향상", "안정적 진행"],
              건강: ["활력 충전", "운동 시작", "휴식 필요", "규칙적 생활", "스트레스 관리"],
              재물: ["투자 기회", "절약 필요", "부수입 가능", "계획적 소비", "안정적 관리"],
            }
            const fortunes = fortuneTypes[category as keyof typeof fortuneTypes] || fortuneTypes.전체
            const fortune = fortunes[Math.floor(Math.random() * fortunes.length)]
            const luckyNumbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 100) + 1)
            const luckyColors = ["빨강", "파랑", "노랑", "초록", "보라", "주황", "분홍"]
            const luckyColor = luckyColors[Math.floor(Math.random() * luckyColors.length)]
            return {
              period,
              category,
              fortune,
              luckyNumbers,
              luckyColor,
              advice: `${period}은 ${fortune}의 기운이 있습니다. 행운의 색깔 ${luckyColor}을 활용해보세요!`,
            }
          },
        }),

        getDateTime: tool({
          description: "현재 날짜와 시간 정보를 가져옵니다",
          parameters: z.object({}),
          execute: async () => {
            const now = new Date()
            return {
              currentTime: now.toLocaleString("ko-KR"),
              date: now.toLocaleDateString("ko-KR"),
              time: now.toLocaleTimeString("ko-KR"),
              dayOfWeek: now.toLocaleDateString("ko-KR", { weekday: "long" }),
            }
          },
        }),
      },
      maxSteps: 5,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("스트림 텍스트 생성 중 오류 발생:", error)
    return new Response(JSON.stringify({ error: "챗봇 응답 생성 중 오류가 발생했습니다. 서버 로그를 확인해주세요." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
