import React from 'react';
import styles from '../CadHomeDesign/CadHome.module.css';

function CadConverterFormateText({ conversionParams }) {
  const formatDetails = [
    {
      label: 'STEP',
      route: 'step',
      description: 'Standard for the Exchange of Product model data is an ISO standard (ISO 10303) used for representing product data in a neutral and portable format for computer-aided design (CAD) and manufacturing applications. It enables the exchange of 3D CAD models, assemblies, and related product data between different software systems.'
    },
    {
      label: 'BREP',
      route: 'brep',
      description: 'Boundary Representation, which is a method used in computer-aided design (CAD) and 3D modeling to represent the shape of a 3D object. BREP focuses on describing the boundary of the object, including its surfaces, edges, and vertices, rather than the volume of the object itself.'
    },
    {
      label: 'STL',
      route: 'stl',
      description: 'Stereolithography is a widely used file format for 3D printing and computer-aided design (CAD). It is primarily used for representing 3D models in a way that can be understood by 3D printers, CNC machines, and other manufacturing technologies.'
    },
    {
      label: 'IGES',
      route: 'iges',
      description: 'Initial Graphics Exchange Specification is an early and widely used file format standard for the exchange of 2D and 3D CAD (Computer-Aided Design) data between different software applications. It was developed by the U.S. National Institute of Standards and Technology (NIST) in the 1980s to allow interoperability between different CAD systems.'
    },
    {
      label: 'OBJ',
      route: 'obj',
      description: 'OBJ is a popular file format used for representing 3D geometry, primarily in the fields of computer graphics, 3D modeling, and animation. It was originally developed by Wavefront Technologies for their Advanced Visualizer software, and has since become a widely adopted format for exchanging 3D models across various applications.'
    },
    {
      label: 'OFF',
      route: 'off',
      description: 'simple text-based file format used to represent 3D geometric data, particularly for storing and sharing polygonal meshes. It is often used in computational geometry, 3D modeling, and research applications, where the focus is primarily on the geometric structure of objects, rather than materials or textures.'
    },
    {label: 'PLY',
      route: 'ply',
      description:'Polygon File Format is a widely used file format for representing 3D data, particularly polygonal meshes, in the fields of computer graphics, 3D scanning, and point cloud data. It was originally developed to store data from 3D scanners and has since gained popularity in both academic and commercial applications due to its flexibility in handling a variety of data types.'
    },
    // {label: 'GLB',
    //   route: 'glb',
    //   description:'Polygon File Format is a widely used file format for representing 3D data, particularly polygonal meshes, in the fields of computer graphics, 3D scanning, and point cloud data. It was originally developed to store data from 3D scanners and has since gained popularity in both academic and commercial applications due to its flexibility in handling a variety of data types.'
    // }
  ];

  const [fromFormat, toFormat] = conversionParams.split('-to-');

  const from = formatDetails.find(item => item.route === fromFormat);
  const to = formatDetails.find(item => item.route === toFormat);

  return (
    <div className={styles['cad-format-types']}>
      <div className={styles['cad-format-types-desc']}>

        <h3> {from.label}</h3>

        <p> {from.description}</p>


      </div>

    
        <div className={styles['cad-format-types-desc']}>
          <h3>{to.label}</h3>
          
          <p> {to.description}</p>
        </div>
     
    </div>
  );
}

export default CadConverterFormateText;
