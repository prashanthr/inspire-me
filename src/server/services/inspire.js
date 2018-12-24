import UnfurlService from './unfurl'
import ComicService from './comic'
import QuoteService from './quote'
import ImageService from './image'
import { sample } from 'lodash'

const SOURCES = [
  ComicService,
  QuoteService,
  ImageService
]

class InspireService {
  async getRandomSource () {
    const source = sample(SOURCES)
    const details = await source.getDetails()
    return {
      url: details.url,
      name: details.name,
      disableUnfurl: details.disableUnfurl,
      type: source.type
    }
  }

  async inspire () {
    const source = await this.getRandomSource()
    const result = await UnfurlService.unfurl({ 
      url: source.url, 
      type: source.type,
      disableUnfurl: source.disableUnfurl
    })
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
