import axios from 'axios'

export const resolveUrl = async (url) => {
  if (url.startsWith('https:')) {
    return url
  } else {
    const httpsUrl = url.replace('http', 'https')
    try {
      await axios.head(httpsUrl)
      return httpsUrl
    } catch (err) {
      console.error(`Could not resolve https url: ${httpsUrl}. Returning original url ${url}`)
      return url
    }
  }
}
