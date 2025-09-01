"use client";
import React, { useState } from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import styles from './Creators.module.css'

function CreatorRating() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Sample data - replace with actual props or API data
  const rating = 4.2
  const totalRatings = 322
  const ratingBreakdown = [
    { stars: 5, count: 100 },
    { stars: 4, count: 60 },
    { stars: 3, count: 120 },
    { stars: 2, count: 40 },
    { stars: 1, count: 2 }
  ]

  const renderStars = (rating, size = 20) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} color="#610bee" size={size} />
      )
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" color="#610bee" size={size} />
      )
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} color="#610bee" size={size} />
      )
    }

    return stars
  }

  const getBarWidth = (count) => {
    const maxCount = Math.max(...ratingBreakdown.map(item => item.count))
    return (count / maxCount) * 100
  }

  return (
    <>
    <div className={styles.creatorRating}>
        <div className="bg-white rounded-lg max-w-md">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 style={{fontSize:'14px',fontWeight:'500'}} className="text-lg font-semibold text-gray-800 mb-2">
            CAD Design Performance
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="text-xl font-bold text-indigo-600">{rating}</span>
            <span className="text-gray-500">/{5}</span>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {/* Expanded Rating Breakdown */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t" style={{background:'#F6F6F6',padding:'12px',borderRadius:'8px',}}>
         
          
          
        

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 min-w-[20px]">
                  <FaStar color="#610bee" size={12} />
                  <span className="text-sm font-medium">{item.stars}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getBarWidth(item.count)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 min-w-[30px] text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    
    </div>
     <div style={{width:'100%',height:'2px',background:'#edf2f7',}}/>
    </>
    
    
  )
}

export default CreatorRating