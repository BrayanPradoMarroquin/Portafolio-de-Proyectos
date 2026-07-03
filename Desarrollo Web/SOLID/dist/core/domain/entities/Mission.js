"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mission = void 0;
const MissionStatus_1 = require("../value-objects/MissionStatus");
class Mission {
    constructor(id, titulo, area_solicitante, prioridad, costo_estimado, estado = MissionStatus_1.MissionStatus.REGISTERED) {
        this.id = id;
        this.titulo = titulo;
        this.area_solicitante = area_solicitante;
        this.prioridad = prioridad;
        this.costo_estimado = costo_estimado;
        this.estado = estado;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.validate();
    }
    validate() {
        if (!this.titulo || this.titulo.trim().length === 0) {
            throw new Error('El título es requerido');
        }
        if (this.prioridad < 1 || this.prioridad > 5) {
            throw new Error('La prioridad debe estar entre 1 y 5');
        }
        if (this.costo_estimado < 0) {
            throw new Error('El costo estimado no puede ser negativo');
        }
    }
    updateTitle(titulo) {
        this.titulo = titulo;
        this.updatedAt = new Date();
    }
    updateStatus(estado) {
        this.estado = estado;
        this.updatedAt = new Date();
    }
    update(titulo, area_solicitante, priority, estimatedCost, status) {
        this.titulo = titulo;
        this.area_solicitante = area_solicitante;
        this.prioridad = priority;
        this.costo_estimado = estimatedCost;
        this.estado = status;
        this.updatedAt = new Date();
        this.validate();
    }
    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            area_solicitante: this.area_solicitante,
            prioridad: this.prioridad,
            costo_estimado: this.costo_estimado,
            estado: this.estado.toString(),
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
}
exports.Mission = Mission;
//# sourceMappingURL=Mission.js.map