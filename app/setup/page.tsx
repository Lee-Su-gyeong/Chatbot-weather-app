import { OpenAISetupGuide } from "@/components/openai-setup-guide"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <OpenAISetupGuide />
      </div>
    </div>
  )
}
