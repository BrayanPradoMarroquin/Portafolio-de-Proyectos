import { IMissionRepository } from '../../core/domain/repositories/IMissionRepository';
import { Mission } from '../../core/domain/entities/Mission';
import { MissionStatus } from '../../core/domain/value-objects/MissionStatus';

export class InMemoryMissionRepository implements IMissionRepository {
  private missions: Map<number, Mission> = new Map();
  private nextId: number = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Datos de ejemplo con IDs numéricos
    const sampleMissions = [
      new Mission(
        1,
        'Adquisición de nuevo servidor',
        'Infraestructura TI',
        3,
        2500.00,
        MissionStatus.REGISTERED
      ),
      new Mission(
        2,
        'Actualización de software de seguridad',
        'Seguridad Informática',
        4,
        1800.50,
        MissionStatus.IN_PROGRESS
      ),
      new Mission(
        3,
        'Capacitación en desarrollo ágil',
        'Desarrollo de Software',
        2,
        3200.00,
        MissionStatus.COMPLETED
      ),
      new Mission(
        4,
        'Migración a la nube',
        'Infraestructura TI',
        5,
        5500.75,
        MissionStatus.REGISTERED
      ),
      new Mission(
        5,
        'Implementación de CI/CD',
        'DevOps',
        3,
        4200.00,
        MissionStatus.IN_PROGRESS
      )
    ];

    sampleMissions.forEach(mission => {
      this.missions.set(mission.id, mission);
    });
    
    // Actualizar nextId
    this.nextId = sampleMissions.length + 1;
  }

  async getNextId(): Promise<number> {
    return this.nextId;
  }

  async findAll(): Promise<Mission[]> {
    return Array.from(this.missions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: number): Promise<Mission | null> {
    return this.missions.get(id) || null;
  }

  async save(mission: Mission): Promise<Mission> {
    // Si la misión no tiene ID válido, asignamos uno
    if (mission.id <= 0) {
      const missionWithId = new Mission(
        this.nextId,
        mission.titulo,
        mission.area_solicitante,
        mission.prioridad,
        mission.costo_estimado,
        mission.estado
      );
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

  async update(mission: Mission): Promise<Mission> {
    if (!this.missions.has(mission.id)) {
      throw new Error('Misión no encontrada');
    }
    
    this.missions.set(mission.id, mission);
    return mission;
  }

  async delete(id: number): Promise<void> {
    if (!this.missions.has(id)) {
      throw new Error('Misión no encontrada');
    }
    
    this.missions.delete(id);
  }

  async updateStatus(id: number, status: MissionStatus): Promise<Mission> {
    const mission = await this.findById(id);
    
    if (!mission) {
      throw new Error('Misión no encontrada');
    }
    
    mission.updateStatus(status);
    this.missions.set(id, mission);
    
    return mission;
  }

  async findByStatus(status: MissionStatus): Promise<Mission[]> {
    const allMissions = await this.findAll();
    return allMissions.filter(mission => mission.estado === status);
  }

  async findByPriority(priority: number): Promise<Mission[]> {
    const allMissions = await this.findAll();
    return allMissions.filter(mission => mission.prioridad === priority);
  }

  // Método adicional para resetear datos
  async clear(): Promise<void> {
    this.missions.clear();
    this.nextId = 1;
    this.initializeSampleData();
  }

  // Método adicional para contar misiones
  async count(): Promise<number> {
    return this.missions.size;
  }
}