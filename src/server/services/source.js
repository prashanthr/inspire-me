
class SourceService {
  constructor (type) {
    this.type = type
  }
  async getUrl (source) {
    try {
      return await source.getUrl()
    } catch (err) {
      console.error(err)
      throw err
    }
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
