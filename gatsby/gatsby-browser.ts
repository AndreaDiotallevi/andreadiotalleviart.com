// require("prismjs/themes/prism-tomorrow.css")
// require("prismjs/themes/prism.css")
// require("prismjs/themes/prism-coy.css")
// require("prismjs/themes/prism-twilight.css")

import { GatsbyBrowser } from "gatsby"

export const shouldUpdateScroll: GatsbyBrowser["shouldUpdateScroll"] = ({
    prevRouterProps,
    routerProps,
    // getSavedScrollPosition,
}) => {
    if (prevRouterProps?.location?.pathname === routerProps.location.pathname) {
        return false
    }

    // const currentPosition = getSavedScrollPosition(routerProps.location)
    // const queriedPosition = getSavedScrollPosition({ pathname: `/random` })

    // window.scrollTo(...(currentPosition || [0, 0]))

    return true
}
