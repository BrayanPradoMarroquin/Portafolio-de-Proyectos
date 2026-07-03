"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionController = void 0;
const InMemoryMissionRepository_1 = require("../../persistence/InMemoryMissionRepository");
const Mission_1 = require("../../../core/domain/entities/Mission");
const MissionStatus_1 = require("../../../core/domain/value-objects/MissionStatus");
class MissionController {
    constructor() {
        this.missionRepository = new InMemoryMissionRepository_1.InMemoryMissionRepository();
    }
    async getAllMissions(req, res) {
        try {
            const missions = await this.missionRepository.findAll();
            res.json({
                success: true,
                count: missions.length,
                data: missions.map(mission => mission.toJSON())
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async createMission(req, res) {
        try {
            const { titulo, area_solicitante, prioridad, costo_estimado } = req.body;
            // Validar campos requeridos
            const errors = [];
            if (!titulo || titulo.trim().length === 0) {
                errors.push('El título es requerido');
            }
            if (!area_solicitante || area_solicitante.trim().length === 0) {
                errors.push('El área solicitante es requerida');
            }
            if (!prioridad || isNaN(prioridad)) {
                errors.push('La prioridad es requerida y debe ser un número');
            }
            else if (prioridad < 1 || prioridad > 5) {
                errors.push('La prioridad debe estar entre 1 y 5');
            }
            if (!costo_estimado || isNaN(costo_estimado)) {
                errors.push('El costo estimado es requerido y debe ser un número');
            }
            else if (parseFloat(costo_estimado) < 0) {
                errors.push('El costo estimado no puede ser negativo');
            }
            if (errors.length > 0) {
                res.status(400).json({
                    success: false,
                    errors
                });
                return;
            }
            // Obtener el siguiente ID disponible
            const nextId = await this.missionRepository.getNextId();
            const mission = new Mission_1.Mission(nextId, titulo.trim(), area_solicitante.trim(), parseInt(prioridad), parseFloat(costo_estimado));
            const savedMission = await this.missionRepository.save(mission);
            res.status(201).json({
                success: true,
                message: 'Misión creada exitosamente',
                data: savedMission.toJSON()
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateMission(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido. Debe ser un número positivo'
                });
                return;
            }
            const { titulo, area_solicitante, prioridad, costo_estimado, estado } = req.body;
            // Verificar que la misión existe
            const existingMission = await this.missionRepository.findById(id);
            if (!existingMission) {
                res.status(404).json({
                    success: false,
                    error: `Misión con ID ${id} no encontrada`
                });
                return;
            }
            // Validaciones
            const errors = [];
            if (!titulo || titulo.trim().length === 0) {
                errors.push('El título es requerido');
            }
            if (!area_solicitante || area_solicitante.trim().length === 0) {
                errors.push('El área solicitante es requerida');
            }
            if (!prioridad || isNaN(prioridad)) {
                errors.push('La prioridad es requerida y debe ser un número');
            }
            else if (prioridad < 1 || prioridad > 5) {
                errors.push('La prioridad debe estar entre 1 y 5');
            }
            if (!costo_estimado || isNaN(costo_estimado)) {
                errors.push('El costo estimado es requerido y debe ser un número');
            }
            else if (parseFloat(costo_estimado) < 0) {
                errors.push('El costo estimado no puede ser negativo');
            }
            if (!estado) {
                errors.push('El estado es requerido');
            }
            else if (!MissionStatus_1.MissionStatus.isValidStatus(estado)) {
                errors.push('Estado inválido. Valores permitidos: registrada, en_proceso, finalizada');
            }
            if (errors.length > 0) {
                res.status(400).json({
                    success: false,
                    errors
                });
                return;
            }
            // Actualizar misión
            existingMission.update(titulo.trim(), area_solicitante.trim(), parseInt(prioridad), parseFloat(costo_estimado), MissionStatus_1.MissionStatus.fromString(estado));
            const updatedMission = await this.missionRepository.update(existingMission);
            res.json({
                success: true,
                message: 'Misión actualizada exitosamente',
                data: updatedMission.toJSON()
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateMissionStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido. Debe ser un número positivo'
                });
                return;
            }
            const { estado } = req.body;
            // Validar que la misión existe
            const existingMission = await this.missionRepository.findById(id);
            if (!existingMission) {
                res.status(404).json({
                    success: false,
                    error: `Misión con ID ${id} no encontrada`
                });
                return;
            }
            // Validar estado
            if (!estado) {
                res.status(400).json({
                    success: false,
                    error: 'El campo estado es requerido'
                });
                return;
            }
            if (!MissionStatus_1.MissionStatus.isValidStatus(estado)) {
                res.status(400).json({
                    success: false,
                    error: 'Estado inválido. Valores permitidos: registrada, en_proceso, finalizada'
                });
                return;
            }
            const updatedMission = await this.missionRepository.updateStatus(id, MissionStatus_1.MissionStatus.fromString(estado));
            res.json({
                success: true,
                message: 'Estado de misión actualizado exitosamente',
                data: updatedMission.toJSON()
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async deleteMission(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id) || id <= 0) {
                res.status(400).json({
                    success: false,
                    error: 'ID inválido. Debe ser un número positivo'
                });
                return;
            }
            // Verificar que existe
            const existingMission = await this.missionRepository.findById(id);
            if (!existingMission) {
                res.status(404).json({
                    success: false,
                    error: `Misión con ID ${id} no encontrada`
                });
                return;
            }
            await this.missionRepository.delete(id);
            res.status(200).json({
                success: true,
                message: 'Misión eliminada exitosamente',
                data: { id }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.MissionController = MissionController;
//# sourceMappingURL=MissionController.js.map