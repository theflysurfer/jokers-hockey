import { CollectionConfig } from 'payload'

export const MatchEvents: CollectionConfig = {
  slug: 'match-events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'match', 'eventType', 'minute', 'createdAt'],
    group: 'Matches',
    description: 'Événements en direct pour les matchs (buts, pénalités, commentaires)',
  },
  access: {
    read: () => true, // Public can read match events
    create: ({ req: { user } }) => ['admin', 'coach'].includes(user?.role),
    update: ({ req: { user } }) => ['admin', 'coach'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin'].includes(user?.role),
  },
  fields: [
    {
      name: 'match',
      type: 'relationship',
      relationTo: 'matches',
      required: true,
      admin: {
        description: 'Match auquel cet événement appartient',
      },
      index: true,
    },
    {
      name: 'minute',
      type: 'number',
      required: true,
      min: 0,
      max: 999,
      admin: {
        description: 'Minute du match (0-60 pour match régulier, >60 pour prolongations)',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'But', value: 'goal' },
        { label: 'Passe décisive', value: 'assist' },
        { label: 'Pénalité', value: 'penalty' },
        { label: 'Arrêt du gardien', value: 'save' },
        { label: 'Tir cadré', value: 'shot_on_goal' },
        { label: 'Tir non cadré', value: 'shot_off_goal' },
        { label: 'Remplacement', value: 'substitution' },
        { label: 'Début de période', value: 'period_start' },
        { label: 'Fin de période', value: 'period_end' },
        { label: 'Temps mort', value: 'timeout' },
        { label: 'Commentaire', value: 'commentary' },
      ],
      admin: {
        description: 'Type d\'événement',
      },
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Titre de l\'événement (ex: "But de Lucas Dubois!")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description détaillée de l\'événement',
      },
    },
    {
      name: 'player',
      type: 'relationship',
      relationTo: 'players',
      admin: {
        description: 'Joueur impliqué dans l\'événement (si applicable)',
      },
    },
    {
      name: 'team',
      type: 'select',
      options: [
        { label: 'Jokers', value: 'home' },
        { label: 'Adversaire', value: 'away' },
      ],
      admin: {
        description: 'Équipe concernée par l\'événement',
      },
    },
    {
      name: 'isHighlight',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Marquer comme moment fort du match',
      },
    },
    {
      name: 'scoreAfter',
      type: 'group',
      fields: [
        {
          name: 'home',
          type: 'number',
          min: 0,
          admin: {
            description: 'Score des Jokers après cet événement',
          },
        },
        {
          name: 'away',
          type: 'number',
          min: 0,
          admin: {
            description: 'Score de l\'adversaire après cet événement',
          },
        },
      ],
      admin: {
        description: 'Score après cet événement (optionnel, utile pour les buts)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-set timestamp if not provided
        if (operation === 'create' && !data.createdAt) {
          data.createdAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  timestamps: true,
  defaultSort: '-minute', // Most recent events first by default
}
