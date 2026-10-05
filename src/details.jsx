import { projects as base } from './art.jsx'
// All project content. Two groups: 'apps' (shown in an iPhone) and 'agents' (shown as websites).
// light: true  -> also featured on the light "Work" section. `site` = your live website URL (agents).
// Screenshots: drop files into src/assets/shots/ named after `slug` (see README.txt there).
const svgOf = t => base.find(p => p.title === t)?.svg
const nexus = <svg viewBox="0 0 120 120"><rect className="f" x="14" y="30" width="92" height="62" rx="12"/><path className="o" d="M14 52h92M28 72h24"/><circle className="y" cx="86" cy="72" r="9"/><path className="o" d="M40 22l10-8 10 8"/></svg>
const D = [
  { slug: 'nexuspay', group: 'apps', light: true, ac: '#2563eb', title: 'NexusPay', kind: 'Application · UPI detection system', status: 'application',
    blurb: 'a UPI detection system that flags risky payments before you confirm.',
    about: 'NexusPay is a UPI detection system built as a mobile app. Before a payment goes through it scores the risk, explains why, and lets you cancel; a fraud intelligence center keeps the alerts in one place.',
    points: ['pre-payment risk check: a risk score with a LOW / MEDIUM / HIGH label and plain-language reasons, e.g. a new receiver not in your contacts or an unknown device', 'Fraud Intelligence Center on the home screen: critical alerts such as a suspicious login attempt, with a security log to review', 'home shortcuts for Scan & Pay, Send Money, Heat Maps and Detect Fraud, plus an account security status card', 'dark, blue-accent UI from onboarding through to the payment warning sheet'],
    stack: [], svg: nexus }, // TODO: add NexusPay's tech stack to `stack`
  { slug: 'vani', group: 'apps', light: true, ac: '#2f6bff', title: 'VANI', kind: 'Application · ML · accessibility', status: 'deployed backend',
    blurb: 'indian sign language, recognised on a phone.',
    about: 'A Flutter app that recognises Indian Sign Language through the camera and turns it into text and speech, powered by a YOLOv11 model behind a FastAPI service deployed on Railway. It also carries an emergency alert centre, because accessibility tech should work when it matters most.',
    points: ['live sign recognition through the camera, with a confidence score and the result translated into the language you pick (English and Hindi shown)', 'Output, Builder and Transcript tabs: build sentences sign by sign, keep a transcript, and hear it read aloud', 'Emergency Alert Centre: six emergency types (help, medical, unsafe, fire, road accident, child in danger) that send an alert with your GPS location to your emergency contacts, plus a helpline quick reference', 'Flutter app talking to a FastAPI + YOLOv11 backend over WebSockets', 'debugged the model download pipeline and a WebSocket DNS mismatch against the live Railway domain'],
    stack: ['Flutter', 'FastAPI', 'YOLOv11', 'Railway'] },
  { slug: 'aurix', group: 'apps', ac: '#ff9500', title: 'Aurix', kind: 'Application · fitness · AI coach', status: 'in progress',
    blurb: 'a fitness app with an AI coach that knows your context.',
    about: 'A Flutter fitness app backed by Supabase, formerly called FitForge. The coach is prompted dynamically from your real training context, so its feedback is about you, not a generic user.',
    points: ['photo-based meal logging with a Groq vision model', 'AI coach: post-workout feedback and weekly scoring reports', 'plate calculator, progressive overload engine, push notifications', 'client-side resilience layer with typed exceptions and Result-style handling', 'dark UI with an orange accent: a home dashboard with streak, sets, volume and a daily completion ring', 'nutrition tracker: weekly calorie trend against a target, meals logged with protein, carbs and fat', 'progress analytics: sessions per week and an all-time muscle-split donut'],
    stack: ['Flutter', 'Supabase', 'Groq'] },
  { slug: 'scrybe', group: 'agents', light: true, ac: '#8b6bff', site: '', title: 'Scrybe', kind: 'Agentic AI · video intelligence', status: 'live website',
    blurb: 'an agentic system that understands video.',
    about: 'An agentic video intelligence system. Videos are processed in the background by Celery workers, indexed for retrieval with FAISS and explored through a two-column React app with a dark violet-to-cyan look.',
    points: ['FastAPI + LangGraph pipeline with Celery and Redis for background jobs', 'multi-session security audit: URL and video-ID validation, CORS, file-extension whitelisting', 'robustness fixes for FAISS edge cases, Celery task expiry and file cleanup', 'found and fixed a keyframe path mismatch that silently broke every visual description', 'recruiter-facing README and a Docker Compose run guide'],
    stack: ['FastAPI', 'LangGraph', 'Celery', 'Redis', 'FAISS', 'React'] },
  { slug: 'adaptiverag', group: 'agents', light: true, ac: '#3be6ff', site: '', title: 'AdaptiveRAG', kind: 'Agentic AI · retrieval', status: 'live website',
    blurb: 'a retrieval-augmented generation system, with a frontend to match.',
    about: 'The front end for a RAG system that retrieves with both FAISS vector search and BM25 keyword search, orchestrated with LangGraph, and answers with Mistral AI.',
    points: ['hybrid retrieval: FAISS (dense) and BM25 (sparse)', 'graph-orchestrated pipeline built on LangGraph', 'Mistral AI for generation'],
    stack: ['LangGraph', 'FAISS', 'BM25', 'Mistral AI'] },
  { slug: 'agent-researcher', group: 'agents', ac: '#ffc83d', site: '', title: 'Agent Researcher', kind: 'Agentic AI · research agent', status: 'first agentic project', badge: 'my first agentic project · built at 17',
    blurb: 'an agent that researches a question end to end.',
    about: 'Where my agentic journey started: an agentic research tool I built at 17. A LangGraph agent works through a question step by step, pulls sources from the web with Tavily, reasons over them with models served by Groq, and hands the findings to a React front end.',
    points: ['multi-step agent graph orchestrated with LangGraph', 'web search through Tavily, fast inference through Groq', 'FastAPI backend, React front end', 'landing and app pages redesigned toward a dense layout with SVG icons and a fixed three-zone sidebar'],
    stack: ['LangGraph', 'FastAPI', 'Groq', 'Tavily', 'React'] },
]
export const all = D.map(d => ({ ...d, svg: d.svg ?? svgOf(d.title) }))
export const apps = all.filter(p => p.group === 'apps')
export const agents = all.filter(p => p.group === 'agents')
