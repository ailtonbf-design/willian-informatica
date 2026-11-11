import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

function createFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(
      app,
      {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = createFirestoreInstance();
export const auth = getAuth(app);
export const storage = getStorage(app);

// ===============================================================
// Local Cache Helpers (reduz >95% das leituras do Firestore)
// ===============================================================

export const CACHE_KEYS = {
  CURSO_DESTAQUE: 'wi_cache_curso_destaque_v1',
  VAGAS: 'wi_cache_vagas_v1',
  CARROSSEL: 'wi_cache_carrossel_v1',
  CURSOS: 'wi_cache_cursos_v1',
  DEPOIMENTOS: 'wi_cache_depoimentos_v1',
} as const;

// TTL padrão: 30 minutos para visitantes públicos
export const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEnvelope<T> {
  timestamp: number;
  data: T;
}

export function getCachedData<T>(key: string, ttlMs: number = DEFAULT_CACHE_TTL_MS): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (!parsed || typeof parsed.timestamp !== 'number') return null;
    if (Date.now() - parsed.timestamp > ttlMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Retorna o dado salvo no localStorage mesmo se o TTL já expirou.
 * Essencial como contingência caso o Firestore esteja temporariamente sem cota ou offline.
 */
export function getStaleCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const envelope: CacheEnvelope<T> = {
      timestamp: Date.now(),
      data
    };
    window.localStorage.setItem(key, JSON.stringify(envelope));
  } catch (err) {
    console.warn(`Aviso: Não foi possível salvar cache local (${key}):`, err);
  }
}

export function invalidateCache(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
