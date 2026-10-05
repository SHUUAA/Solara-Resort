import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const sourceDir = path.resolve('public/images')
const outputDir = path.join(sourceDir, 'responsive')
const names = ['beach', 'breakfast', 'coast', 'dining', 'pool', 'spa', 'suite', 'villa']
const widths = [640, 960, 1440]

await mkdir(outputDir, { recursive: true })
for (const name of names) {
  for (const width of widths) {
    const source = path.join(sourceDir, `${name}.webp`)
    await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality: 58 }).toFile(path.join(outputDir, `${name}-${width}.avif`))
    await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(outputDir, `${name}-${width}.webp`))
  }
}
