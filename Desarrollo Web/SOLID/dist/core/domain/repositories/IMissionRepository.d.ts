import { Mission } from '../entities/Mission';
import { MissionStatus } from '../value-objects/MissionStatus';
export interface IMissionRepository {
    findById(missionId: number): Promise<Mission | null>;
    findByStatus(status: MissionStatus): Promise<Mission[]>;
    save(mission: Mission): Promise<Mission>;
    delete(missionId: number): Promise<void>;
    updateStatus(missionId: number, status: MissionStatus): Promise<Mission>;
    findByStatus(status: MissionStatus): Promise<Mission[]>;
    findByPriority(priority: number): Promise<Mission[]>;
    getNextId(): Promise<number>;
}
//# sourceMappingURL=IMissionRepository.d.ts.map