import React, { Component } from "react"

import { loadableP5 as P5Wrapper } from './loadable'
import Sketch from './sketch'

import moonlightStyles from "./moonlight.module.scss"

class Moonlight extends Component {
    render() {
        return (
            <div className={moonlightStyles.container}>
                <div id="moonlight-container">
                    <P5Wrapper sketch={Sketch} />
                </div>
            </div>
        )
    }
}

export default Moonlight
