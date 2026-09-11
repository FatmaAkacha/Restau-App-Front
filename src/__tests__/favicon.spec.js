import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

describe('Feature 5: Favicon', () => {
  it('5.3.1 - favicon link present in HTML head', () => {
    const indexPath = resolve(process.cwd(), 'index.html')
    const content = readFileSync(indexPath, 'utf-8')
    
    expect(content).toContain('rel="icon"')
    expect(content).toContain('href="/favicon.ico"')
  })

  it('5.3.2 - favicon file exists at correct path', () => {
    const faviconPath = resolve(process.cwd(), 'public', 'favicon.ico')
    expect(existsSync(faviconPath)).toBe(true)
  })

  it('5.3.3 - favicon link has type attribute', () => {
    const indexPath = resolve(process.cwd(), 'index.html')
    const content = readFileSync(indexPath, 'utf-8')
    
    expect(content).toContain('type="image/x-icon"')
  })
})
