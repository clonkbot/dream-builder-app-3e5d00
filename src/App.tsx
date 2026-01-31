import { useState } from 'react'

interface Dream {
  id: number
  title: string
  description: string
  category: string
  progress: number
  createdAt: Date
}

type Category = 'all' | 'career' | 'personal' | 'travel' | 'health' | 'creative'

const categoryColors: Record<string, string> = {
  career: 'from-blue-500 to-cyan-400',
  personal: 'from-pink-500 to-rose-400',
  travel: 'from-green-500 to-emerald-400',
  health: 'from-orange-500 to-yellow-400',
  creative: 'from-purple-500 to-violet-400',
}

const categoryEmojis: Record<string, string> = {
  career: '💼',
  personal: '💝',
  travel: '✈️',
  health: '🌱',
  creative: '🎨',
}

function App() {
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 1,
      title: 'Learn a new language',
      description: 'Become fluent in Japanese by the end of the year',
      category: 'personal',
      progress: 35,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Visit Northern Lights',
      description: 'Travel to Iceland or Norway to see the Aurora Borealis',
      category: 'travel',
      progress: 10,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'Launch my startup',
      description: 'Build and ship my dream product to the world',
      category: 'career',
      progress: 60,
      createdAt: new Date(),
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newDream, setNewDream] = useState({ title: '', description: '', category: 'personal' })
  const [filter, setFilter] = useState<Category>('all')
  const [editingId, setEditingId] = useState<number | null>(null)

  const addDream = () => {
    if (!newDream.title.trim()) return
    const dream: Dream = {
      id: Date.now(),
      title: newDream.title,
      description: newDream.description,
      category: newDream.category,
      progress: 0,
      createdAt: new Date(),
    }
    setDreams([...dreams, dream])
    setNewDream({ title: '', description: '', category: 'personal' })
    setShowModal(false)
  }

  const updateProgress = (id: number, delta: number) => {
    setDreams(dreams.map(d => {
      if (d.id === id) {
        const newProgress = Math.max(0, Math.min(100, d.progress + delta))
        return { ...d, progress: newProgress }
      }
      return d
    }))
  }

  const deleteDream = (id: number) => {
    setDreams(dreams.filter(d => d.id !== id))
  }

  const filteredDreams = filter === 'all' ? dreams : dreams.filter(d => d.category === filter)

  const totalProgress = dreams.length > 0
    ? Math.round(dreams.reduce((acc, d) => acc + d.progress, 0) / dreams.length)
    : 0

  return (
    <div className="min-h-screen dream-gradient">
      {/* Floating orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="text-6xl float inline-block">✨</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Dream Builder
            </h1>
            <p className="text-white/70 text-lg max-w-md mx-auto">
              Visualize your dreams, track your progress, and make them reality
            </p>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="card-gradient backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{dreams.length}</div>
                  <div className="text-white/60 text-sm">Total Dreams</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{totalProgress}%</div>
                  <div className="text-white/60 text-sm">Average Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {dreams.filter(d => d.progress === 100).length}
                  </div>
                  <div className="text-white/60 text-sm">Dreams Achieved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Add Button */}
        <div className="px-4 mb-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 justify-center">
              {(['all', 'career', 'personal', 'travel', 'health', 'creative'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === cat
                      ? 'bg-white text-purple-700 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {cat === 'all' ? '🌟 All' : `${categoryEmojis[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-white text-purple-700 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add Dream
            </button>
          </div>
        </div>

        {/* Dreams Grid */}
        <div className="flex-1 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            {filteredDreams.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌙</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {filter === 'all' ? 'No dreams yet' : `No ${filter} dreams`}
                </h3>
                <p className="text-white/60">Start by adding your first dream above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDreams.map((dream) => (
                  <div
                    key={dream.id}
                    className="card-gradient backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:border-white/40 transition-all hover:scale-[1.02] group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[dream.category]} flex items-center justify-center text-lg`}>
                          {categoryEmojis[dream.category]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg leading-tight">
                            {dream.title}
                          </h3>
                          <span className="text-xs text-white/50 capitalize">{dream.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingId(editingId === dream.id ? null : dream.id)}
                        className="text-white/40 hover:text-white transition-colors p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>

                    {dream.description && (
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {dream.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Progress</span>
                        <span className={`font-bold text-sm ${
                          dream.progress === 100 ? 'text-green-400' : 'text-white'
                        }`}>
                          {dream.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[dream.category]} transition-all duration-500`}
                          style={{ width: `${dream.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Progress Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateProgress(dream.id, -10)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateProgress(dream.id, 10)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {dream.progress === 100 && (
                        <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Achieved!
                        </span>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {editingId === dream.id && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <button
                          onClick={() => {
                            deleteDream(dream.id)
                            setEditingId(null)
                          }}
                          className="w-full py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-sm"
                        >
                          Delete Dream
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-white/40 text-xs">
            Requested by @BHQpDJmjAs43022 · Built by @clonkbot
          </p>
        </footer>
      </div>

      {/* Add Dream Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>✨</span> Add New Dream
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Dream Title</label>
                <input
                  type="text"
                  value={newDream.title}
                  onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
                  placeholder="What's your dream?"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Description (optional)</label>
                <textarea
                  value={newDream.description}
                  onChange={(e) => setNewDream({ ...newDream, description: e.target.value })}
                  placeholder="Describe your dream in detail..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(categoryEmojis).map(([cat, emoji]) => (
                    <button
                      key={cat}
                      onClick={() => setNewDream({ ...newDream, category: cat })}
                      className={`py-2 px-3 rounded-xl text-sm transition-all ${
                        newDream.category === cat
                          ? 'bg-white text-purple-700 font-semibold'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {emoji} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addDream}
                disabled={!newDream.title.trim()}
                className="flex-1 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Dream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App