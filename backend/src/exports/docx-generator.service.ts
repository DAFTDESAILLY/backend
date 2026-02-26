import { Injectable } from '@nestjs/common';
import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    AlignmentType,
    WidthType,
    BorderStyle,
    PageOrientation,
} from 'docx';
import { Planning } from '../planning/plannings/entities/planning.entity';

@Injectable()
export class DocxGeneratorService {
    async generate(planning: Planning): Promise<Buffer> {
        const contenido = planning.contenido || {};
        const firmas = contenido.firmas || {};

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

        const dynamicChildren: any[] = [
            this.createHeader()
        ];

        materiasList.forEach((materia: any, index: number) => {
            const contextForTable = {
                ...planning,
                materia: { id: planning.materia?.id || 0, name: materia.nombre || 'General' },
                metodologia: materia.metodologia || '',
                propositos: materia.propositos || '',
                problematica: materia.problematica || '',
                proyecto: materia.proyecto || ''
            } as Planning;

            if (index > 0) {
                dynamicChildren.push(new Paragraph({ text: '', spacing: { before: 800 } }));
            }

            dynamicChildren.push(this.createMainInfoTable(contextForTable));
            dynamicChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }));
            dynamicChildren.push(this.createCampoFormativoTable(materia.campo_formativo || {}));
            dynamicChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }));
            dynamicChildren.push(this.createDiasTable(materia.dias || []));
            dynamicChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }));
            dynamicChildren.push(this.createEvaluacionTable(materia.evaluacion || {}, materia));
        });

        dynamicChildren.push(new Paragraph({ text: '', spacing: { after: 600 } }));
        dynamicChildren.push(this.createSignaturesRow(firmas));

        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            size: { orientation: PageOrientation.LANDSCAPE },
                            margin: {
                                top: 567, // ~1 cm
                                right: 567,
                                bottom: 567,
                                left: 567,
                            },
                        },
                    },
                    children: dynamicChildren,
                },
            ],
        });

        return await Packer.toBuffer(doc);
    }

    private createHeader(): Paragraph {
        return new Paragraph({
            children: [
                new TextRun({ text: 'COLEGIO INDOAMERICA', bold: true, size: 28 }),
                new TextRun({ text: '\nPrimaria', size: 24 }),
                new TextRun({ text: '\nC.C.T 15PPR3836E', size: 20 }),
                new TextRun({ text: '\nCICLO ESCOLAR 2025-2026', size: 20 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
        });
    }

    private cell(text: string, isLightBlue: boolean = false, colSpan: number = 1, widthPercent?: number, bold: boolean = false): TableCell {
        const lines = text.split('\n');
        const paragraphs = lines.map(line => new Paragraph({
            children: [new TextRun({ text: line, bold })]
        }));

        return new TableCell({
            children: paragraphs,
            columnSpan: colSpan,
            shading: isLightBlue ? { fill: '85D5E6' } : undefined,
            width: widthPercent ? { size: widthPercent, type: WidthType.PERCENTAGE } : undefined
        });
    }

    private createMainInfoTable(planning: Planning): Table {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        this.cell('Materia', true, 1, 15, true),
                        this.cell(planning.materia?.name || '', false, 1, 35),
                        this.cell('Temporalidad', true, 1, 20, true),
                        this.cell(`${planning.fecha_inicio} al ${planning.fecha_fin}`, false, 2, 30),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell('Nombre del Docente', true, 1, 15, true),
                        this.cell(planning.docente?.name || '', false, 1, 35),
                        this.cell('Grado', true, 1, 10, true),
                        this.cell(planning.grupo?.name?.split(' ')[0] || '', false, 1, 10),
                        this.cell(`Grupo: ${planning.grupo?.name?.split(' ')[1] || ''}`, true, 1, 30, true),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell('Metodología a desarrollar', true, 1, 15, true),
                        this.cell(planning.metodologia || '', false, 4),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell('Propósitos de grado', true, 1, 15, true),
                        this.cell(planning.propositos || '', false, 4),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell('Problemática', true, 1, 15, true),
                        this.cell(planning.problematica || '', false, 4),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell('Proyecto', true, 1, 15, true),
                        this.cell(planning.proyecto || '', false, 4, undefined, true),
                    ],
                }),
            ],
        });
    }

    private createCampoFormativoTable(campo: any): Table {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        this.cell('Campo formativo', true, 1, 20, true),
                        this.cell('Contenidos', true, 1, 35, true),
                        this.cell('Procesos de Desarrollo de Aprendizaje', true, 1, 25, true),
                        this.cell('Ejes Articuladores', true, 1, 20, true),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell(campo.nombre || '', false, 1, 20, true),
                        new TableCell({
                            children: [
                                new Paragraph(campo.contenidos || ''),
                                new Paragraph({ text: 'Libros de Texto Gratuito', spacing: { before: 100 }, shading: { fill: '85D5E6' } }),
                                new Paragraph(campo.libros_texto || ''),
                            ]
                        }),
                        this.cell(campo.procesos_desarrollo || '', false, 1, 25),
                        this.cell(campo.ejes_articuladores || '', false, 1, 20),
                    ],
                }),
            ],
        });
    }

    private createDiasTable(dias: any[]): Table {
        const rows = [
            new TableRow({
                children: [
                    this.cell('Particularidades de la metodología', true, 3, 100, true),
                ],
            }),
            new TableRow({
                children: [
                    this.cell('Momentos', true, 1, 20, true),
                    this.cell('Sugerencias Didácticas', true, 1, 60, true),
                    this.cell('Observaciones', true, 1, 20, true),
                ],
            }),
        ];

        dias.forEach(d => {
            const timeText = d.tiempo ? `\nTiempo: ${d.tiempo}` : '';
            rows.push(new TableRow({
                children: [
                    this.cell(`${d.dia_semana}\n${d.fecha}${timeText}\nTarea: ${d.tarea || ''}`, false, 1, 20),
                    this.cell(d.sugerencias_didacticas || '', false, 1, 60),
                    this.cell(d.observaciones || '', false, 1, 20),
                ]
            }));
            if (d.actividades_extra) {
                rows.push(new TableRow({
                    children: [
                        this.cell('Actividades extra:', true, 1, 20, true),
                        this.cell(d.actividades_extra || '', false, 2, 80),
                    ]
                }));
            }
        });

        return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows });
    }

    private createEvaluacionTable(evaluacion: any, contenido: any): Table {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        this.cell('Evaluación formativa:', true, 2, 60, true),
                        this.cell('Materiales y recursos didácticos:', true, 1, 20, true),
                        this.cell('Relación entre campos formativos:', true, 1, 20, true),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell(`Indicadores:\n${evaluacion.indicadores || ''}`, false, 1, 30),
                        this.cell(`Momentos:\n${evaluacion.momentos || ''}\nHerramientas:\n${evaluacion.herramientas || ''}`, false, 1, 30),
                        this.cell(contenido.materiales || '', false, 1, 20),
                        this.cell(contenido.relacion_campos || '', false, 1, 20),
                    ],
                }),
                new TableRow({
                    children: [
                        this.cell('Ajustes razonables:', true, 1, 30, true),
                        this.cell(contenido.ajustes_razonables || '', false, 3, 70),
                    ],
                }),
            ],
        });
    }

    private createSignaturesRow(firmas: any): Paragraph {
        return new Paragraph({
            children: [
                new TextRun({ text: 'Elaborado por: Docente del grupo\n______________________________\n' + (firmas.docente || '') + '\t\t', size: 20 }),
                new TextRun({ text: 'Vo. Bo. Directora Escolar\n______________________________\n' + (firmas.directora || '') + '\t\t', size: 20 }),
                new TextRun({ text: 'Vo. Bo Área Académica\n______________________________\n' + (firmas.academica || ''), size: 20 }),
            ],
            alignment: AlignmentType.CENTER,
        });
    }
}
