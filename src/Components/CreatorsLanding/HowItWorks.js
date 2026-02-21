import React from 'react'
import styles from './CreatorsDashboard.module.css'
    


const howItWorksArray =[
    {
        step:1,
        title:'Create your profile',
        description:'Sign up and build your creator profile with your expertise and portfolio.',
    },
    {
        step:2,
        title:'Upload CAD files',
        description:'Drag and drop your files (.stp, .iges, .step) to our secure platform.',
    },
    {
        step:3,
        title:'Add details',
        description:'Add title, description, and tags to help others discover your work.',
    },
    {
        step:4,
        title:'Set pricing & publish',
        description:'Choose to share for free or set a price (optional) and publish to our platform.',
    }
]
function HowItWorks() {
  return (
    <div className={styles.shareYourDesignsContainer} style={{background:'linear-gradient(0deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.90) 100%), #5B89FF'}}>
        <div style={{textAlign:'center',}}>
             <h2>How It Works</h2>
        <p>Start sharing your designs in just a few simple steps</p>
        </div>
       

        <div className={styles.shareYourDesignsList}>
            {howItWorksArray.map(item => (
                <div key={item.step} className={styles.shareYourDesignsItem}
                style={{width:'300px',background:'white',borderRadius:'8px'}}>
                    <div className={styles.itemStep}>{item.step}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>

    </div>
  )
}

export default HowItWorks