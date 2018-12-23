import SourceService from './source'
import axios from 'axios'
import { sample, random } from 'lodash'

const SOURCES = [{
  name: 'xkcd',
  getUrl: async () => {
    const randomStripNum = random(1, 2100)
    const res = await axios.get(`https://xkcd.now.sh/${randomStripNum}`)
    return res.data.img
  }
}]

class PrefurledService extends SourceService {
  getSource () {
    return sample(SOURCES.filter(source => !source.disabled))
  }
  async getUrl () {
    const source = this.getSource()
    return await source.getUrl()
  }
}

export default new PrefurledService('pre-furled')