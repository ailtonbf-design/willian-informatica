import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import { Save, LogIn, LogOut, CheckCircle, Upload, Trash2, Briefcase, BookOpen, Image as ImageIcon, Users, MessageCircle, Plus } from 'lucide-react';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
}

interface FotoCarrossel {
  id: string;
  url: string;
}

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  categoria: string;
  status: string;
  data: string;
  notas?: string;
}

export function AdminPanel() {
  console.log('AdminPanel rendered');
  const [activeTab, setActiveTab] = useState<'curso' | 'vagas' | 'fotosCarrossel' | 'leads' | 'todosCursos'>('curso');
  
  // Curso Destaque State
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  
  // Vagas State
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [novaVagaTitulo, setNovaVagaTitulo] = useState('');
  const [novaVagaDescricao, setNovaVagaDescricao] = useState('');

  // Todos Cursos State
  const [todosCursos, setTodosCursos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoCursoNome, setNovoCursoNome] = useState('');
  const [novoCursoCategoria, setNovoCursoCategoria] = useState('Administrativo');
  const [novoCursoCarga, setNovoCursoCarga] = useState('');
  const [novoCursoDescricao, setNovoCursoDescricao] = useState('');
  const [novoCursoImagemFile, setNovoCursoImagemFile] = useState<File | null>(null);
  const [novoCursoImagemPreview, setNovoCursoImagemPreview] = useState('');
  const [editingCursoId, setEditingCursoId] = useState<string | null>(null);

  // Fotos Carrossel State
  const [fotosCarrossel, setFotosCarrossel] = useState<FotoCarrossel[]>([]);
  const [novaFotoPreview, setNovaFotoPreview] = useState('');
  const [novaFotoFile, setNovaFotoFile] = useState<File | null>(null);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeLeadCategory, setActiveLeadCategory] = useState<string>('Todos os Leads');
  const leadCategories = ['Todos os Leads', 'Curso em Destaque', 'Treinamento Grátis', 'Programa Aluno Empreendedor', 'WP Escola de Negócios', 'Certificado Premium'];

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true';
  });
  const [authChecking, setAuthChecking] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check for hardcoded login
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }

    // Try to sign in anonymously to satisfy Firebase requirements if needed
    // but handle the error gracefully if it's restricted
    const initAuth = async () => {
      try {
        // Only try if not already authenticated via hardcoded login
        if (!loggedIn) {
          // await signInAnonymously(auth);
        }
      } catch (err: any) {
        console.warn("Anonymous auth restricted, using hardcoded login only:", err.message);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCurrentData();
      loadVagas();
      loadFotosCarrossel();
      loadTodosCursos();
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

  const loadTodosCursos = async () => {
    try {
      const cursosRef = collection(db, 'cursos');
      const q = query(cursosRef, orderBy('nome', 'asc'));
      const snapshot = await getDocs(q);
      const cursosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodosCursos(cursosData);
    } catch (err) {
      console.error("Erro ao carregar todos os cursos:", err);
    }
  };

  const handleCreateCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCursoNome || !novoCursoCategoria || !novoCursoCarga || !novoCursoDescricao) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Usamos o preview (Base64 comprimido) diretamente para evitar problemas de permissão no Storage
      // Se estiver editando e não houver novo preview, mantemos a imagem atual (que já deve estar no preview se carregada no edit)
      const finalImagemUrl = novoCursoImagemPreview || 'https://placehold.co/400x300?text=Sem+Imagem';

      const cursoData = {
        nome: novoCursoNome,
        categoria: novoCursoCategoria,
        carga_horaria: novoCursoCarga,
        descricao: novoCursoDescricao,
        imagem_url: finalImagemUrl,
        ativo: true,
        updatedAt: serverTimestamp()
      };

      if (editingCursoId) {
        const cursoRef = doc(db, 'cursos', editingCursoId);
        await updateDoc(cursoRef, cursoData);
      } else {
        const cursosRef = collection(db, 'cursos');
        await addDoc(cursosRef, {
          ...cursoData,
          createdAt: serverTimestamp()
        });
      }

      // Reset form and close modal
      closeCursoModal();
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Refresh list
      loadTodosCursos();
    } catch (err: any) {
      console.error("Erro detalhado ao salvar curso:", err);
      setError("Erro ao salvar no banco de dados. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const closeCursoModal = () => {
    setNovoCursoNome('');
    setNovoCursoCategoria('Administrativo');
    setNovoCursoCarga('');
    setNovoCursoDescricao('');
    setNovoCursoImagemFile(null);
    setNovoCursoImagemPreview('');
    setEditingCursoId(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (curso: any) => {
    setEditingCursoId(curso.id);
    setNovoCursoNome(curso.nome || '');
    setNovoCursoCategoria(curso.categoria || 'Administrativo');
    setNovoCursoCarga(curso.carga_horaria || '');
    setNovoCursoDescricao(curso.descricao || '');
    setNovoCursoImagemPreview(curso.imagem_url || '');
    setIsModalOpen(true);
  };

  const handleNovoCursoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite de 2MB para o arquivo original
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem original é muito grande. Escolha uma menor que 2MB.');
      return;
    }

    setNovoCursoImagemFile(file);
    
    // Processamento e compressão da imagem para Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIMENSION = 600; // Reduzimos para garantir que caiba no limite do documento Firestore (1MB)

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
        
        // Comprime para JPEG com qualidade 0.7 para economizar espaço no Firestore
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setNovoCursoImagemPreview(compressedBase64);
        setError('');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCurso = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este curso?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'cursos', id));
      setTodosCursos(prev => prev.filter(c => c.id !== id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Erro ao excluir curso:", err);
      setError("Erro ao excluir o curso.");
    } finally {
      setLoading(false);
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

  // --- LÓGICA DE LEADS / CRM ---
  const carregarLeads = async (categoria: string) => {
    setLoading(true);
    setLeads([]);
    
    try {
      const leadsRef = collection(db, 'leads');
      let q;
      
      if (categoria === 'Todos os Leads') {
        q = query(leadsRef);
      } else {
        q = query(
          leadsRef, 
          where('categoria', '==', categoria)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const leadsData: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        leadsData.push({ id: doc.id, ...data });
      });

      // Ordenar em memória por data decrescente
      leadsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      const formattedLeads: Lead[] = leadsData.map(data => {
        let dataFormatada = 'Sem data';
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          dataFormatada = date.toLocaleDateString('pt-BR');
        }
        
        return {
          id: data.id,
          nome: data.nome || '',
          whatsapp: data.whatsapp || '',
          categoria: data.categoria || '',
          status: data.status || 'Novo',
          data: dataFormatada,
          notas: data.notas || ''
        };
      });

      setLeads(formattedLeads);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
      setError("Não foi possível carregar os leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leads' && isAuthenticated) {
      carregarLeads(activeLeadCategory);
    }
  }, [activeTab, activeLeadCategory, isAuthenticated]);

  const handleStatusChange = async (leadId: string, novoStatus: string) => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, { status: novoStatus });
      
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: novoStatus } : lead
      ));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      setError("Erro ao atualizar o status do lead.");
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead?')) return;
    
    try {
      const leadRef = doc(db, 'leads', leadId);
      await deleteDoc(leadRef);
      
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Erro ao excluir lead:", err);
      setError("Erro ao excluir o lead.");
    }
  };
  // -----------------------------

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Hardcoded login for prototype
    setTimeout(() => {
      if (username === 'Admin' && password === 'Winfo2335') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_logged_in', 'true');
      } else {
        setError('Usuário ou senha incorretos.');
      }
      setLoading(false);
    }, 500);
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_logged_in');
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
        setNovaFotoPreview(compressedBase64);
        setNovaFotoFile(file);
        setError('');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddFotoCarrossel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaFotoPreview) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const fileId = Date.now().toString();
      
      const novaFoto: FotoCarrossel = {
        id: fileId,
        url: novaFotoPreview
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

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-red rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Painel Administrativo</h2>
            <p className="text-slate-600">Faça login para acessar as configurações.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                placeholder="Digite o usuário"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                placeholder="Digite a senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar no Painel
                </>
              )}
            </button>
            
            {error && <p className="text-red-500 mt-4 text-sm text-center">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className={`${activeTab === 'leads' ? 'max-w-full' : 'max-w-4xl'} mx-auto transition-all duration-300`}>
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
          <button
            onClick={() => { setActiveTab('todosCursos'); setError(''); setSuccess(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'todosCursos' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Todos Cursos
          </button>
          <button
            onClick={() => { setActiveTab('leads'); setError(''); setSuccess(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'leads' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            Gestão de Leads
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
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-slate-200 text-slate-700">
                    {fotosCarrossel.length} foto(s)
                  </span>
                </div>

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

          {activeTab === 'todosCursos' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Gerenciar Todos os Cursos</h2>
                <button
                  onClick={() => {
                    setEditingCursoId(null);
                    setNovoCursoNome('');
                    setNovoCursoCategoria('Administrativo');
                    setNovoCursoCarga('');
                    setNovoCursoDescricao('');
                    setNovoCursoImagemPreview('');
                    setIsModalOpen(true);
                  }}
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Curso
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-600">Nome</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-600">Categoria</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-600">Carga</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {todosCursos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">Nenhum curso cadastrado no banco de dados.</td>
                      </tr>
                    ) : (
                      todosCursos.map((curso) => (
                        <tr key={curso.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-800 font-medium">{curso.nome}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{curso.categoria}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{curso.carga_horaria}</td>
                          <td className="px-4 py-3 text-sm flex gap-3">
                            <button
                              onClick={() => handleEditClick(curso)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCurso(curso.id)}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal de Cadastro de Curso */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                      <h3 className="text-xl font-bold text-slate-900">
                        {editingCursoId ? 'Editar Curso' : 'Novo Cadastro de Curso'}
                      </h3>
                      <button 
                        onClick={closeCursoModal}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <LogOut className="w-6 h-6 rotate-180" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleCreateCurso} className="p-8 space-y-6">
                      {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium">
                          {error}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do Curso</label>
                            <input
                              type="text"
                              value={novoCursoNome}
                              onChange={(e) => setNovoCursoNome(e.target.value)}
                              placeholder="Ex: Auxiliar Administrativo"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Categoria</label>
                            <select
                              value={novoCursoCategoria}
                              onChange={(e) => setNovoCursoCategoria(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                              required
                            >
                              <option value="Administrativo">Administrativo</option>
                              <option value="Idiomas">Idiomas</option>
                              <option value="Informática e Tecnologia">Informática e Tecnologia</option>
                              <option value="Diversas Áreas">Diversas Áreas</option>
                              <option value="Preparatórios">Preparatórios</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Carga Horária</label>
                            <input
                              type="text"
                              value={novoCursoCarga}
                              onChange={(e) => setNovoCursoCarga(e.target.value)}
                              placeholder="Ex: 40h"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Imagem do Curso</label>
                          <div className="relative group">
                            <div className={`w-full h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-slate-50 ${novoCursoImagemPreview ? 'border-emerald-200' : 'border-slate-300 hover:border-emerald-400'}`}>
                              {novoCursoImagemPreview ? (
                                <img src={novoCursoImagemPreview} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <>
                                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                                  <p className="text-xs text-slate-500 font-medium">Clique para selecionar</p>
                                </>
                              )}
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleNovoCursoImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                            {novoCursoImagemPreview && (
                              <button 
                                type="button"
                                onClick={() => { setNovoCursoImagemFile(null); setNovoCursoImagemPreview(''); }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Conteúdo do Curso</label>
                        <textarea
                          value={novoCursoDescricao}
                          onChange={(e) => setNovoCursoDescricao(e.target.value)}
                          placeholder="Descreva o que o aluno vai aprender neste curso..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                          required
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-[2] px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              Salvar Curso
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Lateral Interna */}
              <aside className="w-full lg:w-64 shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-red" />
                      Filtros de Leads
                    </h3>
                  </div>
                  <nav className="p-2 flex flex-col gap-1">
                    {leadCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveLeadCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group ${
                          activeLeadCategory === cat
                            ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                        {activeLeadCategory === cat && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Área Principal da Tabela */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {activeLeadCategory}
                  </h2>
                  <div className="text-sm text-slate-500 font-medium">
                    Total: {leads.length} registros
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                          <th className="p-4 font-bold">Nome do Prospecto</th>
                          <th className="p-4 font-bold">Origem / Indicação</th>
                          <th className="p-4 font-bold">Cursos de Interesse</th>
                          <th className="p-4 font-bold">WhatsApp</th>
                          <th className="p-4 font-bold">Status</th>
                          <th className="p-4 font-bold text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loading ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-500">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-red rounded-full animate-spin mb-4"></div>
                                <span className="font-medium">Carregando dados do CRM...</span>
                              </div>
                            </td>
                          </tr>
                        ) : leads.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-500 italic">
                              Nenhum lead encontrado nesta categoria.
                            </td>
                          </tr>
                        ) : (
                          leads.map((lead) => {
                            // Parsing das notas para extrair indicação e cursos
                            const indicacaoMatch = lead.notas?.match(/Indicado por: (.*?) \((.*?)\)/);
                            const cursosMatch = lead.notas?.match(/Cursos: (.*)/);
                            
                            const indicador = indicacaoMatch ? indicacaoMatch[1] : 'Direto / Site';
                            const indicadorWhats = indicacaoMatch ? indicacaoMatch[2] : '';
                            const cursosArray = cursosMatch ? cursosMatch[1].split(',').map(c => c.trim()) : [];

                            return (
                              <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/30">
                                <td className="p-4">
                                  <div className="font-bold text-slate-900">{lead.nome}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-tighter">
                                    {lead.data}
                                    {activeLeadCategory === 'Todos os Leads' && (
                                      <span className="ml-2 text-brand-red">• {lead.categoria}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-sm font-medium text-slate-700">{indicador}</div>
                                  {indicadorWhats && (
                                    <div className="text-xs text-slate-400 font-mono">{indicadorWhats}</div>
                                  )}
                                </td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1.5">
                                    {cursosArray.length > 0 ? (
                                      cursosArray.map((curso, idx) => (
                                        <span 
                                          key={idx}
                                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-red/5 text-brand-red border border-brand-red/10"
                                        >
                                          {curso}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-xs text-slate-400 italic">Não informado</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-slate-600">{lead.whatsapp}</span>
                                    <a
                                      href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-sm hover:scale-110"
                                      title="Chamar no WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <select
                                    value={lead.status}
                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                    className={`text-xs font-bold rounded-full border px-3 py-1 outline-none focus:ring-2 focus:ring-brand-red/20 transition-all cursor-pointer ${
                                      lead.status === 'Novo' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                      lead.status === 'Em Atendimento' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                      lead.status === 'Matriculado' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                      'bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <option value="Novo">Novo</option>
                                    <option value="Em Atendimento">Em Atendimento</option>
                                    <option value="Matriculado">Matriculado</option>
                                    <option value="Perdido">Perdido</option>
                                  </select>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Excluir Lead"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
