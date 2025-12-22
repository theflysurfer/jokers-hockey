import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false, // Disable email verification for now
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
    group: 'Administration',
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can see all users
      if (user?.role === 'admin') return true

      // Users can only see themselves
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }

      return false
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => {
      // Admins can update anyone
      if (user?.role === 'admin') return true

      // Users can update themselves (but not their role)
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }

      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'parent',
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Directeur du Club', value: 'director' },
        { label: 'Secrétaire', value: 'secretary' },
        { label: 'Trésorier', value: 'treasurer' },
        { label: 'Entraîneur', value: 'coach' },
        { label: 'Parent', value: 'parent' },
        { label: 'Photographe', value: 'photographer' },
      ],
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        description: 'Rôle de l\'utilisateur dans le système',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: 'Prénom',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: 'Nom de famille',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Numéro de téléphone (pour SMS et WhatsApp)',
        placeholder: '06 12 34 56 78',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      admin: {
        description: 'Équipe gérée par cet entraîneur',
        condition: (data) => data.role === 'coach',
      },
    },
    {
      name: 'notificationPreferences',
      type: 'group',
      fields: [
        {
          name: 'sms',
          type: 'checkbox',
          defaultValue: true,
          label: 'Recevoir des SMS',
        },
        {
          name: 'push',
          type: 'checkbox',
          defaultValue: true,
          label: 'Recevoir des notifications push',
        },
        {
          name: 'email',
          type: 'checkbox',
          defaultValue: true,
          label: 'Recevoir des emails',
        },
      ],
      admin: {
        description: 'Préférences de notification',
      },
    },
  ],
  timestamps: true,
}
