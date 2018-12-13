import UnfurlService from '../services/unfurl'
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      await UnfurlService.unfurl({ 
        url: 'https://dilbert.com/strip/2018-12-06' 
      }
    ))
  }
}
