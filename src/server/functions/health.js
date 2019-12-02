import HealthService from '../services/health'
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      HealthService.healthCheck()
    )
  }
}
