
import React from 'react';
import styles from './IndustryDesign.module.css';
import IndustrySuggestionsHead from './IndustrySuggestionsHead';
import IndustryDesignSuggestedImages from './IndustryDesignSuggestedImages';

function IndustryDesignsSuggestion({ type, designData = [],design }) {

 const style = type
        ? {
            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.90) 100%), #5B89FF',
          }
        : {};

  return (
    <div className={styles['industry-design-suggestion']} style={style}>
      <div className={styles['industry-design-suggestion-header']}>
        <IndustrySuggestionsHead type={type} design={design}/>
      </div>
      <IndustryDesignSuggestedImages type={type} designData={designData} design={design}/>
     
    </div>
  );
}

export default IndustryDesignsSuggestion;