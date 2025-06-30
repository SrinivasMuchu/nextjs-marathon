import React from 'react'
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import Image from "next/image";

function IndustryCarouselImages({ designData, activeIndex, slides,setActiveIndex }) {
    const total = slides.length;
    const goTo = (idx) => setActiveIndex((idx + total) % total);
  return (
    <>
      <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeIndex === idx ? 'bg-blue-100 scale-110' : 'bg-gray-100'}`}
                                onClick={() => goTo(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                style={{ minWidth: 44, minHeight: 44 }}
                            >
                                <span className={`block w-2 h-2 sm:w-3 sm:h-3 rounded-full ${activeIndex === idx ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                            </button>
                        ))}
                    </div>
    
                    {/* Thumbnails */}
                    <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap px-4">
                        {slides.map((slide, idx) => (
                            <div
                                key={idx}
                                className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${activeIndex === idx ? 'border-black' : 'border-transparent'}`}
                                onClick={() => goTo(idx)}
                            >
                                <Image
                                    src={`${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_${slide.x}_${slide.y}.webp`}
                                    alt={slide.title}
                                    width={48}
                                    height={48}
                                    className="object-cover w-12 h-12 sm:w-16 sm:h-16"
                                    loading="eager"
                                />
                            </div>
                        ))}
                    </div>
    </>
  )
}

export default IndustryCarouselImages