import SourceService from './source'
import moment from 'moment'

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

class ComicService extends SourceService {
  getUrl () {
    const dt = randomDate(new Date(2012, 0, 1), new Date())
    const formattedDt = moment(dt).format('YYYY-MM-DD')
    return `https://dilbert.com/strip/${formattedDt}`
  }
}

export default new ComicService('img')
