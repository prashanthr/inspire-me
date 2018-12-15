import InspireService from '../services/inspire'
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      await InspireService.inspire()
    )
  }
}
