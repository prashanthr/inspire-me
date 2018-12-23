import SourceService from './source'
import { sample, random } from 'lodash'
import axios from 'axios'
import moment from 'moment'

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const SOURCES = [{
  name: 'dilbert',
  getUrl: async () => {
    const dt = randomDate(new Date(2012, 0, 1), new Date())
    const formattedDt = moment(dt).format('YYYY-MM-DD')
    return `https://dilbert.com/strip/${formattedDt}`
  }
}, {
  name: 'xkcd',
  disableUnfurl: true, // PRE-FURLED
  getUrl: async () => {
    console.log('here')
    const randomStripNum = random(1, 2100)
    const res = await axios.get(`https://xkcd.now.sh/${randomStripNum}`)
    return res.data.img
  }
}, {
  name: 'yeti',
  getUrl: async () => {
    const dt = randomDate(new Date(2014, 9, 8), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/the-awkward-yeti/${formattedDt}`
  }
}, {
  name: 'devhumor',
  disabled: true,
  getUrl: async () => {
    return `http://devhumor.com/`
  }
}, {
  name: 'calvin',
  getUrl: async () => {
    const dt = randomDate(new Date(2012, 0, 1), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/calvinandhobbes/${formattedDt}`
  }
},{ 
  name: 'beardo',
  getUrl: async () => {
    const dt = randomDate(new Date(2015, 5, 6), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/beardo/${formattedDt}`
  }
}, {
  name: 'breakofday',
  getUrl: async () => {
    const dt = randomDate(new Date(2011, 8, 29), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/break-of-day/${formattedDt}`
  }
}, {
  name: 'thedailydrawing',
  getUrl: async () => {
    const dt = randomDate(new Date(2015, 1, 19), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/the-daily-drawing/${formattedDt}`
  }
}, {
  name: 'liz-climo-cartoons',
  getUrl: async () => {
    const dt = randomDate(new Date(2018, 3, 26), new Date())
    const formattedDt = moment(dt).format('YYYY/MM/DD')
    return `https://www.gocomics.com/liz-climo-cartoons/${formattedDt}`
  }
}]

class ComicService extends SourceService {
  getSource () {
    return sample(SOURCES.filter(source => !source.disabled))
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

export default new ComicService('img')
