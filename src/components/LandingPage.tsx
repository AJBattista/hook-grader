'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ResultsView from '@/components/ResultsView'
import { HookGradeResponse } from '@/lib/types'

export default function LandingPage() {
  const [hook, setHook] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [category, setCategory] = useState('Beverage')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<HookGradeResponse | null>(null)
  const [error, setError] = useState('')

  const platforms = ['TikTok', 'Instagram Reel', 'Meta Ad', 'YouTube Short']
  const categories = ['Beverage', 'Beauty', 'Supplement', 'Fitness', 'Tech', 'Fashion', 'Other']

  const handleGrade = async () => {
    if (!hook.trim()) return
    setIsLoading(true)
    setError('')
    setResult(null)
    
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hook, platform, category }),
      })

      if (!res.ok) {
        throw new Error('Failed to grade hook')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-24 relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl space-y-12 text-center"
          >
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Ad Hook Grader
              </h1>
              <p className="text-xl sm:text-2xl text-zinc-400 max-w-2xl mx-auto">
                Paste your TikTok, Reel, or Meta ad hook. Get a score + 5 better alternatives.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative group text-left">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <textarea
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  placeholder="e.g. I was today years old when I found out you can flavor your water without the sugar..."
                  className="relative w-full h-40 bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-4">
                 <div className="flex flex-wrap gap-3 justify-center">
                  {platforms.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        platform === p 
                          ? "bg-[var(--accent)] text-black scale-105 shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs transition-all duration-300",
                        category === c
                          ? "bg-zinc-700 text-white scale-105" 
                          : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                 <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-12 py-6 rounded-full font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all transform hover:-translate-y-1"
                  onClick={handleGrade}
                  disabled={isLoading || !hook.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                       <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                        </span>
                      Grading...
                    </div>
                  ) : "Grade My Hook"}
                </Button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
            </div>
          </motion.div>
        ) : (
          <ResultsView {...result} onReset={handleReset} />
        )}
      </AnimatePresence>

      <div className="mt-32 max-w-4xl w-full space-y-12 pb-24">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Paste Hook", desc: "Input your ad copy." },
            { step: "2", title: "Get Scored", desc: "AI rates it on 5 key dimensions." },
            { step: "3", title: "Optimize", desc: "Get 5 viral-ready alternatives." }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-black font-bold text-xl flex items-center justify-center mx-auto">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-16 text-center">
        <p className="text-sm text-[#888888] opacity-80">
          Built by <a href="https://www.linkedin.com/in/aj-battista/" target="_blank" rel="noopener noreferrer" className="hover:text-[#a0a0a0] hover:underline transition-colors">Aloysius 'AJ' Battista</a> — Marketing · TampaFL
        </p>
      </footer>
    </div>
  )
}
