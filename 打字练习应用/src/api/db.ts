import Dexie, { type Table } from 'dexie'

export interface TypingRecord {
  id?: number
  mode: 'letter' | 'word' | 'essay_en' | 'essay_cn'
  wpm: number
  accuracy: number
  totalChars: number
  correctChars: number
  duration: number
  date: Date
}

export interface DailyStats {
  id?: number
  date: string
  totalPractices: number
  totalWpm: number
  avgAccuracy: number
  totalDuration: number
}

export class TypingDB extends Dexie {
  records!: Table<TypingRecord, number>
  dailyStats!: Table<DailyStats, number>

  constructor() {
    super('TypingDB')
    this.version(1).stores({
      records: '++id, mode, date',
      dailyStats: '++id, date'
    })
  }

  async addRecord(record: Omit<TypingRecord, 'id'>) {
    const id = await this.records.add(record)
    await this.updateDailyStats(record)
    return id
  }

  async updateDailyStats(record: Omit<TypingRecord, 'id'>) {
    const today = new Date().toISOString().split('T')[0]
    const existing = await this.dailyStats.where('date').equals(today).first()

    if (existing) {
      const newTotalPractices = existing.totalPractices + 1
      const newTotalWpm = existing.totalWpm + record.wpm
      const newTotalAccuracy = existing.avgAccuracy * existing.totalPractices + record.accuracy
      const newAvgAccuracy = newTotalAccuracy / newTotalPractices
      const newTotalDuration = existing.totalDuration + record.duration

      await this.dailyStats.update(existing.id!, {
        totalPractices: newTotalPractices,
        totalWpm: newTotalWpm,
        avgAccuracy: Math.round(newAvgAccuracy * 100) / 100,
        totalDuration: newTotalDuration
      })
    } else {
      await this.dailyStats.add({
        date: today,
        totalPractices: 1,
        totalWpm: record.wpm,
        avgAccuracy: record.accuracy,
        totalDuration: record.duration
      })
    }
  }

  async getRecordsByMode(mode: TypingRecord['mode']) {
    return this.records.where('mode').equals(mode).reverse().toArray()
  }

  async getAllRecords() {
    return this.records.reverse().toArray()
  }

  async getDailyStats(days: number = 7) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    const startDate = date.toISOString().split('T')[0]
    return this.dailyStats.where('date').aboveOrEqual(startDate).toArray()
  }

  async getTotalStats() {
    const records = await this.records.toArray()
    if (records.length === 0) {
      return { totalPractices: 0, avgWpm: 0, avgAccuracy: 0, totalDuration: 0 }
    }
    const totalPractices = records.length
    const avgWpm = Math.round(records.reduce((sum, r) => sum + r.wpm, 0) / totalPractices)
    const avgAccuracy = Math.round(records.reduce((sum, r) => sum + r.accuracy, 0) / totalPractices * 100) / 100
    const totalDuration = records.reduce((sum, r) => sum + r.duration, 0)
    return { totalPractices, avgWpm, avgAccuracy, totalDuration }
  }

  async getBestRecords() {
    const modes: TypingRecord['mode'][] = ['letter', 'word', 'essay_en', 'essay_cn']
    const bestRecords: Record<string, TypingRecord | null> = {}

    for (const mode of modes) {
      const records = await this.getRecordsByMode(mode)
      bestRecords[mode] = records.length > 0 
        ? records.reduce((best, r) => r.wpm > best.wpm ? r : best) 
        : null
    }

    return bestRecords
  }
}

export const db = new TypingDB()
