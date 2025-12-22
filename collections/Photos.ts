import { CollectionConfig } from 'payload'

export const Photos: CollectionConfig = {
  slug: 'photos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'approvalStatus', 'uploadedBy'],
    group: 'Médias',
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins and director see everything
      if (['admin', 'director'].includes(user?.role)) return true

      // Public only sees approved photos
      if (!user) {
        return {
          approvalStatus: {
            equals: 'approved',
          },
        }
      }

      // Logged-in users see approved + their own pending/rejected
      return {
        or: [
          {
            approvalStatus: {
              equals: 'approved',
            },
          },
          {
            uploadedBy: {
              equals: user.id,
            },
          },
        ],
      }
    },
    create: ({ req: { user } }) => ['parent', 'coach', 'admin', 'photographer', 'director'].includes(user?.role),
    update: ({ req: { user } }) => {
      // Admins and director can update everything
      if (['admin', 'director'].includes(user?.role)) return true

      // Users can update their own pending photos
      return {
        and: [
          {
            uploadedBy: {
              equals: user?.id,
            },
          },
          {
            approvalStatus: {
              equals: 'pending',
            },
          },
        ],
      }
    },
    delete: ({ req: { user } }) => {
      // Admins can delete everything
      if (user?.role === 'admin') return true

      // Users can delete their own pending photos
      return {
        and: [
          {
            uploadedBy: {
              equals: user?.id,
            },
          },
          {
            approvalStatus: {
              equals: 'pending',
            },
          },
        ],
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Titre de la photo',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description de la photo',
      },
    },
    {
      name: 'imageUrl',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Match', value: 'match' },
        { label: 'Entraînement', value: 'training' },
        { label: 'Événement', value: 'event' },
        { label: 'Équipe', value: 'team' },
      ],
      admin: {
        description: 'Catégorie de la photo',
      },
    },
    {
      name: 'match',
      type: 'relationship',
      relationTo: 'matches',
      admin: {
        description: 'Match associé',
        condition: (data) => data.category === 'match',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Ajouté par',
      },
      hooks: {
        beforeChange: [
          ({ req }) => req.user?.id,
        ],
      },
    },
    {
      name: 'approvalStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Approuvée', value: 'approved' },
        { label: 'Rejetée', value: 'rejected' },
      ],
      access: {
        update: ({ req: { user } }) => ['admin', 'director'].includes(user?.role),
      },
      admin: {
        description: 'Statut d\'approbation (seuls les admins/directeurs peuvent modifier)',
        position: 'sidebar',
      },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      admin: {
        description: 'Raison du rejet',
        condition: (data) => data.approvalStatus === 'rejected',
      },
      access: {
        update: ({ req: { user } }) => ['admin', 'director'].includes(user?.role),
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Auto-approve photos from official photographer
        if (req.user?.role === 'photographer') {
          data.approvalStatus = 'approved'
        } else if (!data.approvalStatus) {
          data.approvalStatus = 'pending'
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // TODO: Send notification to admin when photo is uploaded
        // TODO: Send notification to uploader when photo is approved/rejected
      },
    ],
  },
}
