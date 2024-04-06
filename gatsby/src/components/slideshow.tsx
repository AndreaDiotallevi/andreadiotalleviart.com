import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Slideshow = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    return (
        <Slider {...settings}>
            <div>
                <img src="your-image-1.jpg" alt="Slide 1" />
            </div>
            <div>
                <img src="your-image-2.jpg" alt="Slide 2" />
            </div>
            <div>
                <img src="your-image-3.jpg" alt="Slide 3" />
            </div>
            {/* Add more slides as needed */}
        </Slider>
    )
}

export default Slideshow
