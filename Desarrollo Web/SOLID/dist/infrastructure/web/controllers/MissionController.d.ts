import { Request, Response } from 'express';
export declare class MissionController {
    private missionRepository;
    constructor();
    getAllMissions(req: Request, res: Response): Promise<void>;
    createMission(req: Request, res: Response): Promise<void>;
    updateMission(req: Request, res: Response): Promise<void>;
    updateMissionStatus(req: Request, res: Response): Promise<void>;
    deleteMission(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MissionController.d.ts.map