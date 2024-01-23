export type RouteType = {
    menuName: string
    baseUrl: string
    pageTitle: string
}

const routes: RouteType[] = [
    {
        menuName: "Art",
        baseUrl: "/portfolio",
        pageTitle: "Generative Artist and Creative Coder",
    },
    // { menuName: "Blog", baseUrl: "/blog", pageTitle: "Blog" },
    // {
    //     menuName: "Home",
    //     baseUrl: "/",
    //     pageTitle: "Generative Artist and Creative Coder",
    // },
    { menuName: "Shop", baseUrl: "/shop", pageTitle: "Shop" },
    { menuName: "Contact", baseUrl: "/contact", pageTitle: "About Me" },
]

export default routes
