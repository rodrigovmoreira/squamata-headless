import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // Isso diz ao Payload que esta coleção lida com arquivos
  access: {
    // Regra de Ouro: Lojista só vê as próprias fotos. Você vê todas.
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'superadmin') return true
      return { tenant: { equals: user.tenant } }
    },
    update: ({ req: { user } }) => user?.role === 'superadmin',
    delete: ({ req: { user } }) => user?.role === 'superadmin',
    // Permite que o lojista faça upload de novas imagens
    create: ({ req: { user } }) => !!user, 
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo (Para Acessibilidade e SEO)',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      // Esconde esse campo no painel do lojista (já preenchemos no hook abaixo)
      admin: {
        condition: (data, siblingData, { user }) => user?.role === 'superadmin',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        // O PULO DO GATO: Se for um lojista fazendo upload, 
        // vinculamos a imagem à empresa dele automaticamente!
        if (operation === 'create' && req.user && req.user.role === 'tenant') {
          data.tenant = req.user.tenant
        }
        return data
      },
    ],
  },
}