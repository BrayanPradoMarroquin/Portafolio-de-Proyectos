import { IMissionRepository } from '../../core/domain/repositories/IMissionRepository';
import { Mission } from '../../core/domain/entities/Mission';
import { MissionStatus } from '../../core/domain/value-objects/MissionStatus';
export declare class InMemoryMissionRepository implements IMissionRepository {
    private missions;
    private nextId;
    constructor();
    private initializeSampleData;
    getNextId(): Promise<number>;
    findAll(): Promise<Mission[]>;
    findById(id: number): Promise<Mission | null>;
    save(mission: Mission): Promise<Mission>;
    update(mission: Mission): Promise<Mission>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, status: MissionStatus): Promise<Mission>;
    findByStatus(status: MissionStatus): Promise<Mission[]>;
    findByPriority(priority: number): Promise<Mission[]>;
    clear(): Promise<void>;
    count(): Promise<number>;
}
//# sourceMappingURL=InMemoryMissionRepository.d.ts.map