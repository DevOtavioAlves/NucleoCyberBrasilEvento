import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import path from 'path';
dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// E-mail (produção: Brevo/Resend; dev: apontar para Mailpit se usar)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 1025),
  secure: process.env.SMTP_SECURE === 'true',
  auth: (process.env.SMTP_USER && process.env.SMTP_PASS) ? {
    user: process.env.SMTP_USER, pass: process.env.SMTP_PASS
  } : undefined,
});

async function notifyGroupByEmail(groupId: string, subject: string, html: string) {
  const subs = await prisma.subscription.findMany({ where: { groupId, emailOn: true }, include: { user: true }});
  const to = subs.map(s => s.user.email).filter(Boolean);
  if (!to.length) return;
  await transporter.sendMail({ from: process.env.FROM_EMAIL || 'no-reply@forum.local', bcc: to, subject, html });
}

async function notifyGroupByWhatsApp(groupId: string, text: string) {
  const subs = await prisma.subscription.findMany({ where: { groupId, waOn: true }, include: { user: true }});
  const phones = subs.map(s => s.user.phone).filter(Boolean);
  if (!phones.length) return;
  await fetch(process.env.N8N_WHATSAPP_WEBHOOK!, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phones, text })
  });
}

// Rotas básicas
app.get('/api/groups', async (_req, res) => {
  res.json(await prisma.group.findMany({ orderBy: { createdAt: 'desc' }}));
});

app.post('/api/users', async (req, res) => {
  const schema = z.object({ name: z.string(), email: z.string().email(), phone: z.string().optional() });
  res.json(await prisma.user.create({ data: schema.parse(req.body) }));
});

app.post('/api/groups', async (req, res) => {
  const data = z.object({ name: z.string() }).parse(req.body);
  res.json(await prisma.group.create({ data }));
});

app.post('/api/groups/:groupId/subscribe', async (req, res) => {
  const { groupId } = req.params;
  const data = z.object({ userId: z.string(), emailOn: z.boolean().optional(), waOn: z.boolean().optional() }).parse(req.body);
  res.json(await prisma.subscription.upsert({
    where: { userId_groupId: { userId: data.userId, groupId } },
    update: { emailOn: data.emailOn ?? true, waOn: data.waOn ?? true },
    create: { userId: data.userId, groupId, emailOn: data.emailOn ?? true, waOn: data.waOn ?? true }
  }));
});

app.post('/api/groups/:groupId/threads', async (req, res) => {
  const { groupId } = req.params;
  const data = z.object({ authorId: z.string(), title: z.string(), content: z.string() }).parse(req.body);
  const thread = await prisma.thread.create({
    data: {
      groupId, authorId: data.authorId, title: data.title,
      posts: { create: { authorId: data.authorId, content: data.content, via: 'web' } }
    }, include: { posts: true }
  });
  const subject = `[${thread.title}] Nova pergunta`;
  const html = `<p>${data.content}</p><p><thread/${thread.id}Abrir no fórum</a></p>`;
  const text = `Nova pergunta: "${thread.title}"\n${data.content}\nAcesse: http://SEU_IP_OU_DOMINIO/thread/${thread.id}`;
  await notifyGroupByEmail(groupId, subject, html);
  await notifyGroupByWhatsApp(groupId, text);
  res.json(thread);
});

app.post('/api/threads/:threadId/replies', async (req, res) => {
  const { threadId } = req.params;
  const data = z.object({ authorId: z.string(), content: z.string(), via: z.enum(['web','whatsapp']).optional() }).parse(req.body);
  const post = await prisma.post.create({ data: { threadId, authorId: data.authorId, content: data.content, via: data.via ?? 'web' }});
  const thread = await prisma.thread.findUnique({ where: { id: threadId }, include: { group: true }});
  if (thread) {
    const subject = `[${thread.title}] Nova resposta`;
    const html = `<p>${data.content}</p><p>/thread/${thread.id}Abrir no fórum</a></p>`;
    const text = `Nova resposta em "${thread.title}":\n${data.content}\nAcesse: http://SEU_IP_OU_DOMINIO/thread/${thread.id}`;
    await notifyGroupByEmail(thread.groupId, subject, html);
    await notifyGroupByWhatsApp(thread.groupId, text);
  }
  res.json(post);
});

// Webhook do n8n (mensagem recebida via WhatsApp -> cria resposta)
app.post('/api/webhooks/whatsapp', async (req, res) => {
  const { threadId, authorPhone, text } = req.body;
  const user = await prisma.user.findFirst({ where: { phone: authorPhone }});
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado pelo phone' });
  const post = await prisma.post.create({ data: { threadId, authorId: user.id, content: text, via: 'whatsapp' }});
  res.json({ ok: true, post });
});

// (opcional) servir frontend estático daqui:
import fs from 'fs';
const publicDir = path.resolve(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => res.sendFile(path.join(publicDir, 'index.html')));
}

const port = Number(process.env.PORT || 3001);

app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});
