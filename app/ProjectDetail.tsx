'use client';

import { useState } from 'react';
import { useProjects } from './context';
import { Item, Payment, PaymentType } from './types';

export default function ProjectDetail() {
    const { activeProject, setActiveProject, addItem, updateItem, deleteItem, addPayment, deleteProject } = useProjects();
    const [section, setSection] = useState<'buy' | 'give'>('buy');
    const [editingItem, setEditingItem] = useState<(Item & { index: number }) | null>(null);

    // Modal states
    const [showItemModal, setShowItemModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    if (!activeProject) return null;

    const items = section === 'buy' ? activeProject.buyItems : activeProject.giveItems;
    const payments = section === 'buy' ? activeProject.buyPayments : activeProject.givePayments;

    const totalItemsCost = items.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalItemsCost - totalPaid;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Printable Bill Area */}
            <div className="print-only p-8 text-black bg-white min-h-screen">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Bill / Statement</h1>
                        <p className="text-slate-500 font-mono mt-1">Project: {activeProject.name}</p>
                        <p className="text-slate-500 font-mono">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold uppercase text-slate-400">Section</p>
                        <p className="text-xl font-bold">{section === 'buy' ? 'Procurement' : 'Distribution'}</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-xl font-bold uppercase mb-4 border-l-4 border-slate-900 pl-3">Items Summary</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-200 text-slate-400 text-xs uppercase">
                                <th className="py-2">Item Name</th>
                                <th className="py-2">Quantity</th>
                                <th className="py-2">Rate</th>
                                <th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td className="py-3 font-medium">{item.name}</td>
                                    <td className="py-3">{item.quantity}</td>
                                    <td className="py-3">PKR {item.quantityPerPcs}</td>
                                    <td className="py-3 text-right font-bold">PKR {item.totalAmount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-10">
                    <h2 className="text-xl font-bold uppercase mb-4 border-l-4 border-slate-900 pl-3">Payment History</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-200 text-slate-400 text-xs uppercase">
                                <th className="py-2">Date</th>
                                <th className="py-2">Purpose</th>
                                <th className="py-2">Mode</th>
                                <th className="py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td className="py-3">{new Date(p.date).toLocaleDateString()}</td>
                                    <td className="py-3">{p.itemOfPayment}</td>
                                    <td className="py-3 uppercase text-[10px]">{p.type}</td>
                                    <td className="py-3 text-right font-bold">PKR {p.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end pt-8 border-t-2 border-slate-900">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-slate-500">
                            <span>Total Amount:</span>
                            <span>PKR {totalItemsCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Total Paid:</span>
                            <span className="text-emerald-700">- PKR {totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black border-t pt-2">
                            <span>Balance:</span>
                            <span>PKR {balance.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center text-slate-400 text-xs italic">
                    <p>This is a computer-generated document.</p>
                    <p>NADEMM TRADER - Project Management System</p>
                </div>
            </div>

            {/* Dashboard UI */}
            <div className="no-print space-y-8">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <button
                            onClick={() => setActiveProject(null)}
                            className="text-sky-400 hover:text-sky-300 text-sm mb-2 transition-colors flex items-center gap-1"
                        >
                            ← Back to Dashboard
                        </button>
                        <h2 className="text-4xl font-extrabold tracking-tight">{activeProject.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-white/50 text-xs italic">Project ID: {activeProject.id}</p>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this entire project?')) {
                                        deleteProject(activeProject.id);
                                    }
                                }}
                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-rose-500/20 transition-all"
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 p-1 glass-card rounded-xl">
                        <button
                            onClick={() => setSection('buy')}
                            className={`px-6 py-2 rounded-lg transition-all ${section === 'buy' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Procurement (Buy)
                        </button>
                        <button
                            onClick={() => setSection('give')}
                            className={`px-6 py-2 rounded-lg transition-all ${section === 'give' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Distribution (Give)
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 border-l-4 border-l-sky-500">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Total {section === 'buy' ? 'Purchase' : 'Release'}</p>
                        <h3 className="text-3xl font-bold">PKR {totalItemsCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Payments Settled</p>
                        <h3 className="text-3xl font-bold text-emerald-400">PKR {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-rose-500">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Remaining Balance</p>
                        <h3 className="text-3xl font-bold text-rose-400">PKR {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button onClick={() => setShowItemModal(true)} className="btn-primary">Add New Item</button>
                    <button onClick={() => setShowPaymentModal(true)} className="btn-secondary">Record Payment</button>
                    {section === 'give' && (
                        <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
                            <span>Print Bill</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        </button>
                    )}
                </div>

                {/* Tables Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Items Table */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <h4 className="font-semibold uppercase tracking-wider text-sm opacity-70">Item List</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs uppercase text-white/30 border-b border-white/5">
                                        <th className="px-6 py-4">Item Name</th>
                                        <th className="px-6 py-4">Qty</th>
                                        <th className="px-6 py-4">Rate</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors group/row">
                                            <td className="px-6 py-4 font-medium">{item.name}</td>
                                            <td className="px-6 py-4 text-white/60">{item.quantity}</td>
                                            <td className="px-6 py-4 text-white/60">PKR {item.quantityPerPcs}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-sky-400">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className="opacity-0 group-hover/row:opacity-100 transition-opacity flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingItem({ ...item, index });
                                                                setShowItemModal(true);
                                                            }}
                                                            className="text-[10px] uppercase text-sky-400 hover:text-white"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Delete this item?')) deleteItem(activeProject.id, section, index);
                                                            }}
                                                            className="text-[10px] uppercase text-rose-500 hover:text-white"
                                                        >
                                                            Delete
                                                        </button>
                                                    </span>
                                                    PKR {item.totalAmount.toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-white/20 italic">No items recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <h4 className="font-semibold uppercase tracking-wider text-sm opacity-70">Payment History</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs uppercase text-white/30 border-b border-white/5">
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Purpose/Item</th>
                                        <th className="px-6 py-4">Mode</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments.map(p => (
                                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-white/60 text-sm whitespace-nowrap">{new Date(p.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-medium">{p.itemOfPayment}</td>
                                            <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[10px] bg-white/10 border border-white/10 uppercase">{p.type}</span></td>
                                            <td className="px-6 py-4 text-right font-semibold text-emerald-400">PKR {p.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {payments.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-white/20 italic">No payments recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {showItemModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
                        <div className="glass-card w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-6">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const itemData = {
                                    name: formData.get('name') as string,
                                    quantity: Number(formData.get('quantity')),
                                    quantityPerPcs: Number(formData.get('rate')),
                                };

                                if (editingItem) {
                                    updateItem(activeProject.id, section, editingItem.index, itemData);
                                } else {
                                    addItem(activeProject.id, section, itemData);
                                }

                                setShowItemModal(false);
                                setEditingItem(null);
                            }} className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-white/60">Item Name</label>
                                    <input name="name" required className="glass-input" defaultValue={editingItem?.name} placeholder="e.g., Concrete Reinforcement" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-white/60">Quantity</label>
                                        <input name="quantity" type="number" required className="glass-input" defaultValue={editingItem?.quantity} placeholder="0" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-white/60">Rate per Unit</label>
                                        <input name="rate" type="number" required className="glass-input" defaultValue={editingItem?.quantityPerPcs} placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => { setShowItemModal(false); setEditingItem(null); }} className="btn-secondary flex-1">Cancel</button>
                                    <button type="submit" className="btn-primary flex-1">Save Item</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showPaymentModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
                        <div className="glass-card w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-6">Record Payment</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                addPayment(activeProject.id, section, {
                                    itemOfPayment: formData.get('purpose') as string,
                                    amount: Number(formData.get('amount')),
                                    type: formData.get('type') as PaymentType,
                                    date: formData.get('date') as string,
                                });
                                setShowPaymentModal(false);
                            }} className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-white/60">Purpose / Item Reference</label>
                                    <input name="purpose" required className="glass-input" placeholder="e.g., Initial Deposit" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-white/60">Amount</label>
                                    <input name="amount" type="number" required className="glass-input" placeholder="0.00" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-white/60">Type</label>
                                        <select name="type" className="glass-input bg-slate-800">
                                            <option value="cash">Cash</option>
                                            <option value="online">Online</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-white/60">Date</label>
                                        <input name="date" type="date" required className="glass-input" defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowPaymentModal(false)} className="btn-secondary flex-1">Cancel</button>
                                    <button type="submit" className="btn-primary flex-1">Record Payment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
