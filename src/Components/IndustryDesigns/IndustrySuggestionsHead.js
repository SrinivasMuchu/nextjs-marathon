import React from 'react'

function IndustrySuggestionsHead({ type, design, industryName, headingLevel = 3 }) {
  const HeadingTag = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <>
    {!type ? <><HeadingTag>Explore Other Industries
           </HeadingTag>
           <p>Browse CAD models and engineering designs from a variety of industries beyond your current focus. Discover new possibilities and applications.</p></> : 
<>
           <HeadingTag>More from the {industryName} </HeadingTag>
           <p>Explore related CAD models and engineering designs from the 
            {/* {{Industry}}  */}
            to support your product development and innovation.</p></>}
           
    </>
  )
}

export default IndustrySuggestionsHead