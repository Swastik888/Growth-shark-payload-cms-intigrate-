import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  access: { read: () => true },
  fields: [
    {
      name: 'heading',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Contact' },
        { name: 'title', type: 'text', defaultValue: 'Get in touch' },
      ],
    },
    {
      name: 'info',
      type: 'group',
      fields: [
        {
          name: 'emails',
          type: 'array',
          fields: [{ name: 'email', type: 'email', required: true }],
        },
        {
          name: 'phones',
          type: 'array',
          fields: [{ name: 'phone', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'form',
      type: 'group',
      fields: [
        { name: 'namePlaceholder', type: 'text' },
        { name: 'emailPlaceholder', type: 'text' },
        { name: 'messagePlaceholder', type: 'text' },
        { name: 'disclaimer', type: 'text' },
        { name: 'buttonText', type: 'text' },
      ],
    },
    {
      name: 'map',
      type: 'group',
      fields: [
        { name: 'show', type: 'checkbox', defaultValue: true },
        {
          name: 'mode',
          type: 'select',
          defaultValue: 'address',
          options: [
            { label: 'Type an address (easy)', value: 'address' },
            { label: 'Paste Google Maps embed link', value: 'embed' },
          ],
        },
        {
          name: 'address',
          type: 'text',
          admin: {
            condition: (_, s) => s?.mode === 'address',
            description: 'e.g. Bardhaman, West Bengal',
          },
        },
        {
          name: 'mapType',
          type: 'select',
          defaultValue: 'roadmap',
          options: [
            { label: 'Map', value: 'roadmap' },
            { label: 'Satellite', value: 'satellite' },
          ],
          admin: { condition: (_, s) => s?.mode === 'address' },
        },
        {
          name: 'zoom',
          type: 'number',
          defaultValue: 13,
          min: 1,
          max: 20,
          admin: { condition: (_, s) => s?.mode === 'address' },
        },
        {
          name: 'embedLink',
          type: 'textarea',
          admin: {
            condition: (_, s) => s?.mode === 'embed',
            description:
              'Google Maps → Share → Embed a map → paste the link or the whole <iframe> code',
          },
        },
        { name: 'height', type: 'number', defaultValue: 450 },
        { name: 'title', type: 'text', defaultValue: 'Location Map' },
      ],
    },
  ],
}
