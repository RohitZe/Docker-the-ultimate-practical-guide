# Understanding your Machine — Why We Need Deployment

A conceptual primer on hardware, operating systems, and deployment, written before diving into deployment tooling.


Our Machine is combination of two thing hardware and Software
## 1. Hardware vs Software

- **Hardware** — anything physical you can touch: keyboard, monitor, RAM, SSD, CPU, network card (NIC).
- **Software** — anything you can't physically touch: Chrome, MS Excel, a CRM app, a game.

## 2. Why we can't just run software directly on hardware

If an application ran straight on the hardware with nothing managing it, problems appear immediately:

- **Process management** — if you close the app, does it exit cleanly? Can you run two copies of the same app at once? Something needs to track and isolate running programs.
- **Resource access** — if the app wants to reach the internet, who grants it access to the network card? Who decides which app gets how much RAM?
- **Isolation** — one app crashing shouldn't be able to take down another, or the whole machine.

This is the job of the **operating system (OS)** — Windows, Linux, macOS, etc. Its core duties:

| Responsibility | What it does |
|---|---|
| Process management | Starts, schedules, and stops programs; lets multiple apps/instances run without colliding |
| Memory management | Allocates RAM to each process and keeps them isolated from each other |
| Hardware abstraction | Talks to devices via drivers, so apps don't need to know SSD/CPU-specific instructions |
| Network management | Controls which processes get access to the network card and how |
| Security/permissions | Enforces who/what can access which resources |

## 3. The layer stack

```
Hardware → Operating System → Application
```

Your CRM, notepad, game, or e-commerce frontend all sit on top of this stack, running as a process managed by the OS.

## 4. Ports — running multiple apps at once

Since many applications can live on one machine, the OS needs a way to route requests to the *right* one. This is what **ports** solve.

- `localhost:5000` → one application
- `localhost:3000` → a different application

Each port number acts like a mailbox address on your machine — the OS delivers incoming traffic to whichever app is "listening" on that port. (Well-known ports like 80/443 are reserved below 1024; custom apps typically use ports above that.)

## 5. Making your app reachable by others

Right now, the app only exists on *your* machine — no one else can see it. There are two broad paths:

### Option A: Self-host

Turn your own laptop into a server. This requires:

- **Port forwarding (DNAT)** on your router — routes incoming internet traffic to your machine. (Note: SNAT is about *outgoing* traffic sharing your public IP — it's not what solves reachability here.)
- **A stable way to be found** — home ISPs usually assign a *dynamic* public IP, so you'd also need a **DDNS (dynamic DNS)** service, or your app's address changes whenever your IP does.
- **Always-on availability** — your machine and Wi-Fi need to stay up 24/7, or the app becomes unreachable.
- You're also now responsible for your own security, since your home network is exposed to the internet.

### Option B: Use a cloud service

Hand your code to a provider and let them manage the infrastructure. Beyond just "handling infra," this typically gets you:

- **Scalability** — spin up more servers automatically under load
- **Reliability/uptime** — you're not dependent on your own machine or Wi-Fi
- **Security patching & backups** — handled for you
- **Load balancing & global reach** — traffic distributed across servers, often via a CDN

## 6. So, why deployment?

Deployment isn't just "put the code somewhere else." It's a shift in responsibility.

On your laptop, you're the OS's only client — nothing else depends on your app staying up. The moment someone else needs to reach it, you're running a **service**, not just a program. That's why things like crash recovery, monitoring, and scaling suddenly matter.

**In short: deployment = making the application reliably reachable to its users — not just reachable, but reliably so.**