import SourceService from './source'
import { sample } from 'lodash'
import SOURCES from './comic-sources'

class ComicService extends SourceService {
  getSource () {
    return sample(SOURCES.filter(source => !source.disabled))
  }
}

export default new ComicService('comic')
