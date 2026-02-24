# Vayload

**The official plugin registry, landing platform, and documentation hub for the Vayload ecosystem.**

Vayload provides a centralized system for discovering, publishing, and managing Lua plugins that extend the Vayload CMS. It also serves as the public entry point and documentation portal for developers and users.

Official landing: [https://vayload.dev](https://vayload.dev)
Official registry: [https://plugins.vayload.dev](https://plugins.vayload.dev)

---

## What is Vayload?

Vayload is a modular CMS built around a microkernel architecture in Go.
This repository powers the ecosystem layer:

- 🌐 Public landing pages
- 📚 Developer documentation

---

## Plugin Ecosystem

Plugins in Vayload are written in **Lua** and run in a sandboxed environment inside the CMS kernel.

The registry enables:

- Plugin publishing and versioning
- Package uploads and downloads
- Dependency management
- API key authentication for automated deployments
- Secure distribution across environments

---

## Continuous Deployment

The registry supports API keys for automated workflows, allowing developers to:

- Publish new versions from CI/CD pipelines
- Automate releases
- Integrate plugin deployment into build systems

---

## Vision

Vayload aims to provide a lightweight, extensible ecosystem where:

- The CMS core remains minimal
- Functionality lives in plugins
- Developers control distribution
- Infrastructure remains affordable
