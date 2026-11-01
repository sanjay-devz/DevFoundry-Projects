import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'

export default function useCollection(endpoint, params = {}) {
  const [items, setItems] = useState([]); const [pagination, setPagination] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { const { data } = await api.get(endpoint, { params }); setItems(data.data.items || []); setPagination(data.data.pagination || null) }
    catch (e) { setError(e.response?.data?.message || 'Could not load your records.') }
    finally { setLoading(false) }
  }, [endpoint, JSON.stringify(params)])
  useEffect(() => { load() }, [load])
  return { items, setItems, pagination, loading, error, reload: load }
}
