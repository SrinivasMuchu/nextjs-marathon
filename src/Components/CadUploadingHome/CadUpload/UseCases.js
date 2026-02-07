import React from 'react';
import cadStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';



function UseCases({useCases}) {
  return (
    <div className={cadStyles['cad-industries']}>
      <div className={cadStyles['cad-industries-content']}>
        <h2>Who this CAD viewer is for</h2>
      </div>
      <div className={cadStyles['cad-industries-items']}>
        {useCases && useCases.map((text, index) => (
          <div key={index} className={cadStyles['cad-industries-item-cont']}>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UseCases;
