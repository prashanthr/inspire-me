export const loadAnalytics = (propertyTag) => {
    window.dataLayer = window.dataLayer || []
    function gtag(){dataLayer.push(arguments)}
    gtag('js', new Date())
    gtag('config', propertyTag)
}
