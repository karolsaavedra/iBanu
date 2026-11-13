# iBanú

Chatbot inteligente de apoyo académico para estudiantes de Ingeniería de Sistemas de la Universidad Autónoma de Bucaramanga (UNAB).

## Objetivo

Desarrollar un asistente conversacional que permita consultar información académica, resolver dudas sobre el programa y ofrecer orientación personalizada mediante inteligencia artificial y recuperación aumentada de información (RAG).

## Funcionalidades principales

- Consulta del plan de estudios y asignaturas.
- Información sobre materias, créditos y prerrequisitos.
- Consulta de notas y promedios mediante datos sintéticos.
- Identificación de materias pendientes.
- Proyección de semestres y recomendaciones académicas.
- Consulta de reglamentos, prácticas y preguntas frecuentes.
- Integración de inteligencia artificial mediante API.
- Recuperación de información mediante RAG.
- Aplicación móvil para Android.

## Tecnologías previstas

- React Native y Expo.
- Python.
- n8n.
- PostgreSQL y Supabase.
- pgvector.
- Gemini API.
- Azure Virtual Machines.
- Git y GitHub.

## Arquitectura

La solución contempla una aplicación móvil, servicios de automatización con n8n, una base de datos PostgreSQL, un sistema RAG para consultar documentos académicos y un modelo de inteligencia artificial para generar respuestas.

## Estructura del repositorio

- `mobile/`: aplicación móvil.
- `database/`: scripts y migraciones de base de datos.
- `backend/`: servicios y API.
- `n8n/`: workflows de automatización.
- `rag/`: documentos y scripts de recuperación de información.
- `scraping/`: extracción de información institucional.
- `infrastructure/`: configuración de infraestructura.
- `docs/`: documentación técnica.
- `screenshots/`: evidencias del desarrollo.

## Consideraciones sobre los datos

Los datos personales, académicos, notas y matrículas utilizados para las pruebas serán sintéticos. La información institucional deberá verificarse con fuentes oficiales de la UNAB.

## Estado del proyecto

- [x] Creación del repositorio.
- [x] Estructura inicial de carpetas.
- [x] Configuración inicial de `.gitignore`.
- [x] Documentación inicial.
- [ ] Diseño de base de datos.
- [ ] Configuración de Supabase y pgvector.
- [ ] Implementación de RAG.
- [ ] Automatizaciones con n8n.
- [ ] Desarrollo del backend.
- [ ] Desarrollo de la aplicación móvil.
- [ ] Pruebas y documentación final.

## Ejecución

Las instrucciones de instalación y ejecución se documentarán a medida que se implementen los componentes.

## Autoría

Proyecto académico desarrollado para Ingeniería de Sistemas.
