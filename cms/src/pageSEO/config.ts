import type { GlobalConfig } from 'payload'
import { makeSeoFields, seoField } from '../fields/seo'

export const PageSEO: GlobalConfig = {
  slug: 'seo',
  label: 'Page SEO',
  access: { read: () => true },
  fields: [
    seoField('defaults', 'Default SEO (used by pages not listed below)'),
    {
      name: 'pages',
      type: 'array',
      label: 'Pages',
      labels: { singular: 'Page', plural: 'Pages' },
      admin: {
        description:
          'One row per page. The path is the page URL, for example /career or /services/blog-writing-service.',
      },
      fields: [
        {
          name: 'path',
          type: 'text',
          required: true,
          label: 'Page path',
          validate: (val: string | null | undefined) =>
            val && val.startsWith('/') ? true : 'Path must start with /',
        },
        ...makeSeoFields(),
      ],
    },
  ],
}
