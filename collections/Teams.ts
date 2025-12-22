import { CollectionConfig } from 'payload'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'ageGroup'],
    group: 'Club',
  },
  access: {
    read: () => true, // Public can read teams
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Nom de l\'équipe (ex: U15, N1, etc.)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'U7', value: 'U7' },
        { label: 'U9', value: 'U9' },
        { label: 'U11', value: 'U11' },
        { label: 'U13', value: 'U13' },
        { label: 'U15', value: 'U15' },
        { label: 'U17', value: 'U17' },
        { label: 'N1 (National 1)', value: 'N1' },
        { label: 'N4 (National 4)', value: 'N4' },
      ],
      admin: {
        description: 'Catégorie de l\'équipe',
      },
    },
    {
      name: 'ageGroup',
      type: 'select',
      options: [
        { label: 'Jeunes', value: 'youth' },
        { label: 'Seniors', value: 'senior' },
      ],
      defaultValue: 'youth',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description de l\'équipe',
      },
    },
    {
      name: 'coach',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Entraîneur(s) de l\'équipe',
      },
    },
    {
      name: 'trainingSchedule',
      type: 'group',
      fields: [
        {
          name: 'day1',
          type: 'text',
          admin: {
            placeholder: 'ex: Mercredi 19h00-20h30',
          },
        },
        {
          name: 'day2',
          type: 'text',
          admin: {
            placeholder: 'ex: Samedi 15h30-17h00',
          },
        },
      ],
      admin: {
        description: 'Horaires d\'entraînement',
      },
    },
    {
      name: 'venue',
      type: 'text',
      defaultValue: 'Gymnase du Charrel, Aubagne',
      admin: {
        description: 'Lieu d\'entraînement',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Couleur de l\'équipe (hex code)',
        placeholder: '#8B5CF6',
      },
    },
  ],
}
