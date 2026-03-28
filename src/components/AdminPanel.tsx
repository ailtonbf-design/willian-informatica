import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, orderBy, addDoc } from 'firebase/firestore';
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
  const [isPopulating, setIsPopulating] = useState(false);

  // Fotos Carrossel State
  const [fotosCarrossel, setFotosCarrossel] = useState<FotoCarrossel[]>([]);
  const [novaFotoPreview, setNovaFotoPreview] = useState('');
  const [novaFotoFile, setNovaFotoFile] = useState<File | null>(null);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeLeadCategory, setActiveLeadCategory] = useState<string>('Curso em Destaque');
  const leadCategories = ['Curso em Destaque', 'Treinamento Grátis', 'Aluno Empreendedor', 'WP Escola de Negócios', 'Certificado Premium'];

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
    // Removed Firebase auth listener to use hardcoded login
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

  const handlePopulateCursos = async () => {
    if (!window.confirm('Deseja popular o banco de dados com a lista de cursos padrão? Isso não excluirá os existentes.')) return;
    
    setIsPopulating(true);
    setLoading(true);
    
    const cursosParaInserir = [
      { nome: 'Auxiliar Administrativo', categoria: 'Administração', carga_horaria: '40h', descricao: 'Rotinas administrativas, organização e atendimento.', imagem_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Atendimento ao Cliente', categoria: 'Administração', carga_horaria: '20h', descricao: 'Técnicas de comunicação e fidelização de clientes.', imagem_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Secretariado Executivo', categoria: 'Administração', carga_horaria: '30h', descricao: 'Gestão de agenda, redação oficial e etiqueta corporativa.', imagem_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Gestão de Pequenos Negócios', categoria: 'Administração', carga_horaria: '40h', descricao: 'Planejamento, finanças e marketing para microempresas.', imagem_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Empreendedorismo', categoria: 'Administração', carga_horaria: '30h', descricao: 'Como transformar ideias em negócios lucrativos.', imagem_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Liderança e Gestão de Equipes', categoria: 'Administração', carga_horaria: '20h', descricao: 'Desenvolvimento de competências de liderança e motivação.', imagem_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Oratória e Comunicação', categoria: 'Administração', carga_horaria: '16h', descricao: 'Falar em público com confiança e clareza.', imagem_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Hardware e Redes', categoria: 'Informática', carga_horaria: '60h', descricao: 'Montagem, manutenção e configuração de redes locais.', imagem_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Manutenção de Computadores', categoria: 'Informática', carga_horaria: '40h', descricao: 'Diagnóstico e reparo de hardware e software.', imagem_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Segurança Cibernética', categoria: 'Informática', carga_horaria: '40h', descricao: 'Proteção de dados e prevenção contra ataques digitais.', imagem_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Lógica de Programação', categoria: 'Informática', carga_horaria: '30h', descricao: 'Fundamentos essenciais para qualquer linguagem de programação.', imagem_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Banco de Dados SQL', categoria: 'Informática', carga_horaria: '30h', descricao: 'Criação e manipulação de bancos de dados relacionais.', imagem_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Robótica com Arduino', categoria: 'Informática', carga_horaria: '40h', descricao: 'Programação de microcontroladores e automação básica.', imagem_url: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=300&fit=crop', ativo: true },
      { nome: 'UX/UI Design', categoria: 'Informática', carga_horaria: '40h', descricao: 'Design de interfaces e experiência do usuário.', imagem_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Figma para Iniciantes', categoria: 'Informática', carga_horaria: '20h', descricao: 'Ferramenta líder para design de produtos digitais.', imagem_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Logística e Supply Chain', categoria: 'Administração', carga_horaria: '40h', descricao: 'Gestão de estoque, transporte e cadeia de suprimentos.', imagem_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Direito do Consumidor', categoria: 'Administração', carga_horaria: '20h', descricao: 'Direitos e deveres nas relações de consumo.', imagem_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Primeiros Socorros', categoria: 'Preparatórios', carga_horaria: '16h', descricao: 'Procedimentos básicos de emergência e salvamento.', imagem_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Cuidador de Idosos', categoria: 'Preparatórios', carga_horaria: '60h', descricao: 'Cuidados físicos e emocionais para a terceira idade.', imagem_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Eletricista Residencial', categoria: 'Preparatórios', carga_horaria: '80h', descricao: 'Instalações elétricas seguras e normas técnicas.', imagem_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Mecânica de Motos', categoria: 'Preparatórios', carga_horaria: '100h', descricao: 'Manutenção preventiva e corretiva de motocicletas.', imagem_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Manutenção de Celulares', categoria: 'Informática', carga_horaria: '40h', descricao: 'Reparo de hardware e software de smartphones.', imagem_url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=400&h=300&fit=crop', ativo: true },
      { nome: 'Mestre de Obras', categoria: 'Preparatórios', carga_horaria: '120h', descricao: 'Gestão de canteiro de obras e leitura de projetos.', imagem_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', ativo: true }
    ];

    try {
      const cursosRef = collection(db, 'cursos');
      let count = 0;
      
      for (const curso of cursosParaInserir) {
        // Check if already exists
        const q = query(cursosRef, where('nome', '==', curso.nome));
        const existing = await getDocs(q);
        
        if (existing.empty) {
          await addDoc(cursosRef, curso);
          count++;
        }
      }
      
      alert(`${count} novos cursos inseridos com sucesso!`);
      loadTodosCursos();
    } catch (err) {
      console.error("Erro ao popular cursos:", err);
      alert("Erro ao popular cursos.");
    } finally {
      setIsPopulating(false);
      setLoading(false);
    }
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
    setLeads([]); // Limpa a tabela antes de carregar
    
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(
        leadsRef, 
        where('categoria', '==', categoria),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const leadsData: Lead[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let dataFormatada = '';
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          dataFormatada = date.toLocaleDateString('pt-BR');
        }
        
        leadsData.push({
          id: doc.id,
          nome: data.nome || '',
          whatsapp: data.whatsapp || '',
          categoria: data.categoria || '',
          status: data.status || 'Novo',
          data: dataFormatada
        });
      });

      setLeads(leadsData);
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
                  onClick={handlePopulateCursos}
                  disabled={isPopulating}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isPopulating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isPopulating ? 'Populando...' : 'Popular com Lista Padrão'}
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
                          <td className="px-4 py-3 text-sm">
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
            </div>
          )}

          {activeTab === 'leads' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Gestão de Leads / CRM
              </h2>

              {/* Navegação de Abas (Categorias de Leads) */}
              <div className="w-full overflow-x-auto pb-2 mb-6 scrollbar-hide">
                <div className="flex gap-2 min-w-max border-b border-slate-200">
                  {leadCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveLeadCategory(cat)}
                      className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                        activeLeadCategory === cat
                          ? 'border-brand-red text-brand-red'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabela de Dados (Data Grid) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                        <th className="p-4 font-semibold">Nome do Lead</th>
                        <th className="p-4 font-semibold">WhatsApp</th>
                        <th className="p-4 font-semibold">Status / Notas</th>
                        <th className="p-4 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-red rounded-full animate-spin mb-4"></div>
                              Carregando leads...
                            </div>
                          </td>
                        </tr>
                      ) : leads.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">
                            Nenhum lead encontrado para esta categoria.
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-slate-900">{lead.nome}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{lead.data}</div>
                            </td>
                            <td className="p-4 text-slate-600">{lead.whatsapp}</td>
                            <td className="p-4">
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                className={`text-sm rounded-lg border px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-red/20 transition-colors ${
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
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
                                  title="Chamar no WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-lg transition-colors shadow-sm"
                                  title="Excluir Lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
