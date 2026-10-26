import type { Field } from 'payload'
import { MetaDescriptionField, MetaImageField, MetaTitleField } from '@payloadcms/plugin-seo/fields'

// returns a fresh array each time (Payload modifies field configs, so don't share one array)
export const makeSeoFields = (): Field[] => [
  MetaTitleField({ hasGenerateFn: false }),
  MetaDescriptionField({}),
  MetaImageField({ relationTo: 'media' }),
  { name: 'keywords', type: 'text', label: 'Keywords (optional, comma separated)' },
  {
    name: 'noIndex',
    type: 'checkbox',
    label: 'Hide this page from search engines (noindex)',
    defaultValue: false,
  },
]

export const seoField = (name = 'meta', label = 'SEO'): Field => ({
  name,
  label,
  type: 'group',
  fields: makeSeoFields(),
})
