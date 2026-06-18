import type { CollectionConfig } from 'payload'

export const Produtos: CollectionConfig = {
    slug: 'produtos',
    admin: {
        useAsTitle: 'nome',
    },
    access: {
        // Lojista lê apenas os produtos da própria loja. O Super Admin lê tudo.
        read: ({ req: { user } }) => {
            if (!user) return false
            if (user.role === 'superadmin') return true
            return { tenant: { equals: user.tenant } }
        },
        create: ({ req: { user } }) => !!user, // Qualquer utilizador logado pode criar
        update: ({ req: { user } }) => {
            if (!user) return false
            if (user.role === 'superadmin') return true
            return { tenant: { equals: user.tenant } }
        },
        delete: ({ req: { user } }) => {
            if (!user) return false
            if (user.role === 'superadmin') return true
            return { tenant: { equals: user.tenant } }
        },
    },
    fields: [
        {
            name: 'nome',
            type: 'text',
            required: true,
            label: 'Nome do Produto',
        },
        {
            name: 'descricao',
            type: 'textarea',
            label: 'Descrição Curta',
        },
        {
            name: 'preco',
            type: 'number',
            required: true,
            label: 'Preço (R$)',
        },
        {
            name: 'imagem',
            type: 'upload',
            relationTo: 'media', // Liga-se diretamente à nossa pasta do MinIO!
            required: true,
            label: 'Imagem Principal',
        },
        {
            name: 'urlMercadoLivre',
            type: 'text',
            label: 'Link do Mercado Livre (Opcional)',
            admin: {
                description: 'Se preenchido, o botão do site redirecionará o cliente para o Mercado Livre.',
            }
        },
        {
            name: 'tenant',
            type: 'relationship',
            relationTo: 'tenants',
            required: true,
            admin: {
                // Esconde este campo do lojista (o sistema vai preencher sozinho)
                condition: (data, siblingData, { user }) => user?.role === 'superadmin',
            },
        },
    ],

    hooks: {
        beforeChange: [
            ({ req, data, operation }) => {
                if (operation === 'create' && req.user && req.user.role === 'tenant') {
                    // Pega apenas o ID, independente se o Payload trouxe o objeto inteiro ou só a string
                    const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant?.id : req.user.tenant;
                    data.tenant = tenantId;
                }
                return data;
            },
        ],
    },
}