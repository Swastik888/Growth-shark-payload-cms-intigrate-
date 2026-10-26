import type { CollectionConfig } from 'payload'
import { seoField } from '@/fields/seo'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
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
      label: 'Project Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'select',
      label: 'Select Case Study Slug',
      required: true,
      defaultValue: 'smm1',
      options: [
        { label: 'CB2B (Custom B2B)', value: 'cb2b' },
        { label: 'OCS (Outreach)', value: 'ocs' },
        { label: 'PMS (Property Management Software)', value: 'pms' },
        { label: 'SMM Case 1 (smm1)', value: 'smm1' },
        { label: 'SMM Case 2 (smm2)', value: 'smm2' },
      ],
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category (e.g. Social Media Management)',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Card Thumbnail Image (Shown on /portfolio grid)',
      required: true,
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Case Study Structured Sections',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          label: 'Section Heading (e.g. Background of the project)',
        },
        {
          name: 'layoutStyle',
          type: 'select',
          label: 'Box Style / Theme',
          defaultValue: 'darkBox',
          options: [
            { label: 'Standard Dark Box (Background / Challenges)', value: 'darkBox' },
            { label: 'Highlighted Cyan Box (Results / Key Takeaways)', value: 'highlightBox' },
            { label: 'Centered Layout', value: 'centered' },
          ],
        },
        {
          name: 'sectionImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Attach Chart / Analytics Screenshot (Optional)',
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
