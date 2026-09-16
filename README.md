# PASTEF Section Pologne

## 1. Présentation

PASTEF Section Pologne est une application web destinée à recueillir et administrer les inscriptions des militantes, militants et sympathisants sénégalais établis en Pologne et dans les pays de juridiction suivants :

- Pologne
- République Tchèque
- Slovaquie
- Roumanie
- Ukraine
- Estonie
- Lettonie
- Lituanie

L’application possède deux espaces :

- un espace public pour présenter la section et recueillir les inscriptions ;
- un espace privé d’administration pour consulter, ajouter, modifier, supprimer et exporter les inscriptions.

## 2. Architecture générale

```text
Pastef/
├── backend/                 API Node.js / Express
├── frontend/                Interface React / Vite
├── .gitignore               Fichiers exclus de Git
└── README.md                Documentation générale du projet
```

Le frontend communique avec le backend au moyen d’une API HTTP JSON. Le backend utilise PostgreSQL, en local ou via Neon en production.

## 3. Frontend

Le frontend se trouve dans `frontend/`.

Technologies principales :

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Oxlint

### Fichiers importants

```text
frontend/
├── index.html                Titre et favicon des onglets
├── package.json              Dépendances et commandes frontend
├── vite.config.js            Configuration Vite et Tailwind
├── public/                   Fichiers publics statiques
└── src/
    ├── App.jsx               Routes publiques et admin
    ├── App.css               Styles hérités du template initial
    ├── index.css             Styles globaux et styles admin/public
    ├── main.jsx              Point d’entrée React
    ├── assets/               Logos, photos et images
    └── pages/
        ├── Register.jsx      Page publique et formulaire d’inscription
        └── admin/
            ├── Login.jsx             Connexion admin
            ├── AdminLayout.jsx       Menu et protection de l’espace admin
            ├── DashboardHome.jsx     Statistiques
            ├── Registrations.jsx     Liste et gestion des inscriptions
            ├── Exports.jsx           Export CSV
            ├── MyAccount.jsx         Modification du compte admin
            ├── ChangePassword.jsx    Changement obligatoire du mot de passe
            ├── ForgotPassword.jsx   Demande de réinitialisation
            └── ResetPassword.jsx    Réinitialisation via lien email
```

### Routes frontend

| URL | Fonction |
|---|---|
| `/` | Page publique d’inscription |
| `/admin/login` | Connexion admin |
| `/admin/forgot-password` | Mot de passe oublié |
| `/admin/reset-password` | Réinitialisation du mot de passe |
| `/admin/change-password` | Changement du mot de passe temporaire |
| `/admin/dashboard` | Tableau de bord |
| `/admin/dashboard/inscriptions` | Gestion des inscriptions |
| `/admin/dashboard/exports` | Export CSV |
| `/admin/dashboard/compte` | Gestion du compte admin |

Le titre de l’onglet est défini dynamiquement dans `src/App.jsx` :

- espace public : `PASTEF Section Pologne` ;
- espace admin : `PASTEF Section Pologne Admin`.

Le favicon est configuré dans `index.html` et utilise `src/assets/pastef-icon.png`.

## 4. Backend

Le backend se trouve dans `backend/`.

Technologies principales :

- Node.js
- Express
- PostgreSQL avec `pg`
- `bcrypt` pour les mots de passe
- JWT pour les sessions admin
- Resend pour les emails de récupération de mot de passe

### Fichiers importants

```text
backend/
├── server.js                    Démarrage de l’API Express
├── package.json                 Dépendances et commandes backend
├── .env                         Variables locales, ne jamais publier
├── config/
│   └── db.js                    Connexion PostgreSQL
├── controllers/
│   ├── auth.controller.js       Création des inscriptions publiques
│   └── admin.controller.js      Connexion et opérations admin
├── middleware/
│   └── auth.middleware.js       Vérification du token JWT
├── routes/
│   ├── auth.routes.js            Routes publiques
│   └── admin.routes.js           Routes protégées et compte admin
├── scripts/
│   ├── createAdmin.js            Création d’un compte admin
│   ├── makeEmailOptional.js      Migration email facultatif
│   └── testEmail.js              Test d’envoi email
└── utils/
    └── email.js                 Envoi des emails avec Resend
```

### Routes API publiques

```text
POST /api/inscription
```

Cette route valide et enregistre une inscription. Les champs obligatoires sont : nom, prénom(s), pays, ville, téléphone, statut et consentement. L’email est facultatif.

### Routes API admin

```text
POST   /api/admin/login
POST   /api/admin/admins
GET    /api/admin/admins
DELETE /api/admin/admins/:id
POST   /api/admin/forgot-password
POST   /api/admin/reset-password
GET    /api/admin/inscriptions
POST   /api/admin/inscriptions
PUT    /api/admin/inscriptions/:id
DELETE /api/admin/inscriptions/:id
GET    /api/admin/stats
PUT    /api/admin/password
PUT    /api/admin/account
```

Toutes les routes admin de gestion, sauf la connexion et la récupération du mot de passe, nécessitent :

```text
Authorization: Bearer <token JWT>
```

`POST /api/admin/admins` permet à un administrateur déjà connecté de créer un autre compte admin depuis la page « Mon compte ». Le mot de passe est haché côté backend avec bcrypt, et le nouvel admin doit le changer à sa première connexion. La chaîne de connexion Neon n’est jamais envoyée au frontend.

L’authentification 2FA a été retirée. La connexion admin se fait directement avec email et mot de passe, puis le backend délivre un token JWT valable 24 heures.

## 5. Variables d’environnement

### Backend : `backend/.env`

```env
PORT=5001
DATABASE_URL=postgresql://...
JWT_SECRET=une_valeur_secrete_longue
RESEND_API_KEY=re_...
FRONTEND_URL=https://adresse-du-frontend.com
```

`DATABASE_URL` doit pointer vers PostgreSQL local en développement et vers Neon en production.

### Frontend : `frontend/.env`

```env
VITE_API_URL=http://localhost:5001
```

En production, remplacer cette valeur par l’URL publique du backend :

```env
VITE_API_URL=https://adresse-du-backend.com
```

Les variables `VITE_*` sont intégrées au moment du build. Après modification, il faut reconstruire et redéployer le frontend.

Ne jamais committer les fichiers `.env`, les mots de passe, les clés Resend, les secrets JWT ou l’URL Neon complète.

## 6. Installation locale

### Prérequis

- Node.js installé
- npm installé
- PostgreSQL local ou une base Neon
- une base de données configurée

### Installer les dépendances

Terminal 1 :

```bash
cd backend
npm install
```

Terminal 2 :

```bash
cd frontend
npm install
```

### Démarrer le backend

```bash
cd backend
npm run dev
```

API locale :

```text
http://localhost:5001
```

### Démarrer le frontend

Dans un autre terminal :

```bash
cd frontend
npm run dev
```

Vite affiche l’adresse locale, généralement :

```text
http://localhost:5173
```

## 7. Gestion de la base de données

La base contient au minimum les tables suivantes :

- `admins` : comptes administrateurs, mots de passe hachés et tokens de récupération ;
- `inscriptions` : données des personnes inscrites.

L’email des inscriptions est facultatif. Si une ancienne base contient une contrainte `NOT NULL`, exécuter la migration avec la bonne base ciblée :

```bash
cd backend
DATABASE_URL="URL_NEON_OU_POSTGRESQL" node scripts/makeEmailOptional.js
```

Les informations de carte d’adhérent sont également facultatives. Pour ajouter les colonnes nécessaires dans une base existante, exécuter :

```bash
cd backend
DATABASE_URL="URL_NEON_OU_POSTGRESQL" node scripts/addCardFields.js
```

La fonctionnalité ajoute `a_carte`, `type_carte` (`virtuelle` ou `physique`) et `numero_carte`. Le numéro n’est jamais obligatoire. Après sélection du type de carte, il est visible dans les enregistrements admin s’il a été renseigné.

Pour créer un compte admin :

```bash
cd backend
node scripts/createAdmin.js admin@example.com "MotDePasseTemporaireFort"
```

Pour Neon, fournir sa `DATABASE_URL` avant la commande ou placer la valeur dans l’environnement du terminal. Le mot de passe temporaire doit ensuite être changé depuis l’espace admin si `must_change_password` est activé.

## 8. Déploiement

### Frontend

Le frontend peut être déployé sur Netlify ou une plateforme équivalente.

- dossier de projet : `frontend`
- commande de build : `npm run build`
- dossier de publication : `dist`
- variable obligatoire : `VITE_API_URL`

Après chaque modification de `VITE_API_URL`, effectuer un nouveau build et un nouveau déploiement.

### Backend

Le backend peut être déployé sur Render, Railway, Fly.io ou une autre plateforme Node.js.

- dossier de projet : `backend`
- commande d’installation : `npm install`
- commande de démarrage : `npm start`
- variables obligatoires : `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `FRONTEND_URL`

Le backend doit être accessible publiquement en HTTPS et le frontend doit utiliser son URL publique.

## 9. Vérifications utiles

Build frontend :

```bash
cd frontend
npm run build
```

Lint frontend :

```bash
cd frontend
npm run lint
```

Vérification syntaxique backend :

```bash
cd backend
node --check server.js
node --check controllers/auth.controller.js
node --check controllers/admin.controller.js
```

Test de connexion API :

```bash
curl http://localhost:5001/
```

Réponse attendue : un message indiquant que l’API PASTEF Pologne est en ligne.

## 10. Parcours fonctionnel

### Inscription publique

1. L’utilisateur ouvre `/`.
2. Il remplit le formulaire.
3. Le frontend envoie `POST /api/inscription`.
4. Le backend valide les données.
5. L’inscription est enregistrée dans PostgreSQL.
6. Le frontend affiche la confirmation ou l’erreur.

### Connexion admin

1. L’administrateur ouvre `/admin/login`.
2. Il saisit son email et son mot de passe.
3. Le backend vérifie le compte et le hash bcrypt.
4. Le backend renvoie un JWT.
5. Le frontend stocke le token dans `localStorage`.
6. L’administrateur accède au tableau de bord.

### Gestion admin

Depuis le tableau de bord, l’administrateur peut :

- consulter les statistiques ;
- rechercher et filtrer les inscriptions ;
- ajouter manuellement une personne ;
- modifier une inscription ;
- supprimer une inscription ;
- exporter les données en CSV ;
- modifier son email ou son mot de passe ;
- créer un autre compte administrateur depuis « Mon compte » ;
- consulter et supprimer les autres comptes administrateurs depuis « Mon compte » ;
- réinitialiser son mot de passe par email.

## 11. Règles de maintenance

- Ne pas supprimer les fichiers `.env` locaux sans vérifier les variables nécessaires.
- Ne jamais mettre de secret dans React ou dans le dépôt Git.
- Après une modification frontend, lancer `npm run build`.
- Après une modification backend, vérifier la syntaxe puis tester l’API.
- Toute modification de schéma PostgreSQL doit être exécutée sur la bonne base, locale ou Neon.
- Lors d’un changement de variable `VITE_API_URL`, redéployer le frontend.
- Garder les noms de pays et les statuts cohérents entre frontend, backend et base de données.
- Vérifier le responsive sur smartphone, tablette et desktop avant publication.

## 12. Dépannage rapide

### Le frontend affiche une erreur réseau

Vérifier :

- `VITE_API_URL` ;
- que le backend est démarré ;
- que l’URL du backend est accessible en HTTPS en production ;
- que le frontend a été rebuild après modification de la variable.

### La connexion admin échoue

Vérifier :

- l’email utilisé ;
- le mot de passe ;
- `DATABASE_URL` ;
- `JWT_SECRET` ;
- les logs du backend ;
- que l’admin existe dans la base Neon utilisée par le backend en production.

### Une inscription sans email échoue

Vérifier que la colonne `inscriptions.email` accepte `NULL`, puis exécuter :

```bash
cd backend
DATABASE_URL="URL_DE_LA_BASE_CONCERNEE" node scripts/makeEmailOptional.js
```

### Les anciens styles ou le favicon apparaissent encore

Faire un nouveau déploiement, puis recharger sans cache :

- macOS : `Cmd + Shift + R`
- Windows/Linux : `Ctrl + Shift + R`

## 13. Important pour la sécurité

Les secrets de base de données, clés Resend, mots de passe admin et secrets JWT ne doivent jamais être partagés publiquement. S’ils ont été exposés dans un terminal, un dépôt ou une conversation, ils doivent être régénérés immédiatement.
