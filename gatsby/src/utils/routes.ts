export type RouteType = {
    menuName: string
    baseUrl: string
    pageTitle: string
}

const routes: RouteType[] = [
    // { menuName: "Shop", baseUrl: "/shop", pageTitle: "Shop" },
    { menuName: "About", baseUrl: "/about", pageTitle: "About" },
    { menuName: "Contact", baseUrl: "/contact", pageTitle: "Contact" },
    {
        menuName: "Portfolio",
        baseUrl: "/portfolio",
        pageTitle: "Generative Artist and Creative Coder",
    },
    // { menuName: "Blog", baseUrl: "/blog", pageTitle: "Blog" },
    // {
    //     menuName: "Home",
    //     baseUrl: "/",
    //     pageTitle: "Generative Artist and Creative Coder",
    // },
]

export default routes
