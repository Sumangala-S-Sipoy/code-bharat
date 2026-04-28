import React from 'react'

export default function JobCard({ job }: { job: any }) {
  return (
    <article className="border rounded p-4 shadow-sm hover:shadow-md">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.company?.name}</p>
      <p className="mt-2 text-sm">{job.description?.slice(0, 180)}...</p>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
        <div>
          {job.salaryMin || job.salaryMax ? (
            <span>
              ₹{job.salaryMin ?? '—'} - ₹{job.salaryMax ?? '—'}
            </span>
          ) : (
            <span>Salary not specified</span>
          )}
        </div>
        <div>{job.distanceKm ? `${job.distanceKm.toFixed(1)} km` : ''}</div>
      </div>
    </article>
  )
}
