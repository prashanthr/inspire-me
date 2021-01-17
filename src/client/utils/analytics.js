import { isProd } from './env'
export const loadAnalytics = (propertyTag) => {
    const enabled = isProd()
    if (enabled && propertyTag) {
      window.dataLayer = window.dataLayer || []
      function gtag(){window.dataLayer.push(arguments)}
      gtag('js', new Date())
      gtag('config', propertyTag, { 'anonymize_ip': true,'allow_ad_personalization_signals': false })
      console.info('Analytics is enabled')
    } else {
      console.info('Analytics is disabled')
    }
}
