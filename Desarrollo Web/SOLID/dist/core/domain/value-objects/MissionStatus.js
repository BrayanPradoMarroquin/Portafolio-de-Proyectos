"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionStatus = void 0;
class MissionStatus {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    // comparar dos estados de misión
    equals(other) {
        return this.value === other.value;
    }
    // metodo de valor
    static fromString(value) {
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
    static validStatuses() {
        return [
            MissionStatus.REGISTERED.getValue(),
            MissionStatus.IN_PROGRESS.getValue(),
            MissionStatus.COMPLETED.getValue(),
        ];
    }
    // validacion de estados
    static isValidStatus(value) {
        return MissionStatus.validStatuses().includes(value);
    }
}
exports.MissionStatus = MissionStatus;
// valores posibles
MissionStatus.REGISTERED = new MissionStatus('registrada');
MissionStatus.IN_PROGRESS = new MissionStatus('en_proceso');
MissionStatus.COMPLETED = new MissionStatus('finalizada');
//# sourceMappingURL=MissionStatus.js.map