import { MissionStatus } from '../value-objects/MissionStatus';

export class Mission {
  public readonly id: number;
  public titulo: string;
  public area_solicitante: string;
  public prioridad: number;
  public costo_estimado: number;
  public estado: MissionStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    titulo: string,
    area_solicitante: string,
    prioridad: number,
    costo_estimado: number,
    estado: MissionStatus = MissionStatus.REGISTERED
  ) {
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

  private validate(): void {
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

  public updateTitle(titulo: string): void {
    this.titulo = titulo;
    this.updatedAt = new Date();
  }

  public updateStatus(estado: MissionStatus): void {
    this.estado = estado;
    this.updatedAt = new Date();
  }

  public update(
    titulo: string,
    area_solicitante: string,
    priority: number,
    estimatedCost: number,
    status: MissionStatus
  ): void {
    this.titulo = titulo;
    this.area_solicitante = area_solicitante;
    this.prioridad = priority;
    this.costo_estimado = estimatedCost;
    this.estado = status;
    this.updatedAt = new Date();
    
    this.validate();
  }

  public toJSON(): any {
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