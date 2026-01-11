import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Project } from '@/models/Project';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        const data = await request.json();
        const { action, section, index, ...updateData } = data;

        let project;

        if (action === 'updateItem') {
            const updateKey = `${section}.${index}`;
            project = await Project.findByIdAndUpdate(
                id,
                { $set: { [updateKey]: updateData } },
                { new: true }
            );
        } else if (action === 'deleteItem') {
            const sectionData = await Project.findById(id).select(section);
            if (sectionData && sectionData[section]) {
                sectionData[section].splice(index, 1);
                project = await sectionData.save();
            }
        } else {
            // Default: Push new item/payment
            project = await Project.findByIdAndUpdate(
                id,
                { $push: data },
                { new: true }
            );
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Update error:', error);
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
