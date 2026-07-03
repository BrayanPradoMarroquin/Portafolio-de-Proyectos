import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Importar rutas
import missionRoutes from './infrastructure/web/routes/missionRoutes';

dotenv.config();

class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
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
    this.app.use('/api/missions', missionRoutes);
  }

  private configureErrorHandling(): void {
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
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Contacte al administrador'
      });
    });
  }

  public start(): void {
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