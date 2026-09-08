# Evolution of Compute / Deployment

How we went from running apps directly on hardware, to VMs, to containers — and why Docker won.

## 1. Bare Metal Deployment

The earliest model: the application runs directly on the OS, which runs directly on physical hardware — same as running an app on your own laptop.

```
┌─────────────────────┐
│     Application      │
├─────────────────────┤
│   Operating System    │
├─────────────────────┤
│       Hardware          │
└─────────────────────┘
```

**Pros:**
- Maximum security and isolation — nothing else shares the machine
- Predictable performance (no virtualization overhead)
- Preferred choice for defense/critical systems where isolation is non-negotiable

**Cons — "works on my machine":**
- Every dependency lives directly on the host OS, so conflicts are common. Example: App A needs Node 18, App B needs Node 20 — both can't coexist cleanly on the same machine.
- The "fix" is often just buying more hardware — not scalable or cost-effective.

## 2. Virtualization

A **hypervisor** splits one physical machine into multiple virtual machines (VMs), each running its *own guest OS*.

```
┌────────────┐   ┌────────────┐
│   App A     │   │   App B     │
├────────────┤   ├────────────┤
│ Guest OS A  │   │ Guest OS B  │
└────────────┘   └────────────┘
┌─────────────────────────────┐
│           Hypervisor            │
├─────────────────────────────┤
│            Hardware                │
└─────────────────────────────┘
```

This solves the dependency problem — each VM can run a different OS/runtime version in isolation.

**Trade-off:** every VM carries a *full guest OS* (its own kernel, drivers, etc.), which means:
- Slower startup times (booting a whole OS)
- High storage and memory overhead
- Still strong isolation, but heavy

## 3. Containers — Docker

Docker doesn't virtualize the whole OS. Instead, it uses three core Linux kernel features to isolate processes while **sharing the host's kernel**:

| Kernel feature | What it does |
|---|---|
| **Namespaces** | Isolate what a process can see — its own PIDs, network stack, mounts, hostname, users |
| **cgroups** | Limit and control how much CPU, memory, and I/O a process can use |
| **Union filesystem** (e.g. OverlayFS) | Layers image filesystems on top of each other efficiently, enabling fast image builds and reuse |

```
┌────────────┐   ┌────────────┐
│   App A     │   │   App B     │
├────────────┤   ├────────────┤
│      Docker Engine / Runtime      │
├─────────────────────────────┤
│        Host OS Kernel (shared)     │
├─────────────────────────────┤
│            Hardware                │
└─────────────────────────────┘
```

Because there's no guest OS to boot, containers start in milliseconds and use a fraction of the resources a VM needs — while namespaces and cgroups still give strong process-level isolation.

## Comparison at a Glance

| | Bare Metal | Virtual Machine | Container (Docker) |
|---|---|---|---|
| Isolation | Highest (physical) | Strong (own kernel) | Good (shared kernel, namespaced) |
| Startup time | N/A (always on) | Minutes | Milliseconds–seconds |
| Resource overhead | None | High (full guest OS) | Low (shares host kernel) |
| Dependency conflicts | Common | Solved | Solved |
| Best for | Defense/high-security systems | Mixed OS workloads | Most modern application deployment |

## Takeaway

Bare metal gives maximum isolation at the cost of flexibility. VMs solve the dependency problem but pay for it in overhead. Docker keeps the isolation benefits (via namespaces + cgroups) while dropping the guest-OS tax — which is why it became the default for modern deployment.