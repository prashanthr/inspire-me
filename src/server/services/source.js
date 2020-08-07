
class SourceService {
  constructor (type) {
    this.type = type
  }
  async getUrl (source) {
    try {
      return await source.getUrl()
    } catch (err) {
      console.error('Error getting url: ', err)
      throw err
    }
  }

  async getDetails ({ innerSources }) {
    const source = this.getSource({ whitelist: innerSources })
    return {
      name: source.name,
      url: await this.getUrl(source),
      disableUnfurl: source.disableUnfurl
    }
  }
}

export default SourceService
