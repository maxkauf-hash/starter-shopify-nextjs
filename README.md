# 🛍️ Starter Kit Shopify Next.js

Un template moderne et performant pour créer des boutiques en ligne avec Shopify, Next.js 14, et les meilleures pratiques actuelles.

## ✨ Fonctionnalités

- 🛠️ Next.js 14 avec App Router
- 🎨 UI moderne avec Shadcn et Tailwind CSS
- 🔄 Gestion d'état avec React Query
- 📝 TypeScript pour la sécurité des types
- 🛒 Intégration Shopify complète avec GraphQL
- 📱 Design responsive et mobile-first
- 🎯 SEO optimisé
- 🔍 Recherche de produits performante
- 🏷️ Gestion des collections
- 🛒 Panier d'achat dynamique
- 💳 Processus de paiement sécurisé

## 🚀 Démarrage Rapide

```bash
# Cloner le repo
git clone https://github.com/votre-username/starter-shopify-nextjs.git

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

## 🔧 Configuration

1. Créez un compte Shopify et une app privée
2. Copiez vos credentials dans le fichier `.env.local`
3. Configurez vos variables d'environnement :

```env
SHOPIFY_STORE_DOMAIN=votre-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre_access_token
```

## 📁 Structure du Projet

Le projet suit une architecture feature-based avec une séparation claire des responsabilités :

- `app/` - Routes et pages (Next.js App Router)
- `src/components/` - Composants React réutilisables
- `src/hooks/` - Custom hooks
- `src/lib/` - Utilitaires et helpers
- `src/services/` - Services d'API et logique métier

## 🛠️ Technologies Utilisées

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- GraphQL
- React Hook Form
- React Table

## 📚 Documentation

Pour plus de détails sur l'utilisation et la personnalisation, consultez :

- [Documentation Complète](docs/README.md)
- [Guide de Contribution](CONTRIBUTING.md)
- [Guide de Style](STYLE_GUIDE.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [Guide de Contribution](CONTRIBUTING.md) pour commencer.

## 📝 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.
