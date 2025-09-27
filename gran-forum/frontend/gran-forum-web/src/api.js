const API = '';
async function j(res) {
    if (!res.ok)
        throw new Error(await res.text());
    return res.json();
}
export const api = {
    // Users
    createUser: (name, email, phone) => fetch(`${API}/api/users`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    }).then((j)),
    // Groups
    listGroups: () => fetch(`${API}/api/groups`).then((j)),
    createGroup: (name) => fetch(`${API}/api/groups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) }).then((j)),
    subscribe: (groupId, userId, emailOn = true, waOn = true) => fetch(`${API}/api/groups/${groupId}/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, emailOn, waOn }) }).then(j),
    // Threads & Posts
    createThread: (groupId, authorId, title, content) => fetch(`${API}/api/groups/${groupId}/threads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId, title, content })
    }).then((j)),
    reply: (threadId, authorId, content) => fetch(`${API}/api/threads/${threadId}/replies`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId, content })
    }).then((j)),
    // Jobs
    listJobs: () => fetch(`${API}/api/jobs`).then(r => r.ok ? r.json() : []),
};
//# sourceMappingURL=api.js.map