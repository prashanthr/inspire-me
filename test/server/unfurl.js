import unfurled from 'unfurled'
const url = 'http://www.commitstrip.com/en/2015/01/22/poker-planning/'
unfurled(url).then(result => console.log('result', result, result.ogp.ogImage))
