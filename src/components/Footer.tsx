import React from 'react';
import { Instagram, Facebook, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774637435/Logo-Willian_g1zxno.webp" 
              alt="William Informática" 
              className="h-[77px] md:h-[83px] w-auto object-contain mb-6" 
            />
            <p className="max-w-sm mb-8 leading-relaxed">
              Transformando vidas através da educação tecnológica e empreendedora há mais de três décadas.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/williaminformatica/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/escolawilliaminformatica" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <span>Rua Brandão Veras, 777<br/>Bebedouro/SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-red shrink-0" />
                <span>17 3342-6732</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="/#destaque" className="hover:text-white transition-colors">Destaque</a></li>
              <li><a href="/cursos" className="hover:text-white transition-colors font-bold text-white">Catálogo de Cursos</a></li>
              <li><a href="/#treinamento" className="hover:text-white transition-colors">Treinamentos</a></li>
              <li><a href="/#empreendedor" className="hover:text-white transition-colors">Aluno Empreendedor</a></li>
              <li><a href="/#wpescola" className="hover:text-white transition-colors">WP Escola</a></li>
              <li><a href="/#certificado" className="hover:text-white transition-colors">Certificado</a></li>
              <li><a href="/#quemsomos" className="hover:text-white transition-colors">Quem Somos</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} William Informática. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
