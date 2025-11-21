// Contenido interpretativo personalizado para INTEGRATE 2.0
// Área 1: Estrategia

export interface NivelContenido {
  rango: string;
  queSeObserva: string;
  comoInterpretarlo: string;
  comoTeAcompanaIntegrate: string;
  oportunidadesDeMejora: string[];
}

export interface SubAreaContenido {
  id: number;
  nombre: string;
  pregunta: string;
  definicion: string;
  niveles: {
    critico: NivelContenido;
    vulnerable: NivelContenido;
    estable: NivelContenido;
    maduro: NivelContenido;
  };
}

export interface AreaContenido {
  area: string;
  rutaFormativa: string;
  proposito: string;
  subAreas: SubAreaContenido[];
}

// Función helper para obtener el nivel según el valor
export function getNivelKey(value: number): 'critico' | 'vulnerable' | 'estable' | 'maduro' {
  if (value < 1.5) return 'critico';
  if (value < 2.5) return 'vulnerable';
  if (value < 3.5) return 'estable';
  return 'maduro';
}

// Contenido del Área 1: Estrategia
export const CONTENIDO_ESTRATEGIA: AreaContenido = {
  area: "Estrategia",
  rutaFormativa: "Visión & Impacto Real",
  proposito: "Conectar propósito, dirección y decisiones para generar sentido compartido y resultados tangibles.",
  subAreas: [
    // SUB-ÁREA 0: Visión / Misión / Valores
    {
      id: 0,
      nombre: "Visión / Misión / Valores",
      pregunta: "¿Los valores y la misión son conocidos y realmente orientan las decisiones estratégicas?",
      definicion: "La visión, misión y valores son el ADN de la organización. Definen quiénes somos, hacia dónde vamos y cómo actuamos. Cuando están claros y compartidos, se convierten en la brújula que orienta cada decisión y acción del equipo.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "La visión, misión y valores no están definidos con claridad o no son conocidos por la mayoría del equipo. Las decisiones se toman sin un marco de referencia compartido, lo que genera desalineación y falta de coherencia en las acciones diarias.",
          comoInterpretarlo: "Este resultado indica que la organización carece de una identidad estratégica clara. Sin un propósito compartido, cada persona o área puede estar trabajando en direcciones diferentes, lo que dificulta la coordinación y reduce el impacto colectivo. Es fundamental establecer estos cimientos antes de avanzar en otras áreas.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita procesos participativos para co-crear la visión, misión y valores de forma colaborativa, asegurando que todo el equipo se sienta parte de la construcción y comprenda su significado real.",
          oportunidadesDeMejora: [
            "Organizar sesiones de trabajo para definir o redefinir la visión, misión y valores de forma participativa",
            "Crear materiales visuales y accesibles que comuniquen estos elementos de manera clara y memorable",
            "Establecer espacios regulares para recordar y reflexionar sobre cómo estos elementos guían el trabajo diario",
            "Incorporar la visión, misión y valores en los procesos de onboarding y formación continua"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "La visión, misión y valores existen y están documentados, pero no son ampliamente conocidos ni utilizados de forma consistente en la toma de decisiones. Algunas personas los conocen, pero no se perciben como herramientas prácticas para el día a día.",
          comoInterpretarlo: "La organización ha dado el primer paso al definir su identidad estratégica, pero aún no ha logrado que se convierta en parte de la cultura organizacional. Existe una brecha entre lo declarado y lo vivido, lo que puede generar desconexión entre el discurso y la práctica.",
          comoTeAcompanaIntegrate: "INTEGRATE propone dinámicas de apropiación y traducción de la visión, misión y valores a comportamientos concretos, ayudando a que pasen de ser conceptos abstractos a guías prácticas para la acción.",
          oportunidadesDeMejora: [
            "Realizar talleres para traducir la visión, misión y valores en comportamientos y decisiones concretas",
            "Crear casos prácticos y ejemplos reales que ilustren cómo estos elementos se aplican en situaciones cotidianas",
            "Incorporar la revisión de alineación con la visión y valores en las reuniones de equipo y evaluaciones de proyectos",
            "Reconocer y celebrar públicamente las acciones que reflejan los valores organizacionales"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "La visión, misión y valores son conocidos por la mayoría del equipo y se utilizan con cierta frecuencia como referencia en la toma de decisiones. Sin embargo, su aplicación no es sistemática y puede variar según las áreas o personas.",
          comoInterpretarlo: "La organización ha logrado que su identidad estratégica sea parte del lenguaje común, pero aún falta consolidar su uso como criterio central en todas las decisiones. Existe una base sólida que puede fortalecerse para lograr mayor coherencia y alineación organizacional.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de seguimiento y reflexión que ayudan a sistematizar el uso de la visión, misión y valores en los procesos de planificación, evaluación y toma de decisiones estratégicas.",
          oportunidadesDeMejora: [
            "Integrar la revisión de alineación con la visión y valores en todos los procesos de planificación y evaluación",
            "Crear indicadores o criterios de decisión explícitos basados en los valores organizacionales",
            "Desarrollar casos de estudio internos que muestren cómo la visión y valores han guiado decisiones importantes",
            "Establecer espacios de reflexión periódica sobre la coherencia entre lo que se declara y lo que se hace"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "La visión, misión y valores son ampliamente conocidos, comprendidos y utilizados de forma sistemática como criterio central en la toma de decisiones estratégicas y operativas. Existe una cultura organizacional coherente y alineada con estos elementos.",
          comoInterpretarlo: "La organización ha logrado que su identidad estratégica sea parte integral de su ADN cultural. Las decisiones se toman con un marco de referencia claro y compartido, lo que genera coherencia, confianza y sentido de pertenencia en todo el equipo.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución continua de la visión, misión y valores, asegurando que se mantengan relevantes y vivos ante los cambios del entorno, y que sigan siendo fuente de inspiración y guía para el equipo.",
          oportunidadesDeMejora: [
            "Revisar periódicamente la vigencia y relevancia de la visión, misión y valores ante los cambios del entorno",
            "Documentar y compartir historias de impacto que muestren cómo estos elementos generan valor real",
            "Involucrar a grupos de interés externos en la reflexión sobre la coherencia entre lo declarado y lo percibido",
            "Convertirse en referente para otras organizaciones en la construcción de identidad estratégica clara y vivida"
          ]
        }
      }
    },
    // SUB-ÁREA 1: Grupos de interés (Stakeholders)
    {
      id: 1,
      nombre: "Grupos de interés (Stakeholders)",
      pregunta: "¿Recogemos habitualmente el feedback de nuestros grupos de interés e incorporamos sus aportaciones a la mejora de los proyectos?",
      definicion: "Los grupos de interés son todas aquellas personas, organizaciones o comunidades que afectan o son afectadas por nuestro trabajo. Escuchar activamente su feedback y incorporar sus aportaciones es clave para generar valor compartido y asegurar la relevancia y sostenibilidad de nuestros proyectos.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "No existe un proceso sistemático para recoger feedback de los grupos de interés. Las decisiones se toman principalmente desde la perspectiva interna, sin considerar de forma estructurada las necesidades, expectativas o aportaciones de quienes se ven afectados por el trabajo de la organización.",
          comoInterpretarlo: "Este resultado indica que la organización opera de forma aislada, sin aprovechar el conocimiento y las perspectivas de sus grupos de interés. Esto puede llevar a proyectos desalineados con las necesidades reales, pérdida de oportunidades de mejora y deterioro de las relaciones con actores clave.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita el mapeo de grupos de interés y el diseño de procesos participativos para recoger feedback de forma estructurada, asegurando que todas las voces relevantes sean escuchadas y consideradas.",
          oportunidadesDeMejora: [
            "Identificar y mapear los grupos de interés clave de la organización y sus proyectos",
            "Diseñar canales básicos de comunicación bidireccional con los grupos de interés prioritarios",
            "Realizar una primera ronda de consultas para entender necesidades, expectativas y percepciones",
            "Crear un registro simple de feedback recibido y acciones tomadas en respuesta"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Se recoge feedback de los grupos de interés de forma ocasional o reactiva, generalmente cuando surgen problemas o al final de los proyectos. La información recopilada no siempre se analiza ni se incorpora de forma sistemática a la mejora de los procesos o proyectos.",
          comoInterpretarlo: "La organización reconoce la importancia de escuchar a sus grupos de interés, pero aún no ha establecido procesos proactivos y sistemáticos para hacerlo. El feedback se percibe más como un requisito que como una fuente valiosa de aprendizaje y mejora continua.",
          comoTeAcompanaIntegrate: "INTEGRATE propone metodologías de escucha activa y co-creación que transforman el feedback en insumo estratégico, ayudando a diseñar procesos regulares de consulta y mecanismos claros de incorporación de aportaciones.",
          oportunidadesDeMejora: [
            "Establecer momentos específicos en el ciclo de proyectos para recoger feedback de grupos de interés",
            "Crear herramientas estandarizadas (encuestas, entrevistas, grupos focales) para facilitar la recopilación de información",
            "Desarrollar un proceso claro para analizar el feedback recibido e identificar acciones de mejora",
            "Comunicar a los grupos de interés cómo su feedback ha sido utilizado y qué cambios se han implementado"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Existe un proceso establecido para recoger feedback de los grupos de interés en momentos clave de los proyectos. La información se analiza y se incorpora a la mejora de procesos, aunque la sistematicidad y profundidad del análisis puede variar según el proyecto o área.",
          comoInterpretarlo: "La organización ha institucionalizado la escucha a sus grupos de interés como parte de su forma de trabajar. Existe una base sólida que puede fortalecerse para lograr mayor profundidad en el análisis, mayor agilidad en la respuesta y mayor impacto en la mejora continua.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de análisis participativo y co-diseño que permiten profundizar en el feedback recibido, identificar patrones y tendencias, y co-crear soluciones con los grupos de interés de forma colaborativa.",
          oportunidadesDeMejora: [
            "Diversificar los métodos de recopilación de feedback para captar perspectivas más ricas y matizadas",
            "Involucrar a los grupos de interés en el análisis del feedback y el diseño de soluciones",
            "Establecer indicadores de satisfacción y percepción de los grupos de interés para hacer seguimiento continuo",
            "Crear espacios de diálogo regular con grupos de interés clave para construir relaciones de confianza y colaboración"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "La organización tiene procesos sistemáticos y diversos para recoger feedback de todos sus grupos de interés de forma continua. El feedback se analiza en profundidad, se incorpora ágilmente a la mejora de proyectos y procesos, y se comunica de forma transparente cómo se ha utilizado.",
          comoInterpretarlo: "La organización ha desarrollado una cultura de escucha activa y co-creación con sus grupos de interés. El feedback no solo se recoge, sino que se convierte en motor de innovación y mejora continua, fortaleciendo las relaciones y generando valor compartido.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución hacia modelos de gobernanza participativa, donde los grupos de interés no solo son consultados, sino que participan activamente en la toma de decisiones y la co-creación de valor.",
          oportunidadesDeMejora: [
            "Explorar modelos de gobernanza participativa que involucren a grupos de interés en la toma de decisiones estratégicas",
            "Desarrollar sistemas de feedback en tiempo real que permitan ajustes ágiles durante la ejecución de proyectos",
            "Documentar y compartir aprendizajes sobre cómo el feedback de grupos de interés ha generado innovación y mejora",
            "Convertirse en referente en prácticas de escucha activa y co-creación con grupos de interés"
          ]
        }
      }
    },
    // SUB-ÁREA 2: Calidad
    {
      id: 2,
      nombre: "Calidad",
      pregunta: "¿Disponemos de criterios de calidad compartidos que orienten el trabajo y la toma de decisiones?",
      definicion: "Los criterios de calidad son los estándares y expectativas compartidas sobre cómo debe ser el trabajo bien hecho. Cuando están claros y son conocidos por todo el equipo, facilitan la toma de decisiones, la coordinación y la mejora continua, asegurando que todos trabajen hacia los mismos objetivos de excelencia.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "No existen criterios de calidad definidos o compartidos. Cada persona o área tiene su propia interpretación de lo que significa 'trabajo bien hecho', lo que genera inconsistencias, conflictos y dificultades para evaluar resultados de forma objetiva.",
          comoInterpretarlo: "Este resultado indica que la organización carece de un marco común para evaluar y asegurar la calidad del trabajo. Sin criterios compartidos, es difícil coordinar esfuerzos, aprender de los errores y mejorar de forma sistemática. La calidad depende más de la iniciativa individual que de estándares organizacionales.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita procesos participativos para co-crear criterios de calidad que reflejen las expectativas y valores del equipo, asegurando que sean comprensibles, aplicables y compartidos por todos.",
          oportunidadesDeMejora: [
            "Organizar sesiones de trabajo para identificar qué significa 'calidad' en el contexto específico de la organización",
            "Definir criterios básicos de calidad para los procesos y productos más críticos",
            "Crear ejemplos concretos y visuales que ilustren cómo se ven estos criterios en la práctica",
            "Establecer un proceso simple de revisión de calidad antes de finalizar entregas importantes"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Existen algunos criterios de calidad definidos, pero no son ampliamente conocidos ni utilizados de forma consistente. La aplicación de estos criterios depende más de la iniciativa de personas o áreas específicas que de un sistema organizacional.",
          comoInterpretarlo: "La organización ha dado el primer paso al definir algunos estándares de calidad, pero aún no ha logrado que se conviertan en parte de la cultura de trabajo. Existe una brecha entre lo definido y lo aplicado, lo que puede generar inconsistencias y frustración.",
          comoTeAcompanaIntegrate: "INTEGRATE propone dinámicas de apropiación y entrenamiento en el uso de criterios de calidad, ayudando a que pasen de ser documentos formales a herramientas prácticas que guían el trabajo diario.",
          oportunidadesDeMejora: [
            "Comunicar y explicar los criterios de calidad existentes de forma clara y accesible a todo el equipo",
            "Crear checklists o guías prácticas que faciliten la aplicación de los criterios en el día a día",
            "Incorporar la revisión de calidad en los procesos de trabajo, no solo al final sino durante la ejecución",
            "Establecer espacios de feedback donde se pueda reflexionar sobre cómo mejorar la aplicación de los criterios"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Los criterios de calidad están definidos, son conocidos por la mayoría del equipo y se utilizan con cierta frecuencia para orientar el trabajo y evaluar resultados. Sin embargo, su aplicación no es sistemática y puede variar según las áreas o proyectos.",
          comoInterpretarlo: "La organización ha logrado que los criterios de calidad sean parte del lenguaje común y se utilicen como referencia habitual. Existe una base sólida que puede fortalecerse para lograr mayor sistematicidad, mayor rigor en la evaluación y mayor impacto en la mejora continua.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de seguimiento y evaluación que ayudan a sistematizar el uso de criterios de calidad, identificar brechas y diseñar planes de mejora basados en evidencia.",
          oportunidadesDeMejora: [
            "Integrar los criterios de calidad en todos los procesos de planificación, ejecución y evaluación de proyectos",
            "Desarrollar indicadores específicos que permitan medir el cumplimiento de los criterios de forma objetiva",
            "Crear espacios de revisión por pares donde se evalúe la calidad del trabajo de forma constructiva",
            "Documentar buenas prácticas y lecciones aprendidas sobre cómo aplicar los criterios en diferentes contextos"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "Los criterios de calidad están claramente definidos, son ampliamente conocidos y se utilizan de forma sistemática en todos los procesos de trabajo. Existe una cultura de mejora continua donde la calidad es responsabilidad compartida y se evalúa de forma rigurosa y constructiva.",
          comoInterpretarlo: "La organización ha desarrollado una cultura de excelencia donde los criterios de calidad son parte integral de la forma de trabajar. La calidad no se percibe como un control externo, sino como un compromiso compartido que genera orgullo, aprendizaje y mejora continua.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución continua de los criterios de calidad, asegurando que se mantengan relevantes ante los cambios del entorno y que sigan siendo fuente de inspiración y guía para la excelencia.",
          oportunidadesDeMejora: [
            "Revisar y actualizar periódicamente los criterios de calidad para asegurar su relevancia y ambición",
            "Desarrollar sistemas de reconocimiento que celebren la excelencia y el compromiso con la calidad",
            "Compartir aprendizajes y buenas prácticas con otras organizaciones para contribuir al sector",
            "Explorar estándares de calidad externos (certificaciones, premios) que puedan enriquecer la práctica interna"
          ]
        }
      }
    },
    // SUB-ÁREA 3: Proyectos
    {
      id: 3,
      nombre: "Proyectos",
      pregunta: "¿Los proyectos reflejan nuestra visión y prioridades estratégicas, y se revisan periódicamente según los resultados?",
      definicion: "Los proyectos son la materialización de la estrategia en acciones concretas. Cuando están alineados con la visión y prioridades, y se revisan periódicamente según los resultados, se convierten en vehículos efectivos para generar el impacto deseado y aprender de forma continua.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "Los proyectos surgen de forma reactiva o por inercia, sin una conexión clara con la visión y prioridades estratégicas. No existe un proceso sistemático de revisión y ajuste basado en resultados, lo que dificulta el aprendizaje y la mejora continua.",
          comoInterpretarlo: "Este resultado indica que la organización está en modo 'apagar fuegos' o 'hacer por hacer', sin una dirección estratégica clara que oriente la selección y gestión de proyectos. Esto puede llevar a dispersión de esfuerzos, bajo impacto y frustración del equipo.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita procesos de planificación estratégica participativa que ayudan a definir prioridades claras y a diseñar proyectos alineados con la visión, asegurando que cada acción tenga un propósito y contribuya al impacto deseado.",
          oportunidadesDeMejora: [
            "Realizar un ejercicio de priorización estratégica para identificar qué proyectos son realmente clave",
            "Establecer criterios claros de selección de proyectos basados en la visión y prioridades organizacionales",
            "Crear un proceso simple de revisión trimestral de proyectos para evaluar avances y ajustar según resultados",
            "Desarrollar una cultura de 'decir no' a proyectos que no estén alineados con las prioridades estratégicas"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Existe cierta conexión entre los proyectos y la visión estratégica, pero no es sistemática ni explícita. Las revisiones de proyectos se realizan de forma ocasional y se centran más en el cumplimiento de actividades que en el análisis de resultados e impacto.",
          comoInterpretarlo: "La organización reconoce la importancia de alinear proyectos con la estrategia, pero aún no ha establecido procesos claros para asegurar esta alineación y para aprender de los resultados. Existe el riesgo de trabajar mucho sin generar el impacto esperado.",
          comoTeAcompanaIntegrate: "INTEGRATE propone metodologías de gestión de proyectos orientada a resultados, que ayudan a definir objetivos claros, establecer indicadores de seguimiento y crear espacios de reflexión y aprendizaje basados en evidencia.",
          oportunidadesDeMejora: [
            "Definir objetivos claros y medibles para cada proyecto, vinculados explícitamente a la visión y prioridades",
            "Establecer indicadores de seguimiento que permitan evaluar no solo actividades sino resultados e impacto",
            "Crear espacios regulares de revisión de proyectos donde se analicen resultados y se tomen decisiones de ajuste",
            "Desarrollar una cultura de aprendizaje donde los 'errores' se vean como oportunidades de mejora"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Los proyectos están generalmente alineados con la visión y prioridades estratégicas, y se revisan periódicamente. Sin embargo, la profundidad del análisis de resultados y la agilidad en los ajustes puede variar según los proyectos o áreas.",
          comoInterpretarlo: "La organización ha logrado establecer una conexión clara entre estrategia y acción, y ha institucionalizado procesos de seguimiento y revisión. Existe una base sólida que puede fortalecerse para lograr mayor rigor en el análisis, mayor agilidad en los ajustes y mayor impacto en el aprendizaje organizacional.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de evaluación participativa y aprendizaje organizacional que ayudan a profundizar en el análisis de resultados, identificar patrones y tendencias, y diseñar estrategias de mejora basadas en evidencia.",
          oportunidadesDeMejora: [
            "Desarrollar sistemas de seguimiento en tiempo real que permitan detectar desviaciones y ajustar ágilmente",
            "Incorporar metodologías de evaluación de impacto que vayan más allá de los resultados inmediatos",
            "Crear espacios de aprendizaje inter-proyectos donde se compartan lecciones y buenas prácticas",
            "Establecer procesos de cierre de proyectos que documenten aprendizajes y alimenten la planificación futura"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "Todos los proyectos están claramente alineados con la visión y prioridades estratégicas, y se revisan de forma sistemática y rigurosa basándose en resultados e impacto. Existe una cultura de aprendizaje continuo donde los proyectos se ajustan ágilmente y los aprendizajes se incorporan a la mejora organizacional.",
          comoInterpretarlo: "La organización ha desarrollado una capacidad estratégica madura donde la planificación, ejecución, evaluación y aprendizaje están integrados en un ciclo continuo. Los proyectos no solo generan resultados, sino que también generan conocimiento que fortalece la capacidad organizacional.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución hacia modelos de gestión adaptativa, donde la organización no solo ejecuta su estrategia, sino que la va ajustando de forma inteligente basándose en lo que aprende de sus proyectos y del entorno.",
          oportunidadesDeMejora: [
            "Explorar metodologías de gestión adaptativa que permitan ajustar la estrategia basándose en aprendizajes de proyectos",
            "Desarrollar sistemas de gestión del conocimiento que capturen y compartan aprendizajes de forma sistemática",
            "Crear espacios de innovación donde se experimenten nuevos enfoques y se aprendan de los resultados",
            "Convertirse en referente en gestión estratégica de proyectos orientada a resultados e impacto"
          ]
        }
      }
    }
  ]
};

// Contenido del Área 2: Estructura
export const CONTENIDO_ESTRUCTURA: AreaContenido = {
  area: "Estructura",
  rutaFormativa: "Liderar con Claridad",
  proposito: "Clarificar roles, procesos y liderazgos para favorecer la coherencia organizativa y la fluidez colectiva.",
  subAreas: [
    // SUB-ÁREA 4: Liderazgo
    {
      id: 4,
      nombre: "Liderazgo",
      pregunta: "¿Los liderazgos son visibles, coherentes y generan confianza en la toma de decisiones?",
      definicion: "Esta subárea muestra cómo se ejerce el liderazgo en la práctica. Habla de la claridad, la coherencia y la capacidad de inspirar confianza. Liderar con claridad implica orientar sin imponer, acompañar sin controlar y generar entornos donde las personas sepan hacia dónde van y por qué sus decisiones importan.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "El liderazgo es difuso o inconsistente. No está claro quién toma las decisiones ni bajo qué criterios. Las personas no saben a quién acudir ante dudas o conflictos, lo que genera confusión, desconfianza y parálisis en momentos críticos.",
          comoInterpretarlo: "Este resultado indica que la organización carece de referencias claras de liderazgo. Sin liderazgos visibles y coherentes, las decisiones se toman de forma reactiva o arbitraria, lo que erosiona la confianza y dificulta la coordinación. Es fundamental establecer quién lidera qué y cómo se toman las decisiones.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita procesos para clarificar estructuras de liderazgo, definir ámbitos de decisión y desarrollar capacidades de liderazgo distribuido que generen confianza y autonomía en el equipo.",
          oportunidadesDeMejora: [
            "Definir claramente quién ejerce liderazgo en cada ámbito de la organización y bajo qué criterios",
            "Establecer procesos transparentes de toma de decisiones que sean conocidos por todo el equipo",
            "Crear espacios de diálogo donde las personas puedan expresar dudas y recibir orientación de los liderazgos",
            "Desarrollar capacidades básicas de liderazgo en las personas que ocupan roles de coordinación o referencia"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Existen liderazgos identificados, pero su ejercicio no es consistente. Las decisiones se toman, pero no siempre se comunican con claridad ni se perciben como coherentes con los valores o prioridades organizacionales. La confianza en el liderazgo es frágil.",
          comoInterpretarlo: "La organización ha dado el primer paso al identificar liderazgos, pero aún no ha logrado que se ejerzan de forma coherente y confiable. Existe una brecha entre el rol formal y la práctica real, lo que puede generar desconfianza y resistencia.",
          comoTeAcompanaIntegrate: "INTEGRATE propone dinámicas de desarrollo de liderazgo que ayudan a alinear el ejercicio del liderazgo con los valores organizacionales, mejorar la comunicación de decisiones y fortalecer la confianza del equipo.",
          oportunidadesDeMejora: [
            "Establecer principios de liderazgo compartidos que orienten cómo se toman y comunican las decisiones",
            "Crear espacios regulares de rendición de cuentas donde los liderazgos expliquen sus decisiones y escuchen feedback",
            "Desarrollar habilidades de comunicación efectiva en las personas que ejercen liderazgo",
            "Implementar mecanismos de feedback 360° que permitan a los liderazgos conocer cómo se percibe su ejercicio"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Los liderazgos son visibles y generalmente coherentes. Las decisiones se toman con criterios claros y se comunican de forma adecuada. Sin embargo, la confianza en el liderazgo puede variar según las áreas o situaciones, y no siempre se fomenta la autonomía del equipo.",
          comoInterpretarlo: "La organización ha logrado establecer liderazgos que funcionan de forma razonablemente efectiva. Existe una base sólida que puede fortalecerse para lograr mayor coherencia, mayor capacidad de inspirar confianza y mayor desarrollo de liderazgo distribuido.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de desarrollo de liderazgo transformacional que ayudan a pasar de un liderazgo directivo a uno que empodera, inspira y desarrolla capacidades en el equipo.",
          oportunidadesDeMejora: [
            "Desarrollar un modelo de liderazgo distribuido donde más personas puedan ejercer liderazgo en sus ámbitos",
            "Fortalecer las habilidades de los liderazgos para empoderar al equipo y fomentar la autonomía",
            "Crear espacios de reflexión sobre el ejercicio del liderazgo y su impacto en la cultura organizacional",
            "Establecer procesos de mentoría donde liderazgos experimentados acompañen el desarrollo de nuevos liderazgos"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "Los liderazgos son visibles, coherentes y generan alta confianza. Las decisiones se toman con criterios claros, se comunican de forma transparente y se perciben como alineadas con los valores y prioridades. Existe un modelo de liderazgo distribuido donde múltiples personas ejercen liderazgo en sus ámbitos.",
          comoInterpretarlo: "La organización ha desarrollado una cultura de liderazgo madura donde el liderazgo no se concentra en pocas personas, sino que se distribuye de forma inteligente. Los liderazgos inspiran confianza, empoderan al equipo y generan entornos de alta autonomía y responsabilidad compartida.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución continua del modelo de liderazgo, asegurando que se mantenga relevante ante los cambios del entorno y que siga siendo fuente de inspiración, confianza y desarrollo para el equipo.",
          oportunidadesDeMejora: [
            "Documentar y compartir el modelo de liderazgo como referente para otras organizaciones",
            "Explorar modelos de liderazgo emergente y auto-organización que puedan enriquecer la práctica actual",
            "Crear programas de desarrollo de liderazgo que preparen a la organización para los desafíos futuros",
            "Establecer sistemas de reconocimiento que celebren el ejercicio de liderazgo coherente y empoderador"
          ]
        }
      }
    },
    // SUB-ÁREA 5: Roles
    {
      id: 5,
      nombre: "Roles",
      pregunta: "¿Cada persona comprende su rol y cómo contribuye al resultado global?",
      definicion: "Esta subárea examina la claridad con la que las personas entienden su función y su impacto en el conjunto. Un rol claro no se limita a una descripción de tareas: ayuda a coordinar, priorizar y colaborar de forma más fluida y autónoma.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "Los roles no están definidos o son muy ambiguos. Las personas no tienen claridad sobre sus responsabilidades ni sobre cómo su trabajo contribuye al resultado global. Esto genera duplicidades, vacíos, conflictos y frustración.",
          comoInterpretarlo: "Este resultado indica que la organización carece de una estructura clara de roles. Sin claridad sobre quién hace qué y por qué, es difícil coordinar esfuerzos, evitar duplicidades y asegurar que todas las tareas necesarias se realicen. Es fundamental definir roles claros como base para la coordinación efectiva.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita procesos participativos para co-crear descripciones de roles que sean claras, significativas y conectadas con el propósito organizacional, asegurando que cada persona entienda su contribución al conjunto.",
          oportunidadesDeMejora: [
            "Realizar un mapeo de roles actual para identificar duplicidades, vacíos y ambigüedades",
            "Definir roles básicos con responsabilidades claras y criterios de éxito para cada posición",
            "Crear descripciones de roles que conecten las tareas con el propósito y el impacto organizacional",
            "Establecer espacios de diálogo donde las personas puedan clarificar expectativas sobre sus roles"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Los roles están definidos de forma básica, pero las descripciones son genéricas o están desactualizadas. Las personas tienen cierta claridad sobre sus tareas, pero no siempre entienden cómo su trabajo se conecta con el resultado global ni cómo coordinar con otros roles.",
          comoInterpretarlo: "La organización ha dado el primer paso al definir roles, pero aún no ha logrado que sean herramientas efectivas para la coordinación y la autonomía. Existe una brecha entre la descripción formal y la práctica real, lo que puede generar confusión y falta de alineación.",
          comoTeAcompanaIntegrate: "INTEGRATE propone metodologías para enriquecer las descripciones de roles, haciéndolas más significativas y conectadas con el propósito, y para crear espacios de clarificación de interfaces entre roles.",
          oportunidadesDeMejora: [
            "Actualizar las descripciones de roles para que reflejen la realidad actual y las expectativas reales",
            "Incorporar en cada rol la conexión explícita con el propósito y los resultados organizacionales",
            "Crear mapas de interdependencias que muestren cómo los roles se relacionan y coordinan entre sí",
            "Establecer espacios regulares de clarificación de roles y expectativas entre personas que colaboran"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Los roles están claramente definidos y las personas comprenden sus responsabilidades y su contribución al resultado global. Sin embargo, la claridad puede variar según las áreas, y no siempre se revisan los roles cuando cambian las necesidades organizacionales.",
          comoInterpretarlo: "La organización ha logrado establecer una estructura de roles que funciona de forma efectiva. Existe una base sólida que puede fortalecerse para lograr mayor flexibilidad, mayor capacidad de adaptación y mayor desarrollo de las personas en sus roles.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de diseño organizacional que ayudan a revisar y ajustar roles de forma ágil según las necesidades cambiantes, y a desarrollar capacidades de las personas para evolucionar en sus roles.",
          oportunidadesDeMejora: [
            "Establecer procesos de revisión periódica de roles para asegurar que sigan siendo relevantes y efectivos",
            "Desarrollar planes de desarrollo individual que ayuden a las personas a crecer en sus roles",
            "Crear espacios de rotación o intercambio de roles que amplíen la comprensión del sistema organizacional",
            "Implementar sistemas de feedback continuo que permitan ajustar roles según la experiencia práctica"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "Los roles están claramente definidos, son ampliamente comprendidos y se revisan periódicamente. Cada persona entiende no solo sus responsabilidades, sino también cómo su trabajo contribuye al resultado global y cómo coordinar efectivamente con otros roles. Existe flexibilidad para ajustar roles según las necesidades.",
          comoInterpretarlo: "La organización ha desarrollado una estructura de roles madura que combina claridad con flexibilidad. Los roles no son camisas de fuerza, sino marcos que facilitan la coordinación, la autonomía y el desarrollo continuo de las personas.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución hacia modelos de roles dinámicos y adaptativos, donde la estructura se ajusta de forma inteligente a las necesidades cambiantes sin perder claridad ni coherencia.",
          oportunidadesDeMejora: [
            "Explorar modelos de roles fluidos donde las personas puedan asumir diferentes responsabilidades según el contexto",
            "Desarrollar sistemas de gestión del talento que aprovechen las fortalezas únicas de cada persona",
            "Crear comunidades de práctica donde personas en roles similares compartan aprendizajes y buenas prácticas",
            "Documentar y compartir el modelo de diseño de roles como referente para otras organizaciones"
          ]
        }
      }
    },
    // SUB-ÁREA 6: Procesos
    {
      id: 6,
      nombre: "Procesos",
      pregunta: "¿Los procesos de trabajo están documentados, actualizados y facilitan la coordinación entre áreas?",
      definicion: "Los procesos son la forma en que la organización convierte su conocimiento en acción. Documentarlos y revisarlos garantiza que las tareas se realicen de manera coherente, ágil y segura.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "Los procesos de trabajo no están documentados o son desconocidos por la mayoría del equipo. Cada persona o área trabaja según su propio criterio, lo que genera inconsistencias, ineficiencias y dificultades para coordinar entre áreas.",
          comoInterpretarlo: "Este resultado indica que la organización carece de procesos estandarizados. Sin procesos claros y compartidos, el conocimiento depende de personas específicas, es difícil mantener la calidad y la coordinación se vuelve caótica. Es fundamental documentar los procesos clave como base para la eficiencia y la mejora continua.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita procesos participativos para mapear, documentar y estandarizar los procesos de trabajo clave, asegurando que sean comprensibles, aplicables y mejorables de forma continua.",
          oportunidadesDeMejora: [
            "Identificar los procesos de trabajo más críticos que requieren documentación urgente",
            "Mapear los procesos actuales de forma participativa con las personas que los ejecutan",
            "Crear documentación básica y visual de los procesos clave (diagramas de flujo, checklists)",
            "Establecer un repositorio accesible donde se puedan consultar los procesos documentados"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Algunos procesos están documentados, pero la documentación está desactualizada, es poco accesible o no se utiliza en la práctica. Las personas conocen algunos procesos, pero no existe una cultura de seguimiento ni de mejora continua de los mismos.",
          comoInterpretarlo: "La organización ha dado el primer paso al documentar algunos procesos, pero aún no ha logrado que se conviertan en herramientas vivas y útiles para el trabajo diario. Existe una brecha entre lo documentado y lo practicado, lo que puede generar confusión y desperdicio de esfuerzos.",
          comoTeAcompanaIntegrate: "INTEGRATE propone metodologías para actualizar, simplificar y hacer accesibles los procesos documentados, y para crear una cultura de uso y mejora continua de los mismos.",
          oportunidadesDeMejora: [
            "Revisar y actualizar la documentación de procesos existente para que refleje la práctica actual",
            "Simplificar y hacer más visual la documentación para facilitar su comprensión y uso",
            "Crear espacios de formación donde se expliquen los procesos y se resuelvan dudas",
            "Establecer mecanismos para que las personas puedan proponer mejoras a los procesos documentados"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Los procesos de trabajo están documentados, son conocidos por la mayoría del equipo y se utilizan con cierta frecuencia. Sin embargo, la actualización de los procesos no es sistemática y la coordinación entre áreas puede mejorar.",
          comoInterpretarlo: "La organización ha logrado establecer procesos documentados que funcionan de forma razonablemente efectiva. Existe una base sólida que puede fortalecerse para lograr mayor agilidad en la actualización, mayor coordinación entre áreas y mayor capacidad de innovación en los procesos.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de gestión de procesos que ayudan a mantenerlos actualizados, a identificar cuellos de botella y a diseñar mejoras basadas en la experiencia del equipo y las mejores prácticas.",
          oportunidadesDeMejora: [
            "Establecer un proceso de revisión periódica de los procesos documentados para asegurar su vigencia",
            "Crear mapas de procesos inter-áreas que muestren cómo fluye el trabajo a través de la organización",
            "Implementar sistemas de medición de eficiencia de procesos para identificar oportunidades de mejora",
            "Desarrollar una cultura de innovación en procesos donde se experimenten nuevas formas de trabajar"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "Los procesos de trabajo están claramente documentados, actualizados y son ampliamente utilizados. Facilitan la coordinación entre áreas y se revisan periódicamente para incorporar mejoras. Existe una cultura de mejora continua de procesos.",
          comoInterpretarlo: "La organización ha desarrollado una capacidad madura de gestión de procesos donde la documentación es una herramienta viva que facilita la eficiencia, la calidad y la innovación. Los procesos no son rígidos, sino que se adaptan de forma inteligente a las necesidades cambiantes.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución hacia modelos de gestión de procesos ágiles y adaptativos, donde la organización puede ajustar sus formas de trabajar de manera rápida y efectiva ante los cambios del entorno.",
          oportunidadesDeMejora: [
            "Explorar metodologías de mejora continua (Lean, Six Sigma) que puedan enriquecer la gestión de procesos",
            "Desarrollar sistemas de automatización de procesos que liberen tiempo para trabajo de mayor valor",
            "Crear comunidades de práctica inter-organizacionales para compartir aprendizajes sobre gestión de procesos",
            "Documentar y compartir el modelo de gestión de procesos como referente para otras organizaciones"
          ]
        }
      }
    },
    // SUB-ÁREA 7: Riesgos
    {
      id: 7,
      nombre: "Riesgos",
      pregunta: "¿Disponemos de mecanismos que permiten anticipar y gestionar imprevistos de manera ágil y colaborativa?",
      definicion: "Esta subárea analiza la capacidad de la organización para prevenir, afrontar y aprender de los imprevistos. Gestionar riesgos no es solo reaccionar, sino anticipar escenarios y fortalecer la estabilidad del sistema.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "No existen mecanismos para identificar, evaluar o gestionar riesgos. La organización opera en modo reactivo, respondiendo a los imprevistos cuando ya se han materializado. Esto genera crisis recurrentes, estrés y pérdida de oportunidades.",
          comoInterpretarlo: "Este resultado indica que la organización carece de capacidad de anticipación y gestión de riesgos. Sin mecanismos para identificar y prevenir problemas potenciales, la organización está constantemente 'apagando fuegos', lo que agota al equipo y compromete la sostenibilidad.",
          comoTeAcompanaIntegrate: "INTEGRATE facilita procesos para identificar riesgos clave, evaluar su probabilidad e impacto, y diseñar estrategias de prevención y mitigación de forma participativa y práctica.",
          oportunidadesDeMejora: [
            "Realizar un primer ejercicio de identificación de riesgos clave que podrían afectar a la organización",
            "Crear un registro básico de riesgos con su probabilidad, impacto y posibles medidas de prevención",
            "Establecer responsables de monitorear los riesgos identificados y activar alertas tempranas",
            "Desarrollar planes de contingencia básicos para los riesgos más críticos"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Existen algunos mecanismos de gestión de riesgos, pero son informales, poco sistemáticos o se activan solo cuando los problemas ya están cerca de materializarse. La gestión de riesgos se percibe más como una carga que como una herramienta de prevención.",
          comoInterpretarlo: "La organización reconoce la importancia de gestionar riesgos, pero aún no ha establecido procesos proactivos y sistemáticos. La gestión de riesgos es reactiva y fragmentada, lo que limita su efectividad y genera una falsa sensación de control.",
          comoTeAcompanaIntegrate: "INTEGRATE propone metodologías para sistematizar la gestión de riesgos, haciéndola más proactiva, colaborativa y orientada al aprendizaje, de forma que se convierta en una práctica natural del equipo.",
          oportunidadesDeMejora: [
            "Establecer un proceso regular de revisión de riesgos (trimestral o semestral) con todo el equipo",
            "Crear herramientas simples (matrices de riesgo, semáforos) para evaluar y priorizar riesgos",
            "Desarrollar una cultura de comunicación abierta donde se puedan reportar señales de alerta sin temor",
            "Incorporar la gestión de riesgos en la planificación de proyectos y en las reuniones de seguimiento"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Existen mecanismos establecidos para identificar y gestionar riesgos. Se realizan evaluaciones periódicas y se toman medidas preventivas. Sin embargo, la gestión de riesgos puede ser más reactiva que proactiva, y no siempre se aprende de los imprevistos pasados.",
          comoInterpretarlo: "La organización ha logrado establecer procesos de gestión de riesgos que funcionan de forma razonablemente efectiva. Existe una base sólida que puede fortalecerse para lograr mayor capacidad de anticipación, mayor agilidad en la respuesta y mayor aprendizaje organizacional.",
          comoTeAcompanaIntegrate: "INTEGRATE ofrece herramientas de análisis de escenarios y planificación adaptativa que ayudan a anticipar riesgos emergentes, diseñar respuestas ágiles y convertir los imprevistos en oportunidades de aprendizaje.",
          oportunidadesDeMejora: [
            "Desarrollar capacidades de análisis de escenarios para anticipar riesgos emergentes y tendencias",
            "Crear sistemas de monitoreo continuo de indicadores de alerta temprana",
            "Establecer procesos de aprendizaje post-crisis donde se analicen los imprevistos y se extraigan lecciones",
            "Desarrollar planes de continuidad de negocio para asegurar la operación ante crisis mayores"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "La organización tiene mecanismos sistemáticos y ágiles para anticipar, evaluar y gestionar riesgos de forma colaborativa. Los imprevistos se afrontan con calma y se convierten en oportunidades de aprendizaje. Existe una cultura de prevención y resiliencia.",
          comoInterpretarlo: "La organización ha desarrollado una capacidad madura de gestión de riesgos donde la anticipación, la prevención y el aprendizaje están integrados en la forma de trabajar. Los riesgos no se perciben como amenazas paralizantes, sino como parte natural del entorno que se puede gestionar de forma inteligente.",
          comoTeAcompanaIntegrate: "INTEGRATE acompaña en la evolución hacia modelos de resiliencia organizacional, donde la organización no solo gestiona riesgos, sino que desarrolla capacidades para adaptarse y prosperar ante la incertidumbre y el cambio.",
          oportunidadesDeMejora: [
            "Explorar metodologías de resiliencia organizacional que fortalezcan la capacidad de adaptación",
            "Desarrollar sistemas de inteligencia estratégica que monitoreen tendencias y señales débiles del entorno",
            "Crear espacios de simulación y entrenamiento para preparar al equipo ante crisis potenciales",
            "Documentar y compartir el modelo de gestión de riesgos como referente para otras organizaciones"
          ]
        }
      }
    }
  ]
};

// ============================================
// ÁREA 3: ORIENTACIÓN A RESULTADOS
// ============================================

export const CONTENIDO_RESULTADOS: AreaContenido = {
  area: "Orientación a Resultados",
  rutaFormativa: "Del KPI al Impacto",
  proposito: "Convertir datos e indicadores en decisiones que generen mejora real, aprendizaje continuo y sentido compartido.",
  subAreas: [
    // SUB-ÁREA 8: COMPROMISO
    {
      id: 8,
      nombre: "Compromiso",
      pregunta: "¿Los resultados reflejan el grado de implicación y energía constructiva de los equipos?",
      definicion: "Esta subárea mide hasta qué punto las personas se sienten conectadas con el propósito y los objetivos comunes. El compromiso no se impone: se construye cuando las personas perciben que su trabajo tiene valor, que se les escucha y que los resultados reflejan su esfuerzo colectivo.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "La implicación de los equipos varía según el contexto o el proyecto. La conexión emocional con los objetivos generales aún está en desarrollo.",
          comoInterpretarlo: "La organización muestra voluntad, pero necesita reforzar el sentido compartido del trabajo. El compromiso crece cuando las personas comprenden el impacto de su aportación.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a visualizar cómo el propósito se traduce en objetivos tangibles, haciendo visible la contribución individual y colectiva.",
          oportunidadesDeMejora: [
            "Explicar de forma clara cómo cada tarea contribuye al propósito global",
            "Promover espacios de conversación sobre motivación y sentido",
            "Alinear la comunicación interna con los logros alcanzados"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Las personas muestran buena disposición, aunque la energía de compromiso fluctúa. Se percibe implicación, pero sin una conexión constante con los resultados.",
          comoInterpretarlo: "Este nivel refleja un compromiso latente que necesita renovarse con prácticas de reconocimiento y participación activa.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa el reconocimiento mutuo y la conexión entre logros, motivación y propósito, fortaleciendo el vínculo emocional con los resultados.",
          oportunidadesDeMejora: [
            "Crear momentos breves de reconocimiento en reuniones o proyectos",
            "Hacer visibles los avances colectivos y celebrar el progreso",
            "Incorporar espacios donde los equipos propongan mejoras"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Los equipos muestran una implicación sostenida. Los objetivos se alcanzan de forma regular y se perciben como relevantes.",
          comoInterpretarlo: "El compromiso se ha convertido en parte del día a día. Mantenerlo requiere cuidar la comunicación y la retroalimentación continua.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a conectar compromiso y bienestar, promoviendo entornos donde la implicación se mantenga con equilibrio y propósito.",
          oportunidadesDeMejora: [
            "Mantener la transparencia sobre resultados y decisiones",
            "Revisar las metas para asegurar que sigan siendo motivadoras",
            "Establecer indicadores de compromiso y participación"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "El compromiso forma parte de la cultura organizativa. Las personas actúan con entusiasmo, responsabilidad y orgullo de pertenencia.",
          comoInterpretarlo: "La organización funciona con coherencia interna y confianza colectiva. La motivación se retroalimenta del sentido y los resultados.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez ofreciendo herramientas para medir y mantener la conexión entre propósito, bienestar y productividad.",
          oportunidadesDeMejora: [
            "Documentar buenas prácticas de implicación colectiva",
            "Reforzar los programas de desarrollo vinculados al propósito",
            "Compartir historias de éxito que inspiren a otros equipos"
          ]
        }
      }
    },

    // SUB-ÁREA 9: POLÍTICAS Y PRÁCTICAS
    {
      id: 9,
      nombre: "Políticas y Prácticas",
      pregunta: "¿Las políticas y prácticas internas reflejan de forma coherente los valores y principios de la organización?",
      definicion: "Esta subárea analiza cómo las normas, protocolos y políticas de la organización se alinean con los valores que promueve. Las reglas son necesarias, pero su poder reside en expresar una cultura compartida más que en imponer comportamientos.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "Las políticas cumplen su función operativa, pero su vínculo con los valores no siempre es evidente.",
          comoInterpretarlo: "El sistema normativo asegura el funcionamiento, pero aún puede evolucionar hacia una cultura más participativa y basada en confianza.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a conectar políticas y cultura, promoviendo decisiones basadas en coherencia y sentido.",
          oportunidadesDeMejora: [
            "Revisar procedimientos clave con una mirada de valores",
            "Incluir a distintos perfiles en la actualización de políticas",
            "Comunicar los motivos y beneficios de cada norma"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Las políticas están bien definidas, pero su aplicación no siempre es uniforme. Las personas las cumplen, aunque a veces sin comprender plenamente su propósito.",
          comoInterpretarlo: "La estructura está consolidada, pero necesita más comunicación y participación para reforzar la confianza.",
          comoTeAcompanaIntegrate: "INTEGRATE fomenta la transparencia y el diálogo sobre el sentido de las normas, favoreciendo su comprensión y adhesión.",
          oportunidadesDeMejora: [
            "Explicar el \"por qué\" de las políticas durante su implementación",
            "Promover sesiones participativas de revisión",
            "Conectar cada política con el valor que busca proteger o potenciar"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Las políticas reflejan los valores y orientan la acción con coherencia. Las personas confían en su utilidad.",
          comoInterpretarlo: "Las prácticas institucionales generan credibilidad y estabilidad. La organización gestiona las normas como una forma de cuidado y coherencia.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida este punto reforzando la relación entre valores, procesos y decisiones.",
          oportunidadesDeMejora: [
            "Revisar periódicamente la vigencia de las políticas",
            "Documentar cómo han contribuido a mejorar la cultura interna",
            "Difundir casos de éxito donde las normas hayan fortalecido la confianza"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "Las políticas son coherentes con la cultura y promueven decisiones responsables.",
          comoInterpretarlo: "La organización ha transformado las normas en herramientas de coherencia y bienestar colectivo.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a mantener viva la conexión entre política y propósito, asegurando que las decisiones reflejen los valores fundamentales.",
          oportunidadesDeMejora: [
            "Integrar la revisión de políticas en la planificación estratégica",
            "Promover el intercambio entre áreas para detectar nuevas necesidades",
            "Comunicar las políticas como parte de la cultura organizativa"
          ]
        }
      }
    },


    // SUB-ÁREA 10: IMAGEN CORPORATIVA
    {
      id: 10,
      nombre: "Imagen Corporativa",
      pregunta: "¿La imagen que proyectamos al exterior refleja fielmente lo que somos y cómo actuamos internamente?",
      definicion: "Esta subárea explora la coherencia entre la identidad interna y la imagen externa. La reputación no se construye solo con comunicación: nace de la autenticidad con que la organización actúa, comunica y se relaciona con su entorno.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "El mensaje externo transmite intención, pero no siempre refleja la experiencia real de las personas dentro de la organización.",
          comoInterpretarlo: "Existe una brecha entre lo que se comunica y lo que se vive. La confianza requiere alinear palabra, acción y percepción.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a alinear narrativa y cultura, garantizando que lo que se proyecta fuera coincide con lo que se construye dentro.",
          oportunidadesDeMejora: [
            "Revisar los mensajes externos junto con los equipos internos",
            "Identificar incoherencias entre discurso y práctica",
            "Promover una comunicación más participativa y veraz"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "La comunicación externa es positiva, pero aún puede reforzar su conexión con la realidad organizativa.",
          comoInterpretarlo: "El relato corporativo tiene solidez, pero necesita nutrirse de historias reales y cotidianas.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa la coherencia comunicativa, integrando la voz de las personas en la narrativa institucional.",
          oportunidadesDeMejora: [
            "Incorporar testimonios y experiencias reales en la comunicación",
            "Fomentar la alineación entre comunicación interna y externa",
            "Promover la escucha activa sobre cómo se percibe la organización"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "La imagen externa coincide con la experiencia interna. Las personas reconocen la autenticidad del mensaje institucional.",
          comoInterpretarlo: "La transparencia se ha convertido en un valor organizativo. La comunicación es coherente y genera credibilidad.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza la coherencia entre cultura, comunicación y práctica diaria, favoreciendo la confianza mutua.",
          oportunidadesDeMejora: [
            "Medir la percepción del entorno sobre la cultura organizativa",
            "Revisar los canales de comunicación para asegurar consistencia",
            "Dar continuidad a la narrativa basada en hechos y aprendizajes"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "La identidad comunicada y la vivida están completamente alineadas. La marca transmite autenticidad, coherencia y orgullo colectivo.",
          comoInterpretarlo: "La organización proyecta confianza porque su cultura es visible y coherente. La comunicación se ha convertido en un reflejo fiel del propósito.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez impulsando la comunicación como herramienta de coherencia y sentido.",
          oportunidadesDeMejora: [
            "Seguir construyendo relatos de impacto humano y organizativo",
            "Ampliar la participación de los equipos en la comunicación externa",
            "Mantener la coherencia narrativa incluso en momentos de cambio"
          ]
        }
      }
    },

    // SUB-ÁREA 11: INDICADORES
    {
      id: 11,
      nombre: "Indicadores",
      pregunta: "¿Los indicadores se utilizan para aprender, mejorar y tomar decisiones de impacto sostenible?",
      definicion: "Esta subárea mide cómo la organización usa la información y los datos para evolucionar. Los indicadores son brújulas: sirven para orientar decisiones, no solo para evaluar resultados. Su valor reside en lo que inspiran a cambiar, no solo en lo que miden.",
      niveles: {
        critico: {
          rango: "1.0-1.49",
          queSeObserva: "Existen indicadores definidos, pero se usan principalmente para seguimiento y control.",
          comoInterpretarlo: "La medición se centra en el pasado, sin conexión con la mejora o el aprendizaje colectivo.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a transformar los datos en reflexión, conectando los indicadores con la toma de decisiones.",
          oportunidadesDeMejora: [
            "Revisar qué indicadores aportan información realmente útil",
            "Incorporar espacios de análisis colectivo de resultados",
            "Usar los datos como punto de partida para nuevas mejoras"
          ]
        },
        vulnerable: {
          rango: "1.5-2.49",
          queSeObserva: "Los datos se analizan con regularidad, pero la interpretación se limita a algunos niveles de la organización.",
          comoInterpretarlo: "La información existe, pero no fluye entre áreas. Compartirla favorece la transparencia y la coherencia.",
          comoTeAcompanaIntegrate: "INTEGRATE promueve la lectura transversal de los indicadores, transformándolos en motor de aprendizaje y conexión.",
          oportunidadesDeMejora: [
            "Crear espacios donde los equipos interpreten juntos los resultados",
            "Incorporar indicadores de mejora continua, no solo de rendimiento",
            "Fomentar la reflexión sobre el sentido de los datos"
          ]
        },
        estable: {
          rango: "2.5-3.49",
          queSeObserva: "Los indicadores guían las decisiones y se revisan de forma participativa.",
          comoInterpretarlo: "La organización mide para aprender, no solo para evaluar. Se percibe una cultura de análisis constructivo.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza la lectura sistémica de los datos, conectando los indicadores con propósito y resultados.",
          oportunidadesDeMejora: [
            "Revisar los indicadores estratégicos de forma colectiva",
            "Integrar indicadores de bienestar o clima organizativo",
            "Comunicar los aprendizajes derivados de la medición"
          ]
        },
        maduro: {
          rango: "3.5-4.0",
          queSeObserva: "La medición es parte natural del trabajo. Los indicadores se interpretan con mirada crítica y constructiva.",
          comoInterpretarlo: "La organización usa los datos para anticipar, aprender y mejorar. La cultura de la medición es madura y equilibrada.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta cultura promoviendo un sistema integral de indicadores (KPI, KHI, KLI, KFI, IMI) que combinan resultados, aprendizaje, bienestar e impacto.",
          oportunidadesDeMejora: [
            "Revisar la coherencia entre los diferentes tipos de indicadores",
            "Mantener espacios para traducir datos en acciones sostenibles",
            "Usar los resultados para inspirar innovación responsable"
          ]
        }
      }
    }
  ]
};

// ============================================================================
// ÁREA 4: EFICACIA - "Equipos de Alto Rendimiento"
// ============================================================================

export const CONTENIDO_EFICACIA: AreaContenido = {
  area: "Eficacia",
  rutaFormativa: "Equipos de Alto Rendimiento",
  proposito: "Potenciar la confianza, la innovación y la capacidad de resolver problemas para lograr resultados sostenibles.",
  subAreas: [
    // SUB-ÁREA 12: PRODUCTIVIDAD
    {
      id: 12,
      nombre: "Productividad",
      pregunta: "¿Los equipos logran sus objetivos de manera eficiente y sostenible, sin comprometer la calidad ni el bienestar?",
      definicion: "Esta subárea evalúa la capacidad de la organización para equilibrar resultados, bienestar y eficiencia. La productividad no consiste solo en hacer más, sino en hacerlo mejor, con claridad, ritmo adecuado y aprovechando los recursos disponibles sin desgaste innecesario.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "La carga de trabajo es alta y la planificación insuficiente. Las prioridades se definen sobre la marcha y el ritmo genera cansancio o frustración.",
          comoInterpretarlo: "La organización necesita establecer un marco más equilibrado entre esfuerzo, foco y resultados. La productividad mejora cuando se gestiona el tiempo con claridad y propósito.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a establecer estructuras de planificación ágiles que equilibran energía, tareas y resultados.",
          oportunidadesDeMejora: [
            "Clarificar prioridades de equipo semanalmente.",
            "Introducir herramientas colaborativas para organizar el trabajo.",
            "Promover pausas activas y espacios de revisión del ritmo laboral."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Se alcanzan los resultados, aunque con esfuerzo elevado y poca anticipación. La eficiencia depende del compromiso personal más que del sistema.",
          comoInterpretarlo: "La productividad está en fase de ajuste: los resultados se logran, pero requieren demasiada energía individual.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa una planificación consciente basada en ciclos cortos de mejora continua (PDCA), ayudando a priorizar sin saturar.",
          oportunidadesDeMejora: [
            "Revisar procesos para eliminar tareas repetitivas.",
            "Introducir métricas que midan carga real y eficiencia.",
            "Planificar reuniones más breves y enfocadas."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "Los equipos gestionan bien el tiempo y los objetivos. Las rutinas son claras y los recursos se aprovechan de forma eficiente.",
          comoInterpretarlo: "Existe una estructura funcional que favorece la productividad sostenible.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta estabilidad promoviendo análisis periódicos de desempeño para mantener el equilibrio entre resultados y bienestar.",
          oportunidadesDeMejora: [
            "Automatizar tareas recurrentes.",
            "Evaluar la productividad desde el impacto, no solo desde el volumen.",
            "Compartir aprendizajes sobre gestión eficaz del tiempo."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "La productividad es equilibrada, fluida y colaborativa. Los equipos alcanzan sus metas sin sobrecarga ni pérdida de calidad.",
          comoInterpretarlo: "La organización funciona con madurez operativa: combina eficacia, bienestar y propósito.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez impulsando sistemas de autoevaluación que garantizan sostenibilidad y coherencia.",
          oportunidadesDeMejora: [
            "Difundir las buenas prácticas de gestión productiva.",
            "Revisar los indicadores de eficacia desde una mirada integral.",
            "Mantener un seguimiento conjunto sobre carga y bienestar."
          ]
        }
      }
    },
    // SUB-ÁREA 13: INNOVACIÓN
    {
      id: 13,
      nombre: "Innovación",
      pregunta: "¿La organización promueve ideas nuevas y transforma el aprendizaje en soluciones prácticas?",
      definicion: "Esta subárea mide la capacidad del sistema para aprender, adaptarse y generar valor a través de la creatividad aplicada. Innovar no es solo crear algo nuevo, sino mejorar lo que ya existe con sentido, impacto y coherencia.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "Las ideas surgen de manera individual y sin un cauce para desarrollarlas. No existen mecanismos claros para compartir o aplicar innovaciones.",
          comoInterpretarlo: "La innovación depende del impulso personal, sin estructura que facilite su continuidad.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a crear entornos donde las ideas puedan recogerse, evaluarse y convertirse en mejoras reales.",
          oportunidadesDeMejora: [
            "Abrir espacios periódicos para proponer y prototipar ideas.",
            "Establecer un canal común de recogida de sugerencias.",
            "Reconocer públicamente las innovaciones implementadas."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Existen ideas y propuestas, pero la implementación es desigual. Falta tiempo o estructura para convertirlas en proyectos.",
          comoInterpretarlo: "La creatividad está presente, pero necesita canalizarse para generar impacto tangible.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa una cultura de aprendizaje experimental, donde el error se entiende como fuente de mejora.",
          oportunidadesDeMejora: [
            "Crear microproyectos piloto con seguimiento ágil.",
            "Fomentar la colaboración entre áreas en procesos de innovación.",
            "Incorporar métricas de aprendizaje y mejora."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "La innovación forma parte del trabajo habitual. Se analizan los resultados y se incorporan aprendizajes.",
          comoInterpretarlo: "El sistema innova de forma constante y consciente, conectando creatividad y utilidad.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza la innovación aplicada conectando las ideas con los objetivos estratégicos.",
          oportunidadesDeMejora: [
            "Compartir públicamente las innovaciones internas.",
            "Evaluar el impacto de las nuevas prácticas.",
            "Fomentar el trabajo transversal entre departamentos."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "La innovación es un hábito colectivo. Las personas experimentan, aprenden y mejoran de forma continua.",
          comoInterpretarlo: "La organización es creativa, flexible y coherente. La innovación surge del aprendizaje cotidiano.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez facilitando metodologías ágiles que convierten la innovación en parte estructural del sistema.",
          oportunidadesDeMejora: [
            "Integrar la innovación en la estrategia anual.",
            "Crear espacios de mentoría entre innovadores internos.",
            "Difundir casos de éxito que inspiren al conjunto."
          ]
        }
      }
    },
    // SUB-ÁREA 14: AGILIDAD
    {
      id: 14,
      nombre: "Agilidad",
      pregunta: "¿La organización responde con rapidez y coordinación ante los cambios y nuevas demandas?",
      definicion: "Esta subárea valora la capacidad de adaptación del sistema. Ser ágil no significa hacer las cosas deprisa, sino reaccionar con sentido, manteniendo la calidad, la claridad y la colaboración.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "Las respuestas a los cambios son lentas y reactivas. Las prioridades cambian sin coordinación.",
          comoInterpretarlo: "La organización necesita fortalecer su estructura de comunicación y priorización para responder con serenidad y orden.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a implantar dinámicas de revisión rápida y clara de decisiones, asegurando coherencia y ritmo adecuado.",
          oportunidadesDeMejora: [
            "Revisar la cadena de comunicación en momentos de cambio.",
            "Identificar cuellos de botella en la toma de decisiones.",
            "Establecer ciclos breves de planificación."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Se logra responder a los cambios, aunque con esfuerzo. Falta previsión y alineación transversal.",
          comoInterpretarlo: "La organización tiene capacidad de adaptación, pero aún reacciona más que anticipa.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa la anticipación mediante herramientas de lectura sistémica y trabajo colaborativo.",
          oportunidadesDeMejora: [
            "Crear espacios de revisión anticipada ante cambios recurrentes.",
            "Promover la toma de decisiones colaborativa.",
            "Analizar el impacto de los cambios y compartir aprendizajes."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "La organización responde de forma coordinada ante los cambios. Los equipos muestran flexibilidad y confianza.",
          comoInterpretarlo: "La agilidad está integrada en la práctica y favorece la estabilidad dinámica del sistema.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta flexibilidad conectando la agilidad con la planificación consciente y la mejora continua.",
          oportunidadesDeMejora: [
            "Mantener ciclos breves de revisión de procesos.",
            "Evaluar la eficacia de las respuestas a imprevistos.",
            "Formar equipos interdepartamentales de resolución ágil."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "La agilidad es parte natural del funcionamiento. Los equipos se anticipan y se reorganizan con fluidez ante nuevos retos.",
          comoInterpretarlo: "La organización aprende del cambio y lo convierte en motor de innovación.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez facilitando modelos ágiles de gestión compartida.",
          oportunidadesDeMejora: [
            "Analizar tendencias para anticipar escenarios futuros.",
            "Promover la agilidad también en los procesos estratégicos.",
            "Documentar buenas prácticas de adaptación y resiliencia."
          ]
        }
      }
    },
    // SUB-ÁREA 15: RESOLUCIÓN DE PROBLEMAS
    {
      id: 15,
      nombre: "Resolución de Problemas",
      pregunta: "¿La organización afronta los retos de manera constructiva, aprendiendo de las dificultades?",
      definicion: "Esta subárea explora cómo se gestionan los conflictos, errores o imprevistos. Resolver problemas no es solo solucionarlos: implica aprender de ellos y fortalecer la colaboración para evitar que se repitan.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "Los problemas se afrontan de manera puntual, con poca coordinación o análisis. Las soluciones dependen del contexto o la persona.",
          comoInterpretarlo: "La organización responde, pero sin aprendizaje estructurado. Falta espacio para analizar causas y consecuencias.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a convertir los errores en oportunidades de mejora, creando marcos seguros de revisión conjunta.",
          oportunidadesDeMejora: [
            "Crear reuniones breves para analizar problemas sin juicio.",
            "Documentar causas y soluciones aplicadas.",
            "Fomentar la comunicación interdepartamental ante incidencias."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Los equipos resuelven con compromiso, pero de manera reactiva. Se aprende de los errores, aunque sin sistematizar.",
          comoInterpretarlo: "El aprendizaje existe, pero no se consolida como práctica.",
          comoTeAcompanaIntegrate: "INTEGRATE promueve el uso de herramientas colaborativas que transforman los errores en aprendizaje colectivo.",
          oportunidadesDeMejora: [
            "Establecer protocolos simples para registrar aprendizajes.",
            "Analizar los problemas con mirada de sistema.",
            "Compartir soluciones entre equipos."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "Los problemas se abordan con serenidad y análisis. Se buscan soluciones conjuntas y se aprenden lecciones útiles.",
          comoInterpretarlo: "La cultura del aprendizaje está presente y favorece la confianza colectiva.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza la mirada sistémica del aprendizaje, conectando mejora, confianza y resultados.",
          oportunidadesDeMejora: [
            "Introducir reuniones de \"lecciones aprendidas\" tras proyectos.",
            "Revisar patrones recurrentes de dificultad.",
            "Reconocer públicamente la gestión constructiva de errores."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "Los equipos resuelven con agilidad y reflexión. Los problemas se convierten en aprendizaje compartido.",
          comoInterpretarlo: "La organización funciona con plasticidad: aprende de la experiencia y ajusta sus decisiones con coherencia.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez integrando la resolución de problemas como práctica formativa continua.",
          oportunidadesDeMejora: [
            "Documentar aprendizajes para el repositorio organizativo.",
            "Usar los retos como base de programas de mejora.",
            "Promover espacios de reflexión conjunta sobre errores y soluciones."
          ]
        }
      }
    }
  ]
};

// ============================================================================
// ÁREA 5: RECURSOS - "Activa tu Sistema Operativo"
// ============================================================================

export const CONTENIDO_RECURSOS: AreaContenido = {
  area: "Recursos",
  rutaFormativa: "Activa tu Sistema Operativo",
  proposito: "Optimizar el uso de herramientas, tiempo y conocimiento para potenciar la autonomía, la colaboración y la sostenibilidad del sistema organizativo.",
  subAreas: [
    // SUB-ÁREA 16: HERRAMIENTAS
    {
      id: 16,
      nombre: "Herramientas",
      pregunta: "¿Disponemos de las herramientas adecuadas y sabemos utilizarlas de forma eficiente y coherente con nuestros objetivos?",
      definicion: "Esta subárea analiza la capacidad de la organización para aprovechar sus recursos digitales y materiales de manera consciente y estratégica. No se trata solo de tener herramientas, sino de saber usarlas con sentido: elegir las adecuadas, compartir buenas prácticas y adaptarlas a las necesidades reales del trabajo. La madurez digital y operativa se refleja en la fluidez con que las personas integran la tecnología en sus procesos cotidianos.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "Se utilizan distintas herramientas sin un criterio común. Existen duplicidades, desactualización o falta de formación.",
          comoInterpretarlo: "La organización tiene recursos disponibles, pero su uso fragmentado limita la eficiencia. La diversidad tecnológica no genera todavía valor colectivo.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a identificar las herramientas clave, optimizar su uso y alinearlas con los objetivos estratégicos, reduciendo ruido y mejorando la productividad.",
          oportunidadesDeMejora: [
            "Realizar un inventario de herramientas y definir su propósito.",
            "Unificar criterios de uso para favorecer la coordinación.",
            "Diseñar formaciones breves y prácticas sobre herramientas clave."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Las herramientas se utilizan de forma activa, aunque sin coherencia plena entre equipos. Algunas prácticas eficaces no se comparten.",
          comoInterpretarlo: "La organización está en fase de transición digital y necesita mejorar la transferencia de conocimiento tecnológico.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa la adopción consciente de herramientas que facilitan la colaboración, evitando la sobrecarga tecnológica.",
          oportunidadesDeMejora: [
            "Promover la figura de referentes digitales por área.",
            "Documentar buenas prácticas de uso y gestión de recursos.",
            "Revisar licencias, accesos y duplicidades para optimizar costes."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "Las herramientas están bien seleccionadas y su uso es generalizado. Los equipos se apoyan en ellas de manera eficaz.",
          comoInterpretarlo: "La tecnología se ha convertido en soporte funcional y operativo, favoreciendo la coordinación.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta madurez impulsando la actualización tecnológica como parte de la cultura de aprendizaje.",
          oportunidadesDeMejora: [
            "Evaluar periódicamente la utilidad de las herramientas.",
            "Incluir la competencia digital en los planes de formación.",
            "Crear espacios para explorar nuevas aplicaciones o integraciones."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "Las herramientas se usan con naturalidad, eficiencia y propósito. Los equipos son autónomos en su gestión y aprendizaje digital.",
          comoInterpretarlo: "La tecnología actúa como un facilitador real de la colaboración, la innovación y la eficiencia.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez conectando herramientas, procesos y decisiones dentro de un sistema operativo coherente.",
          oportunidadesDeMejora: [
            "Difundir buenas prácticas internas de innovación digital.",
            "Anticipar necesidades futuras mediante evaluación tecnológica.",
            "Mantener un sistema de soporte y actualización continuo."
          ]
        }
      }
    },
    // SUB-ÁREA 17: CONOCIMIENTO
    {
      id: 17,
      nombre: "Conocimiento",
      pregunta: "¿Compartimos y aprovechamos el conocimiento interno para mejorar nuestros procesos y resultados?",
      definicion: "Esta subárea examina cómo circula el conocimiento dentro de la organización: cómo se genera, comparte y aprovecha para mejorar la práctica colectiva. Una organización madura aprende de su experiencia y evita repetir errores porque convierte lo aprendido en conocimiento útil. Compartir saberes fortalece la inteligencia colectiva y permite que el aprendizaje individual se transforme en capital organizativo.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "El conocimiento se acumula en personas o equipos concretos. La información no fluye entre áreas.",
          comoInterpretarlo: "La organización depende de la memoria individual, lo que dificulta la continuidad de los procesos y la mejora.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a crear espacios de transferencia de conocimiento, fomentando el aprendizaje entre iguales y la documentación estructurada.",
          oportunidadesDeMejora: [
            "Establecer canales comunes de documentación y aprendizaje.",
            "Promover sesiones breves de intercambio de experiencias.",
            "Registrar buenas prácticas y casos de éxito en repositorios accesibles."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Existen prácticas de comunicación interna, pero el conocimiento no siempre se traduce en aprendizaje compartido.",
          comoInterpretarlo: "La organización aprende, pero necesita sistematizarlo. Consolidar una memoria colectiva evita la pérdida de saberes clave.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa la gestión del conocimiento como eje de coherencia entre experiencia, innovación y resultados.",
          oportunidadesDeMejora: [
            "Crear rutinas de cierre de proyectos con revisión de aprendizajes.",
            "Designar referentes de conocimiento por área.",
            "Favorecer la mentoría entre perfiles sénior y júnior."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "El conocimiento circula de manera regular y se comparte en distintos espacios. Los equipos aprenden entre sí.",
          comoInterpretarlo: "La organización ha establecido una cultura de aprendizaje colaborativo.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza este modelo integrando la transferencia de conocimiento en la gestión estratégica.",
          oportunidadesDeMejora: [
            "Incorporar herramientas colaborativas de gestión del conocimiento.",
            "Crear comunidades de práctica internas.",
            "Evaluar cómo el aprendizaje impacta en la mejora de resultados."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "El conocimiento se gestiona de forma colectiva y abierta. La organización aprende, enseña y evoluciona de manera continua.",
          comoInterpretarlo: "La inteligencia organizativa se convierte en una ventaja sostenible.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez fortaleciendo la gobernanza del conocimiento y su conexión con la innovación.",
          oportunidadesDeMejora: [
            "Sistematizar la transferencia intergeneracional de conocimiento.",
            "Difundir aprendizajes más allá de la propia organización.",
            "Evaluar el retorno del conocimiento compartido en los resultados."
          ]
        }
      }
    },
    // SUB-ÁREA 18: COMUNICACIÓN INTERNA
    {
      id: 18,
      nombre: "Comunicación Interna",
      pregunta: "¿La comunicación fluye de manera clara, transversal y constructiva dentro de la organización?",
      definicion: "Esta subárea evalúa cómo circula la información y la calidad de los mensajes que se comparten. Una comunicación interna efectiva es clave para coordinar, alinear y generar confianza. No se trata solo de informar, sino de conectar: crear canales que inspiren, escuchen y permitan actuar con sentido común compartido.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "La comunicación es irregular o fragmentada. Se producen malentendidos o falta de alineación entre áreas.",
          comoInterpretarlo: "La información no llega siempre a quien la necesita, lo que genera esfuerzo adicional y pérdida de confianza.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a visualizar los flujos de comunicación y a diseñar canales eficientes y claros.",
          oportunidadesDeMejora: [
            "Revisar los canales actuales y su utilidad real.",
            "Simplificar mensajes y establecer pautas comunes de comunicación.",
            "Promover reuniones breves de alineación semanal."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Existen canales definidos, pero su uso no siempre es coherente. Se percibe voluntad de mejorar la escucha y la coordinación.",
          comoInterpretarlo: "La comunicación está presente, pero necesita consolidarse como práctica estructural.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa una comunicación organizativa basada en claridad, respeto y participación activa.",
          oportunidadesDeMejora: [
            "Fomentar reuniones de retroalimentación entre niveles.",
            "Formar en habilidades de comunicación efectiva.",
            "Incorporar herramientas colaborativas que integren la información."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "La información fluye con regularidad y los mensajes son claros. Los equipos se coordinan con confianza.",
          comoInterpretarlo: "La comunicación se ha convertido en soporte de cohesión y eficiencia.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta coherencia promoviendo rutinas de comunicación estructurada y espacios de escucha activa.",
          oportunidadesDeMejora: [
            "Mantener revisiones periódicas de canales y mensajes.",
            "Promover la transparencia en decisiones y resultados.",
            "Difundir buenas prácticas comunicativas entre áreas."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "La comunicación es fluida, bidireccional y participativa. Las personas se sienten informadas y escuchadas.",
          comoInterpretarlo: "La organización comunica con sentido: une, inspira y orienta.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez impulsando la comunicación como eje de coherencia cultural.",
          oportunidadesDeMejora: [
            "Usar la comunicación interna como vehículo de reconocimiento.",
            "Evaluar la satisfacción con los canales existentes.",
            "Seguir promoviendo una cultura de diálogo y transparencia."
          ]
        }
      }
    },
    // SUB-ÁREA 19: ENTORNO FÍSICO Y DIGITAL
    {
      id: 19,
      nombre: "Entorno Físico y Digital",
      pregunta: "¿Los espacios físicos y digitales facilitan el bienestar, la colaboración y el aprendizaje?",
      definicion: "Esta subárea valora cómo los entornos —oficinas, plataformas digitales y herramientas colaborativas— influyen en la eficiencia y el bienestar de las personas. Un entorno bien diseñado facilita la atención, el intercambio de ideas y el equilibrio entre concentración y conexión. La calidad del entorno es un reflejo de la cultura de cuidado y coherencia del sistema.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "Los espacios no están adaptados a las necesidades actuales. Falta accesibilidad, orden o ergonomía digital.",
          comoInterpretarlo: "El entorno genera fricción y reduce la eficacia. La mejora del contexto físico y digital es clave para el bienestar cognitivo.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a identificar mejoras en los espacios de trabajo para favorecer la atención y la colaboración.",
          oportunidadesDeMejora: [
            "Evaluar las condiciones de trabajo y confort.",
            "Reorganizar los espacios según el tipo de tarea.",
            "Promover pausas y hábitos saludables en entornos digitales."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Existen entornos adecuados, aunque no siempre se aprovechan de forma óptima.",
          comoInterpretarlo: "La infraestructura está disponible, pero requiere ajustes y hábitos que favorezcan la concentración y la colaboración.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa la coherencia entre entorno, propósito y bienestar, fomentando hábitos sostenibles.",
          oportunidadesDeMejora: [
            "Revisar la organización del espacio y el uso de salas comunes.",
            "Fomentar rutinas de desconexión digital saludable.",
            "Formar en ergonomía y gestión de la atención."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "Los entornos son funcionales, cómodos y favorecen la colaboración.",
          comoInterpretarlo: "El contexto físico y digital está alineado con la cultura del bienestar y la eficiencia.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza la conexión entre entorno y rendimiento, impulsando el bienestar como parte estructural del trabajo.",
          oportunidadesDeMejora: [
            "Incorporar criterios de sostenibilidad en el diseño de espacios.",
            "Evaluar la percepción del entorno entre equipos.",
            "Integrar espacios de creatividad y pausa consciente."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "Los espacios y entornos digitales son dinámicos, accesibles y coherentes con la identidad organizativa.",
          comoInterpretarlo: "La organización ha integrado el bienestar ambiental y digital como valor estratégico.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez conectando entorno, salud cognitiva y coherencia cultural.",
          oportunidadesDeMejora: [
            "Compartir buenas prácticas en ergonomía y sostenibilidad.",
            "Actualizar los espacios según nuevas formas de trabajo.",
            "Reforzar el vínculo entre entorno y propósito organizativo."
          ]
        }
      }
    }
  ]
};

// ============================================================================
// ÁREA 6: PERSONAS - "Talento, Emoción y Desarrollo"
// ============================================================================

export const CONTENIDO_PERSONAS: AreaContenido = {
  area: "Personas",
  rutaFormativa: "Talento, Emoción y Desarrollo",
  proposito: "Cuidar el crecimiento, la motivación y la coherencia entre bienestar, propósito y rendimiento para construir organizaciones sostenibles.",
  subAreas: [
    // SUB-ÁREA 20: DESARROLLO PROFESIONAL
    {
      id: 20,
      nombre: "Desarrollo Profesional",
      pregunta: "¿La organización ofrece oportunidades reales de aprendizaje y crecimiento que respondan a las necesidades de las personas y a los retos del entorno?",
      definicion: "Esta subárea explora cómo se impulsa el aprendizaje continuo dentro de la organización. Desarrollar talento no es solo formar, sino acompañar: crear entornos donde las personas puedan crecer, experimentar y aplicar lo que aprenden. La evolución profesional se mide tanto por las competencias adquiridas como por la capacidad de adaptarse, aportar valor y mantener la motivación.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "La formación se ofrece de manera puntual o reactiva, sin conexión clara con los objetivos o el desarrollo individual.",
          comoInterpretarlo: "La organización responde a necesidades inmediatas, pero aún no articula una estrategia sostenida de crecimiento profesional.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a diseñar itinerarios formativos alineados con propósito, competencias y resultados, conectando la formación con el desarrollo real.",
          oportunidadesDeMejora: [
            "Detectar necesidades formativas desde conversaciones individuales.",
            "Definir una estrategia de aprendizaje continuo adaptada al contexto.",
            "Fomentar el aprendizaje entre iguales como parte del día a día."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Existen iniciativas formativas regulares, pero su impacto no siempre se mide ni se traduce en nuevas prácticas.",
          comoInterpretarlo: "La formación tiene buena intención, pero necesita un enfoque más práctico y evaluativo.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa una cultura de aprendizaje orientada a la aplicación y la transferencia de lo aprendido.",
          oportunidadesDeMejora: [
            "Evaluar el impacto de la formación en el desempeño real.",
            "Crear espacios de práctica y reflexión posterior.",
            "Incorporar objetivos de aprendizaje en los planes de desarrollo."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "El aprendizaje está integrado en la rutina organizativa. Las personas se forman y aplican lo aprendido en su puesto.",
          comoInterpretarlo: "La organización aprende de forma estructurada y muestra coherencia entre aprendizaje y desempeño.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta estabilidad creando sistemas de medición del progreso y conexión con los retos estratégicos.",
          oportunidadesDeMejora: [
            "Consolidar programas de mentoring o acompañamiento interno.",
            "Promover la autoevaluación del desarrollo profesional.",
            "Vincular la formación con indicadores de impacto y bienestar."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "El desarrollo profesional es continuo, intencional y compartido. Las personas se sienten acompañadas en su evolución.",
          comoInterpretarlo: "La organización ha construido una cultura de aprendizaje vivo y sostenible.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez conectando aprendizaje, propósito y valor organizativo.",
          oportunidadesDeMejora: [
            "Documentar itinerarios formativos ejemplares.",
            "Difundir aprendizajes y buenas prácticas entre equipos.",
            "Reforzar la conexión entre desarrollo profesional y sentido de pertenencia."
          ]
        }
      }
    },
    // SUB-ÁREA 21: BIENESTAR Y EQUILIBRIO
    {
      id: 21,
      nombre: "Bienestar y Equilibrio",
      pregunta: "¿El entorno laboral favorece el bienestar físico, emocional y cognitivo de las personas?",
      definicion: "Esta subárea mide hasta qué punto la organización cuida las condiciones que permiten trabajar con salud, atención y equilibrio. El bienestar no se limita a evitar el malestar, sino que consiste en crear un entorno donde las personas puedan rendir bien, sentirse valoradas y mantener un equilibrio sano entre esfuerzo y descanso.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "Se percibe cansancio general o estrés sostenido. El ritmo de trabajo genera tensión y falta de desconexión.",
          comoInterpretarlo: "El bienestar necesita pasar a ser una prioridad estructural. Cuidar la salud cognitiva y emocional mejora la sostenibilidad de los resultados.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a incorporar el bienestar en la gestión, equilibrando carga, ritmo y atención.",
          oportunidadesDeMejora: [
            "Evaluar la carga de trabajo y ajustar tiempos y objetivos.",
            "Introducir rutinas de pausa activa o espacios de recuperación.",
            "Promover conversaciones sobre bienestar en los equipos."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Se valora el bienestar, pero las acciones dependen de la iniciativa individual o de momentos puntuales.",
          comoInterpretarlo: "Existe conciencia, pero falta un enfoque sistémico que asegure continuidad.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa el bienestar organizativo como parte del rendimiento sostenible.",
          oportunidadesDeMejora: [
            "Crear planes de bienestar con indicadores de seguimiento.",
            "Formar en gestión emocional y de la atención.",
            "Fomentar la desconexión digital responsable."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "La organización promueve la conciliación y dispone de medidas preventivas de estrés.",
          comoInterpretarlo: "El bienestar está integrado en la gestión, y las personas lo perciben como parte de la cultura.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta coherencia vinculando bienestar, propósito y productividad equilibrada.",
          oportunidadesDeMejora: [
            "Evaluar la efectividad de las acciones de bienestar.",
            "Promover hábitos sostenibles de trabajo y descanso.",
            "Compartir testimonios de buenas prácticas de autocuidado."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "El bienestar forma parte natural de la cultura. Las personas trabajan con energía serena y clima positivo.",
          comoInterpretarlo: "La organización ha integrado el bienestar como valor central de su sistema operativo.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez conectando bienestar, salud cognitiva y coherencia organizativa.",
          oportunidadesDeMejora: [
            "Documentar políticas de bienestar para su continuidad.",
            "Reforzar la formación preventiva y la atención plena.",
            "Mantener espacios de escucha y acompañamiento emocional."
          ]
        }
      }
    },
    // SUB-ÁREA 22: RECONOCIMIENTO Y VALOR
    {
      id: 22,
      nombre: "Reconocimiento y Valor",
      pregunta: "¿Las personas sienten que su trabajo es valorado y que sus aportaciones generan impacto real?",
      definicion: "Esta subárea examina cómo la organización reconoce los logros, esfuerzos y contribuciones de las personas. Sentirse valorado es esencial para la motivación y la pertenencia. El reconocimiento efectivo no se limita a premios o incentivos, sino que se expresa en el feedback, la confianza y la visibilidad del trabajo bien hecho.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "El esfuerzo de las personas pasa desapercibido. Se reconoce el resultado, pero no el proceso ni la mejora.",
          comoInterpretarlo: "El reconocimiento necesita sistematizarse y ampliarse para fortalecer la motivación interna.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a construir una cultura de aprecio y feedback positivo, reforzando el sentido de pertenencia.",
          oportunidadesDeMejora: [
            "Introducir rutinas breves de reconocimiento en reuniones.",
            "Hacer visible el progreso y la mejora continua.",
            "Fomentar mensajes de agradecimiento entre iguales."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Existen gestos de reconocimiento, pero dependen del estilo de liderazgo o del contexto.",
          comoInterpretarlo: "El valor se percibe, aunque necesita mayor visibilidad y coherencia.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa sistemas de reconocimiento basados en coherencia y contribución colectiva.",
          oportunidadesDeMejora: [
            "Crear un calendario regular de reconocimiento.",
            "Incorporar indicadores de impacto humano en las evaluaciones.",
            "Promover espacios de agradecimiento interdepartamental."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "El reconocimiento está integrado en la práctica directiva y se percibe en el clima organizativo.",
          comoInterpretarlo: "Las personas sienten que su trabajo tiene impacto y que su esfuerzo se valora.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta práctica impulsando la coherencia entre reconocimiento, desarrollo y cultura de confianza.",
          oportunidadesDeMejora: [
            "Diversificar las formas de reconocimiento (individual, grupal, simbólico).",
            "Evaluar su efecto en la motivación y el clima.",
            "Promover la cultura del agradecimiento transversal."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "El reconocimiento es espontáneo, constante y coherente con los valores.",
          comoInterpretarlo: "La organización ha integrado la gratitud y el aprecio como parte de su identidad.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez reforzando el vínculo entre reconocimiento, propósito y aprendizaje organizativo.",
          oportunidadesDeMejora: [
            "Difundir historias de éxito que inspiren orgullo colectivo.",
            "Mantener la coherencia entre logros, valores y recompensas.",
            "Cuidar el reconocimiento en momentos de cambio o dificultad."
          ]
        }
      }
    },
    // SUB-ÁREA 23: SALARIO EMOCIONAL
    {
      id: 23,
      nombre: "Salario Emocional",
      pregunta: "¿La organización ofrece experiencias y condiciones que generan satisfacción, orgullo y sentido de pertenencia más allá del salario económico?",
      definicion: "Esta subárea valora los factores intangibles que hacen que las personas elijan permanecer y comprometerse con la organización: el clima, la flexibilidad, la autonomía, el crecimiento y la sensación de contribuir a algo con propósito. El salario emocional refleja la capacidad de la organización para generar bienestar, equilibrio y sentido en el trabajo.",
      niveles: {
        critico: {
          rango: "1.0 – 1.49",
          queSeObserva: "Las personas perciben un entorno exigente, con escasos espacios de reconocimiento, flexibilidad o crecimiento.",
          comoInterpretarlo: "La organización necesita reequilibrar la relación entre exigencia y satisfacción para sostener la motivación.",
          comoTeAcompanaIntegrate: "INTEGRATE ayuda a identificar los factores que influyen en el bienestar emocional y la fidelización del talento.",
          oportunidadesDeMejora: [
            "Revisar las condiciones de flexibilidad y conciliación.",
            "Promover espacios de participación y autonomía.",
            "Evaluar la percepción de satisfacción y pertenencia."
          ]
        },
        vulnerable: {
          rango: "1.5 – 2.49",
          queSeObserva: "Se perciben gestos de cuidado y medidas de conciliación, pero sin coherencia entre áreas.",
          comoInterpretarlo: "El compromiso emocional está en proceso de fortalecimiento.",
          comoTeAcompanaIntegrate: "INTEGRATE impulsa políticas que equilibren exigencia, bienestar y sentido colectivo.",
          oportunidadesDeMejora: [
            "Diseñar acciones de bienestar adaptadas a distintos perfiles.",
            "Promover el reconocimiento emocional del esfuerzo.",
            "Escuchar activamente las necesidades del personal."
          ]
        },
        estable: {
          rango: "2.5 – 3.49",
          queSeObserva: "El ambiente es positivo, colaborativo y flexible. Las personas valoran el clima y las oportunidades de participación.",
          comoInterpretarlo: "El salario emocional se ha convertido en un factor de fidelización y motivación real.",
          comoTeAcompanaIntegrate: "INTEGRATE refuerza esta coherencia conectando bienestar emocional y rendimiento sostenible.",
          oportunidadesDeMejora: [
            "Mantener programas de bienestar adaptativos.",
            "Medir el nivel de satisfacción de forma periódica.",
            "Promover la cohesión entre bienestar individual y propósito común."
          ]
        },
        maduro: {
          rango: "3.5 – 4.0",
          queSeObserva: "La organización cuida integralmente a las personas y promueve relaciones basadas en confianza y orgullo compartido.",
          comoInterpretarlo: "El salario emocional está completamente integrado en la cultura. Las personas se sienten valoradas y comprometidas.",
          comoTeAcompanaIntegrate: "INTEGRATE consolida esta madurez fortaleciendo la conexión entre bienestar, propósito y sentido organizativo.",
          oportunidadesDeMejora: [
            "Documentar y comunicar las buenas prácticas de bienestar.",
            "Mantener la escucha activa ante nuevas necesidades.",
            "Incorporar la dimensión emocional en la planificación estratégica."
          ]
        }
      }
    }
  ]
};
