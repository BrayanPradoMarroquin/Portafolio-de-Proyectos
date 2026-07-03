"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importar rutas
const missionRoutes_1 = __importDefault(require("./infrastructure/web/routes/missionRoutes"));
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || '3000');
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    configureMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    configureRoutes() {
        // Ruta de health check
        this.app.get('/api/health', (req, res) => {
            res.json({
                success: true,
                message: 'API de Gestión de Misiones - USAC Software Avanzado',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                endpoints: {
                    missions: '/api/missions',
                    health: '/api/health'
                }
            });
        });
        // Documentación de la API
        this.app.get('/api/docs', (req, res) => {
            res.json({
                endpoints: [
                    {
                        method: 'GET',
                        path: '/api/missions',
                        description: 'Obtener todas las misiones',
                        example: 'GET /api/missions'
                    },
                    {
                        method: 'POST',
                        path: '/api/missions',
                        description: 'Crear nueva misión',
                        body: {
                            titulo: 'string',
                            area_solicitante: 'string',
                            prioridad: 'number (1-5)',
                            costo_estimado: 'number'
                        }
                    },
                    {
                        method: 'PUT',
                        path: '/api/missions/:id',
                        description: 'Actualizar misión completa',
                        body: {
                            titulo: 'string',
                            area_solicitante: 'string',
                            prioridad: 'number (1-5)',
                            costo_estimado: 'number',
                            estado: 'string (registrada, en_proceso, finalizada)'
                        }
                    },
                    {
                        method: 'PATCH',
                        path: '/api/missions/:id/status',
                        description: 'Actualizar solo el estado',
                        body: {
                            estado: 'string (registrada, en_proceso, finalizada)'
                        }
                    },
                    {
                        method: 'DELETE',
                        path: '/api/missions/:id',
                        description: 'Eliminar misión'
                    }
                ]
            });
        });
        // Rutas de misiones
        this.app.use('/api/missions', missionRoutes_1.default);
    }
    configureErrorHandling() {
        // Middleware para rutas no encontradas
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Ruta no encontrada',
                path: req.path,
                method: req.method,
                available_endpoints: [
                    'GET /api/health',
                    'GET /api/docs',
                    'GET /api/missions',
                    'GET /api/missions/:id',
                    'POST /api/missions',
                    'PUT /api/missions/:id',
                    'PATCH /api/missions/:id/status',
                    'DELETE /api/missions/:id',
                    'GET /api/missions/stats',
                    'POST /api/missions/reset'
                ]
            });
        });
        // Middleware para errores generales
        this.app.use((error, req, res, next) => {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Contacte al administrador'
            });
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log('='.repeat(60));
            console.log('🚀 API DE GESTIÓN DE MISIONES - USAC SOFTWARE AVANZADO');
            console.log('='.repeat(60));
            console.log(`📡 Servidor corriendo en: http://localhost:${this.port}`);
            console.log(`🔍 Health Check:    http://localhost:${this.port}/api/health`);
            console.log(`📚 Documentación:   http://localhost:${this.port}/api/docs`);
            console.log(`📊 Misiones:        http://localhost:${this.port}/api/missions`);
            console.log('='.repeat(60));
            console.log('ENDPOINTS DISPONIBLES:');
            console.log('GET  /api/missions           - Obtener todas las misiones');
            console.log('POST /api/missions           - Crear nueva misión');
            console.log('PUT  /api/missions/:id       - Actualizar misión completa');
            console.log('PATCH /api/missions/:id/status - Actualizar solo estado');
            console.log('DELETE /api/missions/:id     - Eliminar misión');
            console.log('='.repeat(60));
        });
    }
}
// Iniciar servidor
const server = new Server();
server.start();
//# sourceMappingURL=server.js.map