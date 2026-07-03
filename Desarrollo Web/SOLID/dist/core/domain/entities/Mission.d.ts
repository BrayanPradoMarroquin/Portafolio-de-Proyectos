import { MissionStatus } from '../value-objects/MissionStatus';
export declare class Mission {
    readonly id: number;
    titulo: string;
    area_solicitante: string;
    prioridad: number;
    costo_estimado: number;
    estado: MissionStatus;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(id: number, titulo: string, area_solicitante: string, prioridad: number, costo_estimado: number, estado?: MissionStatus);
    private validate;
    updateTitle(titulo: string): void;
    updateStatus(estado: MissionStatus): void;
    update(titulo: string, area_solicitante: string, priority: number, estimatedCost: number, status: MissionStatus): void;
    toJSON(): any;
}
//# sourceMappingURL=Mission.d.ts.map