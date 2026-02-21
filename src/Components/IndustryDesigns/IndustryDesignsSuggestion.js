
import React from 'react';
import styles from './IndustryDesign.module.css';
import IndustrySuggestionsHead from './IndustrySuggestionsHead';
import IndustryDesignSuggestedImages from './IndustryDesignSuggestedImages';

function IndustryDesignsSuggestion({ type, designData = [], design, design_type, industryName, headingLevel = 3 }) {

 const style = type
        ? {
            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.90) 100%), #5B89FF',
          }
        : {background: '#F4F4F4'};

  return (
    <div className={styles['industry-design-suggestion']} style={style}>
      <div className={styles['industry-design-suggestion-header']}>
        <IndustrySuggestionsHead type={type} design={design} industryName={industryName} headingLevel={headingLevel} />
      </div>
      <IndustryDesignSuggestedImages type={type} designData={designData} design={design} design_type={design_type}/>
     
    </div>
  );
}

export default IndustryDesignsSuggestion;