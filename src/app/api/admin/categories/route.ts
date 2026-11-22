import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCategories, saveCategories, resetCategories, recordAuditLog } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

const CategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sublabel: z.string().default(''),
  badge: z.string().default('EXPLORE'),
  image: z.string().min(1),
  isLive: z.boolean().optional(),
  sortOrder: z.number().default(1),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const categories = getCategories();
  return NextResponse.json({ categories });
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const categoriesList = z.array(CategorySchema).parse(body.categories || body);

    const updated = saveCategories(categoriesList);

    recordAuditLog({
      userId: session.userId,
      action: 'CATEGORIES_UPDATED',
      entityType: 'CategoryBubbles',
      metadata: { count: updated.length, adminUser: session.email },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      categories: updated,
      message: 'Category story bubbles saved and synced with storefront.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update categories' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await request.json();

    if (body.action === 'reset') {
      const reset = resetCategories();
      recordAuditLog({
        userId: session.userId,
        action: 'CATEGORIES_RESET_TO_DEFAULTS',
        entityType: 'CategoryBubbles',
      });

      revalidatePath('/', 'layout');
      revalidatePath('/');

      return NextResponse.json({
        success: true,
        categories: reset,
        message: 'Categories restored to Studio defaults.',
      });
    }

    // Add new category bubble
    const newCategory = CategorySchema.parse(body);
    const existing = getCategories();

    // Check duplicate ID
    if (existing.some((c) => c.id === newCategory.id)) {
      return NextResponse.json({ error: `Category with ID "${newCategory.id}" already exists.` }, { status: 409 });
    }

    existing.push({
      ...newCategory,
      sortOrder: existing.length + 1,
    });

    saveCategories(existing);

    recordAuditLog({
      userId: session.userId,
      action: 'CATEGORY_CREATED',
      entityType: 'CategoryBubbles',
      metadata: { id: newCategory.id, label: newCategory.label },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      category: newCategory,
      categories: existing,
      message: `Category "${newCategory.label}" created successfully.`,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add category' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const existing = getCategories();
    const filtered = existing.filter((c) => c.id !== id);

    if (filtered.length === existing.length) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Recalibrate sort orders
    filtered.forEach((c, idx) => {
      c.sortOrder = idx + 1;
    });

    saveCategories(filtered);

    recordAuditLog({
      userId: session.userId,
      action: 'CATEGORY_DELETED',
      entityType: 'CategoryBubbles',
      metadata: { id },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      categories: filtered,
      message: `Category "${id}" removed.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 });
  }
}
