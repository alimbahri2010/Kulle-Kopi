import { supabase } from './supabaseClient';
import { CafeSettings } from './types';

/**
 * Extracts the storage path from a full Supabase Storage URL (signed or public).
 * If the URL is not a storage URL, returns it as-is.
 */
export function getStoragePathFromUrl(url: string): string {
  if (!url) return '';
  if (!url.startsWith('http')) {
    return url;
  }
  
  // Try to find '/Assets/' in the URL which represents our bucket
  const searchStr = '/Assets/';
  const index = url.indexOf(searchStr);
  if (index !== -1) {
    const afterAssets = url.substring(index + searchStr.length);
    // Remove query parameters like ?token=...
    const pathPart = afterAssets.split('?')[0];
    return decodeURIComponent(pathPart);
  }
  
  return url;
}

/**
 * Generates a signed URL for a given relative storage path in the 'Assets' bucket.
 */
export async function getSignedUrl(path: string): Promise<string> {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  try {
    const { data, error } = await supabase.storage
      .from('Assets')
      .createSignedUrl(path, 31536000); // 1 year expiry
      
    if (error) {
      console.error('Error generating signed URL for:', path, error);
      return path;
    }
    return data?.signedUrl || path;
  } catch (err) {
    console.error('Exception generating signed URL:', err);
    return path;
  }
}

/**
 * Uploads a file to the 'Assets' bucket and returns both the relative path and the signed URL.
 * File path format: ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
 */
export async function uploadFileToStorage(
  file: File,
  featureName: string,
  itemId: string
): Promise<{ path: string; signedUrl: string }> {
  // Get current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Anda harus masuk log terlebih dahulu untuk mengunggah berkas.');
  }
  
  const uid = user.id;
  const extension = file.name.split('.').pop() || 'png';
  const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const path = `${uid}/${featureName}/${itemId}/${uuid}.${extension}`;
  
  // Upload to the 'Assets' bucket
  const { error: uploadError } = await supabase.storage
    .from('Assets')
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: true
    });
    
  if (uploadError) {
    throw uploadError;
  }
  
  // Generate a signed URL for display
  const signedUrl = await getSignedUrl(path);
  return {
    path,
    signedUrl
  };
}

/**
 * Deletes a file from 'Assets' bucket.
 */
export async function deleteFileFromStorage(path: string): Promise<void> {
  if (!path) return;
  // If it's a full URL that isn't from our storage or a Base64 string, don't delete from storage
  if (path.startsWith('http') && !path.includes('/Assets/')) {
    return;
  }
  if (path.startsWith('data:')) {
    return;
  }
  
  const cleanPath = getStoragePathFromUrl(path);
  if (!cleanPath) return;
  
  try {
    const { error } = await supabase.storage
      .from('Assets')
      .remove([cleanPath]);
      
    if (error) {
      console.error('Failed to delete file from Supabase Storage:', cleanPath, error);
    } else {
      console.log('Successfully deleted file from Supabase Storage:', cleanPath);
    }
  } catch (err) {
    console.error('Exception deleting file from Supabase Storage:', err);
  }
}

/**
 * Batch resolves relative image paths into signed URLs for an array of items.
 */
export async function resolveSignedUrlsForList<T>(
  items: T[],
  imageKey: keyof T
): Promise<T[]> {
  if (!items || items.length === 0) return items;
  
  const pathsToResolve: { index: number; path: string }[] = [];
  
  items.forEach((item, index) => {
    const val = item[imageKey];
    if (typeof val === 'string' && val && !val.startsWith('http') && !val.startsWith('data:')) {
      pathsToResolve.push({ index, path: val });
    }
  });
  
  if (pathsToResolve.length === 0) return items;
  
  try {
    const paths = pathsToResolve.map(p => p.path);
    const { data, error } = await supabase.storage
      .from('Assets')
      .createSignedUrls(paths, 31536000); // 1 year expiry
      
    if (error) {
      console.error('Error batch resolving signed URLs:', error);
      return items;
    }
    
    const newItems = [...items];
    pathsToResolve.forEach((p, idx) => {
      const signedUrl = data?.[idx]?.signedUrl;
      if (signedUrl) {
        newItems[p.index] = {
          ...newItems[p.index],
          [imageKey]: signedUrl
        };
      }
    });
    return newItems;
  } catch (err) {
    console.error('Exception batch resolving signed URLs:', err);
    return items;
  }
}

/**
 * Resolves all relative storage paths inside CafeSettings into signed URLs.
 */
export async function resolveSettingsSignedUrls(settings: CafeSettings): Promise<CafeSettings> {
  if (!settings) return settings;
  const keys: (keyof CafeSettings)[] = ['faviconUrl', 'heroImageUrl1', 'heroImageUrl2', 'heroImageUrl3', 'heroImageUrl4'];
  const resolved = { ...settings };
  for (const key of keys) {
    const val = settings[key];
    if (typeof val === 'string' && val && !val.startsWith('http') && !val.startsWith('data:')) {
      (resolved as any)[key] = await getSignedUrl(val);
    }
  }
  return resolved;
}
