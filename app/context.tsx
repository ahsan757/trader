'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Item, Payment } from './types';

interface ProjectContextType {
    projects: Project[];
    activeProject: Project | null;
    setActiveProject: (project: Project | null) => void;
    addProject: (name: string) => Promise<void>;
    addItem: (projectId: string, section: 'buy' | 'give', item: Omit<Item, 'id' | 'totalAmount'>) => Promise<void>;
    updateItem: (projectId: string, section: 'buy' | 'give', index: number, item: Omit<Item, 'id' | 'totalAmount'>) => Promise<void>;
    deleteItem: (projectId: string, section: 'buy' | 'give', index: number) => Promise<void>;
    addPayment: (projectId: string, section: 'buy' | 'give', payment: Omit<Payment, 'id'>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper to convert Mongo _id to id recursively
    const sanitize = (p: any) => {
        if (!p || p.error) return null;
        return {
            ...p,
            id: p._id || p.id,
            buyItems: (p.buyItems || []).map((i: any) => i ? ({ ...i, id: i._id || i.id }) : null).filter(Boolean),
            buyPayments: (p.buyPayments || []).map((py: any) => py ? ({ ...py, id: py._id || py.id }) : null).filter(Boolean),
            giveItems: (p.giveItems || []).map((i: any) => i ? ({ ...i, id: i._id || i.id }) : null).filter(Boolean),
            givePayments: (p.givePayments || []).map((py: any) => py ? ({ ...py, id: py._id || py.id }) : null).filter(Boolean),
        };
    };

    // Load from MongoDB
    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data.map(sanitize).filter(Boolean));
            }
        } catch (e) {
            console.error('Failed to fetch projects', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const addProject = async (name: string) => {
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, buyItems: [], buyPayments: [], giveItems: [], givePayments: [] }),
            });
            const newProj = await res.json();
            const sanitized = sanitize(newProj);
            if (sanitized) {
                setProjects((prev) => [sanitized, ...prev]);
                setActiveProject(sanitized);
            }
        } catch (e) {
            console.error('Failed to add project', e);
        }
    };

    const addItem = async (projectId: string, section: 'buy' | 'give', itemData: Omit<Item, 'id' | 'totalAmount'>) => {
        try {
            const key = section === 'buy' ? 'buyItems' : 'giveItems';
            const totalAmount = itemData.quantity * itemData.quantityPerPcs;
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: { ...itemData, totalAmount } }),
            });
            const updated = await res.json();
            const sanitized = sanitize(updated);
            if (sanitized) {
                setProjects((prev) => prev.map((p) => (p.id === projectId ? sanitized : p)));
                if (activeProject?.id === projectId) setActiveProject(sanitized);
            }
        } catch (e) {
            console.error('Failed to add item', e);
        }
    };

    const updateItem = async (projectId: string, section: 'buy' | 'give', index: number, itemData: Omit<Item, 'id' | 'totalAmount'>) => {
        try {
            const key = section === 'buy' ? 'buyItems' : 'giveItems';
            const totalAmount = itemData.quantity * itemData.quantityPerPcs;
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateItem',
                    section: key,
                    index,
                    ...itemData,
                    totalAmount
                }),
            });
            const updated = await res.json();
            const sanitized = sanitize(updated);
            if (sanitized) {
                setProjects((prev) => prev.map((p) => (p.id === projectId ? sanitized : p)));
                if (activeProject?.id === projectId) setActiveProject(sanitized);
            }
        } catch (e) {
            console.error('Failed to update item', e);
        }
    };

    const deleteItem = async (projectId: string, section: 'buy' | 'give', index: number) => {
        try {
            const key = section === 'buy' ? 'buyItems' : 'giveItems';
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteItem', section: key, index }),
            });
            const updated = await res.json();
            const sanitized = sanitize(updated);
            if (sanitized) {
                setProjects((prev) => prev.map((p) => (p.id === projectId ? sanitized : p)));
                if (activeProject?.id === projectId) setActiveProject(sanitized);
            }
        } catch (e) {
            console.error('Failed to delete item', e);
        }
    };

    const addPayment = async (projectId: string, section: 'buy' | 'give', paymentData: Omit<Payment, 'id'>) => {
        try {
            const key = section === 'buy' ? 'buyPayments' : 'givePayments';
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: paymentData }),
            });
            const updated = await res.json();
            const sanitized = sanitize(updated);
            if (sanitized) {
                setProjects((prev) => prev.map((p) => (p.id === projectId ? sanitized : p)));
                if (activeProject?.id === projectId) setActiveProject(sanitized);
            }
        } catch (e) {
            console.error('Failed to add payment', e);
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            setProjects((prev) => prev.filter((p) => p.id !== id));
            if (activeProject?.id === id) setActiveProject(null);
        } catch (e) {
            console.error('Failed to delete project', e);
        }
    };

    return (
        <ProjectContext.Provider
            value={{
                projects,
                activeProject,
                setActiveProject,
                addProject,
                addItem,
                updateItem,
                deleteItem,
                addPayment,
                deleteProject,
                loading
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}
