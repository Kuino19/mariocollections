import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';

// Configure Cloudinary explicitly from the URL so we don't have to break it down manually
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
if (cloudinaryUrl) {
  // Cloudinary automatically picks up the CLOUDINARY_URL env var if we just configure it
  cloudinary.config(true);
} else {
  // Fallback if needed, but we know CLOUDINARY_URL is present
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: Request) {
  // Verify Admin
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin-auth');
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { paramsToSign } = body;

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret as string
    );
    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
