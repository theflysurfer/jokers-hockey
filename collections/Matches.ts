import { CollectionConfig } from 'payload'

export const Matches: CollectionConfig = {
  slug: 'matches',
  admin: {
    useAsTitle: 'opponent',
    defaultColumns: ['date', 'opponent', 'category', 'location', 'status'],
    group: 'Matchs',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { status: { equals: 'completed' } } // Public only sees completed matches
      if (['admin', 'director', 'secretary'].includes(user.role)) return true
      if (user.role === 'coach') {
        return { category: { equals: user.team } }
      }
      if (user.role === 'parent') {
        // Parents see matches of their children's teams
        return true // TODO: filter by children's teams
      }
      return { status: { equals: 'completed' } }
    },
    create: ({ req: { user } }) => ['admin', 'coach', 'director'].includes(user?.role),
    update: ({ req: { user } }) => {
      if (['admin', 'director'].includes(user?.role)) return true
      if (user?.role === 'coach') {
        return { category: { equals: user.team } }
      }
      if (user?.role === 'parent') {
        // Parents can update playerAvailability (hook validates they only declare their own children)
        return true
      }
      return false
    },
    delete: ({ req: { user } }) => ['admin', 'director'].includes(user?.role),
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Date et heure du match',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'opponent',
      type: 'text',
      required: true,
      admin: {
        description: 'Équipe adversaire',
        placeholder: 'ex: Marseille',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      admin: {
        description: 'Catégorie/Équipe qui joue',
      },
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      options: [
        { label: 'Domicile', value: 'home' },
        { label: 'Extérieur', value: 'away' },
      ],
      defaultValue: 'home',
    },
    {
      name: 'venue',
      type: 'text',
      admin: {
        description: 'Nom de la salle',
        placeholder: 'ex: Gymnase du Charrel',
      },
    },
    {
      name: 'stadium',
      type: 'relationship',
      relationTo: 'stadiums',
      admin: {
        description: 'Stade externe (avec itinéraire)',
        condition: (data) => data.location === 'away',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      options: [
        { label: 'À venir', value: 'upcoming' },
        { label: 'En direct', value: 'live' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Annulé', value: 'cancelled' },
      ],
    },
    {
      name: 'scoreJokers',
      type: 'number',
      min: 0,
      admin: {
        description: 'Score des Jokers',
        condition: (data) => ['completed', 'live'].includes(data.status),
      },
    },
    {
      name: 'scoreOpponent',
      type: 'number',
      min: 0,
      admin: {
        description: 'Score de l\'adversaire',
        condition: (data) => ['completed', 'live'].includes(data.status),
      },
    },
    {
      name: 'isLive',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Match actuellement en direct',
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Résumé du match',
        condition: (data) => data.status === 'completed',
      },
    },
    {
      name: 'playerAvailability',
      type: 'array',
      admin: {
        description: 'Disponibilité des joueurs pour ce match',
      },
      fields: [
        {
          name: 'player',
          type: 'relationship',
          relationTo: 'players',
          required: true,
          admin: {
            description: 'Joueur',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'maybe',
          options: [
            { label: 'Présent', value: 'available' },
            { label: 'Absent', value: 'unavailable' },
            { label: 'Peut-être', value: 'maybe' },
          ],
          admin: {
            description: 'Statut de disponibilité',
          },
        },
        {
          name: 'declaredBy',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          admin: {
            description: 'Déclaré par (parent/coach)',
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ req }) => req.user?.id,
            ],
          },
        },
        {
          name: 'declaredAt',
          type: 'date',
          admin: {
            description: 'Date de déclaration',
            readOnly: true,
            date: {
              displayFormat: 'd MMM yyyy à HH:mm',
            },
          },
          hooks: {
            beforeChange: [
              () => new Date().toISOString(),
            ],
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Notes (ex: blessure, retard prévu)',
          },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Validate that parents only declare availability for their own children
        if (operation === 'update' && req.user?.role === 'parent' && data.playerAvailability) {
          for (const availability of data.playerAvailability) {
            if (availability.player) {
              try {
                const player = await req.payload.findByID({
                  collection: 'players',
                  id: typeof availability.player === 'string' ? availability.player : availability.player.id,
                })

                const isParentOfPlayer = player.parents.some(
                  (p: any) => (typeof p.parent === 'string' ? p.parent : p.parent.id) === req.user.id
                )

                if (!isParentOfPlayer) {
                  throw new Error('Vous ne pouvez déclarer la présence que pour vos propres enfants')
                }
              } catch (error) {
                throw new Error('Erreur lors de la vérification des permissions : ' + error.message)
              }
            }
          }
        }
        return data
      },
    ],
  },
}
