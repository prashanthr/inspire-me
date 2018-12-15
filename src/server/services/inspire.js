import UnfurlService from './unfurl'
import ComicService from './comic'
import { sample } from 'lodash'

const SOURCES = [
  ComicService
]

class InspireService {
  getRandomSource () {
    const source = sample(SOURCES)
    return {
      url: source.getUrl(),
      type: source.type
    }
  }

  async inspire () {
    const source = this.getRandomSource()
    const result = await UnfurlService.unfurl({ url: source.url, type: source.type })
    return {
      source,
      data: result
    }
  }
}

export default new InspireService()
