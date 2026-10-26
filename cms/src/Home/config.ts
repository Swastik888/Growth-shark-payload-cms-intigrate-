import type { GlobalConfig, Field } from 'payload'
import { revalidateHome } from './hooks/revalidateHome'

import { seoField } from '../fields/seo'

const CALENDLY = 'https://calendly.com/proriterz101/30min'

type HeroDefaults = {
  titleWhite: string
  titleHighlight: string
  subtitle: string
  buttonText: string
  buttonLink: string
}

const makeHeroFields = (d: HeroDefaults): Field[] => [
  {
    name: 'titleWhite',
    type: 'text',
    label: 'Title (white part)',
    required: true,
    defaultValue: d.titleWhite,
  },
  {
    name: 'titleHighlight',
    type: 'text',
    label: 'Title (blue highlighted part)',
    required: true,
    defaultValue: d.titleHighlight,
  },
  { name: 'subtitle', type: 'text', label: 'Subtitle', defaultValue: d.subtitle },
  { name: 'buttonText', type: 'text', label: 'Button text', defaultValue: d.buttonText },
  { name: 'buttonLink', type: 'text', label: 'Button link', defaultValue: d.buttonLink },
  {
    name: 'backgroundImage',
    type: 'upload',
    relationTo: 'media',
    label: 'Background image (leave empty to use the default)',
  },
]

// Heading shown as: [before] [highlight in blue] [after]
const headingFields = (d: { before?: string; highlight: string; after?: string }): Field[] => [
  { name: 'headingBefore', type: 'text', label: 'Heading (start)', defaultValue: d.before },
  {
    name: 'headingHighlight',
    type: 'text',
    label: 'Heading (blue part)',
    defaultValue: d.highlight,
  },
  { name: 'headingAfter', type: 'text', label: 'Heading (end)', defaultValue: d.after },
]

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Attack Mode',
          fields: [
            seoField('attackMeta', 'SEO (Attack mode)'),
            {
              name: 'attackHero',
              type: 'group',
              label: 'Hero (Attack mode)',
              fields: makeHeroFields({
                titleWhite: 'Dominate The',
                titleHighlight: 'Blue Ocean',
                subtitle: 'Get ready to hunt down your competitors',
                buttonText: 'CHECK YOUR ELIGIBILITY',
                buttonLink: CALENDLY,
              }),
            },
            // Attack sections will be added here once I see them
          ],
        },
        {
          // STEALTH MODE — fields are in the same top-to-bottom order as the website:
          // 1 Hero → 2 Contact Form → 3 Logos → 4 Formula → 5 Why → 6 Ready (name form)
          // → 7 Perfect Delegation Partner → 8 Transparent Financials → 9 Testimonials
          label: 'Stealth Mode',
          fields: [
            seoField('stealthMeta', 'SEO (Stealth mode)'),

            // 1. HERO
            {
              name: 'stealthHero',
              type: 'group',
              label: '1. Hero (Stealth mode)',
              fields: makeHeroFields({
                titleWhite: 'Stalk In',
                titleHighlight: 'Stealth',
                subtitle: 'Pull yourself together before the hunt!',
                buttonText: 'CHECK YOUR ELIGIBILITY',
                buttonLink: CALENDLY,
              }),
            },

            // 2. CONTACT FORM
            {
              name: 'stealthPartnerForm',
              type: 'group',
              label: '2. Contact Form Section',
              fields: [
                ...headingFields({ before: 'Before You Hunt, Get In', highlight: 'Stealth Mode' }),
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Paragraph',
                  defaultValue:
                    'Successful companies never hunt blind— they organize, strategize, and delegate with precision. Our Executive Assistants streamline your operations behind-the-scenes, prepping you for the perfect strike.',
                },
                {
                  name: 'serviceOptions',
                  type: 'array',
                  label: 'Service dropdown options',
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  name: 'revenueOptions',
                  type: 'array',
                  label: 'Monthly revenue dropdown options',
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  name: 'submitText',
                  type: 'text',
                  label: 'Submit button text',
                  defaultValue: 'Submit',
                },
              ],
            },

            // 3. CLIENT LOGOS STRIP
            {
              name: 'stealthLogos',
              type: 'group',
              label: '3. Client Logos Strip',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Heading',
                  defaultValue: 'Those Who Hunted With Us',
                },
                {
                  name: 'logos',
                  type: 'array',
                  label: 'Logos',
                  fields: [
                    { name: 'name', type: 'text', label: 'Company name' },
                    { name: 'image', type: 'upload', relationTo: 'media', label: 'Logo' },
                  ],
                },
              ],
            },

            // 4. STEALTH FORMULA
            {
              name: 'stealthFormula',
              type: 'group',
              label: '4. Stealth Formula (3 cards)',
              fields: [
                ...headingFields({
                  before: 'The',
                  highlight: 'Stealth Formula',
                  after: 'Of Ours, Is Based On',
                }),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Cards',
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media', label: 'Image' },
                    { name: 'title', type: 'text', label: 'Title' },
                    { name: 'description', type: 'textarea', label: 'Description' },
                  ],
                },
              ],
            },

            // 5. WHY DO YOU NEED STEALTH MODE
            {
              name: 'stealthWhy',
              type: 'group',
              label: '5. Why Do You Need Stealth Mode',
              fields: [
                ...headingFields({
                  before: 'Why Do You Need',
                  highlight: 'Stealth Mode',
                  after: '?',
                }),
                {
                  name: 'intro',
                  type: 'text',
                  label: 'Intro line',
                  defaultValue: "Because it couldn't have been said better:",
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Quote (blue)',
                  defaultValue:
                    "“If you're not delegating, you're drowning. Real executives focus on the catch—not on chasing their tails.”",
                },
                {
                  name: 'afterQuote',
                  type: 'text',
                  label: 'Line after quote',
                  defaultValue:
                    'Businesses trying to manage everything alone experience predictable chaos:',
                },
                {
                  name: 'leftTitle',
                  type: 'text',
                  label: 'Left box title',
                  defaultValue: 'Doing It In-House',
                },
                {
                  name: 'leftItems',
                  type: 'array',
                  label: 'Left box points',
                  fields: [{ name: 'text', type: 'text', required: true }],
                  defaultValue: [
                    { text: 'Missed Reminders & Deadlines' },
                    { text: 'Overlapping Schedules & Conflicts' },
                    { text: 'Workflow Disruptions & Confusion' },
                    { text: 'Client Tantrums & Communication Breakdowns' },
                    { text: 'Stress-Induced Burnout & Mental Clutter' },
                  ],
                },
                {
                  name: 'rightTitle',
                  type: 'text',
                  label: 'Right box title',
                  defaultValue: 'With GrowthShark',
                },
                {
                  name: 'rightItems',
                  type: 'array',
                  label: 'Right box points',
                  fields: [{ name: 'text', type: 'text', required: true }],
                  defaultValue: [
                    { text: 'Timely Reminders And Delegated Alerts' },
                    { text: 'Optimized Scheduling & Clear Calendars' },
                    { text: 'Seamless Workflow & Structured Processes' },
                    { text: 'Proactive Client Management & Updates' },
                    { text: 'Focused Executives, Stress-Free Teams' },
                  ],
                },
              ],
            },

            // 6. READY FOR A DELEGATION PARTNER (name form with "Next" button)
            {
              name: 'stealthReady',
              type: 'group',
              label: '6. Ready For A Delegation Partner',
              fields: [
                ...headingFields({
                  before: 'Are You Ready For A',
                  highlight: 'Delegation',
                  after: 'Partner?',
                }),
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Quote (blue)',
                  defaultValue:
                    "“Delegation isn't just smart, it's vital. Top executives aren't buried in admin tasks—they're free to focus on growth.”",
                },
                {
                  name: 'text',
                  type: 'textarea',
                  label: 'Text after quote',
                  defaultValue:
                    "not everyone is at the right stage to go out on 'Hunt' while delegating their tasks. Find it out yourself whether you're in for a hunt or a hustle...",
                },
                {
                  name: 'formTitle',
                  type: 'text',
                  label: 'Form title',
                  defaultValue: 'What’s your Name?',
                },
                {
                  name: 'placeholder',
                  type: 'text',
                  label: 'Input placeholder',
                  defaultValue: 'Write your name here...',
                },
                { name: 'buttonText', type: 'text', label: 'Button text', defaultValue: 'Next' },
              ],
            },

            // 7. HOW CAN WE BE YOUR PERFECT DELEGATION PARTNER
            {
              name: 'perfectPartnerGrid',
              type: 'group',
              label: '7. How Can We Be Your Perfect Delegation Partner',
              fields: [
                ...headingFields({
                  before: 'How Can We Be Your Perfect',
                  highlight: 'Delegation Partner?',
                }),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Cards (Email Gatekeeping, Calendar, etc.)',
                  fields: [
                    { name: 'title', type: 'text', label: 'Card Title', required: true },
                    { name: 'description', type: 'textarea', label: 'Card Description' },
                    { name: 'icon', type: 'upload', relationTo: 'media', label: 'Card Icon' },
                  ],
                },
              ],
            },

            // 8. TRANSPARENT FINANCIALS
            {
              name: 'transparentFinancials',
              type: 'group',
              label: '8. Transparent Financials Section',
              fields: [
                ...headingFields({
                  before: '',
                  highlight: 'Transparent Financials',
                  after: '',
                }),
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description text',
                  defaultValue:
                    'We would love to sit on a call and discuss possibilities for your growth via our Attack Mode, but we will be upfront: our typical costs range between $500 to $1500...',
                },
              ],
            },

            // 9. TESTIMONIALS
            {
              name: 'stealthTestimonials',
              type: 'group',
              label: '9. Testimonials',
              fields: [
                {
                  name: 'items',
                  type: 'array',
                  label: 'Testimonials',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'role', type: 'text', label: 'Role / company' },
                    { name: 'photo', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateHome] },
}
