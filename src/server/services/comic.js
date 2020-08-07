import SourceService from './source'
import { sample } from 'lodash'
import SOURCES from './comic-sources'

class ComicService extends SourceService {
  getSource ({ whitelist = [] }) {
    const enabledSources = SOURCES.filter(source => !source.disabled)
    const whitelistedSources = enabledSources
      .filter(source => whitelist.includes(source.name))
    const resolvedSources = whitelistedSources.length > 0 
      ? whitelistedSources 
      : enabledSources
    return sample(resolvedSources)
  }
}

export default new ComicService('comic')
