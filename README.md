# *A*linéa

> Là où la pensée devient paragraphe.

Un éditeur pour ceux qui écrivent pour de vrai. Beau comme un livre,
intelligent comme un co-auteur, rapide comme une conversation.
Ambition frontale : remplacer Google Docs, Notion et le chat AI pour
l'écriture des knowledge workers.

## État actuel — Maquette v0.1

Cette itération est **visuelle uniquement**. On fige le langage
design (palette ambrée, typographie Spectral / Crimson, feuille
inférieure contextuelle) avant de coder le vrai éditeur.

**Contenu de la page** :
- Hero + positionnement
- Showcase deux téléphones (mode lecture · feuille typographique)
- Mockup desktop avec Edit / Preview toggle + ⌘K palette
- Tableau comparatif vs Docs · Notion · Claude
- Trois piliers manifeste
- Strip écosystème (Gmail · Drive · Calendar · Docs · Notion · exports)

## Stack

- **Next.js 15** (App Router, React 19)
- **Tailwind CSS 4** (config CSS-first, `@theme`)
- **TypeScript 5**
- **Google Fonts** : Spectral, Crimson Text, Inter

## Décisions produit figées

| Sujet | Décision |
|---|---|
| Cible V1 | Knowledge workers qui écrivent (concurrent frontal de Docs) |
| Modèle IA | Google Gemini Flash — même OAuth que Google Workspace |
| Export | Fichier (PDF, .docx, MD, HTML) + push (Google Docs, Notion) |
| Publication publique | Post-PMF |
| Collaboration temps réel | Post-PMF |
| Voice memory profonde | V2 |

## Roadmap prochaines itérations

1. **v0.2** — polish visuel de la maquette (animations, micro-interactions)
2. **v0.3** — éditeur Tiptap réel (blocs Notion-style, commande "/", drag)
3. **v0.4** — Gemini câblé (streaming inline, ⌘K, menu de sélection)
4. **v0.5** — auth Google + intégration Drive (open/save `.docx` et `.gdoc`)
5. **v0.6** — Gmail + Calendar
6. **v0.7** — export PDF / .docx (2 templates chacun) + push Notion
7. **v1** — lancement fermé

## Développement local

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # production build
```

## Déploiement

Ce repo est prêt pour **Vercel** (aucune configuration nécessaire —
Next.js est auto-détecté).

Pour brancher Vercel :
1. Vercel dashboard → *New Project* → importer `maiezmehdi/quickedit`
2. Sélectionner la branche `claude/stoic-knuth-n905bn` comme production
3. Deploy — la maquette sera en ligne en ~40 secondes
