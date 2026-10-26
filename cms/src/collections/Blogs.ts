import type { CollectionConfig } from 'payload'
import { seoField } from '@/fields/seo'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Blog Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      unique: true,
      index: true,
      admin: {
        description:
          'Leave empty to generate it from the title. To replace an old blog, type its old slug exactly (e.g. seo-services-to-improve-google-ranking).',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = typeof value === 'string' && value.trim() ? value : data?.title
            return typeof source === 'string' ? slugify(source) : value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category (e.g. Social Media Marketing)',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Banner / Card Image (shown on /blog and at the top of the article)',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Summary (shown on the /blog card)',
      maxLength: 220,
      admin: {
        description: 'Optional. If empty, the first paragraph of the article is used.',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Blog Structured Sections',
      admin: {
        description: 'Order: Heading -> Box Theme -> Banner Image -> Rich Text Editor',
      },
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          label: 'Section Heading',
        },
        {
          name: 'layoutStyle',
          type: 'select',
          label: 'Box Style / Theme',
          defaultValue: 'plain',
          options: [
            { label: 'Plain (like the original blog pages)', value: 'plain' },
            { label: 'Standard Dark Box', value: 'darkBox' },
            { label: 'Highlighted Cyan Box', value: 'highlightBox' },
            { label: 'Centered Layout', value: 'centered' },
          ],
        },
        {
          name: 'sectionImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Attach Banner / Illustration (Optional)',
        },
        {
          name: 'richContent',
          type: 'richText',
          label: 'Rich Text Content',
        },
      ],
    },
    seoField('seo', 'Page SEO Settings'),
  ],
}
