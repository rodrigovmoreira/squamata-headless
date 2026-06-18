import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'superadmin') return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'superadmin') return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => user?.role === 'superadmin',
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin (Você)', value: 'superadmin' },
        { label: 'Lojista (Cliente)', value: 'tenant' },
      ],
      defaultValue: 'tenant',
      required: true,
      // NOVA REGRA: Apenas Super Admins podem alterar o valor deste campo
      access: {
        update: ({ req: { user } }) => user?.role === 'superadmin',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: 'Empresa vinculada',
      required: false,
      admin: {
        condition: (data) => data?.role === 'tenant', 
      },
      // NOVA REGRA: Impede que um lojista mude a própria empresa
      access: {
        update: ({ req: { user } }) => user?.role === 'superadmin',
      },
    },
  ],
}