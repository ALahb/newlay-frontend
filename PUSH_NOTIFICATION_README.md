# Push Notification Integration

## Vue d'ensemble

Ce document décrit l'intégration automatique des notifications push dans toutes les API de requêtes de la clinique. Les notifications sont maintenant envoyées automatiquement aux organisations concernées lors de chaque action importante.

## Fonctionnalités

### Notifications Automatiques

Les notifications push sont automatiquement envoyées pour les actions suivantes :

1. **Création de requête** (`createClinicRequest`)
   - Notifie la clinique réceptrice qu'une nouvelle requête a été créée
   - Inclut le nom du patient dans la notification

2. **Mise à jour de statut** (`updateClinicRequestStatus`)
   - Notifie la clinique réceptrice des changements de statut
   - Messages personnalisés selon le statut :
     - `pending`: "A new request is pending for your organization."
     - `rejected`: "A request has been rejected for your organization."
     - `waiting_for_payment`: "A request is waiting for payment for your organization."
     - `ready_for_examination`: "A request is ready for examination for your organization."
     - `waiting_for_result`: "A request is waiting for results for your organization."
     - `finished`: "A request has been completed for your organization."

3. **Upload de rapport** (`uploadClinicRequestReport`)
   - Notifie la clinique réceptrice qu'un rapport a été uploadé

4. **Création de détails de cas** (`createAwsCaseDetails`)
   - Notifie l'organisation de destination de la création des détails de cas
   - Inclut le numéro d'accession si disponible

5. **Suppression de requête** (`deleteClinicRequest`)
   - Notifie la clinique réceptrice qu'une requête a été supprimée

6. **Traitement de paiement** (`processPaymentForRequest`)
   - Notifie la clinique réceptrice qu'un paiement a été traité
   - Inclut le type de paiement dans la notification

## Structure des Données

### Payload de Notification

```javascript
{
  organization_id: "ID_DE_L_ORGANISATION",
  notification: "Message de notification",
  user_type: "doctor|technician|admin|unknown",
  request_id: "ID_DE_LA_REQUETE"
}
```

### Informations Utilisateur

Les informations utilisateur sont automatiquement extraites du contexte utilisateur :

```javascript
const userInfo = {
  type: "doctor|technician|admin",
  name: "Nom de l'utilisateur",
  // autres propriétés utilisateur
};
```

## API Modifiées

### Fonctions Principales

1. **`createClinicRequest(formData, userInfo)`**
   - Crée une requête et envoie une notification à la clinique réceptrice

2. **`updateClinicRequestStatus(id, status, userInfo)`**
   - Met à jour le statut et envoie une notification avec un message personnalisé

3. **`uploadClinicRequestReport(id, url_file, userInfo)`**
   - Upload un rapport et notifie la clinique réceptrice

4. **`createAwsCaseDetails(params, userInfo)`**
   - Crée les détails de cas et notifie l'organisation de destination

5. **`deleteClinicRequest(id, userInfo)`**
   - Supprime une requête et notifie la clinique réceptrice

6. **`processPaymentForRequest(id, paymentData, userInfo)`**
   - Traite un paiement et notifie la clinique réceptrice

### Fonction Helper

```javascript
const sendNotificationToOrganization = async (organizationId, message, userInfo, requestId) => {
  // Envoie une notification push à une organisation spécifique
  // Gère automatiquement les erreurs sans interrompre le flux principal
};
```

## Gestion des Erreurs

- Les erreurs de notification push sont capturées et loggées
- Les erreurs de notification n'interrompent pas les opérations principales
- Les notifications échouées n'affectent pas le succès des opérations API

## Utilisation

### Dans les Composants

Les composants n'ont plus besoin d'appeler manuellement les notifications push. Elles sont automatiquement gérées par les fonctions API :

```javascript
// Avant (ancien code)
const response = await createRequest(formData);
await sendPushNotificationToOrg(clinicReceiver, 'New request created', response.id);

// Maintenant (nouveau code)
const response = await createRequest(formData);
// La notification est automatiquement envoyée par l'API
```

### Test des Notifications

Utilisez le composant `PushNotificationTest` pour tester les notifications :

```javascript
import PushNotificationTest from './components/PushNotificationTest';

// Dans votre composant
<PushNotificationTest />
```

## Configuration

### Variables d'Environnement

Assurez-vous que les variables suivantes sont configurées :

```javascript
// Dans localStorage ou variables d'environnement
localStorage.setItem('userId', 'USER_ID');
localStorage.setItem('orgId', 'ORGANIZATION_ID');
```

### Endpoints API

Les notifications utilisent l'endpoint :
```
POST /api/aws/push-notification
```

## Monitoring

### Logs

Les notifications sont loggées dans la console :
- Succès : Les notifications sont envoyées silencieusement
- Erreurs : Les erreurs sont loggées avec `console.error`

### Test de Fonctionnement

Pour vérifier que les notifications fonctionnent :

1. Ouvrez les outils de développement du navigateur
2. Allez dans l'onglet Network
3. Effectuez une action (créer, modifier, supprimer une requête)
4. Vérifiez qu'une requête POST vers `/aws/push-notification` est envoyée

## Sécurité

- Les notifications incluent le type d'utilisateur pour l'audit
- Les erreurs de notification ne révèlent pas d'informations sensibles
- Les notifications sont envoyées de manière asynchrone pour éviter les blocages

## Maintenance

### Ajout de Nouvelles Notifications

Pour ajouter des notifications à de nouvelles actions :

1. Modifiez la fonction API correspondante dans `src/api.js`
2. Ajoutez l'appel à `sendNotificationToOrganization`
3. Testez avec le composant `PushNotificationTest`

### Personnalisation des Messages

Les messages peuvent être personnalisés en modifiant les objets de messages dans les fonctions API :

```javascript
const statusMessages = {
  'new_status': 'Message personnalisé pour ce statut'
};
```

## Support

Pour toute question ou problème avec les notifications push, consultez :
- Les logs de la console du navigateur
- Le composant `PushNotificationTest` pour les tests
- La documentation de l'API backend pour les endpoints
