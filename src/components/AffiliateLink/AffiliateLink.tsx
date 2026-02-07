import type { ReactNode } from 'react'
import { addAmazonAffiliateTag, addAppleMusicAffiliateToken } from '../../config/affiliate'

export type AffiliateService = 'amazon-music' | 'amazon-cd' | 'apple-music'

export interface AffiliateLinkProps {
  service: AffiliateService
  url: string
  songTitle?: string
  artistName?: string
  className?: string
  children?: ReactNode
}

function generateSearchUrl(
  service: AffiliateService,
  songTitle?: string,
  artistName?: string
): string {
  const query = [artistName, songTitle].filter(Boolean).join(' ')
  const encodedQuery = encodeURIComponent(query)

  switch (service) {
    case 'amazon-music':
      return addAmazonAffiliateTag(
        `https://www.amazon.co.jp/s?k=${encodedQuery}&i=digital-music`
      )
    case 'amazon-cd':
      return addAmazonAffiliateTag(`https://www.amazon.co.jp/s?k=${encodedQuery}&i=music`)
    case 'apple-music':
      return addAppleMusicAffiliateToken(
        `https://music.apple.com/jp/search?term=${encodedQuery}`
      )
  }
}

function getAffiliateUrl(service: AffiliateService, url: string): string {
  switch (service) {
    case 'amazon-music':
    case 'amazon-cd':
      return addAmazonAffiliateTag(url)
    case 'apple-music':
      return addAppleMusicAffiliateToken(url)
  }
}

function AffiliateLink({
  service,
  url,
  songTitle,
  artistName,
  className,
  children,
}: AffiliateLinkProps) {
  const href = url
    ? getAffiliateUrl(service, url)
    : generateSearchUrl(service, songTitle, artistName)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
    >
      {children}
    </a>
  )
}

export default AffiliateLink
