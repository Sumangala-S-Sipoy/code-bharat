import React from 'react'

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-teal-500 text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">CodeBharat Jobs</h1>
        <nav>
          <a className="mr-4" href="#">Jobs</a>
          <a className="mr-4" href="#">Recruiters</a>
          <a href="#">Profile</a>
        </nav>
      </div>
    </header>
  )
}
