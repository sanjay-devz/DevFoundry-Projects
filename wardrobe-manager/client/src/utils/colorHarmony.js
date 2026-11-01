export function hexToHsl(hex) {
  const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || '')
  if (!match) return null
  let [r,g,b] = match.slice(1).map((v) => parseInt(v,16)/255)
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h=0,s=0; const l=(max+min)/2
  if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4}h/=6}
  return [h*360,s*100,l*100]
}
export function hslToHex(h,s,l){h=((h%360)+360)%360/360;s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h*12)%12;const c=l-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,'0')};return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()}
export function colorSuggestions(hex){const hsl=hexToHsl(hex);if(!hsl)return[];const[h,s,l]=hsl;return[{name:'Complementary',hex:hslToHex(h+180,s,l)},{name:'Analogous',hex:hslToHex(h+30,s,l)},{name:'Triadic',hex:hslToHex(h+120,s,l)},{name:'Soft neutral',hex:hslToHex(h,Math.min(s,18),Math.min(92,Math.max(18,l+25)))}]}
