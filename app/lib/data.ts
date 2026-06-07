// Datos del Recurso Educativo Digital (RED) MANTÉN-LAB
// Asignatura: Programación y Control del Mantenimiento — UNIPAZ

export const curso = {
  nombre: "Programación y Control del Mantenimiento",
  programa: "Ingeniería de Producción",
  institucion: "Instituto Universitario de la Paz (UNIPAZ)",
  region: "Barrancabermeja · Magdalena Medio",
  creditos: 3,
  modalidad: "Presencial con apoyo virtual (b-learning)",
  cohorte: "20 a 35 estudiantes",
  modelo: "ADDIE",
  enfoque: "Constructivismo / aprendizaje basado en problemas y en el hacer",
};

export const problema = {
  titulo:
    "Desconexión entre la enseñanza teórica del mantenimiento y el uso real de software CMMS/GMAO",
  descripcion:
    "Los estudiantes egresan sin experiencia en sistemas computarizados de gestión del mantenimiento (CMMS/GMAO) como SAP-PM o Fiix, herramientas estándar en Ecopetrol, Cenit y empresas contratistas de la región. Las clases se apoyan únicamente en hojas de cálculo, lo que limita la transferencia al entorno laboral.",
};

export type Fase = {
  sigla: string;
  nombre: string;
  color: string;
  pregunta: string;
  acciones: string[];
  enRED: string;
};

export const addie: Fase[] = [
  {
    sigla: "A",
    nombre: "Análisis",
    color: "var(--color-steel)",
    pregunta: "¿Qué necesitan aprender y desde dónde parten?",
    acciones: [
      "Diagnóstico de competencias digitales y de la brecha academia–industria.",
      "Caracterización de la población: perfil mixto, 20 a 35 estudiantes.",
      "Definición de la competencia: gestionar el mantenimiento con un CMMS.",
      "Identificación de recursos: CMMS gratuito (Fiix) y demo institucional.",
    ],
    enRED:
      "Cuestionario diagnóstico de entrada y encuadre de la asignatura publicados en el aula virtual.",
  },
  {
    sigla: "D",
    nombre: "Diseño",
    color: "var(--color-amber)",
    pregunta: "¿Cómo se estructura la ruta de aprendizaje?",
    acciones: [
      "Formulación de objetivos por niveles de la taxonomía de Bloom.",
      "Secuencia de tres actividades articuladas y progresivas.",
      "Selección de estrategias: taller guiado, ABP y estudio de caso.",
      "Diseño de instrumentos de evaluación con rúbricas analíticas.",
    ],
    enRED:
      "Mapa de actividades, objetivos visibles y rúbricas disponibles antes de iniciar cada reto.",
  },
  {
    sigla: "D",
    nombre: "Desarrollo",
    color: "var(--color-teal)",
    pregunta: "¿Con qué materiales y recursos se construye?",
    acciones: [
      "Producción de guías, videotutoriales e infografías de cada actividad.",
      "Configuración del simulador CMMS con activos reales de planta.",
      "Elaboración de plantillas, foros y cuestionarios de retroalimentación.",
      "Curaduría de bibliografía técnica y normativa (ISO 55000, GTC).",
    ],
    enRED:
      "Todos los recursos quedan embebidos en el RED: simulador CMMS, guías descargables y videos.",
  },
  {
    sigla: "I",
    nombre: "Implementación",
    color: "var(--color-ok)",
    pregunta: "¿Cómo se ejecuta la acción formativa?",
    acciones: [
      "Apertura del aula y registro de estudiantes en el CMMS simulado.",
      "Ejecución de las tres actividades con acompañamiento docente.",
      "Trabajo colaborativo en órdenes de trabajo y planes de mantenimiento.",
      "Tutoría sincrónica y foros asincrónicos de resolución de dudas.",
    ],
    enRED:
      "El estudiante opera el CMMS, registra activos, programa tareas y genera órdenes de trabajo.",
  },
  {
    sigla: "E",
    nombre: "Evaluación",
    color: "var(--color-alarm)",
    pregunta: "¿Se alcanzó el aprendizaje y cómo mejorar?",
    acciones: [
      "Evaluación formativa continua con retroalimentación inmediata.",
      "Evaluación sumativa por rúbrica de cada producto entregable.",
      "Análisis de indicadores de uso del CMMS (KPI de aprendizaje).",
      "Encuesta de satisfacción y ajuste del diseño para la siguiente cohorte.",
    ],
    enRED:
      "Tablero de indicadores y rúbricas que califican el desempeño dentro del propio CMMS.",
  },
];

export type Actividad = {
  slug: string;
  codigo: string;
  titulo: string;
  fase: string;
  duracion: string;
  modalidad: string;
  estrategia: string;
  temas: string[];
  objetivoGeneral: string;
  objetivosEspecificos: string[];
  pasos: { titulo: string; detalle: string }[];
  recursos: string[];
  evaluacion: { criterio: string; peso: number }[];
  referencias: string[];
};

export const actividades: Actividad[] = [
  {
    slug: "bd-activos",
    codigo: "A1",
    titulo: "Construcción de la base de datos de activos en un CMMS",
    fase: "Análisis y Diseño (ADDIE)",
    duracion: "2 sesiones · 6 horas",
    modalidad: "Taller práctico guiado",
    estrategia: "Aprender haciendo · modelado guiado paso a paso",
    temas: [
      "Jerarquía de activos y taxonomía (ISO 14224)",
      "Codificación y criticidad de equipos",
      "Estructura de datos maestros en un CMMS",
    ],
    objetivoGeneral:
      "Estructurar la base de datos maestra de activos de una planta industrial dentro de un CMMS, aplicando criterios de jerarquía, codificación y criticidad.",
    objetivosEspecificos: [
      "Identificar la jerarquía funcional de activos según la norma ISO 14224.",
      "Codificar equipos y asignar niveles de criticidad operativa.",
      "Registrar los datos maestros en el simulador CMMS del RED.",
    ],
    pasos: [
      {
        titulo: "Encuadre y diagnóstico",
        detalle:
          "El estudiante revisa el videotutorial introductorio y responde el cuestionario diagnóstico para activar saberes previos sobre activos y mantenimiento.",
      },
      {
        titulo: "Modelado de la jerarquía",
        detalle:
          "A partir de un caso de planta de bombeo, construye el árbol de activos (planta, sistema, equipo, componente) usando la plantilla descargable.",
      },
      {
        titulo: "Codificación y criticidad",
        detalle:
          "Asigna códigos únicos y clasifica la criticidad (alta, media, baja) con la matriz provista, justificando cada decisión en el foro.",
      },
      {
        titulo: "Registro en el CMMS",
        detalle:
          "Ingresa al módulo de Activos del simulador y carga la base de datos. El sistema valida la consistencia de la codificación.",
      },
      {
        titulo: "Retroalimentación",
        detalle:
          "El docente evalúa con la rúbrica y devuelve observaciones; el estudiante ajusta y vuelve a cargar si es necesario.",
      },
    ],
    recursos: [
      "Simulador CMMS — módulo Activos",
      "Videotutorial: jerarquía y taxonomía de activos",
      "Plantilla de árbol de activos (descargable)",
      "Matriz de criticidad",
      "Foro: decisiones de codificación",
    ],
    evaluacion: [
      { criterio: "Coherencia de la jerarquía de activos", peso: 30 },
      { criterio: "Codificación única y normalizada", peso: 25 },
      { criterio: "Justificación de la criticidad", peso: 25 },
      { criterio: "Calidad del registro en el CMMS", peso: 20 },
    ],
    referencias: [
      "International Organization for Standardization. (2016). ISO 14224: Recolección e intercambio de datos de confiabilidad y mantenimiento de equipos.",
      "García Garrido, S. (2010). Organización y gestión integral de mantenimiento. Díaz de Santos.",
    ],
  },
  {
    slug: "plan-preventivo",
    codigo: "A2",
    titulo: "Diseño de un plan de mantenimiento preventivo",
    fase: "Desarrollo e Implementación (ADDIE)",
    duracion: "2 sesiones · 6 horas",
    modalidad: "Análisis y solución de problemas (ABP)",
    estrategia: "Aprendizaje basado en problemas · trabajo colaborativo",
    temas: [
      "Mantenimiento preventivo, predictivo y correctivo",
      "Frecuencias, tareas y planes de trabajo",
      "Programación de la carga de mantenimiento",
    ],
    objetivoGeneral:
      "Diseñar un plan de mantenimiento preventivo para un activo crítico, definiendo tareas, frecuencias y recursos, y programándolo dentro del CMMS.",
    objetivosEspecificos: [
      "Distinguir las estrategias de mantenimiento según el tipo de activo.",
      "Definir tareas y frecuencias con base en recomendaciones del fabricante.",
      "Programar el plan en el CMMS y proyectar la carga de trabajo.",
    ],
    pasos: [
      {
        titulo: "Selección del activo crítico",
        detalle:
          "El equipo escoge un activo de criticidad alta de la base creada en A1 y analiza sus modos de falla más frecuentes.",
      },
      {
        titulo: "Definición de tareas",
        detalle:
          "Con la infografía de tipos de mantenimiento, define tareas preventivas, su frecuencia y la duración estimada.",
      },
      {
        titulo: "Programación en el CMMS",
        detalle:
          "Carga el plan en el módulo de Planes del simulador, asociándolo al activo y al calendario de la planta.",
      },
      {
        titulo: "Proyección de carga",
        detalle:
          "El simulador genera la proyección de horas-hombre; el equipo analiza picos y balancea la programación.",
      },
      {
        titulo: "Sustentación",
        detalle:
          "Cada equipo presenta su plan en el foro y recibe retroalimentación de pares y del docente con rúbrica.",
      },
    ],
    recursos: [
      "Simulador CMMS — módulo Planes de mantenimiento",
      "Infografía: estrategias de mantenimiento",
      "Caso de estudio: bomba centrífuga API 610",
      "Foro de sustentación entre pares",
      "Rúbrica de evaluación de planes",
    ],
    evaluacion: [
      { criterio: "Pertinencia de las tareas frente a los modos de falla", peso: 30 },
      { criterio: "Coherencia de frecuencias y recursos", peso: 25 },
      { criterio: "Correcta programación en el CMMS", peso: 25 },
      { criterio: "Análisis de la carga y sustentación", peso: 20 },
    ],
    referencias: [
      "Moubray, J. (2004). Mantenimiento centrado en confiabilidad (RCM II). Aladon.",
      "Mora Gutiérrez, L. A. (2009). Mantenimiento: planeación, ejecución y control. Alfaomega.",
    ],
  },
  {
    slug: "ordenes-kpi",
    codigo: "A3",
    titulo: "Gestión de órdenes de trabajo e indicadores de mantenimiento",
    fase: "Implementación y Evaluación (ADDIE)",
    duracion: "2 sesiones · 6 horas",
    modalidad: "Estudio de caso + foro de análisis",
    estrategia: "Análisis de datos · toma de decisiones basada en KPI",
    temas: [
      "Ciclo de la orden de trabajo",
      "Indicadores de mantenimiento: MTBF, MTTR, disponibilidad",
      "Cumplimiento del plan y mejora continua",
    ],
    objetivoGeneral:
      "Gestionar el ciclo de órdenes de trabajo en el CMMS y analizar los indicadores clave de mantenimiento para sustentar decisiones de mejora.",
    objetivosEspecificos: [
      "Ejecutar el ciclo de vida de una orden de trabajo en el CMMS.",
      "Calcular e interpretar MTBF, MTTR y disponibilidad.",
      "Proponer acciones de mejora a partir del tablero de indicadores.",
    ],
    pasos: [
      {
        titulo: "Apertura de órdenes",
        detalle:
          "A partir de avisos de falla simulados, el estudiante crea órdenes de trabajo, asigna técnicos y materiales en el CMMS.",
      },
      {
        titulo: "Ejecución y cierre",
        detalle:
          "Registra tiempos de intervención, repuestos y observaciones, y cierra las órdenes documentando la solución.",
      },
      {
        titulo: "Lectura de indicadores",
        detalle:
          "Abre el tablero de KPI del CMMS y analiza MTBF, MTTR y disponibilidad por equipo y por periodo.",
      },
      {
        titulo: "Estudio de caso",
        detalle:
          "Interpreta un escenario de baja disponibilidad y propone, en el foro, acciones correctivas y de mejora continua.",
      },
      {
        titulo: "Evaluación integradora",
        detalle:
          "Presenta un informe técnico breve con conclusiones; se evalúa con la rúbrica integradora del RED.",
      },
    ],
    recursos: [
      "Simulador CMMS — módulo Órdenes de trabajo y Tablero KPI",
      "Videotutorial: cálculo de MTBF, MTTR y disponibilidad",
      "Estudio de caso: parada no programada",
      "Foro de análisis y propuestas de mejora",
      "Rúbrica integradora",
    ],
    evaluacion: [
      { criterio: "Correcta gestión del ciclo de la orden de trabajo", peso: 30 },
      { criterio: "Cálculo e interpretación de indicadores", peso: 30 },
      { criterio: "Calidad de las propuestas de mejora", peso: 25 },
      { criterio: "Comunicación técnica del informe", peso: 15 },
    ],
    referencias: [
      "Tavares, L. (2000). Administración moderna del mantenimiento. Novo Polo.",
      "International Organization for Standardization. (2014). ISO 55000: Gestión de activos.",
    ],
  },
];

// Datos de demostración del CMMS
export const cmmsActivos = [
  { codigo: "BBA-101", nombre: "Bomba centrífuga API 610", sistema: "Bombeo crudo", criticidad: "Alta", estado: "Operativo" },
  { codigo: "MOT-204", nombre: "Motor eléctrico 75 kW", sistema: "Bombeo crudo", criticidad: "Alta", estado: "Mantenimiento" },
  { codigo: "INT-310", nombre: "Intercambiador de calor", sistema: "Tratamiento", criticidad: "Media", estado: "Operativo" },
  { codigo: "CMP-415", nombre: "Compresor de tornillo", sistema: "Aire de planta", criticidad: "Alta", estado: "Falla" },
  { codigo: "TAN-520", nombre: "Tanque de almacenamiento", sistema: "Almacenamiento", criticidad: "Media", estado: "Operativo" },
  { codigo: "VAL-630", nombre: "Válvula de control", sistema: "Tratamiento", criticidad: "Baja", estado: "Operativo" },
];

export const cmmsOrdenes = [
  { id: "OT-2041", activo: "CMP-415", tipo: "Correctivo", prioridad: "Urgente", estado: "Abierta", tecnico: "J. Pérez" },
  { id: "OT-2040", activo: "MOT-204", tipo: "Preventivo", prioridad: "Alta", estado: "En proceso", tecnico: "L. Díaz" },
  { id: "OT-2039", activo: "BBA-101", tipo: "Preventivo", prioridad: "Media", estado: "En proceso", tecnico: "M. Soto" },
  { id: "OT-2038", activo: "INT-310", tipo: "Inspección", prioridad: "Baja", estado: "Cerrada", tecnico: "A. Rojas" },
  { id: "OT-2037", activo: "BBA-101", tipo: "Correctivo", prioridad: "Alta", estado: "Cerrada", tecnico: "M. Soto" },
];

export const cmmsKpi = [
  { etiqueta: "Disponibilidad", valor: 92.4, unidad: "%", meta: 95, tono: "ok" },
  { etiqueta: "MTBF", valor: 312, unidad: "h", meta: 350, tono: "steel" },
  { etiqueta: "MTTR", valor: 4.8, unidad: "h", meta: 4, tono: "amber" },
  { etiqueta: "Cumplim. plan", valor: 87, unidad: "%", meta: 90, tono: "teal" },
];
