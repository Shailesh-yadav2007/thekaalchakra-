"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, RefreshCw } from "lucide-react";

type UserRole = "OWNER" | "ADMIN" | "EDITOR" | "REPORTER";

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    _count: { authoredArticles: number };
}

interface Props {
    users: User[];
    currentUserId: string;
    currentUserRole: UserRole;
}

const ROLE_COLORS: Record<UserRole, string> = {
    OWNER: "role-owner",
    ADMIN: "role-admin",
    EDITOR: "role-editor",
    REPORTER: "role-reporter",
};

const ASSIGNABLE_ROLES: Record<UserRole, UserRole[]> = {
    OWNER: ["ADMIN", "EDITOR", "REPORTER"],
    ADMIN: ["EDITOR", "REPORTER"],
    EDITOR: [],
    REPORTER: [],
};

export function UsersClient({ users: initialUsers, currentUserId, currentUserRole }: Props) {
    const router = useRouter();
    const [users, setUsers] = useState(initialUsers);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState("");

    // Add user form state
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" as UserRole });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    const canCreate = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
    const canDelete = currentUserRole === "OWNER";
    const assignable = ASSIGNABLE_ROLES[currentUserRole];

    async function handleAddUser(e: React.FormEvent) {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");

        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) {
            setFormError(data.error || "Failed to create user");
            setFormLoading(false);
            return;
        }

        setUsers(prev => [...prev, { ...data, _count: { authoredArticles: 0 } }]);
        setForm({ name: "", email: "", password: "", role: "EDITOR" });
        setShowModal(false);
        setFormLoading(false);
    }

    async function handleRoleChange(userId: string, role: UserRole) {
        setLoading(userId);
        setError("");

        const res = await fetch(`/api/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });

        if (res.ok) {
            const updated = await res.json();
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u));
        } else {
            const data = await res.json();
            setError(data.error || "Failed to update role");
        }
        setLoading(null);
    }

    async function handleDelete(userId: string, name: string) {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        setLoading(userId);

        const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
        if (res.ok) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            const data = await res.json();
            setError(data.error || "Failed to delete user");
        }
        setLoading(null);
    }

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Users</h1>
                {canCreate && (
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        <UserPlus size={18} />
                        Add User
                    </button>
                )}
            </div>

            {error && (
                <div className="admin-error-banner">
                    {error}
                    <button onClick={() => setError("")}>✕</button>
                </div>
            )}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Articles</th>
                            <th>Joined</th>
                            {(assignable.length > 0 || canDelete) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const isSelf = user.id === currentUserId;
                            const canEditRole = !isSelf && assignable.includes(user.role as any) && assignable.length > 0;
                            const canDeleteUser = canDelete && !isSelf && user.role !== "OWNER";

                            return (
                                <tr key={user.id}>
                                    <td>
                                        {user.name}
                                        {isSelf && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`status-badge ${ROLE_COLORS[user.role]}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user._count.authoredArticles}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    {(assignable.length > 0 || canDelete) && (
                                        <td>
                                            <div className="table-actions">
                                                {canEditRole && (
                                                    <select
                                                        value={user.role}
                                                        disabled={loading === user.id}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                                        className="role-select"
                                                    >
                                                        {assignable.map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                {loading === user.id && <RefreshCw size={14} className="spin" />}
                                                {canDeleteUser && (
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.name)}
                                                        disabled={loading === user.id}
                                                        className="table-action-btn danger"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Add New User</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
                        </div>

                        <form onSubmit={handleAddUser} className="modal-body">
                            {formError && <div className="form-error">{formError}</div>}

                            <div className="form-group">
                                <label htmlFor="new-name">Full Name</label>
                                <input
                                    id="new-name"
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Rahul Sharma"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new-email">Email</label>
                                <input
                                    id="new-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="rahul@kaalchakra.news"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new-password">Temporary Password</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new-role">Role</label>
                                <select
                                    id="new-role"
                                    value={form.role}
                                    onChange={(e) => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
                                    className="form-input"
                                >
                                    {currentUserRole === "OWNER" && <option value="ADMIN">Admin</option>}
                                    <option value="EDITOR">Editor</option>
                                    <option value="REPORTER">Reporter</option>
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={formLoading} className="btn btn-primary">
                                    {formLoading ? "Creating..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
