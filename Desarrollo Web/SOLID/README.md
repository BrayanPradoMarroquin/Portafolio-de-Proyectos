# API de Gestión de Misiones - Documentación SOLID

## Principios SOLID - Explicación

1. **Single Responsibility Principle (SRP)** - Principio de Responsabilidad Única
"Una clase debe tener una, y solo una, razón para cambiar."

Cada clase en nuestro sistema tiene una única responsabilidad bien definida:

- Mission: Representa únicamente los datos y reglas de negocio de una misión.

- MissionController: Maneja exclusivamente las solicitudes HTTP relacionadas con misiones.

- InMemoryMissionRepository: Se encarga solo del almacenamiento y recuperación de datos en memoria.

2. **Open/Closed Principle (OCP)** - Principio Abierto/Cerrado
"Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación."

3. **Liskov Substitution Principle (LSP)** - Principio de Sustitución de Liskov
"Los objetos de un programa deben ser reemplazables por instancias de sus subtipos sin alterar el correcto funcionamiento del programa."

4. **Interface Segregation Principle (ISP)** - Principio de Segregación de Interfaces
"Muchas interfaces específicas son mejores que una interfaz de propósito general."

5. **Dependency Inversion Principle (DIP)** - Principio de Inversión de Dependencias
"Depende de abstracciones, no de concreciones."

## Evidencia de Aplicación de SOLID

1. SRP - Entidad Mission
Archivo: ```src/core/domain/entities/Mission.ts```

```
export class Mission {
  // Solo propiedades relacionadas con una misión
  public readonly id: number;
  public title: string;
  public applicantArea: string;
  public priority: number;
  public estimatedCost: number;
  public status: MissionStatus;

  // Solo métodos que manipulan los datos de la misión
  public updateTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  public updateStatus(status: MissionStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // Validaciones internas de la entidad
  private validate(): void {
    if (this.priority < 1 || this.priority > 5) {
      throw new Error('La prioridad debe estar entre 1 y 5');
    }
  }
}
```

Explicación: La clase ```Mission``` tiene una única responsabilidad: representar una misión y sus reglas de negocio. No se encarga de persistencia, validación externa, ni presentación.

2. OCP - Sistema de Repositorios
Archivo: ```src/core/domain/repositories/IMissionRepository.ts```

```
export interface IMissionRepository {
  // Interfaz estable que no cambia
  findAll(): Promise<Mission[]>;
  findById(id: number): Promise<Mission | null>;
  save(mission: Mission): Promise<Mission>;
}

// Podemos EXTENDER sin MODIFICAR
export class LoggingMissionRepository implements IMissionRepository {
  constructor(private wrappedRepository: IMissionRepository) {}

  async save(mission: Mission): Promise<Mission> {
    console.log(`Guardando misión: ${mission.title}`);
    const result = await this.wrappedRepository.save(mission);
    console.log(`Misión guardada con ID: ${result.id}`);
    return result;
  }
  // ... otros métodos con logging
}
```

Explicación: El sistema está abierto para extensión (podemos crear ```DatabaseMissionRepository, FileMissionRepository```, etc.) pero cerrado para modificación (no necesitamos cambiar ```IMissionRepository```).

3. LSP - Value Object MissionStatus
Archivo: ```src/core/domain/value-objects/MissionStatus.ts```

```
export class MissionStatus {
  // Cada estado específico puede sustituir a MissionStatus
  static readonly REGISTERED = new MissionStatus('registrada');
  static readonly IN_PROCESS = new MissionStatus('en_proceso');
  static readonly FINISHED = new MissionStatus('finalizada');

  // Métodos que funcionan con cualquier estado
  public static fromString(value: string): MissionStatus {
    // Todos los estados se comportan igual
    const status = this.getAll().find(s => s.value === value);
    if (!status) throw new Error(`Estado inválido: ${value}`);
    return status;
  }
}

// Uso - Sustitución perfecta
function processMission(status: MissionStatus) {
  console.log(`Estado actual: ${status.toString()}`);
  // Funciona igual con cualquier estado
}

processMission(MissionStatus.REGISTERED);    
processMission(MissionStatus.FINISHED);      
```
Explicación: Cualquier estado específico (```REGISTERED, IN_PROCESS, FINISHED```) puede sustituir a ```MissionStatus``` sin alterar el comportamiento del programa.

4. ISP - Interfaces Específicas

Archivo: ```src/core/domain/repositories/IMissionRepository.ts```

```
// Interfaz pequeña y cohesiva
export interface IMissionRepository {
  // Solo operaciones básicas de repositorio
  findAll(): Promise<Mission[]>;
  findById(id: number): Promise<Mission | null>;
  save(mission: Mission): Promise<Mission>;
  update(mission: Mission): Promise<Mission>;
  delete(id: number): Promise<void>;
}

// No incluye operaciones que no son responsabilidad del repositorio
// ❌ NO tiene: generateReport(), sendEmail(), validateBusinessRules()
```

Archivo: ```src/infrastructure/web/controllers/MissionController.ts```

```
export class MissionController {
  // El controlador solo maneja HTTP
  async createMission(req: Request, res: Response): Promise<void> {
    // Solo lógica relacionada con HTTP
    const missionData = req.body;
    // Delega responsabilidad de negocio a otros componentes
  }

  // No incluye: persistencia, validación compleja, lógica de negocio
}
```

Explicación: Cada interfaz/cliente solo tiene los métodos que realmente necesita. El repositorio no tiene métodos HTTP, el controlador no tiene métodos de persistencia.

5. DIP - Inyección de Dependencias
Archivo: ```src/infrastructure/web/controllers/MissionController.ts```

```
export class MissionController {
  // ❌ ANTERIOR: Dependencia concreta
  // private missionRepository = new InMemoryMissionRepository();

  // ✅ ACTUAL: Dependencia de abstracción
  constructor(private missionRepository: IMissionRepository) {}

  async getAllMissions(req: Request, res: Response): Promise<void> {
    // Usa la abstracción, no la implementación concreta
    const missions = await this.missionRepository.findAll();
    res.json(missions);
  }
}
```

Archivo: ```src/server.ts``` (Dependency Injection manual)

```
// Configuración de dependencias
const missionRepository: IMissionRepository = new InMemoryMissionRepository();
const missionController = new MissionController(missionRepository);

// Ahora podemos cambiar fácilmente a otro repositorio:
// const missionRepository = new DatabaseMissionRepository();
// const missionRepository = new FileMissionRepository();
```

Explicación: Los módulos de alto nivel (```MissionController```) dependen de abstracciones (```IMissionRepository```), no de implementaciones concretas (```InMemoryMissionRepository```). Esto permite cambiar fácilmente entre diferentes implementaciones.

## Instalación y Uso

### Requisitos Previos
- Node.js 16 o superior
- npm o yarn

### Instalación
```
# 1. Clonar el repositorio
git clone [repositorio](https://github.com/BrayanPradoMarroquin/Pr-cticas-SA-B-201801369/tree/develop)
cd P1

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

### Scripts Disponibles
```
npm run dev      # Ejecutar con hot-reload
npm run build    # Compilar TypeScript
npm start        # Ejecutar versión compilada
npm run clean    # Limpiar archivos compilados
```

## Endpoints de la API
### Health Check

```
GET /api/health
```

Respuesta:
```
{
  "success": true,
  "message": "API de Gestión de Misiones - USAC Software Avanzado",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "version": "1.0.0"
}
```

1. Obtener todas las misiones
```
GET /api/missions
```

Respuesta:
```
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "titulo": "Adquisición de nuevo servidor",
      "area_solicitante": "Infraestructura TI",
      "prioridad": 3,
      "costo_estimado": 2500.00,
      "estado": "registrada"
    }
  ]
}
```

2. Crear nueva misión

```
POST /api/missions
Content-Type: application/json

{
  "titulo": "Implementación de nueva API",
  "area_solicitante": "Desarrollo",
  "prioridad": 3,
  "costo_estimado": 1500.00
}
```

3. Actualizar misión completa

```
PUT /api/missions/1
Content-Type: application/json

{
  "titulo": "Título actualizado",
  "area_solicitante": "Área actualizada",
  "prioridad": 4,
  "costo_estimado": 2000.00,
  "estado": "en_proceso"
}
```

4. Actualizar solo el estado
```
PATCH /api/missions/1/status
Content-Type: application/json

{
  "estado": "finalizada"
}
```

5. Eliminar misión
```
DELETE /api/missions/1
```

## Estructura del Proyecto
```
src/
├── core/                                # Lógica de negocio (Principios SOLID)
│   └── domain/
│       ├── entities/                    # Entidades del dominio
│       │   └── Mission.ts               # ✅ SRP: Responsabilidad única
│       ├── repositories/                # Contratos/Interfaces
│       │   └── IMissionRepository.ts    # ✅ ISP: Interfaces segregadas
│       └── value-objects/               # Objetos de valor
│           └── MissionStatus.ts         # ✅ LSP: Sustitución de Liskov
├── infrastructure/                      # Implementaciones concretas
│   ├── persistence/                     # Implementación de repositorios
│   │   └── InMemoryMissionRepository.ts # ✅ OCP: Abierto/cerrado
│   └── web/                             # Capa web
│       ├── controllers/                 # Controladores HTTP
│       │   └── MissionController.ts     # ✅ DIP: Inversión dependencias
│       └── routes/                      # Rutas Express
│           └── missionRoutes.ts
└── server.ts                            # Punto de entrada
```

## Validaciones Implementadas
### Validaciones de Entrada
- ID: Debe ser número entero positivo
- Título: Campo requerido, no vacío
- Área Solicitante: Campo requerido, no vacío
- Prioridad: Número entre 1 y 5
- Costo Estimado: Número positivo
- Estado: Solo "registrada", "en_proceso" o "finalizada"

### Mensajes de Error
```
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}

{
  "success": false,
  "errors": ["Error 1", "Error 2"]
}
```