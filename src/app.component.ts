
import { Component, ChangeDetectionStrategy, signal, computed, effect, AfterViewInit, viewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DayData, LaunchPlanData } from './models/launch-plan.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {

  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('taskChart');
  private taskChart?: Chart;

  private readonly launchPlanData: LaunchPlanData = {
    lunes: {
      title: "Lunes: Preparación y Pruebas Finales",
      objective: "Asegurar la estabilidad del producto y tener listos todos los materiales de comunicación.",
      technical: ["✅ Congelación de Código (Code Freeze)", "🐛 Pruebas de Aceptación de Usuario (UAT)", "🔐 Auditoría de Seguridad y claves de API", "📱 Pruebas multidispositivo", "💾 Backup Final de base de datos y código"],
      marketing: ["✍️ Creación de todo el contenido para la semana", "🎤 Contacto con Medios/Influencers", "📦 Preparación del 'Press Kit' oficial"]
    },
    martes: {
      title: "Martes: Contenido y Comunidad",
      objective: "Crear expectación y preparar los recursos de ayuda para los nuevos usuarios.",
      technical: ["🛠️ Configuración final de canales de soporte"],
      marketing: ["📰 Escribir y programar publicación de Blog", "🎬 Creación de tutoriales en vídeo/GIF", "❓ Desarrollar la página de Preguntas Frecuentes (FAQ)", "⏳ Publicar campaña de intriga (Teaser) en redes"]
    },
    miercoles: {
      title: "Miércoles: Despliegue Técnico",
      objective: "Poner la aplicación en el entorno de producción de forma privada para una última validación.",
      technical: ["🚀 Despliegue en Producción (`npm run build`)", "⚙️ Verificación de variables de entorno en servidor", "🔬 Pruebas internas en el dominio final"],
      marketing: ["📢 Anuncio Oficial de la fecha y hora de lanzamiento"]
    },
    jueves: {
      title: "Jueves: Generación de Expectativa (Hype)",
      objective: "Crear el máximo ruido posible justo antes del lanzamiento.",
      technical: ["📊 Monitorización pasiva de logs del servidor"],
      marketing: ["🗣️ Sesión de Preguntas y Respuestas (AMA)", "💬 Compartir testimonios de beta-testers", '📧 Enviar email "Mañana es el día"', "🎉 Lanzar concurso en redes sociales"]
    },
    viernes: {
      title: "Viernes: ¡DÍA DEL LANZAMIENTO!",
      objective: "Ejecutar el plan de comunicación y monitorizar la plataforma de forma intensiva.",
      technical: ["📈 Monitorización Activa y continua del sistema", "🔥 Preparación para despliegue de `hotfixes`"],
      marketing: ["🟢 Activación del acceso público", "📣 Anuncio Multicanal de lanzamiento", "🔗 Actualización de enlaces en biografías de redes sociales", "❤️ Interacción constante con la comunidad"]
    },
    sabado: {
      title: "Sábado: Soporte y Recopilación de Feedback",
      objective: "Escuchar a los primeros usuarios y ofrecer un soporte impecable.",
      technical: ["🆘 Soporte técnico prioritario a usuarios", "🐞 Recopilación y registro de bugs reportados"],
      marketing: ["📝 Habilitar un canal claro de feedback", "📊 Primer vistazo a las métricas de usuario", "🙏 Publicar agradecimiento público en redes"]
    },
    domingo: {
      title: "Domingo: Análisis y Planificación Futura",
      objective: "Evaluar los resultados del lanzamiento y definir los próximos pasos.",
      technical: ["🥇 Priorización técnica de bugs y feedback"],
      marketing: ["📋 Reunión de Retrospectiva del lanzamiento", "🎯 Análisis de efectividad de canales de marketing", "🗺️ Esbozar la hoja de ruta (Roadmap) para las próximas semanas"]
    }
  };

  days = signal<string[]>(Object.keys(this.launchPlanData));
  selectedDay = signal<string>(this.days()[0]);
  selectedDayData = computed<DayData>(() => this.launchPlanData[this.selectedDay()]);

  constructor() {
    effect(() => {
      const dayData = this.selectedDayData();
      if (this.taskChart && dayData) {
        this.updateChart(dayData.technical.length, dayData.marketing.length);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  changeDay(dayKey: string): void {
    this.selectedDay.set(dayKey);
  }

  private initChart(): void {
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const initialData = this.selectedDayData();

    this.taskChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Técnicas', 'Marketing'],
        datasets: [{
          data: [initialData.technical.length, initialData.marketing.length],
          backgroundColor: ['rgba(120, 53, 15, 0.7)', 'rgba(217, 119, 6, 0.7)'],
          borderColor: ['#78350F', '#D97706'],
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#4A2E0A',
              font: { family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += context.parsed + ' tareas';
                }
                return label;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  private updateChart(technicalCount: number, marketingCount: number): void {
    if(this.taskChart) {
        this.taskChart.data.datasets[0].data = [technicalCount, marketingCount];
        this.taskChart.update('none');
    }
  }
}
