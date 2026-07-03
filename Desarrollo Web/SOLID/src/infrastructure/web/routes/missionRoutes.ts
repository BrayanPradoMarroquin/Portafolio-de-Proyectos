import { Router } from 'express';
import { MissionController } from '../controllers/MissionController';

const router = Router();
const missionController = new MissionController();

// GET /api/missions - Obtener todas las misiones
router.get('/', missionController.getAllMissions.bind(missionController));

// POST /api/missions - Crear nueva misión
router.post('/', missionController.createMission.bind(missionController));

// PUT /api/missions/:id - Actualizar misión completa
router.put('/:id', missionController.updateMission.bind(missionController));

// PATCH /api/missions/:id/status - Actualizar solo estado
router.patch('/:id/status', missionController.updateMissionStatus.bind(missionController));

// DELETE /api/missions/:id - Eliminar misión
router.delete('/:id', missionController.deleteMission.bind(missionController));

export default router;