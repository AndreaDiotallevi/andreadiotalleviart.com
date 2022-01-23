import React from "react"

import * as footerStyles from "./footer.module.scss"

const Footer = ({ isHome }) => {
    return (
        <div
            className={`${footerStyles.container} ${
                isHome ? footerStyles.isHome : ""
            }`}
        >
            <footer className={footerStyles.footer}>
                <div>
                    <p className={footerStyles.copyright}>
                        © 2022, ANDREA DIOTALLEVI
                    </p>
                </div>
                <div style={{ display: "flex", marginLeft: "25px" }}>
                    <div>
                        <a
                            href="https://foundation.app/andreadiotalleviart"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className={footerStyles.iconFallbackText}>
                                Instagram
                            </span>
                            <svg
                                className={footerStyles.logo}
                                aria-hidden="true"
                                focusable="false"
                                role="presentation"
                                viewBox="0 0 98 33"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    display: "block",
                                    marginRight: "25px",
                                }}
                            >
                                <path d="M64.894 16.456c0 9.088-7.368 16.456-16.457 16.456s-16.455-7.368-16.455-16.456S39.349 0 48.438 0s16.455 7.368 16.455 16.456zM16.902 1.567a.784.784 0 011.358 0L35.056 30.66a.784.784 0 01-.679 1.176H.785a.784.784 0 01-.679-1.176zM68.614.98c-.865 0-1.567.702-1.567 1.568v27.818c0 .866.702 1.567 1.567 1.567h27.819c.865 0 1.567-.701 1.567-1.567V2.547c0-.866-.702-1.568-1.567-1.568z" />
                            </svg>
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://twitter.com/adiotalleviart"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className={footerStyles.iconFallbackText}>
                                Instagram
                            </span>
                            <svg
                                className={footerStyles.logo}
                                aria-hidden="true"
                                focusable="false"
                                role="presentation"
                                viewBox="0 0 28 24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    display: "block",
                                    marginRight: "20px",
                                }}
                            >
                                <path d="M27.946 3.33a11.667 11.667 0 01-3.296.904 5.784 5.784 0 002.524-3.176 11.857 11.857 0 01-3.648 1.381 5.74 5.74 0 00-9.93 3.918c0 .455.053.892.149 1.311-4.772-.225-9.001-2.517-11.832-5.98a5.626 5.626 0 00-.777 2.887A5.74 5.74 0 003.69 9.354a5.722 5.722 0 01-2.6-.719v.071a5.743 5.743 0 004.604 5.632 5.829 5.829 0 01-2.58.099 5.76 5.76 0 005.371 3.987 11.513 11.513 0 01-7.119 2.455c-.455 0-.909-.027-1.365-.078a16.327 16.327 0 008.816 2.577c10.563 0 16.333-8.745 16.333-16.317 0-.244 0-.49-.018-.735 1.121-.804 2.1-1.82 2.87-2.972l-.055-.024z" />
                            </svg>
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://www.instagram.com/andreadiotalleviart/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className={footerStyles.iconFallbackText}>
                                Instagram
                            </span>
                            <svg
                                className={footerStyles.logo}
                                aria-hidden="true"
                                focusable="false"
                                role="presentation"
                                viewBox="0 0 512 512"
                            >
                                <path d="M256 49.5c67.3 0 75.2.3 101.8 1.5 24.6 1.1 37.9 5.2 46.8 8.7 11.8 4.6 20.2 10 29 18.8s14.3 17.2 18.8 29c3.4 8.9 7.6 22.2 8.7 46.8 1.2 26.6 1.5 34.5 1.5 101.8s-.3 75.2-1.5 101.8c-1.1 24.6-5.2 37.9-8.7 46.8-4.6 11.8-10 20.2-18.8 29s-17.2 14.3-29 18.8c-8.9 3.4-22.2 7.6-46.8 8.7-26.6 1.2-34.5 1.5-101.8 1.5s-75.2-.3-101.8-1.5c-24.6-1.1-37.9-5.2-46.8-8.7-11.8-4.6-20.2-10-29-18.8s-14.3-17.2-18.8-29c-3.4-8.9-7.6-22.2-8.7-46.8-1.2-26.6-1.5-34.5-1.5-101.8s.3-75.2 1.5-101.8c1.1-24.6 5.2-37.9 8.7-46.8 4.6-11.8 10-20.2 18.8-29s17.2-14.3 29-18.8c8.9-3.4 22.2-7.6 46.8-8.7 26.6-1.3 34.5-1.5 101.8-1.5m0-45.4c-68.4 0-77 .3-103.9 1.5C125.3 6.8 107 11.1 91 17.3c-16.6 6.4-30.6 15.1-44.6 29.1-14 14-22.6 28.1-29.1 44.6-6.2 16-10.5 34.3-11.7 61.2C4.4 179 4.1 187.6 4.1 256s.3 77 1.5 103.9c1.2 26.8 5.5 45.1 11.7 61.2 6.4 16.6 15.1 30.6 29.1 44.6 14 14 28.1 22.6 44.6 29.1 16 6.2 34.3 10.5 61.2 11.7 26.9 1.2 35.4 1.5 103.9 1.5s77-.3 103.9-1.5c26.8-1.2 45.1-5.5 61.2-11.7 16.6-6.4 30.6-15.1 44.6-29.1 14-14 22.6-28.1 29.1-44.6 6.2-16 10.5-34.3 11.7-61.2 1.2-26.9 1.5-35.4 1.5-103.9s-.3-77-1.5-103.9c-1.2-26.8-5.5-45.1-11.7-61.2-6.4-16.6-15.1-30.6-29.1-44.6-14-14-28.1-22.6-44.6-29.1-16-6.2-34.3-10.5-61.2-11.7-27-1.1-35.6-1.4-104-1.4z" />
                                <path d="M256 126.6c-71.4 0-129.4 57.9-129.4 129.4s58 129.4 129.4 129.4 129.4-58 129.4-129.4-58-129.4-129.4-129.4zm0 213.4c-46.4 0-84-37.6-84-84s37.6-84 84-84 84 37.6 84 84-37.6 84-84 84z" />
                                <circle cx="390.5" cy="121.5" r="30.2" />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
