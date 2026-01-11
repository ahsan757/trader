'use client';

import { useProjects } from './context';
import { useState } from 'react';
import ProjectDetail from './ProjectDetail';

export default function Home() {
  const { projects, activeProject, setActiveProject, addProject, deleteProject, loading } = useProjects();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  if (activeProject) {
    return <ProjectDetail />;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h2 className="text-5xl font-black tracking-tighter sm:text-6xl bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Project Dashboard
        </h2>
        <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
          Monitor your procurement and distribution chains with precision. Automated billing and payment tracking for large-scale operations.
        </p>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="btn-primary mt-6 text-lg px-8 py-3"
        >
          Initialize New Project
        </button>
      </section>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="group glass-card p-6 h-64 flex flex-col justify-between hover:border-sky-500/50 transition-all cursor-pointer relative overflow-hidden"
            onClick={() => setActiveProject(project)}
          >
            {/* Background design element */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-sky-500/5 rounded-full group-hover:bg-sky-500/10 transition-colors" />

            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold transition-colors group-hover:text-sky-400">{project.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this project?')) deleteProject(project.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-rose-500 transition-all text-xs uppercase"
                >
                  Delete
                </button>
              </div>
              <p className="text-white/40 text-xs font-mono mt-1">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30">Buy Section</p>
                <p className="text-lg font-semibold">PKR {project.buyItems.reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30">Give Section</p>
                <p className="text-lg font-semibold">PKR {project.giveItems.reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-white/20 text-xl italic font-light">No active projects found. Start by initializing one above.</p>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
          <div className="glass-card w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-bold mb-6 tracking-tight">New Project</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
              if (name) {
                addProject(name);
                setShowNewProjectModal(false);
              }
            }} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/60">Project Name</label>
                <input
                  name="name"
                  autoFocus
                  required
                  className="glass-input text-xl py-4"
                  placeholder="e.g., SkyTower Infrastructure"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowNewProjectModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
