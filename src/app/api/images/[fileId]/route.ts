import { NextResponse } from 'next/server';

import { IMAGES_BUCKET_ID } from '@/config/db';
import { createSessionClient } from '@/lib/appwrite';

export const GET = async (_request: Request, { params }: { params: { fileId: string } }) => {
  try {
    const { storage } = await createSessionClient();
    const fileId = params.fileId;
    const file = await storage.getFile(IMAGES_BUCKET_ID, fileId);
    const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, fileId);

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        'Content-Type': file.mimeType ?? 'application/octet-stream',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized.' ? 401 : 404;

    return NextResponse.json({ error: 'Failed to load image.' }, { status });
  }
};
