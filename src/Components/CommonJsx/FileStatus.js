import React from 'react'
import { FaCheck, FaTimes, FaClock, FaSpinner } from 'react-icons/fa'

function FileStatus({status}) {
  const getStatusConfig = () => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return {
          icon: <FaCheck />,
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          label: 'Completed'
        }
      case 'processing':
        return {
          icon: <FaSpinner />,
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          label: 'Processing'
        }
      case 'failed':
        return {
          icon: <FaTimes />,
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          label: 'Failed'
        }
      case 'pending':
        return {
          icon: <FaClock />,
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
          label: 'Pending'
        }
      default:
        return {
          icon: <FaClock />,
          bgColor: 'bg-gray-300',
          textColor: 'text-gray-800',
          label: 'Unknown'
        }
    }
  }

  const { icon, bgColor, textColor, label } = getStatusConfig()

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} ${textColor}`}>
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export default FileStatus