import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Shirt, Sparkles, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import ClothingImage from '../components/ClothingImage'

const cards = [
  ['clothingCount', 'Pieces', '/wardrobe', Shirt],
  ['outfitCount', 'Saved looks', '/outfits', Sparkles],
  ['accessoryCount', 'Accessories', '/accessories', Sparkles],
  ['plannedCount', 'This week', '/planner', CalendarDays],
  ['pendingCount', 'Care tasks', '/maintenance', Wrench],
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    api.get('/dashboard/stats').then((response) => setData(response.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load your studio overview.'))
  }, [])

  return <>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Your personal studio</p>
    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-serif text-5xl">Good to see you, {user?.name?.split(' ')[0]}.</h1><p className="mt-3 text-sm text-muted">A little more intention, one outfit at a time.</p></div>
      <Link to="/wardrobe" className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm text-white">Add a piece <ArrowRight size={15} /></Link>
    </div>
    {error && <p role="alert" className="mt-6 text-sm text-red-800">{error}</p>}
    <div className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map(([key, label, to, Icon]) => <Link to={to} key={key} className="rounded-2xl border border-black/10 bg-white/55 p-5 transition hover:bg-white"><Icon size={18} className="text-forest" /><p className="mt-5 font-serif text-3xl">{data?.stats?.[key] ?? '—'}</p><p className="mt-1 text-xs text-muted">{label}</p></Link>)}
    </div>
    <div className="mt-6 flex flex-wrap gap-2">
      <Link to="/outfits" className="rounded-full border border-black/15 px-4 py-2.5 text-xs hover:bg-white">Create an outfit</Link>
      <Link to="/planner" className="rounded-full border border-black/15 px-4 py-2.5 text-xs hover:bg-white">Plan a look</Link>
      <Link to="/accessories" className="rounded-full border border-black/15 px-4 py-2.5 text-xs hover:bg-white">Manage accessories</Link>
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-3xl border border-black/10 bg-white/50 p-6">
        <div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Recently added</h2><Link to="/wardrobe" className="text-xs text-forest">View wardrobe →</Link></div>
        <div className="mt-5 divide-y divide-black/5">{data?.recent?.length ? data.recent.map((item) => <div key={item._id} className="flex items-center gap-3 py-3"><ClothingImage src={item.imageUrl} alt={item.name} className="h-12 w-10 rounded-lg" iconSize={15}/><div className="flex-1"><p className="text-sm font-medium">{item.name}</p><p className="mt-1 text-xs text-muted">{item.category} · {item.color}</p></div><span style={{ backgroundColor: item.colorHex }} className="h-3.5 w-3.5 rounded-full border border-black/10" /></div>) : <div className="py-8 text-center"><p className="font-serif text-xl">Start with a favorite.</p><Link to="/wardrobe" className="mt-2 inline-block text-xs text-forest">Add your first piece →</Link></div>}</div>
      </section>
      <section className="rounded-3xl border border-black/10 bg-[#e9e9df] p-6">
        <div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Care up next</h2><Link to="/maintenance" className="text-xs text-forest">All tasks →</Link></div>
        {data?.upcoming?.length ? <div className="mt-4 space-y-3">{data.upcoming.map((task) => <div key={task._id} className="flex items-center justify-between gap-3 border-b border-black/10 pb-3"><div><p className="text-sm font-medium">{task.taskType} · {task.clothingItem?.name || 'Wardrobe piece'}</p><p className="mt-1 text-xs text-muted">{task.description || task.clothingItem?.category || ''}</p></div><span className="shrink-0 text-xs text-muted">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div>)}</div> : <p className="mt-4 text-sm text-muted">Nothing due this week. Your clothes can take a breather.</p>}
        <div className="mt-6 border-t border-black/10 pt-5"><h3 className="text-xs font-semibold uppercase tracking-[.16em] text-muted">Collection by category</h3><div className="mt-4 space-y-3">{data?.categories?.slice(0, 4).map((category) => <div key={category._id}><div className="mb-1 flex justify-between text-xs"><span>{category._id}</span><span>{category.count}</span></div><div className="h-1.5 rounded-full bg-white/70"><div className="h-full rounded-full bg-forest" style={{ width: `${Math.max(6, Math.min(100, (category.count / Math.max(1, data.categories[0]?.count)) * 100))}%` }} /></div></div>)}{!data?.categories?.length && <p className="text-xs text-muted">Category insights appear as your wardrobe grows.</p>}</div></div>
        <Link to="/outfits" className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-forest">Explore outfit studio <ArrowRight size={14} /></Link>
      </section>
    </div>
  </>
}
