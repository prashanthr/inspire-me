import unfurled from 'unfurled'
import { get as getProperty } from 'lodash';
class UnfurlService {
  async unfurl ({ url, type, disableUnfurl }) {
    if (disableUnfurl) {
      return url
    }
    const result = await unfurled(url)
    switch (type) {
      case 'img':
      case 'image':
      case 'comic':
       return this.getPrimaryImageUrl(result)
      case 'basic':
      case 'article':
      case 'blog':
        return this.getBasicDetails({ url, data: result })
      case 'link':
        return this.getUrl(result)
      case 'raw':
      default:
        return result
    }
  }
  
  getBasicDetails ({ url, data }) {
    return {
      url: this.getUrl(data) || url,
      imageUrl: this.getPrimaryImageUrl(data),
      title: this.getTitle(data),
      description: this.getDescription(data)
    }
  }
  getKeywords (data) {
    const { other } = data
    return getProperty(other, 'keywords', null)
  }
  getDescription (data) {
    const { other } = data
    return getProperty(other, 'description', null)
  }
  getTitle (data) {
    const { ogp } = data
    return getProperty(ogp, 'ogTitle', null)
  }
  getUrl (data) {
    const { other, ogp } = data
    return getProperty(ogp, 'ogUrl', null) || getProperty(other, 'alWebUrl', null)
  }
  getPrimaryImageUrl (data) {
    const images = this.getImages(data)  
    return images.length > 0 ? images[0].url : null
  }

  getImages (data) {
    const { ogp } = data
    const images = getProperty(ogp, 'ogImage', [])
    return images
  }
}

export default new UnfurlService()
