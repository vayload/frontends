# Vayload CMS

## ¿Qué es Vayload?

Vayload es un **CMS/CRM headless extensible** construido en Go con arquitectura de microkernel, diseñado para funcionar eficientemente en servidores pequeños sin sacrificar funcionalidad. Soporta casos de uso como e-commerce, blogs y portales de noticias.

### Estado del proyecto

**🚧 Alpha (Febrero 2025)**: Lanzamiento a finales de febrero  
**✅ Estable (Marzo 2025)**: Versión estable en un mes adicional

**Advertencia actual**: El proyecto está en desarrollo activo. Muchas partes pueden estar rotas o faltar tests. Por ahora, **está limitado a desarrolladores** que quieran probar el producto y puedan:

- Reportar errores encontrados
- Enviar recomendaciones
- Contribuir con feedback técnico

---

## ¿Por qué Vayload?

### El problema que resolvemos

Durante años trabajé con WordPress creando plugins. Cada vez que necesitaba algo específico, tenía que hackear el núcleo del CMS. Muchas veces lo usaba solo como headless, lo que dejaba mucho código muerto, ya que WordPress fue construido pensando en tener frontend y backend en una única base de código.

Posteriormente probé Sanity CMS y Strapi, que me gustaron por enfocarse en ser únicamente la fuente de datos/administrador. Sin embargo, el ecosistema JavaScript presentaba un problema: **Strapi era demasiado pesado** para mi VPS de $4 al mes. Tanto WordPress como Strapi devoraban RAM y CPU.

### La búsqueda de alternativas

Busqué algo en el ecosistema Go y solo encontré proyectos abandonados o hobbies. Como ya tenía experiencia trabajando con Go y apreciaba su robustez para servicios web, decidí probarlo. También evalué Rust con Actix Web - aunque Rust consume menos recursos por ser un lenguaje de sistemas (de hecho, el backend del repositorio de plugins de Vayload está programado en Rust y es código cerrado), finalmente opté por Go.

### El caso de uso real

Una amiga me pidió un administrador para su mini tienda. No quería instalarle WordPress o Strapi en un servidor de $4 porque su negocio era pequeño y no podía pagar mucho dinero. Así nació Vayload: **un CMS que funciona tanto para e-commerce, noticias y blogs**, optimizado para servidores pequeños.

Aunque los blogs están siendo menos usados con la llegada de la IA, las tiendas virtuales - y sus administradores - se usarán por años.

---

## Filosofía del proyecto

### La IA como asistente, no como autor

En Vayload creemos firmemente que **los humanos deben escribir el contenido**. La inteligencia artificial está aquí para asistir, no para reemplazar:

- ✓ Verificar errores tipográficos
- ✓ Resumir contenido existente
- ✓ Proporcionar contexto
- ✗ Ser el autor principal del contenido

---

## Características principales

### Base de datos flexible

Vayload soporta múltiples motores SQL según las necesidades del proyecto:

- **SQLite**: Para proyectos pequeños o medianos
- **MySQL/PostgreSQL**: Para elevar el nivel de tu proyecto

### Sistema de migraciones en Lua

Contamos con un sistema de migraciones que abstrae cada driver y permite optimizaciones específicas:

```lua
ifEngine(driver: string, fn: Function)
```

Esta función ejecuta código específico para cada motor de base de datos. **Usar con precaución**: puede introducir SQL injection si no se maneja correctamente.

---

## Arquitectura

### Backend: Go

El backend está desarrollado en **Go** por varias razones estratégicas:

- ✅ Despliegue en servidores minúsculos
- ✅ Soporta gran cantidad de peticiones con mínimo uso de recursos
- ✅ Goroutines para tareas paralelas y procesamiento en background

### Arquitectura: Microkernel de dos niveles

#### Nivel 1: Kernel

Gestiona los componentes fundamentales:

- **Dependency Injection (DI)**
- **Event Bus**
- **Job Queue**
- **Lua VM**
- **Orquestador de plugins**

#### Nivel 2: Servicios

Se registran en el kernel y pueden interoperar entre ellos. La idea es que se pueda agregar otro servicio e incrustarlo de forma sencilla. La API es muy sencilla y está detallada en la documentación.

**Nota**: Aún no es estable, por lo que podría estar sujeta a cambios hasta alcanzar estabilidad.

#### Nivel 3: Plugins (Lua)

Extienden la funcionalidad del CMS. La API está documentada en la página de Vayload Plug para developers. Vayload también creará plugins necesarios que tal vez no sean prioritarios al principio o a largo plazo.

**Seguridad**: Los plugins corren en modo **sandbox**, por lo que si son vulnerables, no pueden comprometer el sistema. Están limitados a lo que el kernel les pueda ofrecer como host.

### Flujo de comunicación

Los componentes se comunican **de arriba hacia abajo**:

```
Request
  → Middlewares/Guards
  → Kernel
  → Router por transporte (HTTP, gRPC, MCP)
  → Handlers
  → Services
  → Plugins (si es necesario)
```

**Limitación actual**: Los plugins solo llegan a nivel de kernel, no a nivel de petición. No podemos interceptar la request para modificar algo o hacer una acción en base a ella.

**Capacidades actuales de plugins**:

- Registrar rutas en HTTP, gRPC y MCP
- **Nota**: gRPC y MCP están desactivados por defecto - debes activarlos manualmente

---

## ¿Por qué Lua en vez de JavaScript?

### Rendimiento

**QuickJS es más lento que LuaJIT** o Lua bytecode. Por eso escogimos Lua como motor principal de scripting.

### Futuro de JavaScript en Vayload

Si en el futuro podemos integrar QuickJS (el motor más pequeño de JavaScript), lo haremos como **opt-in para desarrolladores de JS**. Actualmente no hay un binding maduro para Go, y crear uno no sería trivial.

**Limitaciones futuras**: Aunque se integre QuickJS, tendrá limitaciones porque no es V8. Go le prestará operaciones I/O como host de manera controlada, igual que ahora con Lua.

---

## Arquitectura de base de datos

### Tablas principales (mínimas)

- `roles`
- `usuarios`
- `collections` (content types)
- `sesiones`
- `file_objects`

### Collections dinámicas: Enfoque EAV con tipos

Para las collections dinámicas optamos por **Entity-Attribute-Value (EAV)**, pero con tipos en vez de strings simples.

#### Estructura

```
id
entity_id
entity_value_{type: json, int, string, datetime}
entity_type
```

#### Pros y contras

**Ventajas**:

- ✅ Permite que varios editores trabajen en el mismo contenido de forma **colaborativa en tiempo real**
- ✅ No hay race conditions o bloqueos (que podrían ocurrir con una columna JSON)
- ✅ Tipos explícitos ayudan a la base de datos a indexar correctamente

**Comparación con WordPress**: WordPress usa este enfoque, pero sus tablas tienen `value` como `LONGTEXT`, desperdiciando espacio sin saber qué tipo es o debería ser.

**Desventajas**:

- ⚠️ Las queries se vuelven muy complejas
- ⚠️ Las queries son más costosas comparado con JSON y columnar (como lo hace Strapi)

#### Nuestra estrategia de optimización

1. **Abstraer al máximo** con nuestro query builder y entityService
2. **Cachear lo más posible**
3. **Vistas materializadas** (si la base de datos lo permite)
4. **Recalcular por eventos** de update

Cada enfoque tiene sus pros y contras. La idea de Vayload es mitigar las desventajas con cacheo agresivo y optimizaciones inteligentes.

---

## Extensibilidad

### Vayload Plug: Repositorio de plugins

**Vayload Plug** es el ecosistema de plugins en Lua que extiende las capacidades del CMS:

- **Directorio de plugins**: Catálogo de plugins disponibles
- **Documentación para developers**: Guías para crear tus propios plugins
- **API documentada**: Referencia completa de la API disponible

Los plugins pueden:

- Registrar rutas HTTP, gRPC y MCP
- Acceder a servicios del kernel de forma controlada
- Ejecutarse en sandbox seguro

---

## Recursos y documentación

### Para usuarios

- **Documentación de uso**: [Por publicar con la versión alpha]
- **Guías de inicio rápido**: [En preparación]

### Para desarrolladores

- **Vayload Plug**: Repositorio de plugins y documentación
- **API Reference**: [En construcción]
- **Docs de desarrollo**: Guías para contribuir al core

### Comunidad y soporte

- **Issue Tracker**: Para reportar bugs durante la fase alpha
- **Feedback**: Bienvenidas recomendaciones y sugerencias

---

## Roadmap

**Febrero 2025 (Alpha)**

- Lanzamiento inicial para desarrolladores
- Funcionalidades core estables
- Tests en progreso
- Documentación básica

**Marzo 2025 (Estable v1.0)**

- Suite completa de tests
- Documentación completa
- Performance optimizado
- Listo para producción

**Futuro**

- Soporte opcional para QuickJS (JavaScript)
- Más drivers de base de datos
- Expansión del ecosistema de plugins
