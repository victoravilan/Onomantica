import { set, get } from 'idb-keyval'
import type { NombreItem } from '../types'

const KEY = 'onomantica-dataset-v1'
const URL = '/data/nombres_completos.json'

export async function loadDataset(): Promise<NombreItem[]> {
  const cached = await get<NombreItem[]>(KEY)
  if (cached?.length) return cached
  const res = await fetch(URL, { cache: 'no-cache' })
  const data = await res.json()
  await set(KEY, data)
  return data
}
