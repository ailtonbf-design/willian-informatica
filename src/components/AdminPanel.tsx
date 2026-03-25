import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Save, LogIn, LogOut, CheckCircle, Upload, Trash2, Briefcase, BookOpen, Image as ImageIcon } from 'lucide-react';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
}

interface FotoCarrossel {
  id: string;
  url: string;
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'curso' | 'vagas' | 'fotosCarrossel'>('curso');
  
  // Curso Destaque State
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  
  // Vagas State
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [novaVagaTitulo, setNovaVagaTitulo] = useState('');
  const [novaVagaDescricao, setNovaVagaDescricao] = useState('');

  // Fotos Carrossel State
  const [fotosCarrossel, setFotosCarrossel] = useState<FotoCarrossel[]>([]);
  const [novaFotoPreview, setNovaFotoPreview] = useState('');
  const [novaFotoFile, setNovaFotoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Hardcoded login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadCurrentData();
      loadVagas();
      loadFotosCarrossel();
    }
  }, [isAuthenticated]);

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
      console.error("Erro ao carregar dados do curso:", err);
    }
  };

  const loadVagas = async () => {
    try {
      const docRef = doc(db, 'configuracoes', 'vagas');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lista) setVagas(data.lista);
      }
    } catch (err) {
      console.error("Erro ao carregar vagas:", err);
    }
  };

  const loadFotosCarrossel = async () => {
    try {
      const docRef = doc(db, 'configuracoes', 'carrossel');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lista) setFotosCarrossel(data.lista);
      }
    } catch (err) {
      console.error("Erro ao carregar fotos do carrossel:", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Winfo2335') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleSaveCurso = async (e: React.FormEvent) => {
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

  const handleAddVaga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaVagaTitulo || !novaVagaDescricao) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const newVaga: Vaga = {
        id: Date.now().toString(),
        titulo: novaVagaTitulo,
        descricao: novaVagaDescricao
      };
      
      const updatedVagas = [...vagas, newVaga];
      
      const docRef = doc(db, 'configuracoes', 'vagas');
      await setDoc(docRef, { lista: updatedVagas }, { merge: true });
      
      setVagas(updatedVagas);
      setNovaVagaTitulo('');
      setNovaVagaDescricao('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao adicionar vaga.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVaga = async (idToDelete: string) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const updatedVagas = vagas.filter(v => v.id !== idToDelete);
      
      const docRef = doc(db, 'configuracoes', 'vagas');
      await setDoc(docRef, { lista: updatedVagas }, { merge: true });
      
      setVagas(updatedVagas);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao remover vaga.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('A imagem deve ter no máximo 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIMENSION = 800;

        if (width > height && width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG to save space
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setImagemUrl(compressedBase64);
        setError('');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFotoCarrosselChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setNovaFotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNovaFotoPreview(event.target?.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleAddFotoCarrossel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaFotoFile) return;

    if (fotosCarrossel.length >= 10) {
      setError('Limite de 10 fotos atingido. Exclua uma para adicionar outra.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const fileId = Date.now().toString();
      const storageRef = ref(storage, `carrossel/${fileId}_${novaFotoFile.name}`);
      
      await uploadBytes(storageRef, novaFotoFile);
      const downloadUrl = await getDownloadURL(storageRef);

      const novaFoto: FotoCarrossel = {
        id: fileId,
        url: downloadUrl
      };
      
      const updatedFotos = [...fotosCarrossel, novaFoto];
      
      const docRef = doc(db, 'configuracoes', 'carrossel');
      await setDoc(docRef, { lista: updatedFotos }, { merge: true });
      
      setFotosCarrossel(updatedFotos);
      setNovaFotoFile(null);
      setNovaFotoPreview('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao adicionar foto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFotoCarrossel = async (foto: FotoCarrossel) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Delete from Storage if it's a firebase storage URL
      if (foto.url.includes('firebasestorage')) {
        try {
          // Extract the path from the URL
          const urlObj = new URL(foto.url);
          const path = decodeURIComponent(urlObj.pathname.split('/o/')[1].split('?')[0]);
          const fileRef = ref(storage, path);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.error("Erro ao deletar do storage:", storageErr);
          // Continue to delete from firestore even if storage delete fails
        }
      }

      const updatedFotos = fotosCarrossel.filter(f => f.id !== foto.id);
      
      const docRef = doc(db, 'configuracoes', 'carrossel');
      await setDoc(docRef, { lista: updatedFotos }, { merge: true });
      
      setFotosCarrossel(updatedFotos);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao remover foto.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Painel Administrativo</h2>
          <p className="text-slate-600 mb-8">Insira suas credenciais para acessar as configurações.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                placeholder="Digite o usuário"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                placeholder="Digite a senha"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <LogIn className="w-5 h-5" />
              Entrar
            </button>
          </form>
          
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
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

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setActiveTab('curso'); setError(''); setSuccess(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'curso' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Curso Destaque
          </button>
          <button
            onClick={() => { setActiveTab('vagas'); setError(''); setSuccess(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'vagas' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Gerenciar Vagas
          </button>
          <button
            onClick={() => { setActiveTab('fotosCarrossel'); setError(''); setSuccess(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'fotosCarrossel' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Fotos do Carrossel
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-3 border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">Operação realizada com sucesso!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {activeTab === 'curso' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Configuração: Curso Destaque
              </h2>
              <form onSubmit={handleSaveCurso} className="space-y-6">
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
                    Imagem do Curso (Máx. 1MB)
                  </label>
                  
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Clique para enviar</span> ou arraste uma imagem</p>
                        <p className="text-xs text-slate-500">PNG, JPG ou WEBP (Max. 1MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

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
            </>
          )}

          {activeTab === 'vagas' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Gerenciar Vagas de Emprego
              </h2>
              
              <form onSubmit={handleAddVaga} className="space-y-6 mb-10 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">Adicionar Nova Vaga</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título da Vaga
                  </label>
                  <input
                    type="text"
                    value={novaVagaTitulo}
                    onChange={(e) => setNovaVagaTitulo(e.target.value)}
                    placeholder="Ex: Auxiliar Administrativo"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descrição da Vaga
                  </label>
                  <textarea
                    value={novaVagaDescricao}
                    onChange={(e) => setNovaVagaDescricao(e.target.value)}
                    placeholder="Ex: Requisitos, horário, salário, etc."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Adicionar Vaga
                    </>
                  )}
                </button>
              </form>

              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Vagas Ativas ({vagas.length})</h3>
                
                {vagas.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    Nenhuma vaga cadastrada no momento.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {vagas.map((vaga) => (
                      <div key={vaga.id} className="flex items-start justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">{vaga.titulo}</h4>
                          <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap">{vaga.descricao}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteVaga(vaga.id)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-4"
                          title="Remover vaga"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'fotosCarrossel' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Gerenciar Fotos do Carrossel
              </h2>
              
              <form onSubmit={handleAddFotoCarrossel} className="space-y-6 mb-10 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Adicionar Nova Foto</h3>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${fotosCarrossel.length >= 10 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                    {fotosCarrossel.length} / 10 fotos
                  </span>
                </div>

                {fotosCarrossel.length >= 10 ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg">
                    <p className="font-medium">Limite de 10 fotos atingido. Exclua uma para adicionar outra.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Imagem (Máx. 5MB)
                      </label>
                      
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-slate-400" />
                            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Clique para enviar</span> ou arraste uma imagem</p>
                            <p className="text-xs text-slate-500">PNG, JPG ou WEBP (Max. 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleFotoCarrosselChange}
                          />
                        </label>
                      </div>

                      {novaFotoPreview && (
                        <div className="mt-4">
                          <p className="text-xs text-slate-500 mb-2">Pré-visualização da imagem:</p>
                          <img 
                            src={novaFotoPreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !novaFotoFile}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Adicionar Foto
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>

              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Galeria de Fotos</h3>
                
                {fotosCarrossel.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    Nenhuma foto cadastrada no momento. O carrossel exibirá fotos padrão.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {fotosCarrossel.map((foto) => (
                      <div key={foto.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                        <img 
                          src={foto.url} 
                          alt="Foto do Carrossel" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                          <button
                            onClick={() => handleDeleteFotoCarrossel(foto)}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-lg"
                            title="Remover foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
