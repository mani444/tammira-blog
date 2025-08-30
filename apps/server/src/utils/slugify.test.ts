import { describe, it, expect } from 'vitest'
import { slugify } from './slugify.js'

describe('slugify', () => {
  it('normalizes and trims dashes', () => {
    expect(slugify(' Hello, World! ')).toBe('hello-world')
  })

  it('removes diacritics', () => {
    expect(slugify('Café déjà-vu')).toBe('cafe-deja-vu')
  })
})

