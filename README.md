# Site Dr Hédi Belhoula — avec administration intégrée

Ce dossier contient ton site (identique visuellement à l'original) + un panneau
d'administration (`/admin`) qui te permet d'ajouter, modifier ou supprimer :
- les articles du blog
- les applications présentées
- les textes de la page d'accueil (titre, piliers, newsletter...)

**Aucune ligne de code à toucher au quotidien.** Tout se fait depuis un formulaire
web, en te connectant sur `tonsite.com/admin`.

Coût : **0€/mois** (hébergement gratuit sur Netlify).

---

## Mise en ligne — à faire une seule fois (~15 minutes)

### 1. Créer un compte GitHub (si tu n'en as pas)
Sur https://github.com — gratuit.

### 2. Créer un dépôt et y déposer ces fichiers
- Crée un nouveau dépôt (bouton "New repository"), nomme-le par exemple `site-dr-belhoula`.
- Mets-le en **Private** si tu ne veux pas que le code soit visible publiquement
  (le contenu du site sera quand même visible une fois en ligne, seul le code
  source ne le sera pas).
- Dépose tous les fichiers de ce dossier dedans (glisser-déposer sur GitHub,
  ou via `git push` si tu es à l'aise avec Git).

### 3. Connecter le dépôt à Netlify
- Va sur https://app.netlify.com et crée un compte (tu peux te connecter
  directement avec ton compte GitHub).
- Clique sur "Add new site" → "Import an existing project" → choisis GitHub
  → sélectionne ton dépôt `site-dr-belhoula`.
- Laisse les réglages par défaut (aucune commande de build n'est nécessaire,
  le fichier `netlify.toml` s'en occupe) → clique "Deploy site".
- Après 1-2 minutes, ton site est en ligne sur une adresse type
  `nom-au-hasard.netlify.app`. Tu pourras la remplacer plus tard par ton
  propre nom de domaine (`drbelhoula.com` par ex.) dans "Domain settings".

### 4. Activer l'authentification (Netlify Identity)
C'est ce qui te permettra de te connecter à `/admin` en toute sécurité.
- Dans le tableau de bord Netlify de ton site → onglet **Identity** → clique
  "Enable Identity".
- Toujours dans Identity → "Registration" → mets-le sur **Invite only**
  (pour que seul toi puisses créer un compte admin).
- Dans Identity → "Services" → **Git Gateway** → clique "Enable Git Gateway".
  C'est cette brique qui permet au panneau d'admin d'écrire directement dans
  ton dépôt GitHub sans que tu aies besoin de toucher à Git.

### 5. T'inviter toi-même comme administrateur
- Toujours dans l'onglet Identity → bouton "Invite users" → entre ton email.
- Tu recevras un email d'invitation → clique le lien → choisis un mot de
  passe.

### 6. Te connecter au panneau d'administration
- Va sur `https://tonsite.netlify.app/admin/`
- Connecte-toi avec l'email/mot de passe choisis à l'étape 5.
- Tu arrives sur l'interface d'édition : trois sections — **Réglages du
  site**, **Articles**, **Applications**.

Chaque modification que tu publies depuis `/admin` déclenche automatiquement
une republication du site (environ 30 à 60 secondes).

---

## Utilisation au quotidien

- **Ajouter un article** : Articles → "Liste des articles" → "Add" en bas de
  la liste → remplis le formulaire (titre, catégorie, contenu) → "Publish".
- **Modifier/supprimer un article** : clique dessus dans la liste, modifie ou
  clique l'icône de suppression.
- **Ajouter une image** : dans le contenu markdown d'un article, utilise le
  bouton image de l'éditeur — elle sera stockée dans le dossier `uploads/`.
- **Encadrés spéciaux** dans un article : tape sur une ligne
  `:::callout Point clé` puis ton texte puis `:::` sur la ligne suivante pour
  un encadré mis en avant (couleur corail). Remplace `callout` par
  `disclaimer` pour un encadré d'avertissement grisé.
- **Modifier le texte d'accueil** (titre, piliers, newsletter) : section
  "Réglages du site" → "Page d'accueil".
- **Ajouter/modifier une application** : section "Applications", même
  principe que les articles.

---

## Structure du projet

```
index.html            page d'accueil (contenu chargé dynamiquement)
article.html           gabarit d'article (?slug=... dans l'URL)
applications.html      page des applications (contenu chargé dynamiquement)
content/
  site.json             textes de la page d'accueil, piliers, newsletter
  articles.json          liste des articles
  apps.json               liste des applications
admin/
  index.html              interface d'administration (Decap CMS)
  config.yml               définit les formulaires d'édition
uploads/                 images ajoutées depuis l'admin
netlify.toml             configuration d'hébergement (aucun build requis)
```

## Limites à connaître

- Le formulaire newsletter est visuel uniquement pour l'instant : les emails
  saisis ne sont envoyés nulle part. Si tu veux vraiment collecter des
  inscriptions, il faut brancher un service gratuit comme Brevo ou
  Mailchimp — je peux t'aider à le faire quand tu veux.
- Un seul administrateur à la fois est prévu par défaut ; tu peux inviter
  d'autres personnes depuis Identity si besoin (ex. un confrère, une
  secrétaire).
