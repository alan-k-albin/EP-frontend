import BottomNav from '../../components/layout/BottomNav'

function FeedC() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
        <h1 className="text-lg font-bold text-gray-800">C</h1>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-2xl font-black text-[#2B4593] mb-3">Something Big is Coming</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          We're working on something truly special for you. Stay tuned — you won't want to miss this.
        </p>
        <div className="mt-8 bg-[#2B4593] text-white px-6 py-3 rounded-full text-sm font-semibold">
          Coming Soon
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default FeedC