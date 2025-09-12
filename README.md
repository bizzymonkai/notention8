# MonkeyBusiness - A Semantic P2P E-Commerce Prototype

MonkeyBusiness is a prototype peer-to-peer (P2P) e-commerce application that uses a semantic ontology to match buyers and sellers in a decentralized network.

At its core, MonkeyBusiness is built on a powerful idea: the distinction between **real** (offers to sell) and **imaginary** (requests to buy). This allows users to create listings that are not just static advertisements, but dynamic documents that can be automatically matched and discovered on a decentralized network.

---

## Core Concepts

### 1. Semantic Notes

Every listing in MonkeyBusiness is a "note" that can contain both unstructured text and structured data. This structured data is embedded directly within the note as inline "widgets," which are both easy to read and parseable by machines.

- **Tags:** Simple, hierarchical concepts (e.g., `#product`, `#electronics`).
- **Properties:** Key-value pairs with defined types and operators (e.g., `[condition:is:New]`, `[price < 200]`).

### 2. The Ontology

The Ontology is the backbone of MonkeyBusiness's semantic system. It's a schema that acts as the "language" for structured data in notes. It defines all available tags and property keys, along with their data types (string, number, date, geo, etc.) and, crucially, the **operators** they can use.

### 3. Real vs. Imaginary (The Core Idea)

This is what makes MonkeyBusiness unique. Every piece of structured data can be defined as either "real" or "imaginary."

- **Real Data (Offers)** represents a definite, observed fact. It typically uses the `is` operator. A seller creates a note with real data to list a product.
  - `[product:is:T-Shirt]` - The product for sale _is_ a T-Shirt.
  - `[price:is:25]` - The price _is_ $25.

- **Imaginary Data (Requests)** represents a condition, a query, or a desire. It uses conditional operators like `greater than`, `less than`, `contains`. A buyer creates a note with imaginary data to find a product.
  - `[price < 30]` - I'm looking for a product with a price _less than_ $30.
  - `[category:is:Electronics]` - I'm looking for a product in the electronics category.

**Why does this matter?** When you publish a note to a decentralized network like Nostr, this distinction powers a semantic matching system.

- A seller's note with `[product:is:T-Shirt]` and `[price:is:25]` can be automatically discovered by a buyer whose note contains `[product:is:T-Shirt]` and `[price < 30]`.

### 4. Decentralization via Nostr

MonkeyBusiness is a local-first application, meaning all your data is stored securely in your browser. However, you can choose to publish notes to the decentralized Nostr network. When published, the embedded semantic data allows your notes to become part of a global, queryable information network, without a central server.

---

## Architecture Overview

MonkeyBusiness is a client-side Progressive Web App (PWA) built with modern web technologies.

- **Framework:** React with TypeScript for a robust and type-safe codebase.
- **Styling:** TailwindCSS for rapid, utility-first UI development.
- **Editor:** A custom `contentEditable`-based editor. This approach was chosen over existing libraries to allow for deep integration of custom, interactive semantic widgets directly within the text flow.
- **Local Storage:** `localforage` is used to provide a simple, asynchronous API over IndexedDB, ensuring a reliable local-first experience.
- **Decentralization:** `nostr-tools` provides the low-level primitives for interacting with the Nostr network, enabling decentralized identity and note publishing.
