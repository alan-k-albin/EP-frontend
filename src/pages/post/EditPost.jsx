import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'

function EditPost() {
  const [content, setContent] = useState('This is the original post content that can be edited.')

  const handleSave = () => {
    console.log('Updated post:', content)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 flex items-center justify-between">
        <Link to="/">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Edit Post</h1>
        <button
          onClick={handleSave}
          className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-1.5 rounded-full"
        >
          Save
        </button>
      </div>

      <div className="pt-16 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">Alan Joseph</p>
            <p className="text-xs text-gray-400">@alan</p>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full text-sm text-gray-800 focus:outline-none resize-none"
        />
      </div>
    </div>
  )
}

export default EditPost