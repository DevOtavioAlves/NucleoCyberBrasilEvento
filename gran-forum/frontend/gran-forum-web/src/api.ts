// src/api.ts
export type User = { id: string; name: string; email: string; phone?: string|null };
export type Group = { id: string; name: string; createdAt: string };
export type Thread = { id: string; groupId: string; authorId: string; title: string; createdAt: string };
export type Post = { id: string; threadId: string; authorId: string; content: string; via: string; createdAt: string };
export type Job = { id: string; title: string; company?: string; location?: string; url: string; source: string; createdAt: string };

const API = '';

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Users
  createUser: (name: string, email: string, phone?: string) =>
    fetch(`${API}/api/users`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, phone })
    }).then(j<User>),

  // Groups
  listGroups: () => fetch(`${API}/api/groups`).then(j<Group[]>),
  createGroup: (name: string) =>
    fetch(`${API}/api/groups`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name })}).then(j<Group>),
  subscribe: (groupId: string, userId: string, emailOn=true, waOn=true) =>
    fetch(`${API}/api/groups/${groupId}/subscribe`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId, emailOn, waOn })}).then(j),

  // Threads & Posts
  createThread: (groupId:string, authorId:string, title:string, content:string) =>
    fetch(`${API}/api/groups/${groupId}/threads`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ authorId, title, content })
    }).then(j<Thread>),

  reply: (threadId:string, authorId:string, content:string) =>
    fetch(`${API}/api/threads/${threadId}/replies`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ authorId, content })
    }).then(j<Post>),

  // Jobs
  listJobs: () => fetch(`${API}/api/jobs`).then(r => r.ok ? r.json() : [] as Job[]),
};
