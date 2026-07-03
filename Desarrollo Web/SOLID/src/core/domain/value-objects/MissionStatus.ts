export class MissionStatus {
    private constructor(private readonly value: string) {}

    // valores posibles
    static readonly REGISTERED = new MissionStatus('registrada');
    static readonly IN_PROGRESS = new MissionStatus('en_proceso');
    static readonly COMPLETED = new MissionStatus('finalizada');

    public getValue(): string {
        return this.value;
    }

    public toString(): string {
        return this.value;
    }

    // comparar dos estados de misión
    public equals(other: MissionStatus): boolean {
        return this.value === other.value;
    }

    // metodo de valor
    public static fromString(value: string): MissionStatus {
        switch (value) {
            case 'registrada':
                return MissionStatus.REGISTERED;
            case 'en_proceso':
                return MissionStatus.IN_PROGRESS;
            case 'finalizada':
                return MissionStatus.COMPLETED;
            default:
                throw new Error(`Estado de misión inválido: ${value}`);
        }
    }

    // Estados validos
    public static validStatuses(): string[] {
        return [
            MissionStatus.REGISTERED.getValue(),
            MissionStatus.IN_PROGRESS.getValue(),
            MissionStatus.COMPLETED.getValue(),
        ];
    }

    // validacion de estados
    public static isValidStatus(value: string): boolean {
        return MissionStatus.validStatuses().includes(value);
    }
}