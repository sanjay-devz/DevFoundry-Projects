export default function PageHeading({ eyebrow, title, description, action }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">{eyebrow}</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h1>{description&&<p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p>}</div>{action}</div>
}''
