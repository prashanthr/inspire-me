import UnfurlService from './unfurl'
import ComicService from './comic'
import QuoteService from './quote'
import ImageService from './image'
import { sample } from 'lodash'

const SOURCES = [
  ComicService,
  // QuoteService,
  // ImageService
]

class InspireService {
  async getRandomSource ({ innerSources }) {
    const source = sample(SOURCES)
    const details = await source.getDetails({ innerSources })
    return {
      url: details.url,
      name: details.name,
      disableUnfurl: details.disableUnfurl,
      type: source.type
    }
  }

  getResolvedInnerSources (sources) {
    if (!sources || sources.length === 0) {
      return []
    }
    const sourceList = sources
      .split(',')
      .map(src => src.replace(/[^\w]/gi, '')) // Filter out bad chars
    if (sourceList && sourceList.length > 0) {
      return sourceList
    } else {
       return []
    }
  }

  async inspire ({ innerSources }) {
    const innerSourceList = this.getResolvedInnerSources(innerSources)
    const source = await this.getRandomSource({ innerSources: innerSourceList })
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
