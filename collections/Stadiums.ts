import { CollectionConfig } from 'payload'

export const Stadiums: CollectionConfig = {
  slug: 'stadiums',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'address'],
    group: 'Club',
  },
  access: {
    read: () => true, // Public can read stadiums
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
        description: 'Nom du stade/gymnase',
      },
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      admin: {
        description: 'Adresse complète',
      },
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      admin: {
        description: 'Ville',
      },
    },
    {
      name: 'postalCode',
      type: 'text',
      admin: {
        description: 'Code postal',
      },
    },
    {
      name: 'googleMapsUrl',
      type: 'text',
      admin: {
        description: 'Lien Google Maps pour l\'itinéraire',
        placeholder: 'https://goo.gl/maps/...',
      },
    },
    {
      name: 'parkingInfo',
      type: 'textarea',
      admin: {
        description: 'Informations sur le parking, accès PMR, etc.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Photo du stade',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Notes supplémentaires (vestiaires, buvette, etc.)',
      },
    },
  ],
  timestamps: true,
}
