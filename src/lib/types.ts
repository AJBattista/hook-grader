export interface Dimension {
  name: string
  score: number // 0-20
  explanation: string
}

export interface Alternative {
  label: string
  hook: string
  explanation: string
}

export interface HookGradeResponse {
  overallScore: number // 0-100
  dimensions: Dimension[]
  alternatives: Alternative[]
}
