import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
 
// Vercel analytics
injectAnalytics({ mode: dev ? 'development' : 'production' });