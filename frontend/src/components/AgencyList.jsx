import React from 'react'
import AgencyCard from './AgencyCard'

const AgencyList = ({ agencies, onEdit, onDelete }) => {
  if (!agencies || agencies.length === 0) {
    return (
      <div className="card text-text/70">No agencies found.</div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {agencies.map((agency) => (
        <AgencyCard key={agency.id} agency={agency} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default AgencyList


