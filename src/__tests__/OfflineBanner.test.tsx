import { render, screen } from '@testing-library/react'
import OfflineBanner from '../components/OfflineBanner'
import * as useOnlineStatusModule from '../hooks/useOnlineStatus'

vi.mock('../hooks/useOnlineStatus')

describe('OfflineBanner', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('オフライン時にバナーを表示する', () => {
    vi.mocked(useOnlineStatusModule.useOnlineStatus).mockReturnValue(false)

    render(<OfflineBanner />)

    expect(
      screen.getByText('オフラインモード - 広告・外部リンクが利用できません'),
    ).toBeInTheDocument()
  })

  it('オンライン時にバナーを表示しない', () => {
    vi.mocked(useOnlineStatusModule.useOnlineStatus).mockReturnValue(true)

    render(<OfflineBanner />)

    expect(
      screen.queryByText('オフラインモード - 広告・外部リンクが利用できません'),
    ).not.toBeInTheDocument()
  })

  it('オフライン時にrole=alertでバナーを表示する', () => {
    vi.mocked(useOnlineStatusModule.useOnlineStatus).mockReturnValue(false)

    render(<OfflineBanner />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
