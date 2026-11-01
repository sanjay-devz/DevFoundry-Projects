import { useState } from 'react'
import { ArrowLeft, ArrowRight, Shirt } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/studio" replace />
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      if (isRegister) await register(form)
      else await login({ email: form.email, password: form.password })
      const destination = params.get('next')
      navigate(destination?.startsWith('/') && !destination.startsWith('//') ? destination : '/studio', { replace: true })
    } catch (err) { setError(err.response?.data?.message || 'We could not complete that request. Please try again.') }
    finally { setBusy(false) }
  }
  return <main className="grid min-h-screen bg-ivory lg:grid-cols-2">
    <section className="flex flex-col px-6 py-7 sm:px-12 lg:px-16">
      <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.12em]"><span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white"><Shirt size={18}/></span>WARDROBE / STUDIO</Link>
      <div className="mx-auto my-auto w-full max-w-md py-14">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-xs text-muted hover:text-ink"><ArrowLeft size={14}/> Back home</Link>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-forest">A more considered closet</p>
        <h1 className="font-serif text-5xl tracking-tight">{isRegister ? 'Make room for better.' : 'Welcome back.'}</h1>
        <p className="mt-4 text-sm leading-6 text-muted">{isRegister ? 'Create your private wardrobe studio and start with what you already love.' : 'Your wardrobe is right where you left it.'}</p>
        <form onSubmit={submit} className="mt-9 space-y-5">
          {isRegister && <label className="block text-xs font-medium">Your name<input autoComplete="name" required minLength="2" maxLength="60" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="auth-input" placeholder="Alex Morgan"/></label>}
          <label className="block text-xs font-medium">Email address<input type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="auth-input" placeholder="you@example.com"/></label>
          <label className="block text-xs font-medium">Password<input type="password" autoComplete={isRegister?'new-password':'current-password'} required minLength={isRegister?8:1} maxLength="72" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="auth-input" placeholder={isRegister?'At least 8 characters':'Your password'}/></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-3 rounded-full bg-forest px-6 py-4 text-sm font-medium text-white transition hover:bg-[#293b2e] disabled:opacity-60">{busy?'One moment…':isRegister?'Create your account':'Sign in'} {!busy&&<ArrowRight size={16}/>}</button>
        </form>
        <p className="mt-7 text-center text-sm text-muted">{isRegister?'Already have an account?':'New to Wardrobe Studio?'} <Link className="font-semibold text-forest underline-offset-4 hover:underline" to={isRegister?'/login':'/register'}>{isRegister?'Sign in':'Create an account'}</Link></p>
      </div>
      <p className="text-xs text-muted">Your wardrobe is private to you.</p>
    </section>
    <aside className="relative hidden overflow-hidden bg-[#dcded3] lg:block"><img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Wardrobe inspiration"/><div className="absolute inset-0 bg-forest/20"/><div className="absolute bottom-12 left-12 max-w-sm rounded-2xl bg-ivory/90 p-7 backdrop-blur"><p className="text-[10px] uppercase tracking-[0.2em] text-forest">A note to yourself</p><p className="mt-3 font-serif text-3xl leading-tight">“Style is knowing what belongs, and letting the rest go.”</p></div></aside>
  </main>
}
