

export const textLettersLimit = (text, limitType) => {

  if (typeof text !== 'string' || typeof limitType !== 'number') {
    return text;
  }

  if (text.length > limitType) {
    return `${text.substring(0, limitType)}...`;
  }

  return text;
};

export function sendViewerEvent(eventName) {
  
    window.gtag('event', eventName, {
      event_category: 'CAD_VIEWER'
    });
 
}


export function sendConverterEvent(eventName) {
 
  window.gtag('event', eventName, {
    event_category: 'CONVERTER'
  });

}

export function sendPublishEvent(eventName) {
 
   
    window.gtag('event', eventName, {
      event_category: 'PUBLISH',
      
    });
  
}
export function sendPublishModelEvent(eventName) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.gtag('event', eventName, {
      event_category: 'PUBLISH',
      event_label: cleanUrl // URL without query params
    });
  } 
}

export function sendFloatingButtonEvent(eventName) {
 
  window.gtag('event', eventName, {
    event_category: 'FLOATING_BUTTON'
  });

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
      "name": "engine-block.step"
    },
    {
      "id": '68012016b1f61b010dd05a53',
      "name": "end-effector.step"
    },
    {
      "id": "68011f2eb1f61b010dd05a50",
      "name": "brushless-dc-motor.step"
  
    },
    {
      "id": '6800ef3cb1f61b010dd059d1',
      "name": "fixture-clamp.step"
    },
    
   ]


export const createDropdownCustomStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "transparent",
        border: "1px solid #EDF2F7",
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
