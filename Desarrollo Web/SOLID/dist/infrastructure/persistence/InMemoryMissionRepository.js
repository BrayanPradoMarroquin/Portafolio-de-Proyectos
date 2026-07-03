"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMissionRepository = void 0;
const Mission_1 = require("../../core/domain/entities/Mission");
const MissionStatus_1 = require("../../core/domain/value-objects/MissionStatus");
class InMemoryMissionRepository {
    constructor() {
        this.missions = new Map();
        this.nextId = 1;
        this.initializeSampleData();
    }
    initializeSampleData() {
        // Datos de ejemplo con IDs numéricos
        const sampleMissions = [
            new Mission_1.Mission(1, 'Adquisición de nuevo servidor', 'Infraestructura TI', 3, 2500.00, MissionStatus_1.MissionStatus.REGISTERED),
            new Mission_1.Mission(2, 'Actualización de software de seguridad', 'Seguridad Informática', 4, 1800.50, MissionStatus_1.MissionStatus.IN_PROGRESS),
            new Mission_1.Mission(3, 'Capacitación en desarrollo ágil', 'Desarrollo de Software', 2, 3200.00, MissionStatus_1.MissionStatus.COMPLETED),
            new Mission_1.Mission(4, 'Migración a la nube', 'Infraestructura TI', 5, 5500.75, MissionStatus_1.MissionStatus.REGISTERED),
            new Mission_1.Mission(5, 'Implementación de CI/CD', 'DevOps', 3, 4200.00, MissionStatus_1.MissionStatus.IN_PROGRESS)
        ];
        sampleMissions.forEach(mission => {
            this.missions.set(mission.id, mission);
        });
        // Actualizar nextId
        this.nextId = sampleMissions.length + 1;
    }
    async getNextId() {
        return this.nextId;
    }
    async findAll() {
        return Array.from(this.missions.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findById(id) {
        return this.missions.get(id) || null;
    }
    async save(mission) {
        // Si la misión no tiene ID válido, asignamos uno
        if (mission.id <= 0) {
            const missionWithId = new Mission_1.Mission(this.nextId, mission.titulo, mission.area_solicitante, mission.prioridad, mission.costo_estimado, mission.estado);
            this.missions.set(this.nextId, missionWithId);
            this.nextId++;
            return missionWithId;
        }
        // Si el ID ya existe, actualizamos
        if (this.missions.has(mission.id)) {
            this.missions.set(mission.id, mission);
            return mission;
        }
        // Si es un nuevo ID, verificamos y actualizamos nextId si es necesario
        this.missions.set(mission.id, mission);
        if (mission.id >= this.nextId) {
            this.nextId = mission.id + 1;
        }
        return mission;
    }
    async update(mission) {
        if (!this.missions.has(mission.id)) {
            throw new Error('Misión no encontrada');
        }
        this.missions.set(mission.id, mission);
        return mission;
    }
    async delete(id) {
        if (!this.missions.has(id)) {
            throw new Error('Misión no encontrada');
        }
        this.missions.delete(id);
    }
    async updateStatus(id, status) {
        const mission = await this.findById(id);
        if (!mission) {
            throw new Error('Misión no encontrada');
        }
        mission.updateStatus(status);
        this.missions.set(id, mission);
        return mission;
    }
    async findByStatus(status) {
        const allMissions = await this.findAll();
        return allMissions.filter(mission => mission.estado === status);
    }
    async findByPriority(priority) {
        const allMissions = await this.findAll();
        return allMissions.filter(mission => mission.prioridad === priority);
    }
    // Método adicional para resetear datos
    async clear() {
        this.missions.clear();
        this.nextId = 1;
        this.initializeSampleData();
    }
    // Método adicional para contar misiones
    async count() {
        return this.missions.size;
    }
}
exports.InMemoryMissionRepository = InMemoryMissionRepository;
//# sourceMappingURL=InMemoryMissionRepository.js.map