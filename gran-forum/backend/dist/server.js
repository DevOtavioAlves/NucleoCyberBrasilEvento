"use strict";
// /opt/gran-forum/backend/src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
/** -----------------------------
 *  E-MAIL (Nodemailer)
 *  Lê host/porta/secure/user/pass do .env
 *  ----------------------------- */
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || '127.0.0.1',
    port: Number(process.env.SMTP_PORT || 1025),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
});
/** -----------------------------
 *  Helpers de Notificação
 *  ----------------------------- */
async function notifyGroupByEmail(groupId, subject, html) {
    const subs = await prisma.subscription.findMany({
        where: { groupId, emailOn: true },
        include: { user: true },
    });
    const bcc = subs.map((s) => s.user.email).filter(Boolean);
    if (!bcc.length)
        return;
    await transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@forum.local',
        bcc,
        subject,
        html,
    });
}
async function notifyGroupByWhatsApp(groupId, text) {
    const subs = await prisma.subscription.findMany({
        where: { groupId, waOn: true },
        include: { user: true },
    });
    const phones = subs.map((s) => s.user.phone).filter(Boolean);
    if (!phones.length)
        return;
    const webhook = process.env.N8N_WHATSAPP_WEBHOOK;
    if (!webhook)
        return;
    await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phones, text }),
    });
}
/** -----------------------------
 *  ROTAS DE API
 *  ----------------------------- */
// Listar grupos
app.get('/api/groups', async (_req, res) => {
    const groups = await prisma.group.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(groups);
});
// Criar usuário
app.post('/api/users', async (req, res) => {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().optional(),
    });
    const data = schema.parse(req.body);
    const user = await prisma.user.create({ data });
    res.json(user);
});
// Criar grupo
app.post('/api/groups', async (req, res) => {
    const schema = zod_1.z.object({ name: zod_1.z.string().min(1) });
    const data = schema.parse(req.body);
    const group = await prisma.group.create({ data });
    res.json(group);
});
// Assinar grupo (email/whatsapp)
app.post('/api/groups/:groupId/subscribe', async (req, res) => {
    const { groupId } = req.params;
    const schema = zod_1.z.object({
        userId: zod_1.z.string().min(1),
        emailOn: zod_1.z.boolean().optional(),
        waOn: zod_1.z.boolean().optional(),
    });
    const data = schema.parse(req.body);
    const sub = await prisma.subscription.upsert({
        where: { userId_groupId: { userId: data.userId, groupId } },
        update: { emailOn: data.emailOn ?? true, waOn: data.waOn ?? true },
        create: { userId: data.userId, groupId, emailOn: data.emailOn ?? true, waOn: data.waOn ?? true },
    });
    res.json(sub);
});
// Criar tópico (notifica por e‑mail e chama n8n para WhatsApp)
app.post('/api/groups/:groupId/threads', async (req, res) => {
    const { groupId } = req.params;
    const schema = zod_1.z.object({
        authorId: zod_1.z.string().min(1),
        title: zod_1.z.string().min(1),
        content: zod_1.z.string().min(1),
    });
    const data = schema.parse(req.body);
    const thread = await prisma.thread.create({
        data: {
            groupId,
            authorId: data.authorId,
            title: data.title,
            posts: { create: { authorId: data.authorId, content: data.content, via: 'web' } },
        },
        include: { posts: true },
    });
    const subject = `[${thread.title}] Nova pergunta no grupo`;
    const link = `http://localhost:${process.env.PORT || 3001}/thread/${thread.id}`;
    const html = `<p>${data.content}</p><p>${link}Abrir no fórum</a></p>`;
    const text = `Nova pergunta: "${thread.title}"\n${data.content}\nAcesse: ${link}`;
    await notifyGroupByEmail(groupId, subject, html);
    await notifyGroupByWhatsApp(groupId, text);
    res.json(thread);
});
// Responder tópico
app.post('/api/threads/:threadId/replies', async (req, res) => {
    const { threadId } = req.params;
    const schema = zod_1.z.object({
        authorId: zod_1.z.string().min(1),
        content: zod_1.z.string().min(1),
        via: zod_1.z.enum(['web', 'whatsapp']).optional(),
    });
    const data = schema.parse(req.body);
    const post = await prisma.post.create({
        data: { threadId, authorId: data.authorId, content: data.content, via: data.via ?? 'web' },
    });
    const thread = await prisma.thread.findUnique({ where: { id: threadId } });
    if (thread) {
        const subject = `[${thread.title}] Nova resposta`;
        const link = `http://localhost:${process.env.PORT || 3001}/thread/${thread.id}`;
        const html = `<p>${data.content}</p><p>${link}Abrir no fórum</a></p>`;
        const text = `Nova resposta em "${thread.title}":\n${data.content}\nAcesse: ${link}`;
        await notifyGroupByEmail(thread.groupId, subject, html);
        await notifyGroupByWhatsApp(thread.groupId, text);
    }
    res.json(post);
});
// Webhook chamado pelo n8n quando chega mensagem do WhatsApp (inbound)
app.post('/api/webhooks/whatsapp', async (req, res) => {
    const schema = zod_1.z.object({
        threadId: zod_1.z.string().min(1),
        authorPhone: zod_1.z.string().min(1),
        text: zod_1.z.string().min(1),
    });
    const { threadId, authorPhone, text } = schema.parse(req.body);
    const user = await prisma.user.findFirst({ where: { phone: authorPhone } });
    if (!user)
        return res.status(400).json({ error: 'Usuário não encontrado pelo phone' });
    const post = await prisma.post.create({
        data: { threadId, authorId: user.id, content: text, via: 'whatsapp' },
    });
    res.json({ ok: true, post });
});
// Importar vagas (n8n -> backend)
app.post('/api/jobs/import', async (req, res) => {
    const schema = zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string(),
            company: zod_1.z.string().optional(),
            location: zod_1.z.string().optional(),
            source: zod_1.z.string(),
            url: zod_1.z.string().url(),
            publishedAt: zod_1.z.string().optional(),
            tags: zod_1.z.string().optional(),
        })),
    });
    const { items } = schema.parse(req.body);
    const results = await prisma.$transaction(items.map((i) => prisma.jobListing.upsert({
        where: { url: i.url },
        update: {
            title: i.title,
            company: i.company,
            location: i.location,
            source: i.source,
            publishedAt: i.publishedAt ? new Date(i.publishedAt) : null,
            tags: i.tags ?? null,
        },
        create: {
            title: i.title,
            company: i.company,
            location: i.location,
            source: i.source,
            url: i.url,
            publishedAt: i.publishedAt ? new Date(i.publishedAt) : null,
            tags: i.tags ?? null,
        },
    })));
    res.json({ imported: results.length });
});
// Listar vagas (mais recentes primeiro)
app.get('/api/jobs', async (_req, res) => {
    const jobs = await prisma.jobListing.findMany({
        orderBy: { createdAt: 'desc' },
        take: 30,
    });
    res.json(jobs);
});
/** -----------------------------
 *  SERVIR FRONTEND (build do Vite)
 *  publicDir = /opt/gran-forum/backend/public (copiado do /frontend/.../dist)
 *  ----------------------------- */
const publicDir = path_1.default.resolve(__dirname, '../public');
if (fs_1.default.existsSync(publicDir)) {
    app.use(express_1.default.static(publicDir));
    // ⚠️ Express 5: catch‑all DEVE ser nomeado OU RegExp (nada de '*')
    app.get('/{*splat}', (_req, res) => {
        res.sendFile(path_1.default.join(publicDir, 'index.html'));
    });
    // Alternativa (RegExp):
    // app.get(/.*/, (_req, res) => {
    //   res.sendFile(path.join(publicDir, 'index.html'));
    // });
}
/** -----------------------------
 *  START
 *  ----------------------------- */
const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`API on http://127.0.0.1:${port}`);
});
