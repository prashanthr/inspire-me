import UnfurlService from './unfurl'
import ComicService from './comic'
import PrefurledService from './pre-furled'
import { sample } from 'lodash'

const SOURCES = [
  ComicService,
  PrefurledService
]

class InspireService {
  async getRandomSource () {
    const source = sample(SOURCES)
    return {
      url: await source.getUrl(),
      type: source.type
    }
  }

  async inspire () {
    const source = await this.getRandomSource()
    const result = await UnfurlService.unfurl({ url: source.url, type: source.type })
    if (!result) {
     return this.inspire() 
    }
    return {
      source,
      data: result
    }
  }
}

export default new InspireService()
