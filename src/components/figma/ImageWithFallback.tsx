import React, { useState } from 'react'

// Map all files under src/assets to their built URLs so JSON paths like 
// "/assets/invoase/1.png" can be resolved at runtime.
const ASSET_URLS = import.meta.glob('/src/assets/**/*', {
  eager: true,
  as: 'url',
}) as Record<string, string>

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [attemptIndex, setAttemptIndex] = useState(0)

  const handleFinalError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // Attempt to resolve local assets referenced as "/assets/..." from JSON.
  const tryResolveLocalAsset = (maybeUrl?: string | number | readonly string[] | null) => {
    if (!maybeUrl || typeof maybeUrl !== 'string') return undefined
    // Normalize input -> '/src/assets/...'
    let key: string | undefined
    if (maybeUrl.startsWith('/src/assets/')) {
      key = maybeUrl
    } else if (maybeUrl.startsWith('/assets/')) {
      key = '/src' + maybeUrl
    } else if (maybeUrl.startsWith('assets/')) {
      key = '/src/' + maybeUrl
    } else if (maybeUrl.startsWith('src/assets/')) {
      key = '/' + maybeUrl
    }
    if (key && ASSET_URLS[key]) return ASSET_URLS[key]
    return undefined
  }

  // Return possible direct URL variants for Google Drive / common cases.
  const getUrlCandidates = (maybeUrl?: string | number | readonly string[] | null) => {
    if (!maybeUrl || typeof maybeUrl !== 'string') return [maybeUrl as any]

    const url = maybeUrl
    const candidates: string[] = []

    const localResolved = tryResolveLocalAsset(url)
    if (localResolved) {
      candidates.push(localResolved)
    }

    // If it's a Drive file/d/<id>/view URL
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileIdMatch && fileIdMatch[1]) {
      const id = fileIdMatch[1]
      // Prefer lightweight thumbnails first for faster perceived load
      candidates.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1600`)
      candidates.push(`https://drive.google.com/uc?export=view&id=${id}`)
      candidates.push(`https://drive.googleusercontent.com/uc?export=view&id=${id}`)
      candidates.push(`https://drive.google.com/uc?export=download&id=${id}`)
    }

    // If it's a drive open?id=<id> style
    const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (openIdMatch && openIdMatch[1]) {
      const id = openIdMatch[1]
      // Prefer lightweight thumbnails first
      candidates.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1600`)
      candidates.push(`https://drive.google.com/uc?export=view&id=${id}`)
      candidates.push(`https://drive.googleusercontent.com/uc?export=view&id=${id}`)
      candidates.push(`https://drive.google.com/uc?export=download&id=${id}`)
    }

    // If no Drive patterns matched, assume original is already a direct URL and use as-is
    if (candidates.length === 0) {
      candidates.push(url)
    }

    // Ensure unique candidates preserving order
    return Array.from(new Set(candidates))
  }

  const candidates = getUrlCandidates(src)
  const currentSrc = candidates[Math.min(attemptIndex, candidates.length - 1)]

  // When an attempted src fails, advance to the next candidate; if none remain, show fallback.
  const handleError = () => {
    const next = attemptIndex + 1
    if (next < candidates.length) {
      setAttemptIndex(next)
    } else {
      handleFinalError()
    }
  }

  return didError ? (
    <div
      className={`flex items-center justify-center bg-gray-100/10 ${className ?? ''}`}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <img
        src={ERROR_IMG_SRC}
        alt="Error loading image"
        width={64}
        height={64}
        data-original-url={currentSrc as any}
      />
    </div>
  ) : (
    <img
      src={currentSrc as any}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
      {...rest}
      onError={handleError}
    />
  )
}
