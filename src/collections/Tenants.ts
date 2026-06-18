import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    // Early return: se não houver usuário logado, barra na hora
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'superadmin') return true
      
      // Filtro invisível: lojista comum só lê o próprio tenant
      return { id: { equals: user.tenant } }
    },
    // Regra de segurança: Apenas você (superadmin) gerencia as empresas cadastradas
    create: ({ req: { user } }) => user?.role === 'superadmin',
    update: ({ req: { user } }) => user?.role === 'superadmin',
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome da Loja/Cliente',
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Domínio (Ex: tochabags.vercel.app)',
    },
  ],
}