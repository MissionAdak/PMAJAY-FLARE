import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

const FundTracker = ({ data = [] }) => {
  const chartData = data.map((f) => ({ name: f.agency || f.component || 'Item', allocated: f.allocated, utilized: f.utilized }))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-navy heading">Fund Allocation vs Utilization</h3>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#333333" tick={{ fill: '#333333' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis stroke="#333333" tick={{ fill: '#333333' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
            <Tooltip contentStyle={{ background: '#F8F9FA', border: '1px solid #e5e7eb', color: '#333333' }} />
            <Bar dataKey="allocated" fill="#FF9933" radius={[4,4,0,0]} />
            <Bar dataKey="utilized" fill="#138808" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data && data.length > 0 && (
        <motion.div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.slice(0,4).map((f, idx) => {
            const progress = f.allocated ? Math.min(100, Math.round((f.utilized / f.allocated) * 100)) : 0
            return (
              <motion.div key={idx} className="p-3 rounded-lg border border-gray-200 bg-offwhite" whileHover={{ y: -2 }}>
                <div className="text-xs text-text/70">{f.agency || f.component}</div>
                <div className="mt-1 text-sm font-semibold text-charcoal">{progress}% utilized</div>
                <div className="mt-2 h-2 w-full bg-white rounded">
                  <div className="h-2 rounded bg-indiaGreen" style={{ width: `${progress}%` }} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export default FundTracker


