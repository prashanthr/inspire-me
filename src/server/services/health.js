class HealthService {
  healthCheck() {
    return { 
      status: 'healthy'
    }
  }
}

export default new HealthService()
