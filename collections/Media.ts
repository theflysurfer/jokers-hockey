import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'dist/public/uploads',
    staticURL: '/uploads',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 200,
        position: 'centre',
      },
      {
        name: 'medium',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1200,
        height: 900,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  admin: {
    group: 'Médias',
  },
  access: {
    read: () => true, // Public can read media
    create: ({ req: { user } }) => !!user, // Any logged-in user can upload
    update: ({ req: { user } }) => {
      // Admins can update any media
      if (user?.role === 'admin') return true

      // Users can update their own uploads
      return {
        uploadedBy: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Admins can delete any media
      if (user?.role === 'admin') return true

      // Users can delete their own uploads
      return {
        uploadedBy: {
          equals: user?.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Texte alternatif pour l\'accessibilité',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req }) => req.user?.id,
        ],
      },
    },
  ],
  timestamps: true,
}
