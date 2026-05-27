"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  AtSign,
  Diamond,
  Mail,
  MapPin,
  Scissors,
} from "lucide-react";
import identityLogo from "@/app/assets/identityLogo.png";

const locations = [
  {
    name: "Greenhills",
    label: "Metro Manila",
    address: "2F, One Kennedy Centre, Greenhills, San Juan",
    href: "https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.bing.com%2Fmaps%2Fdefault.aspx%3Fv%3D2%26pc%3DFACEBK%26mid%3D8100%26where1%3D%252339%2520Sct.%2520Ybardaloza%252C%2520Manila%252C%252C%2520Philippines%252C%25201103%26FORM%3DFBKPL1%26mkt%3Den-US",
  },
  {
    name: "Bulacan",
    label: "Provincial Flagship",
    address: "Identity Hair Studio Bulacan, San Pedro, Camias",
    href: null,
  },
];

const connectItems = [
  {
    label: "Instagram",
    value: "@russcutshair_",
    href: "https://www.instagram.com/russcutshair_/",
    icon: AtSign,
  },
  {
    label: "Facebook",
    value: "Identity Studio",
    href: "https://www.facebook.com/profile.php?id=100093132221384",
    icon: Diamond,
  },
  {
    label: "Email",
    value: "russravelaz@gmail.com",
    href: "mailto:russravelaz@gmail.com",
    icon: Mail,
  },
];

const services = [
  {
    num: "01",
    title: "Precision Cut",
    desc: "Architectural shaping tailored to your face structure and lifestyle.",
  },
  {
    num: "02",
    title: "Fade & Taper",
    desc: "Clean skin fades to soft blends — executed with technical discipline.",
  },
  {
    num: "03",
    title: "Color & Tone",
    desc: "Editorial coloring with premium-grade products and precise application.",
  },
];

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;1,700;1,800;1,900&family=Barlow:wght@300;400;500&display=swap');

        :root {
          --white: #ffffff;
          --off-white: #f7f6f4;
          --light-grey: #e8e6e2;
          --mid-grey: #9a9690;
          --dark-grey: #3a3835;
          --near-black: #1a1917;
          --ink: #0e0d0c;
          --red-stripe: #d42b2b;
          --stamp-red: #cc2200;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--off-white);
          color: var(--ink);
          font-family: 'Barlow', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── STICKER TEXT EFFECT — matching the logo image ── */
        .identity-sticker {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.02em;

          /* White fill */
          color: #ffffff;

          /* Multi-layer: dark grey stroke + hard block 3D shadow (down-right) */
          -webkit-text-stroke: 3px #4a4745;
          paint-order: stroke fill;

          /* Hard-edged 3D extrusion block shadow — no blur */
          text-shadow:
            3px 3px 0 #3a3835,
            4px 4px 0 #3a3835,
            5px 5px 0 #3a3835,
            6px 6px 0 #3a3835,
            7px 7px 0 #3a3835,
            8px 8px 0 #3a3835;
        }

        .identity-sticker-sm {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #ffffff;
          -webkit-text-stroke: 2px #4a4745;
          paint-order: stroke fill;
          text-shadow:
            2px 2px 0 #3a3835,
            3px 3px 0 #3a3835,
            4px 4px 0 #3a3835,
            5px 5px 0 #3a3835;
        }

        /* ── NAV ── */
        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 0 clamp(1.25rem, 4vw, 3rem);
          height: 60px;
          background: var(--white);
          border-bottom: 2px solid var(--ink);
        }

        .nav-logo-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .nav-wordmark {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 1.4rem;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--ink);
          line-height: 1;
        }

        .nav-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 400;
          font-size: 0.55rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--mid-grey);
          line-height: 1;
          margin-top: 2px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0;
          list-style: none;
        }

        @media (max-width: 640px) { .nav-links { display: none; } }

        .nav-links a {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.72rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--dark-grey);
          text-decoration: none;
          padding: 0 1.25rem;
          height: 60px;
          display: flex;
          align-items: center;
          border-left: 1px solid var(--light-grey);
          transition: background 0.15s, color 0.15s;
        }
        .nav-links a:hover {
          background: var(--ink);
          color: var(--white);
        }

        .nav-actions { display: flex; gap: 0; }

        .btn-nav-ghost {
          height: 60px;
          padding: 0 1.25rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--dark-grey);
          border: none;
          border-left: 1px solid var(--light-grey);
          background: transparent;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: background 0.15s, color 0.15s;
        }
        .btn-nav-ghost:hover {
          background: var(--dark-grey);
          color: var(--white);
        }

        .btn-nav-black {
          height: 60px;
          padding: 0 1.5rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--white);
          background: var(--ink);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.15s;
        }
        .btn-nav-black:hover { background: var(--dark-grey); }

        /* ── HERO ── */
        .hero {
          background: var(--white);
          border-bottom: 2px solid var(--ink);
          position: relative;
          overflow: hidden;
        }

        /* Graph-paper grid bg */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0;
          min-height: 560px;
        }

        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; min-height: auto; }
        }

        .hero-left {
          padding: clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem);
          border-right: 2px solid var(--ink);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (max-width: 768px) { .hero-left { border-right: none; border-bottom: 2px solid var(--ink); } }

        .hero-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 500;
          font-size: 0.62rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--mid-grey);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hero-tag::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: var(--mid-grey);
        }

        .logo-image-wrap {
          display: block;
          max-width: 680px;
          width: 100%;
          margin-bottom: 2rem;
        }

        .hero-subtitle {
          font-size: clamp(0.85rem, 1.4vw, 1rem);
          font-weight: 300;
          line-height: 1.9;
          color: var(--mid-grey);
          max-width: 30rem;
          margin-bottom: 2.5rem;
        }

        .hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
        }

        .btn-hero-black {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          height: 52px;
          padding: 0 2rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--white);
          background: var(--ink);
          text-decoration: none;
          border: 2px solid var(--ink);
          transition: all 0.15s;
        }
        .btn-hero-black:hover {
          background: var(--white);
          color: var(--ink);
        }

        .btn-hero-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          height: 52px;
          padding: 0 2rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--ink);
          background: transparent;
          border: 2px solid var(--ink);
          border-left: none;
          text-decoration: none;
          transition: all 0.15s;
        }
        .btn-hero-outline:hover {
          background: var(--ink);
          color: var(--white);
        }

        /* Hero right sidebar */
        .hero-right {
          width: 140px;
          display: flex;
          flex-direction: column;
          padding: clamp(1.5rem, 3vw, 2.5rem) 1rem;
          gap: 2rem;
          border-left: 0;
        }

        @media (max-width: 768px) { .hero-right { display: none; } }

        .hero-stat {
          text-align: center;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--light-grey);
        }
        .hero-stat:last-child { border-bottom: none; padding-bottom: 0; }

        .hero-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 3rem;
          color: var(--ink);
          line-height: 1;
        }
        .hero-stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 400;
          font-size: 0.58rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--mid-grey);
          margin-top: 0.4rem;
          line-height: 1.4;
        }

        /* ── RED STRIPE MARQUEE ── */
        .marquee-wrap {
          background: var(--stamp-red);
          overflow: hidden;
          padding: 0.65rem 0;
          border-bottom: 2px solid var(--ink);
          border-top: 2px solid var(--ink);
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        .marquee-item {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-style: italic;
          font-size: 1rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--white);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .marquee-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          flex-shrink: 0;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── SECTION SHARED ── */
        .section {
          padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem);
        }

        .section-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.6rem;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: var(--mid-grey);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .section-eyebrow::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: var(--mid-grey);
        }

        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: clamp(3rem, 6vw, 5.5rem);
          letter-spacing: -0.02em;
          line-height: 0.92;
          color: var(--ink);
          text-transform: uppercase;
        }

        /* ── PHILOSOPHY ── */
        .philosophy {
          background: var(--off-white);
          border-top: 2px solid var(--ink);
          border-bottom: 2px solid var(--ink);
        }

        .philosophy-grid {
          margin-top: 2.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border: 2px solid var(--ink);
        }

        @media (max-width: 768px) {
          .philosophy-grid { grid-template-columns: 1fr; }
        }

        .phil-card {
          padding: 2.5rem 2rem;
          border-right: 2px solid var(--ink);
          transition: background 0.15s;
          position: relative;
        }
        .phil-card:last-child { border-right: none; }
        .phil-card:hover { background: var(--ink); }
        .phil-card:hover .phil-num { color: rgba(255,255,255,0.08); }
        .phil-card:hover .phil-title { color: var(--white); }
        .phil-card:hover .phil-desc { color: rgba(255,255,255,0.5); }
        .phil-card:hover .phil-icon { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }

        .phil-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 4rem;
          color: var(--light-grey);
          line-height: 1;
          margin-bottom: 1rem;
          transition: color 0.15s;
        }

        .phil-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0,0,0,0.15);
          margin-bottom: 1rem;
          color: var(--dark-grey);
          transition: all 0.15s;
        }

        .phil-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ink);
          margin-bottom: 0.75rem;
          transition: color 0.15s;
        }

        .phil-desc {
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.9;
          color: var(--mid-grey);
          transition: color 0.15s;
        }

        /* ── SERVICES ── */
        .services-section {
          background: var(--white);
          border-bottom: 2px solid var(--ink);
        }

        .services-grid {
          margin-top: 2.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 2px solid var(--ink);
          gap: 0;
        }

        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr; }
        }

        .svc-item {
          padding: 2rem 2rem 2rem 1.75rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          border-right: 2px solid var(--ink);
          border-bottom: 2px solid var(--ink);
          transition: background 0.15s;
        }
        .svc-item:nth-child(2n) { border-right: none; }
        .svc-item:nth-last-child(-n+2) { border-bottom: none; }
        .svc-item:hover { background: var(--off-white); }

        @media (max-width: 640px) {
          .svc-item { border-right: none; }
          .svc-item:last-child { border-bottom: none; }
          .svc-item:not(:last-child) { border-bottom: 2px solid var(--ink); }
        }

        .svc-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 1.8rem;
          color: var(--light-grey);
          line-height: 1;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .svc-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
          margin-bottom: 0.5rem;
        }

        .svc-desc {
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.85;
          color: var(--mid-grey);
        }

        /* ── LOCATIONS & CONNECT ── */
        .bottom-section {
          background: var(--off-white);
          border-bottom: 2px solid var(--ink);
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin-top: 2.5rem;
          border: 2px solid var(--ink);
        }

        @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }

        .two-col-left {
          padding: 2rem;
          border-right: 2px solid var(--ink);
        }

        @media (max-width: 768px) {
          .two-col-left { border-right: none; border-bottom: 2px solid var(--ink); }
        }

        .two-col-right { padding: 2rem; }

        .location-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--light-grey);
        }
        .location-item:first-child { padding-top: 0; }
        .location-item:last-child { border-bottom: none; }

        .location-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-style: italic;
          font-size: 1.5rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .location-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 500;
          font-size: 0.58rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--mid-grey);
          margin: 0.25rem 0 0.5rem;
        }
        .location-addr {
          font-size: 0.82rem;
          font-weight: 300;
          line-height: 1.85;
          color: var(--mid-grey);
          max-width: 22rem;
        }

        .location-pin {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(0,0,0,0.12);
          color: var(--mid-grey);
          flex-shrink: 0;
          transition: all 0.15s;
          text-decoration: none;
          background: var(--white);
        }
        .location-pin:hover {
          background: var(--ink);
          color: var(--white);
          border-color: var(--ink);
        }

        .connect-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--light-grey);
          text-decoration: none;
          transition: all 0.15s;
          color: inherit;
        }
        .connect-item:first-child { padding-top: 0; }
        .connect-item:last-child { border-bottom: none; }
        .connect-item:hover .connect-icon { background: var(--ink); color: var(--white); border-color: var(--ink); }
        .connect-item:hover .connect-value { color: var(--ink); }
        .connect-item:hover .connect-arrow { transform: translateX(4px); color: var(--ink); }

        .connect-icon {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mid-grey);
          flex-shrink: 0;
          transition: all 0.15s;
          background: var(--white);
        }

        .connect-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 500;
          font-size: 0.58rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
          margin-bottom: 0.25rem;
        }

        .connect-value {
          font-size: 0.9rem;
          font-weight: 400;
          color: rgba(0,0,0,0.55);
          transition: color 0.15s;
        }

        .connect-arrow {
          color: rgba(0,0,0,0.25);
          flex-shrink: 0;
          transition: all 0.2s;
        }

        /* ── FOOTER ── */
        .footer {
          background: var(--ink);
          padding: 2.5rem clamp(1.5rem, 4vw, 3rem);
        }

        .footer-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .footer-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 2.5rem;
          color: var(--white);
          letter-spacing: -0.01em;
          text-transform: uppercase;
          line-height: 1;
        }
        .footer-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 300;
          font-size: 0.55rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
        }
        .footer-copy {
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-top: 1rem;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0 0;
        }
        .footer-links a {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 500;
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          padding: 0.35rem 1rem;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.15s;
          margin: 0.25rem;
        }
        .footer-links a:hover { color: var(--white); border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.05); }

        .footer-rule {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin-bottom: 2rem;
        }

        /* ── STAMP BADGE ── */
        .stamp {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-style: italic;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--stamp-red);
          border: 2px solid var(--stamp-red);
          padding: 0.25rem 0.65rem;
          transform: rotate(-2deg);
          display: inline-flex;
          align-items: center;
        }
      `}</style>

      <main>
        {/* ── NAV ── */}
        <header className="nav">
          <Link href="/" className="nav-logo-wrap">
            <div>
              <div className="nav-wordmark">Identity</div>
              <div className="nav-sub">Hair Studio</div>
            </div>
          </Link>

          <nav>
            <ul className="nav-links">
              <li><a href="#philosophy">Philosophy</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#studio">Locations</a></li>
            </ul>
          </nav>

          <div className="nav-actions">
            <Link href="/login" className="btn-nav-black">Login</Link>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-left">
              <div>
                <p className="hero-tag">Est. Metro Manila · Philippines</p>

                {/* Logo image — primary brand mark */}
                <div className="logo-image-wrap">
                  <Image
                    src={identityLogo}
                    alt="Identity Hair Studio"
                    priority
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>

                <p className="hero-subtitle">
                  Editorial attitude meets precision barbering. A studio built for
                  clients who treat grooming as craftsmanship — not routine.
                </p>
              </div>

              <div className="hero-cta">
                <a
                  href="https://www.instagram.com/russcutshair_/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-hero-black"
                >
                  Book Appointment
                  <ArrowRight size={14} />
                </a>
                <Link href="/login" className="btn-hero-outline">
                  Staff Portal
                </Link>
                <span className="stamp" style={{ marginLeft: "1.5rem", alignSelf: "center" }}>PH · 2026</span>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-stat">
                <div className="hero-stat-num">2</div>
                <div className="hero-stat-label">Studio Locations</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-label">Precision Focused</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">★</div>
                <div className="hero-stat-label">Premium Grade</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RED MARQUEE ── */}
        <div className="marquee-wrap" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                {["IDENTITY HAIR STUDIO", "PRECISION BARBERING", "METRO MANILA", "EDITORIAL GROOMING", "BULACAN", "MASTER CRAFT", "FOR MEN & WOMEN"].map((t, j) => (
                  <span key={j} className="marquee-item">
                    {t}
                    <span className="marquee-dot" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── PHILOSOPHY ── */}
        <section id="philosophy" className="section philosophy">
          <p className="section-eyebrow">The Philosophy</p>
          <h2 className="section-title">Built on Craft</h2>

          <div className="philosophy-grid">
            {[
              {
                num: "01",
                icon: null,
                title: "Precision",
                desc: "Identity is not just a haircut — it's an architectural approach to personal style. Every cut measured, shaped, and finished with intent.",
              },
              {
                num: "02",
                icon: <Scissors size={16} />,
                title: "Master Craft",
                desc: "Technical barbering rooted in clean execution. We fuse high-fashion editorial aesthetics with raw, precision barbering.",
              },
              {
                num: "03",
                icon: <Diamond size={16} />,
                title: "Premium Vibe",
                desc: "An elevated studio atmosphere from entry to finish — for clients who want both technical discipline and a refined experience.",
              },
            ].map((c) => (
              <div key={c.title} className="phil-card">
                <div className="phil-num">{c.num}</div>
                {c.icon && <div className="phil-icon">{c.icon}</div>}
                <div className="phil-title">{c.title}</div>
                <p className="phil-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="section services-section">
          <p className="section-eyebrow">What We Do</p>
          <h2 className="section-title">Services</h2>

          <div className="services-grid">
            {services.map((s) => (
              <div key={s.num} className="svc-item">
                <span className="svc-num">{s.num}</span>
                <div>
                  <div className="svc-title">{s.title}</div>
                  <p className="svc-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── LOCATIONS + CONNECT ── */}
        <section className="section bottom-section">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "0" }}>
            <div id="studio">
              <p className="section-eyebrow">Find Us</p>
              <h2 className="section-title">Locations</h2>
            </div>
            <div>
              <p className="section-eyebrow">Reach Out</p>
              <h2 className="section-title">Connect</h2>
            </div>
          </div>

          <div className="two-col">
            <div className="two-col-left">
              {locations.map((loc) => (
                <div key={loc.name} className="location-item">
                  <div>
                    <div className="location-name">{loc.name}</div>
                    <div className="location-label">{loc.label}</div>
                    <p className="location-addr">{loc.address}</p>
                  </div>
                  {loc.href ? (
                    <a href={loc.href} target="_blank" rel="noreferrer" className="location-pin" aria-label={`View ${loc.name} on map`}>
                      <MapPin size={15} />
                    </a>
                  ) : (
                    <span className="location-pin" style={{ opacity: 0.3, cursor: "default" }}>
                      <MapPin size={15} />
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="two-col-right">
              {connectItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="connect-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div className="connect-icon"><Icon size={15} /></div>
                      <div>
                        <div className="connect-label">{item.label}</div>
                        <div className="connect-value">{item.value}</div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="connect-arrow" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-rule" />
          <div className="footer-inner">
            <div>
              <div className="footer-logo">Identity</div>
              <div className="footer-sub">Hair Studio · Metro Manila · Bulacan</div>
              <p className="footer-copy">© 2026 Identity Hair Studio. All rights reserved.</p>
            </div>

            <div className="footer-links">
              <Link href="/login">Login</Link>
              <a href="mailto:russravelaz@gmail.com">Email</a>
              <a href="https://www.instagram.com/russcutshair_/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.facebook.com/profile.php?id=100093132221384" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}