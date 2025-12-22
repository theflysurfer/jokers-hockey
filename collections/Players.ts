import { CollectionConfig } from 'payload'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'team', 'jerseyNumber', 'position'],
    group: 'Club',
  },
  access: {
    // Parents see only their kids, coaches see their team, admins/director/secretary see all
    read: ({ req: { user } }) => {
      if (!user) return false
      if (['admin', 'director', 'secretary'].includes(user.role)) return true

      if (user.role === 'coach') {
        return {
          team: {
            equals: user.team,
          },
        }
      }

      if (user.role === 'parent') {
        return {
          'parents.parent': {
            equals: user.id,
          },
        }
      }

      return false
    },
    create: ({ req: { user } }) => ['admin', 'coach'].includes(user?.role),
    update: ({ req: { user } }) => {
      if (['admin', 'director', 'secretary'].includes(user?.role)) return true

      if (user?.role === 'coach') {
        return {
          team: {
            equals: user.team,
          },
        }
      }

      // Parents can update basic info of their kids
      if (user?.role === 'parent') {
        return {
          'parents.parent': {
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
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data.firstName && data.lastName) {
              return `${data.firstName} ${data.lastName}`
            }
          },
        ],
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Photo du joueur - Avatar IA ou photo réelle',
        components: {
          Field: '@/components#PhotoReplacementField',
        },
      },
    },
    {
      name: 'birthDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date de naissance',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      admin: {
        description: 'Équipe',
      },
    },
    {
      name: 'jerseyNumber',
      type: 'number',
      admin: {
        description: 'Numéro de maillot',
      },
    },
    {
      name: 'position',
      type: 'select',
      options: [
        { label: 'Attaquant', value: 'forward' },
        { label: 'Défenseur', value: 'defense' },
        { label: 'Gardien', value: 'goalie' },
      ],
      admin: {
        description: 'Poste',
      },
    },
    {
      name: 'parents',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'parent',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          filterOptions: ({ data }) => {
            return {
              role: {
                equals: 'parent',
              },
            }
          },
          admin: {
            description: 'Compte parent',
          },
        },
        {
          name: 'relationship',
          type: 'select',
          options: [
            { label: 'Père', value: 'father' },
            { label: 'Mère', value: 'mother' },
            { label: 'Tuteur', value: 'guardian' },
          ],
          admin: {
            description: 'Lien de parenté',
          },
        },
      ],
      admin: {
        description: 'Parents/Tuteurs',
      },
    },
    {
      name: 'medicalNotes',
      type: 'textarea',
      access: {
        read: ({ req: { user } }) => ['admin', 'director'].includes(user?.role),
        update: ({ req: { user } }) => ['admin', 'director'].includes(user?.role),
      },
      admin: {
        description: 'Notes médicales (visible uniquement par les admins)',
      },
    },
    {
      name: 'emergencyContact',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'relationship',
          type: 'text',
        },
      ],
      admin: {
        description: 'Contact d\'urgence',
      },
    },
  ],
  timestamps: true,
}
