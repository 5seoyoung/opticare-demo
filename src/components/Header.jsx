import React from 'react'

const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* public/snuh-logo.png */}
            <img
              src={`${import.meta.env.BASE_URL}snuh-logo.png`}
              alt="서울대학교병원(SNUH)"
              className="h-10 w-auto"
              loading="eager"
              decoding="async"
            />
            <div className="h-8 w-px bg-gray-300" />
          </div>

          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              Opticare
            </h1>
            <p className="text-xs text-gray-600">중환자실 자원효율 에이전트</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">ICU 1병동</div>
            <div className="text-xs text-gray-600">2025.10.13 14:23</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            의
          </div>
        </div>
      </div>
    </div>
  </header>
)

export default Header
