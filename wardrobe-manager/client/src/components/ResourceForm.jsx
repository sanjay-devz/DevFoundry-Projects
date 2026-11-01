export default function ResourceForm({ fields, value, onChange, onSubmit, onCancel, submitText = 'Save changes', children }) {
  return <form onSubmit={onSubmit} className="space-y-4">
    {fields.map((field) => <label key={field.name} className="block text-xs font-medium text-ink">{field.label}
      {field.type === 'select' ? <select required={field.required !== false} value={value[field.name] ?? ''} onChange={(e) => onChange({ ...value, [field.name]: e.target.value })} className="auth-input">{field.options.map((option) => { const optionValue = typeof option === 'string' ? option : option.value; const optionLabel = typeof option === 'string' ? option : option.label; return <option key={optionValue} value={optionValue}>{optionLabel}</option> })}</select>
        : field.type === 'textarea' ? <textarea rows="3" maxLength={field.maxLength || 500} value={value[field.name] ?? ''} onChange={(e) => onChange({ ...value, [field.name]: e.target.value })} className="auth-input" placeholder={field.placeholder || ''} />
          : <input type={field.type || 'text'} required={field.required !== false} min={field.min} max={field.max} maxLength={field.maxLength} value={value[field.name] ?? ''} onChange={(e) => onChange({ ...value, [field.name]: e.target.value })} className="auth-input" placeholder={field.placeholder || ''} />}
    </label>)}
    {children}
    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onCancel} className="rounded-full border border-black/15 px-5 py-3 text-sm">Cancel</button><button className="rounded-full bg-forest px-6 py-3 text-sm text-white hover:bg-[#293b2e]">{submitText}</button></div>
  </form>
}
