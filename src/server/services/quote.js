import SourceService from './source'
import { sample } from 'lodash'
import axios from 'axios'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

const SOURCES = [{
  name: 'unsplash',
  disableUnfurl: true,
  getUrl: async () => {
    const tags = 'quote-quotes-inspire'
    const baseURL = 'https://api.unsplash.com/photos/random'
    const randomPhoto = await axios.get(`${baseURL}?query=${tags}&client_id=${UNSPLASH_ACCESS_KEY}`)
    return randomPhoto.data.urls.regular
  }
}]

class QuoteService extends SourceService {
  getSource () {
    return sample(SOURCES.filter(source => !source.disabled))
  }
}

export default new QuoteService('quote')