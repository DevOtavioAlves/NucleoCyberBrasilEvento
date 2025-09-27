export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
};
export type Group = {
    id: string;
    name: string;
    createdAt: string;
};
export type Thread = {
    id: string;
    groupId: string;
    authorId: string;
    title: string;
    createdAt: string;
};
export type Post = {
    id: string;
    threadId: string;
    authorId: string;
    content: string;
    via: string;
    createdAt: string;
};
export type Job = {
    id: string;
    title: string;
    company?: string;
    location?: string;
    url: string;
    source: string;
    createdAt: string;
};
export declare const api: {
    createUser: (name: string, email: string, phone?: string) => Promise<User>;
    listGroups: () => Promise<Group[]>;
    createGroup: (name: string) => Promise<Group>;
    subscribe: (groupId: string, userId: string, emailOn?: boolean, waOn?: boolean) => Promise<unknown>;
    createThread: (groupId: string, authorId: string, title: string, content: string) => Promise<Thread>;
    reply: (threadId: string, authorId: string, content: string) => Promise<Post>;
    listJobs: () => Promise<any>;
};
//# sourceMappingURL=api.d.ts.map