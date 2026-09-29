import { useEffect, useState } from 'react'

const CMS_URL = import.meta.env.VITE_CMS_URL

export function useGlobal(slug) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${CMS_URL}/api/globals/${slug}?depth=1`)
            .then((res) => res.json())
            .then(setData)
            .catch((err) => console.error('CMS error:', err))
            .finally(() => setLoading(false))
    }, [slug])

    return { data, loading }
}

