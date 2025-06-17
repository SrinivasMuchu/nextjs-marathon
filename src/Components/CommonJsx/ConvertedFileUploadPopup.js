"use client"
import React from 'react'
import PopupWrapper from './PopupWrapper';
import styles from './CommonStyles.module.css';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from "next/navigation";

const features = [
    {
        icon: "🚀",
        title: "Inspire Others",
        desc: "Share your work to spark new ideas and drive innovation."
    },
    {
        icon: "🤝",
        title: "Help the Community",
        desc: "Support fellow engineers and makers with valuable designs."
    },
    {
        icon: "📢",
        title: "Showcase Your Skills",
        desc: "Build your portfolio and gain visibility in the industry."
    },
    {
        icon: "🔗",
        title: "Connect & Collaborate",
        desc: "Find like-minded professionals and potential partners."
    },
    {
        icon: "💡",
        title: "Contribute to the Ecosystem",
        desc: "Be part of a growing library of open hardware designs."
    }
];

function ConvertedFileUploadPopup({url,setPublishCad}) {
    const router = useRouter();
    const handlePublish = () => {
        // Example object to save
     

        // Save object as JSON string
      
        router.push("/publish-cad");
    };
    return (
        <PopupWrapper>
            <div className={styles.cadConvertPopup}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <ClearIcon
                        style={{ cursor: 'pointer' }}
                      onClick={() => setPublishCad(false)} 
                    />
                </div>
                <p className="text-2xl font-bold text-purple-700">
                    ✨ Upload Your Design & Get Paid Soon!
                </p>
                <div className="grid gap-4 mt-4" style={{height:'50vh',overflow:'scroll'}}>
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl shadow-sm">
                            <span className="text-3xl">{feature.icon}</span>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
                        onClick={handlePublish}
                    >
                        Publish
                    </button>
                </div>

            </div>
        </PopupWrapper>
    )
}

export default ConvertedFileUploadPopup


