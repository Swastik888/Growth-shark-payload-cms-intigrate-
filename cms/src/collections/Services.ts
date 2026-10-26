import type { CollectionConfig } from 'payload'

const text = [{ name: 'text', type: 'textarea', required: true }] as const

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      index: true,
      options: [
        { label: 'B2B SEO', value: 'b2b-seo-service' },
        { label: 'Blog Writing', value: 'blog-writing-service' },
        { label: 'Community Management', value: 'community-management' },
        { label: 'Content Creation', value: 'content-creation-services' },
        { label: 'Copywriting', value: 'copywriting-services' },
        { label: 'E-commerce SEO', value: 'ecommerce-seo-services' },
        { label: 'Email Marketing', value: 'email-marketing-services' },
        { label: 'Facebook Marketing', value: 'facebook-marketing' },
        { label: 'Instagram Marketing', value: 'insta-marketing' },
        { label: 'Social Listening', value: 'social-listening' },
        { label: 'Video Editing', value: 'video-editing-service' },
      ],
      admin: { description: 'Pick the service page this entry controls' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          name: 'hero',
          fields: [
            { name: 'titleStart', type: 'text' },
            { name: 'titleHighlight', type: 'text' },
            { name: 'titleEnd', type: 'text' },
            { name: 'subheading', type: 'text' },
            { name: 'intro', type: 'textarea', admin: { description: 'Use **text** for bold' } },
          ],
        },
        {
          label: 'What is',
          name: 'whatIs',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'textarea' },
            { name: 'factsTitle', type: 'text' },
            { name: 'facts', type: 'array', fields: [...text] },
          ],
        },
        {
          label: 'Approach',
          name: 'approach',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'cards',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Different',
          name: 'different',
          fields: [
            { name: 'titleStart', type: 'text' },
            { name: 'titleHighlight', type: 'text' },
            { name: 'titleEnd', type: 'text' },
            { name: 'points', type: 'array', fields: [...text] },
          ],
        },
        {
          label: 'Why + FAQ',
          name: 'whyAds',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'intro', type: 'text' },
            { name: 'points', type: 'array', fields: [...text] },
          ],
        },
        {
          label: 'FAQ',
          name: 'faq',
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Results + CTA',
          name: 'results',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'textarea' },
          ],
        },
        {
          label: 'CTA',
          name: 'cta',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'text', type: 'textarea' },
            { name: 'buttonText', type: 'text', defaultValue: 'Contact Us' },
            { name: 'buttonLink', type: 'text', defaultValue: '/contact' },
          ],
        },
        {
          label: 'SEO',
          name: 'meta',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'keywords', type: 'text' },
            { name: 'noindex', type: 'checkbox' },
          ],
        },
      ],
    },
  ],
}
