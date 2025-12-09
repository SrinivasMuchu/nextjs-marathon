import { Label } from "@mui/icons-material";


export const textLettersLimit = (text, limitType) => {

  if (typeof text !== 'string' || typeof limitType !== 'number') {
    return text;
  }

  if (text.length > limitType) {
    return `${text.substring(0, limitType)}...`;
  }

  return text;
};


export function sendGAtagEvent1(eventName,category,publish_from) {
  if(publish_from){
    const cleanUrl = window.location.origin + window.location.pathname;
    window.gtag('event', eventName, {
      event_category: 'PUBLISH',
      event_label: cleanUrl // URL without query params
    });
  }else{
    window.gtag('event', eventName, {
      event_category: category
    });
  }
  
  

}
export function sendGAtagEvent(eventData) {
  const { event_name, ...eventParams } = eventData;
  

    window.gtag('event', event_name, eventParams);
  
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).replace(',', '');
}








//    iges 


export const convertedFiles = [
  {
    "id": "1",
    "url": "https://marathon-org-assets.s3.ap-south-1.amazonaws.com/67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745498051_620_cy79pc4yd3r.step",
    "format": "step",
    "name": "sample.step"

  },
  {
    "id": '2',
    "url": "https://marathon-org-assets.s3.ap-south-1.amazonaws.com/67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745231893_385_b3jinkax9rn.stl",
    "format": "stl",

    "name": "sample.stl"
  },
  {
    "id": '3',
    "url": "https://marathon-org-assets.s3.ap-south-1.amazonaws.com/67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745562522_827_dqmd45tl4ft.ply",
    "format": "ply",
    "name": "sample.ply"
  },
  {
    "id": '4',
    "url": "https://marathon-org-assets.s3.ap-south-1.amazonaws.com/67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745497469_620_njtb4ms2wf.iges",
    "format": "iges",
    "name": "sample.iges"
  },
  {
    "id": "5",
    "url": "https://marathon-org-assets.s3.ap-south-1.amazonaws.com/67f7f3651e29d8a1a943e57f/designs_upload/67f7f3651e29d8a1a943e57f_designs_upload_upload_1745497955_891_tbkq0vuhfd.obj",
    "format": "obj",
    "name": "sample.obj"


  }]


  export const cadViewerFiles = [
    {
      "id": '6800a5b1b6b9e6583e6ec3c3',    
      "name": "Engine Block",
      
    },
    {
      "id": '68012016b1f61b010dd05a53',
      "name": "End Effector",
      
    },
    {
      "id": "68011f2eb1f61b010dd05a50",
      "name": "Brushless DC Motor",
      
  
    },
    {
      "id": '6800ef3cb1f61b010dd059d1',
      "name": "Fixture Clamp",
      
    },
    
   ]


export const createDropdownCustomStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "transparent",
        border: "1px solid #d1d5db",
        boxShadow: "none",
        marginBottom: "16px",
        height:"42px"
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),

    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? "#3182CE"
            : state.isFocused
            ? "#E2E8F0"
            : "white",
        color: state.isSelected ? "white" : "black",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "#E2E8F0",
        },
    }),

    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#610bee", // blue background for selected values
        borderRadius: "4px",
    }),

    multiValueLabel: (provided) => ({
        ...provided,
        color: "white", // white text
        fontWeight: 500,
    }),

    multiValueRemove: (provided) => ({
        ...provided,
        color: "white",
        ":hover": {
            backgroundColor: "#2B6CB0", // darker blue on hover
            color: "white",
        },
    }),
};




export const converterTypes = [
  { label: 'STEP to BREP', path: '/step-to-brep' },
  { label: 'STEP to IGES', path: '/step-to-iges' },
  { label: 'STEP to OBJ', path: '/step-to-obj' },
  { label: 'STEP to PLY', path: '/step-to-ply' },
  { label: 'STEP to STL', path: '/step-to-stl' },
  { label: 'STEP to OFF', path: '/step-to-off' },
  { label: 'STEP to GLB', path: '/step-to-glb' },

  { label: 'IGES to BREP', path: '/iges-to-brep' },
  { label: 'IGES to STEP', path: '/iges-to-step' },
  { label: 'IGES to OBJ', path: '/iges-to-obj' },
  { label: 'IGES to PLY', path: '/iges-to-ply' },
  { label: 'IGES to STL', path: '/iges-to-stl' },
  { label: 'IGES to OFF', path: '/iges-to-off' },
  { label: 'IGES to GLB', path: '/iges-to-glb' },

  { label: 'OBJ to BREP', path: '/obj-to-brep' },
  { label: 'OBJ to IGES', path: '/obj-to-iges' },
  { label: 'OBJ to STEP', path: '/obj-to-step' },
  { label: 'OBJ to PLY', path: '/obj-to-ply' },
  { label: 'OBJ to STL', path: '/obj-to-stl' },
  { label: 'OBJ to OFF', path: '/obj-to-off' },
  { label: 'OBJ to GLB', path: '/obj-to-glb' },

  { label: 'PLY to BREP', path: '/ply-to-brep' },
  { label: 'PLY to IGES', path: '/ply-to-iges' },
  { label: 'PLY to OBJ', path: '/ply-to-obj' },
  { label: 'PLY to STEP', path: '/ply-to-step' },
  { label: 'PLY to STL', path: '/ply-to-stl' },
  { label: 'PLY to OFF', path: '/ply-to-off' },
  { label: 'PLY to GLB', path: '/ply-to-glb' },

  { label: 'STL to BREP', path: '/stl-to-brep' },
  { label: 'STL to IGES', path: '/stl-to-iges' },
  { label: 'STL to OBJ', path: '/stl-to-obj' },
  { label: 'STL to PLY', path: '/stl-to-ply' },
  { label: 'STL to STEP', path: '/stl-to-step' },
  { label: 'STL to OFF', path: '/stl-to-off' },
  { label: 'STL to GLB', path: '/stl-to-glb' },

  { label: 'OFF to BREP', path: '/off-to-brep' },
  { label: 'OFF to IGES', path: '/off-to-iges' },
  { label: 'OFF to OBJ', path: '/off-to-obj' },
  { label: 'OFF to PLY', path: '/off-to-ply' },
  { label: 'OFF to STL', path: '/off-to-stl' },
  { label: 'OFF to STEP', path: '/off-to-step' },
  { label: 'OFF to GLB', path: '/off-to-glb' },

  { label: 'BREP to STEP', path: '/brep-to-step' },
  { label: 'BREP to IGES', path: '/brep-to-iges' },
  { label: 'BREP to OBJ', path: '/brep-to-obj' },
  { label: 'BREP to PLY', path: '/brep-to-ply' },
  { label: 'BREP to STL', path: '/brep-to-stl' },
  { label: 'BREP to OFF', path: '/brep-to-off' },
  { label: 'BREP to GLB', path: '/brep-to-glb' },

  { label: 'GLB to STEP', path: '/glb-to-step' },
  { label: 'GLB to IGES', path: '/glb-to-iges' },
  { label: 'GLB to OBJ', path: '/glb-to-obj' },
  { label: 'GLB to PLY', path: '/glb-to-ply' },
  { label: 'GLB to STL', path: '/glb-to-stl' },
  { label: 'GLB to OFF', path: '/glb-to-off' },
  { label: 'GLB to BREP', path: '/glb-to-brep' },




 
];
// export const allowedFilesList = [ ".stp",  ,  ".igs", , ".brp", ]
export const cadViewTypes =[{
  label:'OBJ viewer',
  path:'/obj'
},{  label:'STL viewer',
  path:'/stl'
},{  label:'PLY viewer',
  path:'/ply'
},{  label:'OFF viewer',
  path:'/off'
},{  label:'IGES viewer',
  path:'/iges'
},{  label:'BREP viewer',
  path:'/brep'
},{  label:'STEP viewer',
  path:'/step'
},{label:'STP viewer',
  path:'/stp'
},{label:'BRP viewer',
  path:'/brp'
},{label:'IGS viewer',
  path:'/igs'
},{label:'GLB viewer',
  path:'/glb'
}]