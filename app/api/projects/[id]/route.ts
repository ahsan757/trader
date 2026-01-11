import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Project } from '@/models/Project';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const data = await request.json();
        const { id } = await params;

        // This will handle adding items or payments
        const project = await Project.findByIdAndUpdate(
            id,
            { $push: data },
            { new: true }
        );

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        await Project.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Project deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
