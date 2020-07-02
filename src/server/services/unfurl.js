import unfurled from 'unfurled'
import { get as getProperty } from 'lodash'
import { resolveUrl } from '../utils/resolve-url'
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
       return await this.getPrimaryImageUrl(result)
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
  async getPrimaryImageUrl (data) {
    const images = this.getImages(data)
    if (images.length > 0) {
      const resolvedUrl = await resolveUrl(images[0].url)
      return resolvedUrl
    } else {
      return null
    }
  }

  getImages (data) {
    const { ogp } = data
    const images = getProperty(ogp, 'ogImage', [])
    return images
  }
}

export default new UnfurlService()
