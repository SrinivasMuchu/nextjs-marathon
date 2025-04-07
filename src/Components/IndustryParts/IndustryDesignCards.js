import React from 'react'
import IndustryDesignParallelaxWrapper from './IndustryDesignParallelaxWrapper'

function IndustryDesignCards({styles}) {
    const CAPABILITIESLIST = [
        {
            // image: IMAGEURLS.cadCapability,
            title: 'CAD Data Management',
            description: 'Efficiently handle files and designs with version control.'
        },
        {
            // image: IMAGEURLS.cadCapability,
            title: 'BOM and Part Management',
            description: 'BOM and Part Management.'
        },
        {
            // image: IMAGEURLS.cadCapability,
            title: 'Production Scheduling',
            description: 'Plan and monitor production in real time.'
        },
        {
            // image: IMAGEURLS.cadCapability,
            title: 'Inventory Management',
            description: 'Track and manage stock levels with ease.'
        },
        {
            // image: IMAGEURLS.cadCapability,
            title: 'Purchase Management',
            description: 'Streamline procurement and supplier orders.'
        },
        {
            // image: IMAGEURLS.cadCapability,
            title: 'Change Management',
            description: 'Implement ECOs with ease and traceability.'
        },
    ];
    
  return (
    <>
    {CAPABILITIESLIST.map((capability, index) => (
        <IndustryDesignParallelaxWrapper key={index} styles={styles}>

            <div className={styles['capabilities-img-cont']}>
                {/* <Image
                    src={capability.image}
                    alt={capability.title}
                    className={styles['capabilities-img']}
                    width={350}
                    height={150}
                /> */}
            </div>
            <div className={styles['capabilities-page-card-text']}>
                <h6 className={styles['capabilities-page-card-head']}>
                    {capability.title}
                </h6>
                <p className={styles['capabilities-page-card-desc']}>
                    {capability.description}
                </p>
            </div>
        </IndustryDesignParallelaxWrapper>

    ))}
</>
  )
}

export default IndustryDesignCards