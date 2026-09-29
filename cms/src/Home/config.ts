import type { GlobalConfig } from 'payload'
import { revalidateHome } from './hooks/revalidateHome'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true, // public, so the React site can fetch it
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'titleWhite',
          type: 'text',
          label: 'Title (white part)',
          required: true,
          defaultValue: 'Dominate The',
        },
        {
          name: 'titleHighlight',
          type: 'text',
          label: 'Title (blue highlighted part)',
          required: true,
          defaultValue: 'Blue Ocean',
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          defaultValue: 'Get ready to hunt down your competitors',
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button text',
          defaultValue: 'Check Your Eligibility',
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Button link',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background image',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHome],
  },
}