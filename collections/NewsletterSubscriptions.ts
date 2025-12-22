import { CollectionConfig } from 'payload'

export const NewsletterSubscriptions: CollectionConfig = {
  slug: 'newsletter-subscriptions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribed', 'createdAt'],
    group: 'Administration',
  },
  access: {
    read: ({ req: { user } }) => ['admin', 'secretary'].includes(user?.role),
    create: () => true, // Anyone can subscribe
    update: ({ req: { user } }) => ['admin', 'secretary'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin', 'secretary'].includes(user?.role),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Adresse email',
      },
    },
    {
      name: 'subscribed',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Abonné',
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        description: 'Date de désabonnement',
        condition: (data) => !data.subscribed,
      },
    },
  ],
  timestamps: true,
}
