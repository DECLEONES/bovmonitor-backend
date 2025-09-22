// src/routes/routes.js
const express = require('express');

// Importação de todos os Controllers
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');
const AnimalController = require('../controllers/AnimalController');
const WeightController = require('../controllers/WeightController');
const DashboardController = require('../controllers/DashboardController');
const EventController = require('../controllers/EventController'); // 1. IMPORTE

// Importação do Middleware
const authMiddleware = require('../middlewares/auth.js');

const routes = express.Router();

// --- Rotas Públicas ---
routes.post('/users', UserController.create);
routes.post('/sessions', SessionController.create);

// --- Middleware de Autenticação ---
routes.use(authMiddleware);

// --- Rotas Protegidas ---

// Rota do Dashboard
routes.get('/dashboard', DashboardController.index);

// Rotas de Animais
routes.get('/animals', AnimalController.index);
routes.post('/animals', AnimalController.create);
routes.put('/animals/:id', AnimalController.update);
routes.delete('/animals/:id', AnimalController.delete);

// Rotas de Pesos
routes.get('/animals/:animal_id/weights', WeightController.index);
routes.post('/animals/:animal_id/weights', WeightController.create);

// Rotas de Eventos
routes.get('/events', EventController.index);     // 2. ADICIONE
routes.post('/events', EventController.create);    // 3. ADICIONE

module.exports = routes;
