export declare class MissionStatus {
    private readonly value;
    private constructor();
    static readonly REGISTERED: MissionStatus;
    static readonly IN_PROGRESS: MissionStatus;
    static readonly COMPLETED: MissionStatus;
    getValue(): string;
    toString(): string;
    equals(other: MissionStatus): boolean;
    static fromString(value: string): MissionStatus;
    static validStatuses(): string[];
    static isValidStatus(value: string): boolean;
}
//# sourceMappingURL=MissionStatus.d.ts.map