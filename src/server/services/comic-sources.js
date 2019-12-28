import axios from 'axios'
import moment from 'moment'
import { random } from 'lodash'

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const getGOComicsUrl = ({ date, prefix, dateFormat }) => {
  const formattedDt = moment(date).format(dateFormat || 'YYYY/MM/DD')
  return `https://www.gocomics.com/${prefix}/${formattedDt}`
}

const sources = [{
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
    const randomStripNum = random(1, 2100)
    const res = await axios.get(`https://xkcd.now.sh/?comic=${randomStripNum}`)
    return res.data.img
  }
}, {
  name: 'the-awkward-yeti',
  getUrl: async () => {
    const date = randomDate(new Date(2014, 9, 8), new Date())
    return getGOComicsUrl({ 
      date,
      prefix: 'the-awkward-yeti'
    })
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
    const date = randomDate(new Date(2012, 0, 1), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'calvinandhobbes'
    })
  }
},{ 
  name: 'beardo',
  getUrl: async () => {
    const date = randomDate(new Date(2011, 3, 1), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'beardo'
    })
  }
}, {
  name: 'breakofday',
  getUrl: async () => {
    const date = randomDate(new Date(2011, 8, 29), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'break-of-day'
    })
  }
}, {
  name: 'thedailydrawing',
  getUrl: async () => {
    const date = randomDate(new Date(2015, 1, 19), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'the-daily-drawing'
    })
  }
}, {
  name: 'liz-climo-cartoons',
  getUrl: async () => {
    const date = randomDate(new Date(2018, 3, 26), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'liz-climo-cartoons'
    })
  }
}, {
  name: 'garfield',
  getUrl: async () => {
    const date = randomDate(new Date(1978, 6, 19), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'garfield'
    })
  }
}, {
  name: 'lunarbaboon',
  getUrl: async () => {
    const date = randomDate(new Date(2015, 11, 2), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'lunarbaboon'
    })
  }
}, {
  name: 'commitstrip',
  // disableUnfurl: true, // PRE-FURLED
  disabled: true,
  getUrl: async () => {
    let unfurlResult = 'https://www.commitstrip.com'
    /*
    for (let i = 0; unfurlResult === 'https://www.commitstrip.com'; i++) {
      const date = randomDate(new Date(2014, 1, 1), new Date())
      const formattedDt = moment(date).format('YYYY/MM/DD')
      const ogUrl = `https://www.commitstrip.com/en/${formattedDt}`  
      unfurlResult = await UnfurlService.unfurl({
        type: 'link',
        url: ogUrl,
        disableUnfurl: false
      })
      console.log('ogUrl', ogUrl, 'unfurlRes', unfurlResult)
    }
    */
    return unfurlResult
  }
}, {
  name: 'brevity',
  getUrl: async () => {
    const date = randomDate(new Date(2005, 1, 3), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'brevity'
    })
  }
}, {
  name: 'fminus',
  getUrl: async () => {
    const date = randomDate(new Date(2005, 5, 10), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'fminus'
    })
  }
}, {
  name: 'poochcafe',
  getUrl: async () => {
    const date = randomDate(new Date(2003, 4, 27), new Date())
    return getGOComicsUrl({
      date,
      prefix: 'poochcafe'
    })
  }
}]

export default sources
