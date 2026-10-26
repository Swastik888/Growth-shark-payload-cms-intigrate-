import { useEffect, useState } from 'react'

const CMS_URL = import.meta.env.VITE_CMS_URL

// One shared request per global, reused by every component
const requests = {}

function load(slug) {
    if (!requests[slug]) {
        requests[slug] = fetch(`${CMS_URL}/api/globals/${slug}?depth=1`)
            .then((res) => {
                if (!res.ok) throw new Error(`CMS responded ${res.status}`)
                return res.json()
            })
            .catch((err) => {
                delete requests[slug] // allow a retry next time
                throw err
            })
    }
    return requests[slug]
}

// Turns a Payload media object into a full image URL (or null if there is none)
export function mediaUrl(media) {
    if (!media?.url) return null
    return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`
}

export function useGlobal(slug) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        load(slug)
            .then(setData)
            .catch((err) => console.error('CMS error:', err))
            .finally(() => setLoading(false))
    }, [slug])

    return { data, loading }
}

