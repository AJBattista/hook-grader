import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HookGradeResponse } from '@/lib/types'

interface ResultsViewProps extends HookGradeResponse {
  onReset: () => void
}

export default function ResultsView({ overallScore, dimensions, alternatives, onReset }: ResultsViewProps) {
  const score = overallScore // mapping prop name for convenience
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-500"
    if (s >= 60) return "text-yellow-500"
    if (s >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreColorBg = (s: number) => {
    if (s >= 80) return "bg-green-500"
    if (s >= 60) return "bg-yellow-500"
    if (s >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // could add toast here
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section A: Overall Score */}
        <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-zinc-400 font-medium uppercase tracking-wider text-sm">Overall Hook Score</h2>
          <div className={`text-8xl font-black ${getScoreColor(score)} font-mono`}>
            {score}
          </div>
          <div className="text-zinc-500 text-sm">
            {score >= 80 ? "🔥 Strong hook" : score >= 60 ? "⚡ Decent, needs refinement" : score >= 40 ? "😐 Weak — losing viewers" : "🚫 Scroll-past territory"}
          </div>
        </div>

        {/* Section B: Dimensions */}
        <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 space-y-6">
          <h3 className="text-xl font-bold">Breakdown</h3>
          <div className="space-y-4">
            {dimensions.map((dim, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-300">{dim.name}</span>
                  <span className={getScoreColor(dim.score * 5)}>{dim.score}/20</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(dim.score / 20) * 100}%` }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className={`h-full ${getScoreColorBg(dim.score * 5)}`}
                  />
                </div>
                <p className="text-xs text-zinc-500">{dim.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section C: Alternatives */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">5 Better Alternatives</h3>
        <div className="grid grid-cols-1 gap-4">
          {alternatives.map((alt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent)]/10 px-2 py-0.5 rounded">
                      {alt.label}
                    </span>
                  </div>
                  <p className="text-xl font-medium text-white font-sans">"{alt.hook}"</p>
                  <p className="text-sm text-zinc-500">
                    <span className="text-zinc-400 font-medium">Why it works:</span> {alt.explanation}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(alt.hook)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section D: Actions */}
      <div className="flex justify-center gap-4 pt-8">
        <Button onClick={onReset} variant="outline" size="lg" className="rounded-full">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Another Hook
        </Button>
      </div>
    </motion.div>
  )
}
