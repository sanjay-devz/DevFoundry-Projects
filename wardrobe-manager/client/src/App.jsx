import { ArrowRight, Shirt, Sparkles } from 'lucide-react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import StudioLayout from './layouts/StudioLayout'
import DashboardPage from './pages/DashboardPage'
import WardrobePage from './pages/WardrobePage'
import OutfitsPage from './pages/OutfitsPage'
import PlannerPage from './pages/PlannerPage'
import ColorsPage from './pages/ColorsPage'
import AccessoriesPage from './pages/AccessoriesPage'
import MaintenancePage from './pages/MaintenancePage'
import AccountPage from './pages/AccountPage'

export default function App() {
  return <AuthProvider><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route element={<ProtectedRoute/>}><Route element={<StudioLayout/>}><Route path="/studio" element={<DashboardPage/>}/><Route path="/wardrobe" element={<WardrobePage/>}/><Route path="/outfits" element={<OutfitsPage/>}/><Route path="/planner" element={<PlannerPage/>}/><Route path="/colors" element={<ColorsPage/>}/><Route path="/accessories" element={<AccessoriesPage/>}/><Route path="/maintenance" element={<MaintenancePage/>}/><Route path="/account" element={<AccountPage/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></AuthProvider>
}

function Home() {
  const { user } = useAuth()
  return (
    <main className="min-h-screen bg-ivory text-ink">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-12">
        <Link to="/" className="flex items-center gap-3" aria-label="Wardrobe Manager home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white"><Shirt size={19} /></span>
          <span className="text-sm font-semibold tracking-[0.13em]">WARDROBE<span className="font-normal text-muted"> / STUDIO</span></span>
        </Link>
        <span className="hidden text-xs tracking-[0.16em] text-muted sm:block">A MORE CONSIDERED CLOSET</span>
      </header>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-12 lg:grid-cols-[1fr_1fr] lg:px-12 lg:pb-28 lg:pt-16">
        <div className="max-w-xl">
          <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest"><Sparkles size={14} /> Your wardrobe, reimagined</p>
          <h1 className="font-serif text-6xl leading-[0.98] tracking-[-0.045em] sm:text-7xl">Get dressed<br /><span className="italic text-forest">with intention.</span></h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted">A quieter way to know what you own, find new combinations, and make every day’s outfit feel like you.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={user?'/studio':'/register'} className="inline-flex items-center gap-3 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#293b2e] focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2">{user?'Open your studio':'Build your wardrobe'} <ArrowRight size={16} /></Link>
            <Link to={user?'/studio':'/login'} className="rounded-full border border-black/15 px-6 py-3.5 text-sm font-medium transition hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-forest">{user?'Your wardrobe':'Sign in'}</Link>
          </div>
          <div className="mt-14 flex gap-10 border-t border-black/10 pt-6 text-xs text-muted"><span><b className="mr-2 text-ink">01</b> Curate your closet</span><span><b className="mr-2 text-ink">02</b> Find your rhythm</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="aspect-[0.94] overflow-hidden rounded-[44%_44%_8px_8px] bg-[#e7e3d8]">
            <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="A thoughtfully styled neutral wardrobe" />
          </div>
          <div className="absolute -bottom-5 left-0 rounded-full border border-black/10 bg-ivory px-5 py-3 text-xs tracking-wide shadow-sm">LESS, BUT BETTER <span className="ml-2 text-forest">✳</span></div>
          <div className="absolute right-0 top-12 max-w-[170px] rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur"><p className="text-[10px] uppercase tracking-[0.16em] text-muted">This week</p><p className="mt-2 font-serif text-xl">Your kind of everyday.</p><p className="mt-2 text-xs text-muted">A little more room for what you love.</p></div>
        </div>
      </section>
    </main>
  )

