import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Planning } from '../planning/plannings/entities/planning.entity';

@Injectable()
export class PdfGeneratorService {
    private template: HandlebarsTemplateDelegate;

    constructor() {
        this.loadTemplate();
    }

    private async loadTemplate() {
        await this.reloadTemplateCache();
    }

    private async reloadTemplateCache() {
        const templatePath = path.join(__dirname, 'templates', 'planning-pdf.hbs');
        if (fs.existsSync(templatePath)) {
            const templateHtml = await fs.readFile(templatePath, 'utf-8');
            this.template = Handlebars.compile(templateHtml);
        } else {
            console.warn('Template file not found at', templatePath);
            const fallbackPath = path.join(process.cwd(), 'src/exports/templates/planning-pdf.hbs');
            if (fs.existsSync(fallbackPath)) {
                const templateHtml = await fs.readFile(fallbackPath, 'utf-8');
                this.template = Handlebars.compile(templateHtml);
            } else {
                this.template = Handlebars.compile('<html><body><h1>Planeacion</h1></body></html>');
            }
        }
    }

    async generate(planning: Planning): Promise<Buffer> {
        const contenido = planning.contenido || {};
        const firmas = contenido.firmas || {};

        // Force reload the Handlebars file to ensure immediate updates without server restart
        await this.reloadTemplateCache();

        let materiasList = contenido.materias || [];
        if (materiasList.length === 0 && (contenido.campo_formativo || contenido.dias)) {
            materiasList.push({
                nombre: planning.materia?.name || 'General',
                metodologia: planning.metodologia || '',
                propositos: planning.propositos || '',
                problematica: planning.problematica || '',
                proyecto: planning.proyecto || '',
                campo_formativo: contenido.campo_formativo || {},
                dias: contenido.dias || [],
                evaluacion: contenido.evaluacion || {},
                materiales: contenido.materiales || '',
                relacion_campos: contenido.relacion_campos || '',
                ajustes_razonables: contenido.ajustes_razonables || ''
            });
        }

        const materiasMapped = materiasList.map((m: any) => ({
            nombreMateria: m.nombre || 'General',
            campoNombre: m.campo_formativo?.nombre || '',
            campoContenidos: (m.campo_formativo?.contenidos || '').replace(/\n/g, '<br>'),
            campoLibros: (m.campo_formativo?.libros_texto || '').replace(/\n/g, '<br>'),
            campoProcesos: (m.campo_formativo?.procesos_desarrollo || '').replace(/\n/g, '<br>'),
            campoEjes: (m.campo_formativo?.ejes_articuladores || '').replace(/\n/g, '<br>'),

            dias: (m.dias || []).map((d: any) => ({
                fechaFormateada: this.formatDate(d.fecha),
                dia_semana: d.dia_semana,
                tarea: (d.tarea || '').replace(/\n/g, '<br>'),
                actividades_extra: (d.actividades_extra || '').replace(/\n/g, '<br>'),
                sugerencias_didacticas: (d.sugerencias_didacticas || '').replace(/\n/g, '<br>'),
                observaciones: (d.observaciones || '').replace(/\n/g, '<br>')
            })),

            evaluacionIndicadores: (m.evaluacion?.indicadores || '').replace(/\n/g, '<br>'),
            evaluacionMomentos: (m.evaluacion?.momentos || '').replace(/\n/g, '<br>'),
            evaluacionHerramientas: (m.evaluacion?.herramientas || '').replace(/\n/g, '<br>'),

            materiales: (m.materiales || '').replace(/\n/g, '<br>'),
            relacionCampos: (m.relacion_campos || '').replace(/\n/g, '<br>'),
            ajustes: (m.ajustes_razonables || '').replace(/\n/g, '<br>')
        }));

        const data = {
            colegio: 'COLEGIO INDOAMERICA',
            nivel: 'Primaria',
            cct: 'C.C.T 15PPR3836E',
            ciclo: 'CICLO ESCOLAR 2025-2026',
            temporalidad: `${this.formatDate(planning.fecha_inicio)} al ${this.formatDate(
                planning.fecha_fin,
            )}`,
            docente: planning.docente?.name || planning.docente?.email || '',
            grado: planning.grupo?.name?.split(' ')[0] || '',
            grupo: planning.grupo?.name?.split(' ')[1] || '',

            materiasMapped,

            firmaDocente: firmas.docente || '',
            firmaDirectora: firmas.directora || '',
            firmaAcademica: firmas.academica || '',

            logoIzquierdo: '',
            logoDerecho: '',
        };

        const html = this.template(data);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBufferArray = await page.pdf({
            format: 'Letter',
            landscape: true,
            printBackground: true,
            margin: {
                top: '0.4in',
                bottom: '0.4in',
                left: '0.4in',
                right: '0.4in',
            },
        });

        const pdfBuffer = Buffer.from(pdfBufferArray);

        await browser.close();

        return pdfBuffer;
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const day = d.getUTCDate();
        const month = d.toLocaleString('es-MX', { month: 'long', timeZone: 'UTC' });
        const year = d.getUTCFullYear();
        return `${day} de ${month} del ${year}`;
    }
}
