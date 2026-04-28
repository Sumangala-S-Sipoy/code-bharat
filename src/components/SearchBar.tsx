import React from 'react'

export default function SearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [q, setQ] = React.useState('')
  return (
    <div className="max-w-6xl mx-auto py-6 px-6">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 p-3 border rounded"
          placeholder="Search jobs, skills, companies..."
        />
        <button
          onClick={() => onSearch && onSearch(q)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Search
        </button>
      </div>
    </div>
  )
}
