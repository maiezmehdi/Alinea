# *A*linéa

> Là où la pensée devient paragraphe.

Un éditeur pour ceux qui écrivent pour de vrai. Beau comme un livre,
intelligent comme un co-auteur, rapide comme une conversation. Cible :
knowledge workers qui écrivent tout, tout le temps.

## État — V0.4a (auth + éditeur réel)

Pour la première fois, Alinéa se teste vraiment :

- **/login** et **/signup** — Continuer avec Google, ou entrer en invité
- **/app** — route protégée avec un éditeur Tiptap fonctionnel
  - Frappe libre, gras, italique, barré, code, titres H1/H2/H3, listes,
    citations, blocs de code, surligneur
  - Menu inline sur sélection (Format + IA — IA branchée en V0.5)
  - ⌘K palette avec insertion de blocs et exports (Markdown, HTML,
    clipboard)
  - Toggle Edit / Preview, sélecteur de police (Spectral / Crimson /
    Inter), sauvegarde localStorage automatique

Landing page (marketing) inchangée par rapport à V0.3 côté structure —
la voix éditoriale a été généralisée (plus de mentions directes de
concurrents dans les titres et les messages).

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS 4** (config CSS-first, `@theme`)
- **NextAuth v5** (Auth.js) — Google OAuth + credentials guest
- **Tiptap 3** — éditeur riche fondé sur ProseMirror
- **Motion 12** — spring physics, shared-element transitions
- Fonts : Spectral, Crimson Text, Inter (Google Fonts)

## Développement local

```bash
npm install
cp .env.example .env.local     # remplir AUTH_SECRET a minima
npm run dev                    # http://localhost:3000
```

`AUTH_SECRET` peut être généré avec :

```bash
openssl rand -base64 32
```

Sans `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, le bouton Google
n'ouvrira rien — utilise le formulaire **Entrer sans compte** pour tester
l'éditeur.

## Configurer Google OAuth (5 min)

1. https://console.cloud.google.com/apis/credentials
2. **Create OAuth Client ID** → Application type : *Web application*
3. Authorized redirect URIs :
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<votre-domaine-vercel>/api/auth/callback/google`
4. Copier Client ID + Secret dans `.env.local` puis relancer `npm run dev`
5. Sur Vercel : les mêmes trois variables dans *Settings → Environment
   Variables*, redéployer

## Décisions produit figées

| Sujet | Décision |
|---|---|
| Modèle IA (V0.5) | Google Gemini Flash — même OAuth Google que Workspace |
| Persistence V0.4a | localStorage (canvas unique par utilisateur) |
| Persistence V0.5 | DB serveur (Turso ou Postgres via Neon) |
| Auth V0.4a | Google OAuth + invité |
| Auth V0.5 | + magic link email |
| Export | PDF, .docx, Markdown, HTML, push Docs/Notion |

## Prochaines itérations

- **V0.5** — Gemini branché (streaming ⌘K + sélection), vraie DB, magic link
- **V0.6** — Import universel (docx, gdoc, md, pdf, .eml, Notion)
- **V0.7** — Google Workspace live (Gmail, Drive, Calendar)
- **V0.8** — Export PDF templaté, push Notion, lien de partage public
- **V1** — Lancement fermé

## Déploiement Vercel

Le repo est prêt Next.js — auto-détecté. Ajouter les variables
d'environnement ci-dessus dans *Settings → Environment Variables* puis
déployer.

Si le nom du repo change et que Vercel semble ne plus rebuilder :
*Settings → Git → Disconnect / Reconnect Repository*.
