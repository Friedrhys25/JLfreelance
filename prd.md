# 📋 Product Requirements Document (PRD) & Development Plan  
# Barbershop POS System

---

# 📄 PART 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Overview

A lightweight, purpose-built Point of Sale (POS) system designed specifically for barbershops offering three core services:

- Haircut
- Hair Color
- Hair Treatment

The system streamlines checkout, tracks service-level revenue, provides real-time sales breakdowns, and allows exporting of sales records for accounting and analytics.

---

## 2. Problem Statement

Many barbershops rely on generic POS systems or manual tracking, leading to:

- Inaccurate service-level revenue tracking
- Time-consuming manual reporting
- Poor export compatibility with accounting tools
- Inefficient checkout workflows

---

## 3. Target Users

### Shop Owner / Admin
Oversees pricing, settings, and financial reports.

### Cashier / Front Desk
Processes transactions, applies discounts, and prints receipts.

### Barber / Stylist *(Future Scope)*
Views completed services and tracks tips or commissions.

---

## 4. Core Modules

| Module | Description |
|---|---|
| **M1 - User & Role Management** | Authentication and role-based access (Admin, Cashier) |
| **M2 - Service Catalog** | Manage services, pricing, taxes, and discounts |
| **M3 - POS Checkout & Payments** | Cart, payment processing, and receipt generation |
| **M4 - Sales Breakdown & Dashboard** | Revenue analytics by service and timeframe |
| **M5 - Export & Data Management** | CSV/Excel/PDF export of sales records |
| **M6 - System Settings** | Tax rates, currency, shop info, and backups |

---

## 5. User Stories (MVP Scope)

### Admin
> As an Admin, I want to set prices and taxes for Haircut, Hair Color, and Hair Treatment so that checkout calculates totals accurately.

### Cashier
> As a Cashier, I want to select services, apply discounts, process payments, and generate receipts quickly.

### Owner
> As an Owner, I want to see a breakdown of sales by service, date range, and payment method on a dashboard.

### Accountant / Owner
> As an Accountant or Owner, I want to export sales records to CSV/Excel for bookkeeping.

---

## 6. Functional Requirements

### Service CRUD
- Add/edit service prices
- Toggle service availability
- Set default tax rates

### Cart & Checkout
- Multi-service selection
- Discount codes
- Tip entry support

### Payment Processing
- Cash payments
- Card payments
- Digital wallets
- Stripe/Square integration

### Receipt Generation
- Print/email receipts
- Shop logo support
- Tax breakdown
- Transaction ID generation

### Sales Breakdown
Filter by:
- Date range
- Service type
- Payment method
- Staff member

Display:
- Totals
- Taxes
- Discounts

### Export System
- CSV export
- Excel export
- PDF export
- Pagination support
- Background processing for large datasets

### Role-Based Access
| Role | Permissions |
|---|---|
| **Admin** | Full access |
| **Cashier** | Checkout + reports only |

### Audit Trail
- Log transactions
- Track edits
- Record exports

---

## 7. Non-Functional Requirements

### Performance
- Checkout: **< 3 seconds**
- Report loading: **< 5 seconds**
- Export trigger: **< 2 seconds**

### Security
- JWT authentication
- Password hashing
- PCI-compliant payment handling
- Role-based API guards

### Reliability
- Daily auto-backups
- Graceful degradation during payment gateway downtime

### Usability
- Touch-optimized UI
- Keyboard shortcuts for cashiers
- Responsive design

### Compliance
- GDPR/CCPA-ready exports
- Tax calculation compliance

---

## 8. Success Metrics (KPIs)

| KPI | Target |
|---|---|
| Successful transaction completion | >95% |
| Export generation success rate | >99% |
| Average checkout time | <45 seconds |
| Monthly active staff usage | 100% |
| Data loss incidents | 0 |

---

## 9. Assumptions & Constraints

- Single-location barbershop for MVP
- Flat or service-based tax rules only
- Merchant account required for payment gateway
- Internet connectivity required
- Offline mode is out of scope for v1

---

## 10. Future Roadmap (v2+)

### Planned Features
- Appointment booking & calendar sync
- Product inventory & retail sales
- Staff commissions & tip tracking
- Multi-location & franchise support
- Customer CRM & loyalty program

---

# 🛠️ PART 2: DEVELOPMENT PLAN PER MODULE

| Module | Timeline | Tech Stack | Key Tasks & Deliverables | Dependencies |
|---|---|---|---|---|
| **M1: User & Role Management** | Sprint 1 (2 wks) | Node.js, Express, PostgreSQL, JWT, bcrypt, React | Auth DB schema, Login/Logout APIs, Role middleware, Session management UI, Password reset flow | M6 |
| **M2: Service Catalog** | Sprint 1 (2 wks) | PostgreSQL, REST/GraphQL, React Admin Panel | Services table, CRUD APIs, Validation, Audit logging, Admin UI, Seed data | M1 |
| **M3: POS Checkout & Payments** | Sprint 2–3 (3 wks) | React/PWA, Stripe/Square SDK, PDF receipt generator | Cart management, Discount/tip logic, Payment intents, Receipt templates, Logging, Error fallback UI | M1, M2, M6 |
| **M4: Sales Dashboard & Breakdown** | Sprint 3–4 (2 wks) | PostgreSQL, Chart.js/Recharts, Redis | Revenue analytics queries, Dashboard charts/cards, Filters, Real-time refresh, Pagination | M3 |
| **M5: Export & Data Management** | Sprint 4 (1.5 wks) | CSV/Excel libs, jsPDF, BullMQ/Redis | Export API, Async processing, Progress UI, Download/email option, Export logs | M3, M4 |
| **M6: System Settings** | Sprint 1–2 (Overlap) | PostgreSQL, JSON config, UI forms | Shop info, Tax rates, Currency settings, Session/security preferences, Backup toggles | M1 |

---

# 📅 Overall Timeline (MVP)

| Phase | Duration | Deliverables |
|---|---|---|
| **Discovery & Architecture** | 1 week | DB schema, API contracts, wireframes, project setup |
| **Sprints 1–2** | 3 weeks | Auth, Service Catalog, Settings, Checkout UI, Payment sandbox |
| **Sprints 3–4** | 2.5 weeks | Live payments, Receipts, Dashboard, Export module, QA |
| **UAT & Deployment** | 1 week | Staging tests, migration, production deployment, training docs |

---

# ✅ Total Estimated Timeline

**~7.5 Weeks**

MVP ready for:
- Single-location deployment
- Real-world cashier usage
- Revenue tracking & exports
- Payment processing integration

---