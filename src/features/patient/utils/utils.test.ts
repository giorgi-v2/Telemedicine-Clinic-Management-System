import { describe, expect, it } from 'vitest'
import { formatDayMonth, formatLongDate, isValidIsoDate, todayIso } from './date'
import { getInitials, getShortName } from './name'
import { hasErrors, validatePrescriptionDraft, validateRecordDraft } from './validation'

describe('date', () => {
  it('formats long and short Georgian dates', () => {
    expect(formatLongDate('2026-10-28')).toBe('28 ოქტომბერი, 2026')
    expect(formatLongDate('1995-05-12')).toBe('12 მაისი, 1995')
    expect(formatDayMonth('2026-11-06')).toBe('6 ნოემბერი')
  })
  it('rejects impossible dates and returns the raw value', () => {
    expect(isValidIsoDate('2026-02-30')).toBe(false)
    expect(isValidIsoDate('2026-13-01')).toBe(false)
    expect(isValidIsoDate('28/10/2026')).toBe(false)
    expect(formatLongDate('not-a-date')).toBe('not-a-date')
  })
  it('todayIso returns a YYYY-MM-DD string', () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('name', () => {
  it('builds initials and short name', () => {
    expect(getInitials('გიორგი ბერიძე')).toBe('გბ')
    expect(getShortName('გიორგი ბერიძე')).toBe('გიორგი ბ.')
    expect(getShortName('გიორგი')).toBe('გიორგი')
  })
})

describe('validation', () => {
  it('requires non-blank record fields', () => {
    const errors = validateRecordDraft({ title: '   ', notes: '' })
    expect(errors.title).toBe('ეს ველი სავალდებულოა.')
    expect(errors.notes).toBe('აღწერა არ უნდა იყოს ცარიელი.')
    expect(hasErrors(errors)).toBe(true)
  })
  it('accepts valid records and enforces max length', () => {
    expect(hasErrors(validateRecordDraft({ title: 'a', notes: 'b' }))).toBe(false)
    expect(validateRecordDraft({ title: 'x'.repeat(121), notes: 'b' }).title).toBeDefined()
  })
  it('validates prescriptions', () => {
    expect(hasErrors(validatePrescriptionDraft({ medication: 'A', instructions: 'B' }))).toBe(false)
    expect(validatePrescriptionDraft({ medication: '', instructions: ' ' })).toEqual({
      medication: 'ეს ველი სავალდებულოა.',
      instructions: 'ინსტრუქცია არ უნდა იყოს ცარიელი.',
    })
  })
})
