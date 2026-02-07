import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('affiliate', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('addAmazonAffiliateTag', () => {
    it('URLにアソシエイトタグを追加する', async () => {
      vi.stubEnv('VITE_AMAZON_ASSOCIATE_TAG', 'test-22')
      const { addAmazonAffiliateTag } = await import('../config/affiliate')

      const result = addAmazonAffiliateTag('https://www.amazon.co.jp/dp/B001234567')
      expect(result).toBe('https://www.amazon.co.jp/dp/B001234567?tag=test-22')
    })

    it('既存のクエリパラメータがある場合は&で連結する', async () => {
      vi.stubEnv('VITE_AMAZON_ASSOCIATE_TAG', 'test-22')
      const { addAmazonAffiliateTag } = await import('../config/affiliate')

      const result = addAmazonAffiliateTag('https://www.amazon.co.jp/dp/B001234567?ref=abc')
      expect(result).toBe('https://www.amazon.co.jp/dp/B001234567?ref=abc&tag=test-22')
    })

    it('設定が無効な場合はURLをそのまま返す', async () => {
      vi.stubEnv('VITE_AMAZON_ASSOCIATE_TAG', '')
      const { addAmazonAffiliateTag } = await import('../config/affiliate')

      const url = 'https://www.amazon.co.jp/dp/B001234567'
      const result = addAmazonAffiliateTag(url)
      expect(result).toBe(url)
    })

    it('空文字の場合はそのまま返す', async () => {
      vi.stubEnv('VITE_AMAZON_ASSOCIATE_TAG', 'test-22')
      const { addAmazonAffiliateTag } = await import('../config/affiliate')

      const result = addAmazonAffiliateTag('')
      expect(result).toBe('')
    })

    it('undefinedの場合は空文字を返す', async () => {
      vi.stubEnv('VITE_AMAZON_ASSOCIATE_TAG', 'test-22')
      const { addAmazonAffiliateTag } = await import('../config/affiliate')

      const result = addAmazonAffiliateTag(undefined as unknown as string)
      expect(result).toBe('')
    })
  })

  describe('addAppleMusicAffiliateToken', () => {
    it('URLにアフィリエイトトークンを追加する', async () => {
      vi.stubEnv('VITE_APPLE_AFFILIATE_TOKEN', 'abc123')
      vi.stubEnv('VITE_APPLE_CAMPAIGN_TOKEN', '')
      const { addAppleMusicAffiliateToken } = await import('../config/affiliate')

      const result = addAppleMusicAffiliateToken('https://music.apple.com/jp/album/123')
      expect(result).toBe('https://music.apple.com/jp/album/123?at=abc123')
    })

    it('キャンペーントークンが設定されている場合は追加する', async () => {
      vi.stubEnv('VITE_APPLE_AFFILIATE_TOKEN', 'abc123')
      vi.stubEnv('VITE_APPLE_CAMPAIGN_TOKEN', 'campaign1')
      const { addAppleMusicAffiliateToken } = await import('../config/affiliate')

      const result = addAppleMusicAffiliateToken('https://music.apple.com/jp/album/123')
      expect(result).toBe('https://music.apple.com/jp/album/123?at=abc123&ct=campaign1')
    })

    it('既存のクエリパラメータがある場合は&で連結する', async () => {
      vi.stubEnv('VITE_APPLE_AFFILIATE_TOKEN', 'abc123')
      vi.stubEnv('VITE_APPLE_CAMPAIGN_TOKEN', '')
      const { addAppleMusicAffiliateToken } = await import('../config/affiliate')

      const result = addAppleMusicAffiliateToken('https://music.apple.com/jp/album/123?l=en')
      expect(result).toBe('https://music.apple.com/jp/album/123?l=en&at=abc123')
    })

    it('設定が無効な場合はURLをそのまま返す', async () => {
      vi.stubEnv('VITE_APPLE_AFFILIATE_TOKEN', '')
      const { addAppleMusicAffiliateToken } = await import('../config/affiliate')

      const url = 'https://music.apple.com/jp/album/123'
      const result = addAppleMusicAffiliateToken(url)
      expect(result).toBe(url)
    })

    it('空文字の場合はそのまま返す', async () => {
      vi.stubEnv('VITE_APPLE_AFFILIATE_TOKEN', 'abc123')
      const { addAppleMusicAffiliateToken } = await import('../config/affiliate')

      const result = addAppleMusicAffiliateToken('')
      expect(result).toBe('')
    })
  })

  describe('affiliateConfig', () => {
    it('Amazon設定が環境変数から読み込まれる', async () => {
      vi.stubEnv('VITE_AMAZON_ASSOCIATE_TAG', 'mystore-22')
      const { affiliateConfig } = await import('../config/affiliate')

      expect(affiliateConfig.amazon.associateTag).toBe('mystore-22')
      expect(affiliateConfig.amazon.enabled).toBe(true)
    })

    it('Amazon設定が未設定の場合はenabledがfalse', async () => {
      vi.stubEnv('VITE_AMAZON_ASSOCIATE_TAG', '')
      const { affiliateConfig } = await import('../config/affiliate')

      expect(affiliateConfig.amazon.enabled).toBe(false)
    })

    it('Apple設定が環境変数から読み込まれる', async () => {
      vi.stubEnv('VITE_APPLE_AFFILIATE_TOKEN', 'token123')
      vi.stubEnv('VITE_APPLE_CAMPAIGN_TOKEN', 'camp1')
      const { affiliateConfig } = await import('../config/affiliate')

      expect(affiliateConfig.appleMusic.affiliateToken).toBe('token123')
      expect(affiliateConfig.appleMusic.campaignToken).toBe('camp1')
      expect(affiliateConfig.appleMusic.enabled).toBe(true)
    })

    it('Apple設定が未設定の場合はenabledがfalse', async () => {
      vi.stubEnv('VITE_APPLE_AFFILIATE_TOKEN', '')
      const { affiliateConfig } = await import('../config/affiliate')

      expect(affiliateConfig.appleMusic.enabled).toBe(false)
    })
  })
})
