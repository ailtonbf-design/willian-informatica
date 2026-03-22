import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Save, LogIn, LogOut, CheckCircle } from 'lucide-react';

export function AdminPanel() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadCurrentData();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadCurrentData = async () => {
    try {
      const docRef = doc(db, 'configuracoes', 'cursoDestaque');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.titulo) setTitulo(data.titulo);
        if (data.descricao) setDescricao(data.descricao);
        if (data.imagemUrl) setImagemUrl(data.imagemUrl);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const docRef = doc(db, 'configuracoes', 'cursoDestaque');
      await setDoc(docRef, {
        titulo,
        descricao,
        imagemUrl
      }, { merge: true });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao salvar as configurações. Verifique as permissões.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Painel Administrativo</h2>
          <p className="text-slate-600 mb-8">Faça login com sua conta Google para acessar as configurações.</p>
          <button
            onClick={handleLogin}
            className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Fazer Login com Google
          </button>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-700 flex items-center gap-2 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
            Configuração: Curso Destaque
          </h2>

          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-3 border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">Configurações salvas com sucesso!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome do Curso
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Auxiliar Administrativo"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descrição / Subtítulo
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Domine as rotinas do escritório..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link da Imagem (URL)
              </label>
              <input
                type="url"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                required
              />
              {imagemUrl && (
                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-2">Pré-visualização da imagem:</p>
                  <img 
                    src={imagemUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400?text=Erro+na+Imagem')}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Configurações
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
