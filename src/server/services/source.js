
class SourceService {
  constructor (type) {
    this.type = type
  }
  async getUrl (source) {
    return await source.getUrl()
  }

  async getDetails () {
    const source = this.getSource()
    return {
      name: source.name,
      url: await this.getUrl(source),
      disableUnfurl: source.disableUnfurl
    }
  }
}

export default SourceService
