# Strategic Design Recap

## 電影院比喻

## Bounded Context 與 Subdomain 差別。

From PPPoDDD:

Subdomains, introduced in Chapter 3, “Focusing on the Core Domain,” represent the logical areas of a problem domain, typically reflecting the business capabilities of the business organizational structure. They are used to distinguish the areas of importance in an application, the core domain, from the less important areas, the supporting and generic domains. Subdomains exist to distill the problem space and break down complexity.

Domain models are built to fulfill the uses cases of each of the subdomains. Ideally there would be a one‐to‐one mapping between models and subdomains, but this is not always the case. Models are defined based on team structure, ambiguity in language, business process alignment, or physical deployment. Therefore a subdomain could contain more than a single model and a model could span more than a single subdomain. This is often the case within legacy environments.

Models need to be isolated and defined within an explicit context in order to stay pure and focused. As you’ve learned, this context is known as the bounded context. **Unlike a subdomain, a bounded context is a concrete technical implementation that enforces boundaries between models within an application.** Bounded contexts exist in the solution space and are represented as explicit domain models in a context.

## 解答

## Resources
