import { useState } from 'react'
import { Shirt } from 'lucide-react'

export default function ClothingImage({ src, alt = '', className = '', iconSize = 26 }) {
  const [failed, setFailed] = useState(false)
  return <div className={`relative grid overflow-hidden bg-[#e8e5dc] ${className}`}>
    {(!src || failed) && <span className="grid h-full w-full place-items-center text-forest/40"><Shirt size={iconSize} /></span>}
    {src && !failed && <img src={src} alt={alt} onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />}
  </div>
}
