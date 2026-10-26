import type { GlobalConfig } from 'payload'

const cards = [
  { name: 'title', type: 'text' },
  { name: 'text', type: 'textarea' },
] as const

export const CareerPage: GlobalConfig = {
  slug: 'career-page',
  label: 'Career Page',
  access: { read: () => true },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'titleStart', type: 'text', defaultValue: 'Join' },
        { name: 'titleHighlight', type: 'text', defaultValue: 'GrowthShark' },
        { name: 'text', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'form',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'buttonText', type: 'text' },
      ],
    },
    {
      name: 'why',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'items', type: 'array', fields: [...cards] },
      ],
    },
    {
      name: 'process',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'intro', type: 'textarea' },
        { name: 'steps', type: 'array', fields: [...cards] },
        { name: 'offerTitle', type: 'text' },
        { name: 'offerText', type: 'textarea' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'intro', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'emails', type: 'array', fields: [{ name: 'email', type: 'email' }] },
      ],
    },
  ],
}
