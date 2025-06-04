export interface DiaryEntry {
  id: number
  date: string
  weather: 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy'
  visibility: 'great' | 'good' | 'ok' | 'poor'
}

export interface NewDiaryEntry extends Omit<DiaryEntry, 'id'> {
  comment: string
}
