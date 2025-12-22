import { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'youtubeId'],
    group: 'Médias',
  },
  access: {
    read: () => true, // Public can read videos
    create: ({ req: { user } }) => ['admin', 'coach'].includes(user?.role),
    update: ({ req: { user } }) => ['admin', 'coach'].includes(user?.role),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Titre de la vidéo',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description de la vidéo',
      },
    },
    {
      name: 'youtubeId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID YouTube (ex: dQw4w9WgXcQ)',
        placeholder: 'dQw4w9WgXcQ',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Highlights', value: 'highlights' },
        { label: 'Interviews', value: 'interviews' },
        { label: 'Entraînement', value: 'training' },
        { label: 'Événement', value: 'event' },
      ],
      admin: {
        description: 'Catégorie de la vidéo',
      },
    },
    {
      name: 'match',
      type: 'relationship',
      relationTo: 'matches',
      admin: {
        description: 'Match associé',
        condition: (data) => data.category === 'highlights',
      },
    },
  ],
  timestamps: true,
}
