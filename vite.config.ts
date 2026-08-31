import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          cursos: path.resolve(__dirname, 'cursos.html'),
          depoimentos: path.resolve(__dirname, 'depoimentos.html'),
          alunoEmpreendedor: path.resolve(__dirname, 'aluno-empreendedor.html'),
          melhoridade: path.resolve(__dirname, 'melhoridade.html'),
          filhosbrilhantes: path.resolve(__dirname, 'filhosbrilhantes.html'),
          carreira: path.resolve(__dirname, 'carreira.html'),
          negocios: path.resolve(__dirname, 'negocios.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/aluno-empreendedor' || req.url === '/aluno-empreendedor/') {
            req.url = '/aluno-empreendedor.html';
          }
          if (req.url === '/melhoridade' || req.url === '/melhoridade/' || req.url === '/melhor-idade' || req.url === '/melhor-idade/') {
            req.url = '/melhoridade.html';
          }
          if (req.url === '/filhosbrilhantes' || req.url === '/filhosbrilhantes/' || req.url === '/filhos-brilhantes' || req.url === '/filhos-brilhantes/') {
            req.url = '/filhosbrilhantes.html';
          }
          if (req.url === '/carreira' || req.url === '/carreira/' || req.url === '/empregabilidade' || req.url === '/empregabilidade/') {
            req.url = '/carreira.html';
          }
          if (req.url === '/negocios' || req.url === '/negocios/' || req.url === '/wpescola' || req.url === '/wpescola/') {
            req.url = '/negocios.html';
          }
          next();
        });
      }
    },
  };
});
