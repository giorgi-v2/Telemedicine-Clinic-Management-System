import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupStore } from '../../../app/store'
import reducer, {
  initialState,
  prescriptionUpdated,
  recordAdded,
  recordUpdated,
} from './medicalRecordsSlice'
import type { MedicalRecordsState } from './medicalRecordsSlice'
import { fetchMedicalData } from './medicalRecordsThunks'
import type { MedicalData } from './medicalRecordsThunks'

const readJson = (file: string): unknown => JSON.parse(readFileSync(`public/data/${file}`, 'utf8'))

function data(patientId: string): MedicalData {
  const pick = (file: string) => (readJson(file) as { patientId: string }[]).filter((i) => i.patientId === patientId)
  return {
    patient: (readJson('patients.json') as { id: string }[]).find((p) => p.id === patientId) as MedicalData['patient'],
    records: pick('medicalRecords.json') as MedicalData['records'],
    prescriptions: pick('prescriptions.json') as MedicalData['prescriptions'],
    doctors: readJson('doctors.json') as MedicalData['doctors'],
  }
}

describe('medicalRecordsSlice reducers', () => {
  it('pending for a new patient clears old data and stores requestId', () => {
    const loaded = reducer(
      reducer(initialState, fetchMedicalData.pending('r1', 'PAT-001')),
      fetchMedicalData.fulfilled(data('PAT-001'), 'r1', 'PAT-001'),
    )
    expect(loaded.records).toHaveLength(3)

    const next = reducer(loaded, fetchMedicalData.pending('r2', 'PAT-002'))
    expect(next.records).toEqual([])
    expect(next.prescriptions).toEqual([])
    expect(next.patient).toBeNull()
    expect(next.loadedPatientId).toBe('PAT-002')
    expect(next.activeRequestId).toBe('r2')
    expect(next.status).toBe('pending')
  })

  it('ignores a stale fulfilled response from an older request', () => {
    let state = reducer(initialState, fetchMedicalData.pending('old', 'PAT-001'))
    state = reducer(state, fetchMedicalData.pending('new', 'PAT-002'))
    state = reducer(state, fetchMedicalData.fulfilled(data('PAT-001'), 'old', 'PAT-001'))
    expect(state.patient).toBeNull()
    expect(state.status).toBe('pending')
    state = reducer(state, fetchMedicalData.fulfilled(data('PAT-002'), 'new', 'PAT-002'))
    expect(state.patient?.id).toBe('PAT-002')
    expect(state.records.every((r) => r.patientId === 'PAT-002')).toBe(true)
    expect(state.status).toBe('succeeded')
  })

  it('stores failure only for the active request; abort is not shown as an error', () => {
    let state = reducer(initialState, fetchMedicalData.pending('a', 'PAT-001'))
    state = reducer(state, fetchMedicalData.rejected(new Error('boom'), 'zzz', 'PAT-001'))
    expect(state.status).toBe('pending')

    state = reducer(state, fetchMedicalData.rejected(new Error('boom'), 'a', 'PAT-001'))
    expect(state.status).toBe('failed')
    expect(state.error).toBe('boom')

    let aborted = reducer(initialState, fetchMedicalData.pending('b', 'PAT-001'))
    const abortError = new Error('Aborted')
    abortError.name = 'AbortError'
    aborted = reducer(aborted, fetchMedicalData.rejected(abortError, 'b', 'PAT-001'))
    expect(aborted.status).toBe('idle')
    expect(aborted.error).toBeNull()
  })

  describe('edits', () => {
    const loaded = (): MedicalRecordsState =>
      reducer(
        reducer(initialState, fetchMedicalData.pending('r', 'PAT-001')),
        fetchMedicalData.fulfilled(data('PAT-001'), 'r', 'PAT-001'),
      )

    it('recordUpdated changes only the targeted record', () => {
      const before = loaded()
      const after = reducer(before, recordUpdated({ id: 'rec-002', changes: { title: 'ახალი', notes: 'ტექსტი' } }))
      expect(after.records.find((r) => r.id === 'rec-002')).toMatchObject({ title: 'ახალი', notes: 'ტექსტი' })
      expect(after.records.find((r) => r.id === 'rec-001')).toEqual(before.records.find((r) => r.id === 'rec-001'))
      expect(after.records.find((r) => r.id === 'rec-002')?.visitDate).toBe('2026-09-14')
    })

    it('recordUpdated with an unknown id changes nothing', () => {
      const before = loaded()
      expect(reducer(before, recordUpdated({ id: 'nope', changes: { title: 'x', notes: 'y' } }))).toEqual(before)
    })

    it('prescriptionUpdated changes only the targeted prescription', () => {
      const before = loaded()
      const after = reducer(before, prescriptionUpdated({ id: 'rx-002', changes: { medication: 'C', instructions: 'i' } }))
      expect(after.prescriptions.find((p) => p.id === 'rx-002')).toMatchObject({ medication: 'C', instructions: 'i' })
      expect(after.prescriptions.find((p) => p.id === 'rx-001')?.medication).toBe('პრეპარატი A')
    })

    it('recordAdded creates id and date in prepare and does not mutate the previous state', () => {
      const before = loaded()
      const action = recordAdded({ patientId: 'PAT-001', doctorId: 'doc-001', title: 'ახალი', notes: 'n' })
      expect(action.payload.id).toBeTruthy()
      expect(action.payload.visitDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      const after = reducer(before, action)
      expect(after.records).toHaveLength(4)
      expect(before.records).toHaveLength(3)
    })
  })
})

describe('fetchMedicalData thunk (fake fetch over public/data)', () => {
  let releaseFirst: (() => void) | null = null

  beforeEach(() => {
    releaseFirst = null
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init?: { signal?: AbortSignal }) => {
        const file = url.split('/').pop() as string
        const respond = () => ({ ok: true, status: 200, json: async () => readJson(file) })
        // PAT-001-ის პირველი მოთხოვნა (patients.json) ხელოვნურად დაგვიანდება
        if (file === 'patients.json' && !releaseFirst) {
          return new Promise((resolve, reject) => {
            releaseFirst = () => resolve(respond())
            init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
          })
        }
        return Promise.resolve(respond())
      }),
    )
  })
  afterEach(() => vi.unstubAllGlobals())

  it('loads only the requested patient, filtered by patientId', async () => {
    releaseFirst = () => {}
    const store = setupStore()
    await store.dispatch(fetchMedicalData('PAT-002'))
    const s = store.getState().medicalRecords
    expect(s.status).toBe('succeeded')
    expect(s.patient?.fullName).toBe('მარიამ ჯავახიშვილი')
    expect(s.records.map((r) => r.id).sort()).toEqual(['rec-101', 'rec-102'])
    expect(s.prescriptions.map((p) => p.id)).toEqual(['rx-101'])
  })

  it('fast patient switch: aborted old request never overwrites the new patient', async () => {
    const store = setupStore()
    const first = store.dispatch(fetchMedicalData('PAT-001')) // დაგვიანებული
    first.abort()
    await store.dispatch(fetchMedicalData('PAT-002'))
    await first
    const s = store.getState().medicalRecords
    expect(s.loadedPatientId).toBe('PAT-002')
    expect(s.patient?.id).toBe('PAT-002')
    expect(s.records.every((r) => r.patientId === 'PAT-002')).toBe(true)
    expect(s.status).toBe('succeeded')
  })

  it('does not refetch an already loaded patient (session edits survive remount)', async () => {
    releaseFirst = () => {}
    const store = setupStore()
    await store.dispatch(fetchMedicalData('PAT-001'))
    store.dispatch(recordUpdated({ id: 'rec-001', changes: { title: 'რედაქტირებული', notes: 'n' } }))
    const fetchMock = vi.mocked(fetch)
    const calls = fetchMock.mock.calls.length
    await store.dispatch(fetchMedicalData('PAT-001'))
    expect(fetchMock.mock.calls.length).toBe(calls)
    expect(store.getState().medicalRecords.records.find((r) => r.id === 'rec-001')?.title).toBe('რედაქტირებული')
  })

  it('fails with a shared error on unknown patient and recovers on retry', async () => {
    releaseFirst = () => {}
    const store = setupStore()
    await store.dispatch(fetchMedicalData('PAT-999'))
    expect(store.getState().medicalRecords.status).toBe('failed')
    await store.dispatch(fetchMedicalData('PAT-001'))
    expect(store.getState().medicalRecords.status).toBe('succeeded')
  })

  it('rejects malformed server data instead of trusting a type assertion', async () => {
    releaseFirst = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        status: 200,
        json: async () => (url.endsWith('medicalRecords.json') ? [{ id: 'x', visitDate: '28/10/2026' }] : readJson(url.split('/').pop() as string)),
      })),
    )
    const store = setupStore()
    await store.dispatch(fetchMedicalData('PAT-001'))
    expect(store.getState().medicalRecords.status).toBe('failed')
    expect(store.getState().medicalRecords.error).toContain('medicalRecords.json')
  })

  it('treats HTTP errors as failures', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })))
    const store = setupStore()
    await store.dispatch(fetchMedicalData('PAT-001'))
    expect(store.getState().medicalRecords.error).toContain('HTTP 404')
  })

  it('keeps working when doctors.json is unavailable', async () => {
    releaseFirst = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.endsWith('doctors.json')
          ? { ok: false, status: 404, json: async () => ({}) }
          : { ok: true, status: 200, json: async () => readJson(url.split('/').pop() as string) },
      ),
    )
    const store = setupStore()
    await store.dispatch(fetchMedicalData('PAT-001'))
    expect(store.getState().medicalRecords.status).toBe('succeeded')
    expect(store.getState().medicalRecords.doctors).toEqual([])
  })
})
