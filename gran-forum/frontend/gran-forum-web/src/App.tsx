import { useEffect, useState } from 'react';
import { api } from './api';
import type { Group, Thread, Job, User } from './api';

type ThreadView = {
  thread: Thread;
  posts: { author?: string; content: string; createdAt: string }[];
};

export default function App() {
  // Estado base
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState('Aluno');
  const [email, setEmail] = useState('aluno@ex.com');
  const [phone, setPhone] = useState('');

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<ThreadView | null>(null);

  const [newGroupName, setNewGroupName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const [replyText, setReplyText] = useState('');

  const [jobs, setJobs] = useState<Job[]>([]);

  // Carregar grupos e vagas
  useEffect(() => { api.listGroups().then(setGroups).catch(()=>{}); }, []);
  useEffect(() => { api.listJobs().then(setJobs).catch(()=>{}); }, []);

  // ===== Ações =====
  const createUser = async () => {
    const u = await api.createUser(name.trim(), email.trim(), phone.trim() || undefined);
    setMe(u);
    alert('Usuário criado! ✔');
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    const g = await api.createGroup(newGroupName.trim());
    setGroups([g, ...groups]);
    setNewGroupName('');
    alert('Grupo criado! ✔');
  };

  const selectGroup = async (g: Group) => {
    setSelectedGroup(g);
    setCurrentThread(null);
    setThreads([]);
    if (me) await api.subscribe(g.id, me.id, true, true);
  };

  const openThread = (t: Thread) => {
    setCurrentThread({ thread: t, posts: [] });
  };

  const createThread = async () => {
    if (!me || !selectedGroup) { alert('Crie usuário e selecione um grupo.'); return; }
    if (!newTitle.trim() || !newContent.trim()) return;
    const t = await api.createThread(selectedGroup.id, me.id, newTitle.trim(), newContent.trim());
    setThreads([t, ...threads]);
    setCurrentThread({
      thread: t,
      posts: [{ author: me.name, content: newContent.trim(), createdAt: new Date().toISOString() }],
    });
    setNewTitle(''); setNewContent('');
    alert('Tópico criado! Notificações enviadas por e‑mail/WhatsApp ✔');
  };

  const reply = async () => {
    if (!me || !currentThread) { alert('Crie usuário e abra um tópico.'); return; }
    if (!replyText.trim()) return;
    await api.reply(currentThread.thread.id, me.id, replyText.trim());
    setCurrentThread({
      thread: currentThread.thread,
      posts: [...currentThread.posts, { author: me.name, content: replyText.trim(), createdAt: new Date().toISOString() }]
    });
    setReplyText('');
    alert('Resposta enviada! Notificações disparadas ✔');
  };

  return (
    <div style={styles.page}>
      {/* COLUNA ESQUERDA: Identidade + Grupos */}
      <aside style={styles.left}>
        <h2>Meu perfil</h2>
        {me ? (
          <div style={styles.card}>
            <div><b>Nome:</b> {me.name}</div>
            <div><b>Email:</b> {me.email}</div>
            <div><b>Telefone:</b> {me.phone || '—'}</div>
          </div>
        ) : (
          <div style={styles.card}>
            <label>Nome</label>
            <input value={name} onChange={e=>setName(e.target.value)} />
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} />
            <label>Telefone (WhatsApp)</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+55..." />
            <button onClick={createUser}>Criar usuário</button>
          </div>
        )}

        <h2>Grupos</h2>
        <div style={styles.row}>
          <input placeholder="Novo grupo..." value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} />
          <button onClick={createGroup}>+</button>
        </div>
        <div style={{maxHeight:280, overflow:'auto'}}>
          {groups.map(g => (
            <div key={g.id}
                 style={{...styles.item, ...(selectedGroup?.id===g.id ? styles.itemActive: {})}}
                 onClick={()=>selectGroup(g)}>
              {g.name}
            </div>
          ))}
          {!groups.length && <small>Nenhum grupo ainda.</small>}
        </div>
      </aside>

      {/* COLUNA CENTRAL: Tópicos e Thread atual */}
      <main style={styles.main}>
        <h2>Fórum</h2>

        {!selectedGroup && <p>Selecione um grupo à esquerda.</p>}

        {selectedGroup && (
          <>
            <div style={styles.card}>
              <h3>Novo tópico em <em>{selectedGroup.name}</em></h3>
              <input placeholder="Título" value={newTitle} onChange={e=>setNewTitle(e.target.value)}/>
              <textarea placeholder="Conteúdo da pergunta" rows={4} value={newContent} onChange={e=>setNewContent(e.target.value)} />
              <button onClick={createThread} disabled={!me}>Publicar</button>
              {!me && <small>Crie seu usuário no painel à esquerda.</small>}
            </div>

            <h3>Tópicos recentes</h3>
            <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
              {threads.map(t => (
                <div key={t.id} style={{...styles.card, width: 'calc(50% - 8px)', cursor:'pointer'}} onClick={()=>openThread(t)}>
                  <b>{t.title}</b><br/>
                  <small>{new Date(t.createdAt).toLocaleString()}</small>
                </div>
              ))}
              {!threads.length && <small>Crie o primeiro tópico acima.</small>}
            </div>

            {currentThread && (
              <div style={{...styles.card, marginTop:16}}>
                <h3>{currentThread.thread.title}</h3>
                <div style={{display:'grid', gap:12}}>
                  {currentThread.posts.map((p, i) => (
                    <div key={i} style={styles.post}>
                      <div style={{fontSize:12, color:'#666'}}>{p.author || 'Autor'} — {new Date(p.createdAt).toLocaleString()}</div>
                      <div>{p.content}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12}}>
                  <textarea rows={3} placeholder="Escreva sua resposta..." value={replyText} onChange={e=>setReplyText(e.target.value)} />
                  <button onClick={reply} disabled={!me}>Responder</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* COLUNA DIREITA: Vagas */}
      <aside style={styles.right}>
        <h2>Vagas</h2>
        <div style={{maxHeight:560, overflow:'auto'}}>
          {jobs.map(j => (
            <a key={j.url} href={j.url} target="_blank" style={{textDecoration:'none', color:'#111'}}>
              <div style={styles.job}>
                <b>{j.title}</b><br/>
                <small>{j.company || '—'} • {j.location || '—'} • <i>{j.source}</i></small>
              </div>
            </a>
          ))}
          {!jobs.length && <small>Quando o n8n importar (Adzuna/Jooble), aparecem aqui.</small>}
        </div>
      </aside>
    </div>
  );
}

const styles: Record<string, any> = {
  page: { display:'grid', gridTemplateColumns:'280px 1fr 320px', gap:16, padding:16, fontFamily:'system-ui, Arial', color:'#111' },
  left: { borderRight:'1px solid #eee', paddingRight:16 },
  main: { paddingRight:16 },
  right:{ borderLeft:'1px solid #eee', paddingLeft:16 },

  row: { display:'grid', gridTemplateColumns:'1fr 48px', gap:8, marginBottom:8 },
  card:{ border:'1px solid #ddd', borderRadius:8, padding:12, display:'grid', gap:8, background:'#fff' },
  item:{ padding:'8px 10px', borderRadius:6, border:'1px solid transparent', cursor:'pointer' },
  itemActive:{ borderColor:'#2b8a3e', background:'#f0fff4' },

  post:{ border:'1px solid #eee', borderRadius:6, padding:8, background:'#fafafa' },
  job:{ border:'1px solid #eee', borderRadius:8, padding:10, marginBottom:10, background:'#fff' },
};
