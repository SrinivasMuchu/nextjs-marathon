import React from 'react';
import styles from '../CadHomeDesign/CadHome.module.css';

function CadConverterTypes() {
  const converterTypes = [
    { label: 'STEP to BREP', path: '/step-to-brep' },
    { label: 'STEP to IGES', path: '/step-to-iges' },
    { label: 'STEP to OBJ', path: '/step-to-obj' },
    { label: 'STEP to PLY', path: '/step-to-ply' },
    { label: 'STEP to STL', path: '/step-to-stl' },
    { label: 'STEP to OFF', path: '/step-to-off' },

    { label: 'IGES to BREP', path: '/iges-to-brep' },
    { label: 'IGES to STEP', path: '/iges-to-step' },
    { label: 'IGES to OBJ', path: '/iges-to-obj' },
    { label: 'IGES to PLY', path: '/iges-to-ply' },
    { label: 'IGES to STL', path: '/iges-to-stl' },
    { label: 'IGES to OFF', path: '/iges-to-off' },

    { label: 'OBJ to BREP', path: '/obj-to-brep' },
    { label: 'OBJ to IGES', path: '/obj-to-iges' },
    { label: 'OBJ to STEP', path: '/obj-to-step' },
    { label: 'OBJ to PLY', path: '/obj-to-ply' },
    { label: 'OBJ to STL', path: '/obj-to-stl' },
    { label: 'OBJ to OFF', path: '/obj-to-off' },

    { label: 'PLY to BREP', path: '/ply-to-brep' },
    { label: 'PLY to IGES', path: '/ply-to-iges' },
    { label: 'PLY to OBJ', path: '/ply-to-obj' },
    { label: 'PLY to STEP', path: '/ply-to-step' },
    { label: 'PLY to STL', path: '/ply-to-stl' },
    { label: 'PLY to OFF', path: '/ply-to-off' },

    { label: 'STL to BREP', path: '/stl-to-brep' },
    { label: 'STL to IGES', path: '/stl-to-iges' },
    { label: 'STL to OBJ', path: '/stl-to-obj' },
    { label: 'STL to PLY', path: '/stl-to-ply' },
    { label: 'STL to STEP', path: '/stl-to-step' },
    { label: 'STL to OFF', path: '/stl-to-off' },

    { label: 'OFF to BREP', path: '/off-to-brep' },
    { label: 'OFF to IGES', path: '/off-to-iges' },
    { label: 'OFF to OBJ', path: '/off-to-obj' },
    { label: 'OFF to PLY', path: '/off-to-ply' },
    { label: 'OFF to STL', path: '/off-to-stl' },
    { label: 'OFF to STEP', path: '/off-to-step' },

    { label: 'BREP to STEP', path: '/brep-to-step' },
    { label: 'BREP to IGES', path: '/brep-to-iges' },
    { label: 'BREP to OBJ', path: '/brep-to-obj' },
    { label: 'BREP to PLY', path: '/brep-to-ply' },
    { label: 'BREP to STL', path: '/brep-to-stl' },
    { label: 'BREP to OFF', path: '/brep-to-off' },




   
  ];

  return (
    <div className={styles['cad-convert-types']}>
      <h2>CAD Converter Types</h2>
      <div className={styles['cad-convert-types-list']}>
        {converterTypes.map((type, index) => (
          <a href={`/tools/convert/${type.path}`} key={index}>
            <button >
              {type.label}
            </button>
          </a>
        ))}
      </div>
    </div>
  );
}

export default CadConverterTypes;
