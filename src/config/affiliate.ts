export const affiliateConfig = {
  amazon: {
    associateTag: import.meta.env.VITE_AMAZON_ASSOCIATE_TAG || '',
    enabled: !!import.meta.env.VITE_AMAZON_ASSOCIATE_TAG,
  },
  appleMusic: {
    affiliateToken: import.meta.env.VITE_APPLE_AFFILIATE_TOKEN || '',
    campaignToken: import.meta.env.VITE_APPLE_CAMPAIGN_TOKEN || '',
    enabled: !!import.meta.env.VITE_APPLE_AFFILIATE_TOKEN,
  },
}

export function addAmazonAffiliateTag(url: string): string {
  if (!url) return ''
  if (!affiliateConfig.amazon.enabled) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}tag=${affiliateConfig.amazon.associateTag}`
}

export function addAppleMusicAffiliateToken(url: string): string {
  if (!url) return ''
  if (!affiliateConfig.appleMusic.enabled) return url

  const separator = url.includes('?') ? '&' : '?'
  let result = `${url}${separator}at=${affiliateConfig.appleMusic.affiliateToken}`

  if (affiliateConfig.appleMusic.campaignToken) {
    result += `&ct=${affiliateConfig.appleMusic.campaignToken}`
  }

  return result
}
