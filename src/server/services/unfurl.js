import unfurled from 'unfurled'
class UnfurlService {
  async unfurl ({ url }) {
    const result = unfurled(url)
    return result
  }
}

export default new UnfurlService()
