import React from 'react'
import { motion } from 'framer-motion'

const AgencyCard = ({ agency, onEdit, onDelete }) => {
  return (
    <motion.div
      className="card"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-navy heading">{agency.name}</h3>
          <p className="text-sm text-grayMed mt-1">{agency.type}</p>
          {agency.state && (
            <p className="text-sm text-grayMed mt-1">{agency.state}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button onClick={() => onEdit(agency)} className="btn-secondary text-sm px-3 py-2">Edit</button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(agency)} className="btn-primary bg-red-600 hover:bg-red-700 text-white px-3 py-2">Delete</button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AgencyCard


