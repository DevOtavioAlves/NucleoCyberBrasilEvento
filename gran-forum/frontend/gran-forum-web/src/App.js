import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { api } from './api';
export default function App() {
    // Estado base
    const [me, setMe] = useState(null);
    const [name, setName] = useState('Aluno');
    const [email, setEmail] = useState('aluno@ex.com');
    const [phone, setPhone] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [threads, setThreads] = useState([]);
    const [currentThread, setCurrentThread] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [replyText, setReplyText] = useState('');
    const [jobs, setJobs] = useState([]);
    // Carregar grupos e vagas
    useEffect(() => { api.listGroups().then(setGroups).catch(() => { }); }, []);
    useEffect(() => { api.listJobs().then(setJobs).catch(() => { }); }, []);
    // ===== Ações =====
    const createUser = async () => {
        const u = await api.createUser(name.trim(), email.trim(), phone.trim() || undefined);
        setMe(u);
        alert('Usuário criado! ✔');
    };
    const createGroup = async () => {
        if (!newGroupName.trim())
            return;
        const g = await api.createGroup(newGroupName.trim());
        setGroups([g, ...groups]);
        setNewGroupName('');
        alert('Grupo criado! ✔');
    };
    const selectGroup = async (g) => {
        setSelectedGroup(g);
        setCurrentThread(null);
        setThreads([]);
        if (me)
            await api.subscribe(g.id, me.id, true, true);
    };
    const openThread = (t) => {
        setCurrentThread({ thread: t, posts: [] });
    };
    const createThread = async () => {
        if (!me || !selectedGroup) {
            alert('Crie usuário e selecione um grupo.');
            return;
        }
        if (!newTitle.trim() || !newContent.trim())
            return;
        const t = await api.createThread(selectedGroup.id, me.id, newTitle.trim(), newContent.trim());
        setThreads([t, ...threads]);
        setCurrentThread({
            thread: t,
            posts: [{ author: me.name, content: newContent.trim(), createdAt: new Date().toISOString() }],
        });
        setNewTitle('');
        setNewContent('');
        alert('Tópico criado! Notificações enviadas por e‑mail/WhatsApp ✔');
    };
    const reply = async () => {
        if (!me || !currentThread) {
            alert('Crie usuário e abra um tópico.');
            return;
        }
        if (!replyText.trim())
            return;
        await api.reply(currentThread.thread.id, me.id, replyText.trim());
        setCurrentThread({
            thread: currentThread.thread,
            posts: [...currentThread.posts, { author: me.name, content: replyText.trim(), createdAt: new Date().toISOString() }]
        });
        setReplyText('');
        alert('Resposta enviada! Notificações disparadas ✔');
    };
    return (_jsxs("div", { style: styles.page, children: [_jsxs("aside", { style: styles.left, children: [_jsx("h2", { children: "Meu perfil" }), me ? (_jsxs("div", { style: styles.card, children: [_jsxs("div", { children: [_jsx("b", { children: "Nome:" }), " ", me.name] }), _jsxs("div", { children: [_jsx("b", { children: "Email:" }), " ", me.email] }), _jsxs("div", { children: [_jsx("b", { children: "Telefone:" }), " ", me.phone || '—'] })] })) : (_jsxs("div", { style: styles.card, children: [_jsx("label", { children: "Nome" }), _jsx("input", { value: name, onChange: e => setName(e.target.value) }), _jsx("label", { children: "Email" }), _jsx("input", { value: email, onChange: e => setEmail(e.target.value) }), _jsx("label", { children: "Telefone (WhatsApp)" }), _jsx("input", { value: phone, onChange: e => setPhone(e.target.value), placeholder: "+55..." }), _jsx("button", { onClick: createUser, children: "Criar usu\u00E1rio" })] })), _jsx("h2", { children: "Grupos" }), _jsxs("div", { style: styles.row, children: [_jsx("input", { placeholder: "Novo grupo...", value: newGroupName, onChange: e => setNewGroupName(e.target.value) }), _jsx("button", { onClick: createGroup, children: "+" })] }), _jsxs("div", { style: { maxHeight: 280, overflow: 'auto' }, children: [groups.map(g => (_jsx("div", { style: { ...styles.item, ...(selectedGroup?.id === g.id ? styles.itemActive : {}) }, onClick: () => selectGroup(g), children: g.name }, g.id))), !groups.length && _jsx("small", { children: "Nenhum grupo ainda." })] })] }), _jsxs("main", { style: styles.main, children: [_jsx("h2", { children: "F\u00F3rum" }), !selectedGroup && _jsx("p", { children: "Selecione um grupo \u00E0 esquerda." }), selectedGroup && (_jsxs(_Fragment, { children: [_jsxs("div", { style: styles.card, children: [_jsxs("h3", { children: ["Novo t\u00F3pico em ", _jsx("em", { children: selectedGroup.name })] }), _jsx("input", { placeholder: "T\u00EDtulo", value: newTitle, onChange: e => setNewTitle(e.target.value) }), _jsx("textarea", { placeholder: "Conte\u00FAdo da pergunta", rows: 4, value: newContent, onChange: e => setNewContent(e.target.value) }), _jsx("button", { onClick: createThread, disabled: !me, children: "Publicar" }), !me && _jsx("small", { children: "Crie seu usu\u00E1rio no painel \u00E0 esquerda." })] }), _jsx("h3", { children: "T\u00F3picos recentes" }), _jsxs("div", { style: { display: 'flex', gap: 16, flexWrap: 'wrap' }, children: [threads.map(t => (_jsxs("div", { style: { ...styles.card, width: 'calc(50% - 8px)', cursor: 'pointer' }, onClick: () => openThread(t), children: [_jsx("b", { children: t.title }), _jsx("br", {}), _jsx("small", { children: new Date(t.createdAt).toLocaleString() })] }, t.id))), !threads.length && _jsx("small", { children: "Crie o primeiro t\u00F3pico acima." })] }), currentThread && (_jsxs("div", { style: { ...styles.card, marginTop: 16 }, children: [_jsx("h3", { children: currentThread.thread.title }), _jsx("div", { style: { display: 'grid', gap: 12 }, children: currentThread.posts.map((p, i) => (_jsxs("div", { style: styles.post, children: [_jsxs("div", { style: { fontSize: 12, color: '#666' }, children: [p.author || 'Autor', " \u2014 ", new Date(p.createdAt).toLocaleString()] }), _jsx("div", { children: p.content })] }, i))) }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx("textarea", { rows: 3, placeholder: "Escreva sua resposta...", value: replyText, onChange: e => setReplyText(e.target.value) }), _jsx("button", { onClick: reply, disabled: !me, children: "Responder" })] })] }))] }))] }), _jsxs("aside", { style: styles.right, children: [_jsx("h2", { children: "Vagas" }), _jsxs("div", { style: { maxHeight: 560, overflow: 'auto' }, children: [jobs.map(j => (_jsx("a", { href: j.url, target: "_blank", style: { textDecoration: 'none', color: '#111' }, children: _jsxs("div", { style: styles.job, children: [_jsx("b", { children: j.title }), _jsx("br", {}), _jsxs("small", { children: [j.company || '—', " \u2022 ", j.location || '—', " \u2022 ", _jsx("i", { children: j.source })] })] }) }, j.url))), !jobs.length && _jsx("small", { children: "Quando o n8n importar (Adzuna/Jooble), aparecem aqui." })] })] })] }));
}
const styles = {
    page: { display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: 16, padding: 16, fontFamily: 'system-ui, Arial', color: '#111' },
    left: { borderRight: '1px solid #eee', paddingRight: 16 },
    main: { paddingRight: 16 },
    right: { borderLeft: '1px solid #eee', paddingLeft: 16 },
    row: { display: 'grid', gridTemplateColumns: '1fr 48px', gap: 8, marginBottom: 8 },
    card: { border: '1px solid #ddd', borderRadius: 8, padding: 12, display: 'grid', gap: 8, background: '#fff' },
    item: { padding: '8px 10px', borderRadius: 6, border: '1px solid transparent', cursor: 'pointer' },
    itemActive: { borderColor: '#2b8a3e', background: '#f0fff4' },
    post: { border: '1px solid #eee', borderRadius: 6, padding: 8, background: '#fafafa' },
    job: { border: '1px solid #eee', borderRadius: 8, padding: 10, marginBottom: 10, background: '#fff' },
};
//# sourceMappingURL=App.js.map