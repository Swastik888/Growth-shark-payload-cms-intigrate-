import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  access: { read: () => true },
  fields: [
    {
      name: 'story',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Our Story' },
        { name: 'heading', type: 'text' },
        { name: 'paragraph1', type: 'textarea' },
        { name: 'paragraph2', type: 'textarea' },
        { name: 'paragraph3', type: 'textarea' },
      ],
    },
    {
      name: 'gallery',
      type: 'group',
      fields: [
        {
          name: 'images',
          type: 'array',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'alt', type: 'text' },
          ],
        },
        { name: 'autoplay', type: 'checkbox', defaultValue: true },
        {
          name: 'autoplayDelay',
          type: 'number',
          defaultValue: 2500,
          admin: { description: 'Milliseconds per slide' },
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'buttonText', type: 'text' },
        { name: 'buttonLink', type: 'text', defaultValue: '/contact' },
      ],
    },
  ],
}
