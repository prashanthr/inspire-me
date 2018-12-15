import SourceService from './source'
import { sample, random } from 'lodash'
import moment from 'moment'

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const SOURCES = [{
  name: 'dilbert',
  getUrl: () => {
    const dt = randomDate(new Date(2012, 0, 1), new Date())
    const formattedDt = moment(dt).format('YYYY-MM-DD')
    return `https://dilbert.com/strip/${formattedDt}`
  }
}, {
  name: 'xkcd',
  disabled: true,
  getUrl: () => {
    const randomStripNum = random(1, 2085)
    return `https://xkcd.com`
  }
}, {
  name: 'yeti',
  getUrl: () => {
    const dt = randomDate(new Date(2014, 9, 8), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/the-awkward-yeti/${formattedDt}`
  }
}, {
  name: 'devhumor',
  disabled: true,
  getUrl: () => {
    return `http://devhumor.com/`
  }
}, {
  name: 'calvin',
  getUrl: () => {
    const dt = randomDate(new Date(2012, 0, 1), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/calvinandhobbes/${formattedDt}`
  }
},{ 
  name: 'beardo',
  getUrl: () => {
    const dt = randomDate(new Date(2015, 5, 6), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/beardo/${formattedDt}`
  }
}, {
  name: 'breakofday',
  getUrl: () => {
    const dt = randomDate(new Date(2011, 8, 29), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/break-of-day/${formattedDt}`
  }
}, {
  name: 'thedailydrawing',
  getUrl: () => {
    const dt = randomDate(new Date(2015, 1, 19), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/the-daily-drawing/${formattedDt}`
  }
}, {
  name: 'liz-climo-cartoons',
  getUrl: () => {
    const dt = randomDate(new Date(2018, 3, 26), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/liz-climo-cartoons/${formattedDt}`
  }
}]

class ComicService extends SourceService {
  getSource () {
    return sample(SOURCES.filter(source => !source.disabled))
  }
  getUrl () {
    const source = this.getSource()
    return source.getUrl()
  }
}

export default new ComicService('img')