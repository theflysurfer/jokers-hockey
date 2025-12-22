import { CollectionConfig } from 'payload'

export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'team'],
    group: 'Club',
  },
  access: {
    read: () => true, // Public can read staff
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Nom complet',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Entraîneur', value: 'coach' },
        { label: 'Entraîneur adjoint', value: 'assistant_coach' },
        { label: 'Président', value: 'president' },
        { label: 'Secrétaire', value: 'secretary' },
        { label: 'Trésorier', value: 'treasurer' },
        { label: 'Responsable matériel', value: 'equipment_manager' },
        { label: 'Bénévole', value: 'volunteer' },
      ],
      admin: {
        description: 'Fonction au sein du club',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      admin: {
        description: 'Équipe gérée (si applicable)',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Photo de profil',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Biographie',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Email de contact',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Téléphone',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Ordre d\'affichage',
      },
    },
  ],
  timestamps: true,
}
