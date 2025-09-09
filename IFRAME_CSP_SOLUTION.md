# Solution pour les problèmes d'iframe et CSP

## Problèmes identifiés

1. **CSP `frame-ancestors` ignoré** : La directive `frame-ancestors` ne fonctionne pas avec les balises `<meta>` - elle doit être définie dans les en-têtes HTTP du serveur.

2. **localStorage en mode privé** : Les navigateurs en mode privé bloquent ou limitent l'accès au localStorage, causant des dysfonctionnements.

## Solutions implémentées

### 1. Gestion du localStorage en mode privé

**Fichier : `src/utils/storage.js`**
- Détection automatique de la disponibilité du localStorage
- Fallback vers un stockage en mémoire (Map) si localStorage n'est pas disponible
- Gestion transparente des erreurs

**Utilisation :**
```javascript
import storageManager from './utils/storage';

// Au lieu de localStorage.setItem()
storageManager.setItem('key', 'value');

// Au lieu de localStorage.getItem()
const value = storageManager.getItem('key');
```

### 2. Priorité des paramètres d'authentification

**Fichier : `src/utils/authParams.js`**
- Priorité : Paramètres URL > localStorage > stockage mémoire
- Détection automatique du contexte iframe
- Gestion des cas d'erreur avec messages informatifs

**Stratégie d'authentification :**
1. Vérification des paramètres URL (`?userId=...&organizationId=...`)
2. Si présents, stockage dans le système de stockage disponible
3. Sinon, récupération depuis le stockage existant
4. Affichage d'alertes informatives en cas de problème

### 3. Configuration CSP pour les iframes

**Fichier : `src/setupProxy.js`** (serveur de développement)
```javascript
res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:* https://localhost:* https://*.yourdomain.com;");
```

**Fichier : `public/_headers`** (déploiement Netlify)
```
/*
  Content-Security-Policy: frame-ancestors 'self' http://localhost:* https://localhost:* https://*.yourdomain.com;
```

### 4. Amélioration de l'expérience utilisateur

**Fichier : `src/App.js`**
- Messages d'erreur informatifs
- Détection du mode iframe
- Alertes pour le mode de navigation privé
- Instructions claires pour la configuration

## Configuration serveur requise

### Pour le développement local
1. Installer `http-proxy-middleware` si pas déjà fait :
   ```bash
   npm install --save-dev http-proxy-middleware
   ```

2. Le fichier `src/setupProxy.js` sera automatiquement utilisé par React

### Pour la production
Configurer les en-têtes HTTP sur votre serveur :

**Apache (.htaccess) :**
```apache
Header always set Content-Security-Policy "frame-ancestors 'self' https://*.yourdomain.com;"
Header always set X-Frame-Options "SAMEORIGIN"
```

**Nginx :**
```nginx
add_header Content-Security-Policy "frame-ancestors 'self' https://*.yourdomain.com;";
add_header X-Frame-Options "SAMEORIGIN";
```

**Express.js :**
```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://*.yourdomain.com;");
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});
```

## Test de la solution

### 1. Test en mode normal
```bash
npm start
```
Ouvrir `http://localhost:3000/iframe-example.html`

### 2. Test en mode privé
- Ouvrir le navigateur en mode privé/incognito
- Tester l'application - elle devrait fonctionner avec un stockage en mémoire

### 3. Test avec paramètres URL
```
http://localhost:3000/newlay/?userId=676301e1818b3e9f34f20fc2&organizationId=5a4db4c32d7f2fc398abd870
```

## Dépannage

### Erreur "Refused to display in a frame"
- Vérifier que les en-têtes CSP sont correctement configurés
- S'assurer que le domaine parent est autorisé dans `frame-ancestors`

### Données perdues en mode privé
- Normal : le stockage en mémoire est temporaire
- Solution : utiliser les paramètres URL pour l'authentification

### Problèmes d'authentification
- Vérifier que les paramètres `userId` et `organizationId` sont passés dans l'URL
- Consulter la console pour les messages de débogage

## Avantages de cette solution

1. **Compatibilité maximale** : Fonctionne en mode normal et privé
2. **Flexibilité** : Support des paramètres URL et du localStorage
3. **Sécurité** : Configuration CSP appropriée
4. **Débogage** : Messages informatifs et logs détaillés
5. **Maintenance** : Code modulaire et réutilisable
