const express = require('express');

// Importação de todos os Controllers
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');
const DashboardController = require('../controllers/DashboardController');
const AnimalController = require('../controllers/AnimalController');
const WeightController = require('../controllers/WeightController');
const EventController = require('../controllers/EventController');
const VaccineController = require('../controllers/VaccineController');

// Middlewares
const authMiddleware = require('../middlewares/auth.js');
const permit = require('../middlewares/authRole.js');

const routes = express.Router();

// --- Rotas Públicas ---
routes.post('/users', UserController.create);
routes.post('/sessions', SessionController.create);

// --- Middleware de Autenticação (todas as rotas abaixo exigem login) ---
routes.use(authMiddleware);

// --- Rotas Protegidas ---
routes.get('/dashboard', DashboardController.show);
routes.put('/users/:id', UserController.update);
routes.get('/animals', AnimalController.index);
routes.post('/animals', permit(['ADMIN', 'FUNCIONARIO']), AnimalController.create);
routes.put('/animals/:id', permit(['ADMIN', 'FUNCIONARIO']), AnimalController.update);
routes.delete('/animals/:id', permit(['ADMIN']), AnimalController.delete);

routes.get('/animals/:animal_id/weights', WeightController.index);
routes.post('/animals/:animal_id/weights', permit(['ADMIN', 'FUNCIONARIO']), WeightController.create);

// --- Rotas de Vacinas ---
routes.get('/animals/:animal_id/vaccines', VaccineController.index);
routes.post('/animals/:animal_id/vaccines', permit(['ADMIN', 'FUNCIONARIO']), VaccineController.create);

routes.get('/events', EventController.index);
// ...

routes.get('/events', EventController.index);
routes.post('/events', permit(['ADMIN', 'FUNCIONARIO']), EventController.create);

module.exports = routes;