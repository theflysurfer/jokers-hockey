import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const testPhotos = [
  { name: 'match-u13-nice-1.jpg', url: 'https://picsum.photos/1200/800?random=1' },
  { name: 'match-u15-marseille-1.jpg', url: 'https://picsum.photos/1200/800?random=2' },
  { name: 'match-n1-aix-1.jpg', url: 'https://picsum.photos/1200/800?random=3' },
  { name: 'match-u17-toulon-1.jpg', url: 'https://picsum.photos/1200/800?random=4' },
  { name: 'match-u13-entrainement-1.jpg', url: 'https://picsum.photos/1200/800?random=5' },
  { name: 'event-noel-1.jpg', url: 'https://picsum.photos/1200/800?random=6' },
  { name: 'event-tournoi-1.jpg', url: 'https://picsum.photos/1200/800?random=7' },
  { name: 'event-ceremonie-1.jpg', url: 'https://picsum.photos/1200/800?random=8' },
]

async function downloadPhoto(url: string, outputPath: string, redirectCount = 0): Promise<void> {
  if (redirectCount > 5) {
    throw new Error('Too many redirects')
  }

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        // Follow redirects recursively
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
          if (!response.headers.location) {
            reject(new Error('Redirect without location header'))
            return
          }
          // Recursively follow redirect
          downloadPhoto(response.headers.location, outputPath, redirectCount + 1)
            .then(resolve)
            .catch(reject)
        } else if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(outputPath)
          response.pipe(fileStream)
          fileStream.on('finish', () => {
            fileStream.close()
            resolve()
          })
          fileStream.on('error', reject)
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`))
        }
      })
      .on('error', reject)
  })
}

async function downloadAllPhotos() {
  const photosDir = path.join(__dirname, 'seed-assets', 'photos')

  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true })
  }

  console.log('📸 Downloading test photos...')

  for (const photo of testPhotos) {
    const outputPath = path.join(photosDir, photo.name)

    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭️  ${photo.name} already exists, skipping`)
      continue
    }

    console.log(`  Downloading ${photo.name}...`)
    try {
      await downloadPhoto(photo.url, outputPath)
      console.log(`  ✅ ${photo.name} downloaded`)
      // Rate limiting to avoid overwhelming Unsplash
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`  ❌ Failed to download ${photo.name}:`, error)
    }
  }

  console.log('\n✅ All photos downloaded!')
  console.log(`📁 Photos saved to: ${photosDir}`)
}

downloadAllPhotos().catch((error) => {
  console.error('❌ Download failed:', error)
  process.exit(1)
})
