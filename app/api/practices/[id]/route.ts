import { NextRequest, NextResponse } from 'next/server';
import practicesData from '@/data/arizona-practices.json';
import fs from 'fs';
import path from 'path';

// Get single practice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const practice = (practicesData as any[]).find((p: any) => p.id === id);
  
  if (!practice) {
    return NextResponse.json({ error: 'Practice not found' }, { status: 404 });
  }
  
  
  return NextResponse.json({ practice });
}

// Update practice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const updates = await request.json();
    
    const practices = [...practicesData] as any[];
    const index = practices.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Practice not found' }, { status: 404 });
    }
    
    const previousValue = { ...practices[index] };
    
    // Apply updates
    practices[index] = {
      ...practices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Save to JSON file
    const filePath = path.join(process.cwd(), 'data', 'arizona-practices.json');
    fs.writeFileSync(filePath, JSON.stringify(practices, null, 2));
    
    
    return NextResponse.json({ 
      practice: practices[index],
      message: 'Practice updated successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update practice' }, { status: 500 });
  }
}

// Delete practice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const practices = [...practicesData] as any[];
    const index = practices.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Practice not found' }, { status: 404 });
    }
    
    const deletedPractice = practices[index];
    practices.splice(index, 1);
    
    // Save to JSON file
    const filePath = path.join(process.cwd(), 'data', 'arizona-practices.json');
    fs.writeFileSync(filePath, JSON.stringify(practices, null, 2));
    
    
    return NextResponse.json({ 
      message: 'Practice deleted successfully',
      deletedPractice: { id: deletedPractice.id, name: deletedPractice.name },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete practice' }, { status: 500 });
  }
}
