import React from 'react'

function IndustrySuggestionsHead({type,design}) {
  return (
    <>
    {!type ? <><h2>Explore Other Industries

           </h2>
           <p>Browse CAD models and engineering designs from a variety of industries beyond your current focus. Discover new possibilities and applications.</p></> : 
           <><h2>More from the {design.industry.replace(/-/g, ' ')} </h2>
           <p>Explore related CAD models and engineering designs from the 
            {/* {{Industry}}  */}
            to support your product development and innovation.</p></>}
           
    </>
  )
}

export default IndustrySuggestionsHead