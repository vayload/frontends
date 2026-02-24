# Vayload CMS

## What is Vayload?

Vayload is an **extensible headless CMS/CRM** built in Go using a microkernel architecture, designed to run efficiently on small servers without sacrificing functionality. It supports use cases such as e-commerce, blogs, and news portals.

### Project Status

**🚧 Alpha (February 2025)**: Launch at the end of February
**✅ Stable (Late May 2025)**: Stable release one month later

**Current Warning**: The project is under active development. Many parts may be unstable or lack tests. For now, it is **limited to developers** who want to try the product and can:

- Report bugs
- Send recommendations
- Provide technical feedback

---

## Why Vayload?

### The Problem We’re Solving

For years, I worked with WordPress building plugins. Every time I needed something specific, I had to hack the CMS core. Often I used it purely as headless, leaving a lot of unused code, since WordPress was built with both frontend and backend tightly coupled.

Later I tried Sanity CMS and Strapi, which I liked because they focus on being a pure data source/admin panel. However, the JavaScript ecosystem presented a problem: **Strapi was too heavy** for my $4/month VPS. Both WordPress and Strapi consumed too much RAM and CPU.

### The Search for Alternatives

I looked into the Go ecosystem but mostly found abandoned or hobby projects. Since I already had experience with Go and appreciated its robustness for web services, I decided to try it.

I also evaluated Rust with Actix Web — although Rust consumes fewer resources as a systems language (in fact, the backend of the Vayload plugin registry is written in Rust and is closed source), I ultimately chose Go for the CMS core.

### The Real Use Case

A friend asked me to build an admin panel for her small online store. Installing WordPress or Strapi on a $4 server didn’t make sense for her small business.

That’s how Vayload was born: **a CMS that works for e-commerce, news, and blogs**, optimized for small servers.

While blogs may decline with the rise of AI, online stores — and their admin systems — will remain relevant for years.

---

## Project Philosophy

### AI as Assistant, Not Author

At Vayload, we strongly believe that **humans should write content**. Artificial intelligence is here to assist, not replace:

- ✓ Fix typos
- ✓ Summarize existing content
- ✓ Provide context
- ✗ Act as the primary author

---

## Core Features

### Flexible Database Support

Vayload supports multiple SQL engines depending on your project needs:

- **SQLite**: For small to medium projects
- **MySQL/PostgreSQL**: To scale your project further

### Lua-Based Migration System

We provide a migration system that abstracts each driver and allows engine-specific optimizations:

```lua
ifEngine(driver: string, fn: Function)
```

This function executes engine-specific code. **Use with caution**: it can introduce SQL injection risks if misused.

---

## Architecture

### Backend: Go

The backend is built in **Go** for strategic reasons:

- ✅ Deployable on very small servers
- ✅ Handles many requests with minimal resource usage
- ✅ Goroutines for background tasks and parallel processing

### Two-Level Microkernel Architecture

#### Level 1: Kernel

Manages fundamental components:

- Dependency Injection (DI)
- Event Bus
- Job Queue
- Lua VM
- Plugin Orchestrator

#### Level 2: Services

Services register into the kernel and can interoperate. The goal is to allow new services to be embedded easily. The API is intentionally simple and documented.

**Note**: Not yet stable and subject to change before full stability.

#### Level 3: Plugins (Lua)

Plugins extend CMS functionality. The API is documented in Vayload Plug for developers. Vayload will also build essential plugins that may not be prioritized initially or long-term.

**Security**: Plugins run in **sandbox mode**. Even if vulnerable, they cannot compromise the system. They are limited to what the kernel exposes.

---

## Communication Flow

Components communicate **top-down**:

```
Request
  → Middlewares/Guards
  → Kernel
  → Transport Router (HTTP, gRPC, MCP)
  → Handlers
  → Services
  → Plugins (if needed)
```

**Current Limitation**: Plugins only reach the kernel level, not the request level. They cannot intercept or modify requests directly.

**Current Plugin Capabilities**:

- Register routes in HTTP, gRPC, and MCP
- gRPC and MCP are disabled by default and must be manually enabled

---

## Why Lua Instead of JavaScript?

### Performance

**QuickJS is slower than LuaJIT** or Lua bytecode. That is why we chose Lua as the primary scripting engine.

### Future JavaScript Support

If we can integrate QuickJS (the smallest JavaScript engine) in the future, we will offer it as an **opt-in option for JS developers**.

Currently, there is no mature Go binding, and building one would not be trivial.

Even if integrated, QuickJS would have limitations because it is not V8. Go would provide controlled I/O operations as host — just like it does with Lua.

---

## Database Architecture

### Core Tables (Minimal)

- `roles`
- `users`
- `collections` (content types)
- `sessions`
- `file_objects`

### Dynamic Collections: Typed EAV Approach

For dynamic collections, we use **Entity-Attribute-Value (EAV)** — but with typed values instead of plain strings.

#### Structure

```
id
entity_id
entity_value_{type: json, int, string, datetime}
entity_type
```

#### Pros and Cons

**Advantages**:

- ✅ Allows multiple editors to collaborate in **real time**
- ✅ No race conditions or locks (which may occur with a single JSON column)
- ✅ Explicit types help proper indexing

**Compared to WordPress**: WordPress uses a similar approach but stores values as `LONGTEXT`, wasting space without explicit typing.

**Disadvantages**:

- ⚠️ Queries become more complex
- ⚠️ Queries are more expensive compared to JSON or column-based approaches (like Strapi)

#### Our Optimization Strategy

1. Abstract as much as possible using a query builder and entityService
2. Cache aggressively
3. Use materialized views (if supported by the database)
4. Recompute on update events

Each approach has trade-offs. Vayload mitigates disadvantages with aggressive caching and smart optimizations.

---

## Extensibility

### Vayload Plug: Plugin Ecosystem

Vayload Plug is the Lua-based plugin ecosystem that extends the CMS:

- Plugin directory
- Developer documentation
- Fully documented API

Plugins can:

- Register HTTP, gRPC, and MCP routes
- Access kernel services in a controlled way
- Run securely in sandbox mode

---

## Resources & Documentation

### For Users

- Usage documentation: Coming with the alpha release
- Quick start guides: In progress

### For Developers

- Vayload Plug: Plugin repository and documentation
- API Reference: Under construction
- Core development docs: Contribution guides

### Community & Support

- Issue Tracker: For reporting bugs during alpha
- Feedback: Recommendations and suggestions are welcome

---

## Roadmap

### February 2025 (Alpha)

- Initial developer release
- Stable core functionality
- Tests in progress
- Basic documentation

### Late May 2025 (Stable v1.0)

- Full test suite
- Complete documentation
- Performance optimized
- Production-ready

### Future

- Optional QuickJS (JavaScript) support
- More database drivers
- Expansion of the plugin ecosystem
