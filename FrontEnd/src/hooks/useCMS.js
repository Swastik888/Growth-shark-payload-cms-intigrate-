
import { useEffect, useState } from 'react'

const CMS_URL = (import.meta.env.VITE_CMS_URL || '').replace(/\/$/, '')

// Reuse requests for each global
const requests = {}

function load(slug) {
    if (!requests[slug]) {
        requests[slug] = fetch(
            `${CMS_URL}/api/globals/${slug}?depth=1`,
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`CMS responded ${res.status}`)
                }
                return res.json()
            })
            .catch((err) => {
                delete requests[slug]
                throw err
            })
    }

    return requests[slug]
}

// Resolve a Payload media object to its image URL
export function mediaUrl(media) {
    if (!media) return null

    // Prefer the URL returned by Payload/Blob storage
    const url = typeof media === 'string' ? media : media.url

    if (!url) return null

    // Blob URLs and other absolute URLs should be used directly
    if (/^https?:\/\//i.test(url)) return url

    // Handle relative URLs returned by Payload
    return `${CMS_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export function useGlobal(slug) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        setLoading(true)

        load(slug)
            .then((result) => {
                if (active) setData(result)
            })
            .catch((err) => {
                console.error(`CMS error (${slug}):`, err)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [slug])

    return { data, loading }
}




