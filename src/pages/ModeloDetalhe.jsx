import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ModeloDetalhe.css';

const BASE = import.meta.env.BASE_URL;

const WHATSAPP_BASE = 'https://wa.me/551341412112';

const modelos = {
  removivel: {
    nome: 'Tela removível',
    uso: 'Para janelas',
    imagem: `${BASE}site/catalogo-tela-removivel.webp`,
    resumo: 'Proteção discreta, feita sob medida e fácil de retirar quando você precisar limpar a janela ou a própria tela.',
    destaques: ['Encaixe sob medida', 'Remoção simples', 'Acabamento discreto'],
    indicado: 'Janelas de correr, janelas guilhotina e vitrôs basculantes que permitam um encaixe seguro e bem ajustado.',
    detalhe: 'A moldura é produzida para acompanhar as dimensões do vão, mantendo a tela firme durante o uso e prática na rotina de limpeza.',
  },
  'de-correr': {
    nome: 'Tela de correr',
    uso: 'Para esquadrias com trilho',
    imagem: `${BASE}site/catalogo-tela-correr.png`,
    resumo: 'Uma solução integrada à esquadria, com deslizamento leve para acompanhar a abertura e o fechamento da janela.',
    destaques: ['Movimento suave', 'Uso cotidiano', 'Integração ao trilho'],
    indicado: 'Janelas e portas que já possuem trilho compatível ou espaço adequado para a instalação de uma folha deslizante.',
    detalhe: 'Cada peça é dimensionada para o conjunto existente, buscando movimento preciso, boa vedação periférica e acabamento harmonioso.',
  },
  'de-recolher': {
    nome: 'Tela de recolher',
    uso: 'Para portas e vãos amplos',
    imagem: `${BASE}site/catalogo-tela-recolher.png`,
    resumo: 'A tela permanece protegida no sistema quando não está em uso e pode ser acionada sempre que o ambiente precisar de proteção.',
    destaques: ['Abertura livre', 'Uso sob demanda', 'Sistema compacto'],
    indicado: 'Portas, varandas e vãos amplos em que seja importante liberar a passagem quando a tela não estiver sendo utilizada.',
    detalhe: 'O sistema é fabricado conforme o vão e instalado para oferecer acionamento prático sem comprometer a circulação do ambiente.',
  },
  'porta-de-giro': {
    nome: 'Porta de giro',
    uso: 'Para portas de passagem',
    imagem: `${BASE}site/porta-giro.png`,
    resumo: 'Uma porta telada independente, resistente e prática para proteger áreas de passagem sem interromper a rotina da casa.',
    destaques: ['Estrutura resistente', 'Passagem prática', 'Feita sob medida'],
    indicado: 'Portas de entrada, cozinhas, áreas de serviço, varandas e outros acessos usados com frequência.',
    detalhe: 'A estrutura é dimensionada para o local e recebe ferragens adequadas ao uso diário, com abertura confortável e fechamento preciso.',
  },
};

const tutorialRemovivel = [
  {
    titulo: 'Janela de correr com 2 folhas',
    texto: 'Meça apenas uma folha móvel. L é a largura dessa folha e A é a altura da folha.',
    imagem: `${BASE}site/tutorial-removivel/janela-correr-2-folhas.png`,
  },
  {
    titulo: 'Janela de correr com 4 folhas',
    texto: 'Meça juntas as duas folhas móveis do meio. L é a largura total das duas folhas e A é a altura delas.',
    imagem: `${BASE}site/tutorial-removivel/janela-correr-4-folhas.png`,
  },
  {
    titulo: 'Janela guilhotina com 2 folhas',
    texto: 'Meça somente a folha móvel de baixo. L é a largura e A é a altura dessa folha.',
    imagem: `${BASE}site/tutorial-removivel/janela-guilhotina.png`,
  },
  {
    titulo: 'Vitrô basculante',
    texto: 'Meça a folha inteira do basculante. L é a largura total e A é a altura total da folha.',
    imagem: `${BASE}site/tutorial-removivel/vitro-basculante.png`,
  },
];

const tutorialCorrer = [
  {
    titulo: 'Janela de correr com 2 folhas',
    texto: 'Meça apenas uma folha móvel. L é a largura dessa folha e A é a altura da folha.',
    imagem: `${BASE}site/tutorial-correr/janela-correr-2-folhas.png`,
  },
  {
    titulo: 'Janela de correr com 4 folhas',
    texto: 'Meça juntas as duas folhas móveis do meio. L é a largura total das duas folhas e A é a altura delas.',
    imagem: `${BASE}site/tutorial-correr/janela-correr-4-folhas.png`,
  },
  {
    titulo: 'Porta de sacada de correr',
    texto: 'Meça a folha de vidro móvel inteira. L é a largura da folha e A é a altura total da folha de vidro.',
    imagem: `${BASE}site/tutorial-correr/porta-sacada-correr.png`,
  },
];

const tutorialPortaGiro = [
  {
    titulo: 'Porta de giro de madeira ou alumínio',
    texto: 'Meça a porta inteira. L é a largura total da porta e A é a altura total da porta.',
    imagem: `${BASE}site/tutorial-porta-giro/porta-giro.png`,
  },
];

const tutorialRecolher = [
  {
    titulo: 'Medidas do vão para tela de recolher',
    texto: 'Meça a largura e a altura internas do vão em três pontos e informe a menor medida encontrada. Confirme também pelo menos 10 cm de profundidade nas laterais e no topo.',
    imagem: `${BASE}site/tutorial-recolher/medidas-tela-recolher.png`,
    poster: true,
  },
];

const tutoriais = {
  removivel: tutorialRemovivel,
  'de-correr': tutorialCorrer,
  'de-recolher': tutorialRecolher,
  'porta-de-giro': tutorialPortaGiro,
};

function whatsappPara(nome) {
  const mensagem = `Olá! Gostaria de solicitar um orçamento para ${nome}. Posso enviar as fotos e medidas iniciais?`;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(mensagem)}`;
}

export default function ModeloDetalhe() {
  const { slug } = useParams();
  const modelo = modelos[slug];
  const [imagemAmpliada, setImagemAmpliada] = useState(null);
  const arrastarRef = useRef(null);

  const alterarZoom = (passo) => {
    setImagemAmpliada((atual) => atual
      ? (() => {
        const zoom = Math.min(4, Math.max(1, Number((atual.zoom + passo).toFixed(1))));
        return { ...atual, zoom, x: zoom === 1 ? 0 : atual.x, y: zoom === 1 ? 0 : atual.y };
      })()
      : atual);
  };

  const iniciarArraste = (evento) => {
    if (imagemAmpliada.zoom <= 1) return;
    evento.currentTarget.setPointerCapture(evento.pointerId);
    arrastarRef.current = { pointerId: evento.pointerId, x: evento.clientX, y: evento.clientY };
  };

  const moverImagem = (evento) => {
    const inicio = arrastarRef.current;
    if (!inicio || inicio.pointerId !== evento.pointerId) return;
    const deltaX = evento.clientX - inicio.x;
    const deltaY = evento.clientY - inicio.y;
    arrastarRef.current = { pointerId: evento.pointerId, x: evento.clientX, y: evento.clientY };
    setImagemAmpliada((atual) => ({ ...atual, x: atual.x + deltaX, y: atual.y + deltaY }));
  };

  const encerrarArraste = () => { arrastarRef.current = null; };

  useEffect(() => {
    if (!modelo) return;
    document.title = `${modelo.nome} sob medida em Santos | Mosquiteira.com`;
    const descricao = `${modelo.resumo} Solicite seu orçamento online com orientação da Mosquiteira.com.`;
    const url = `https://mosquiteira.com/modelos/${slug}`;
    const imagem = `https://mosquiteira.com${modelo.imagem}`;
    const metadados = [
      ['meta[name="description"]', 'content', descricao],
      ['meta[property="og:title"]', 'content', `${modelo.nome} sob medida | Mosquiteira.com`],
      ['meta[property="og:description"]', 'content', descricao],
      ['meta[property="og:url"]', 'content', url],
      ['meta[name="twitter:title"]', 'content', `${modelo.nome} sob medida | Mosquiteira.com`],
      ['meta[name="twitter:description"]', 'content', descricao],
    ];
    const valoresAnteriores = metadados.map(([seletor, atributo, valor]) => {
      const elemento = document.querySelector(seletor);
      const anterior = elemento?.getAttribute(atributo);
      elemento?.setAttribute(atributo, valor);
      return [elemento, atributo, anterior];
    });
    const imagensSociais = [
      ['property', 'og:image'],
      ['name', 'twitter:image'],
    ].map(([tipo, nome]) => {
      let elemento = document.querySelector(`meta[${tipo}="${nome}"]`);
      const criado = !elemento;
      if (!elemento) {
        elemento = document.createElement('meta');
        elemento.setAttribute(tipo, nome);
        document.head.appendChild(elemento);
      }
      const anterior = elemento.getAttribute('content');
      elemento.setAttribute('content', imagem);
      return [elemento, criado, anterior];
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
    return () => {
      valoresAnteriores.forEach(([elemento, atributo, anterior]) => {
        if (!elemento) return;
        if (anterior === null) elemento.removeAttribute(atributo);
        else elemento.setAttribute(atributo, anterior);
      });
      imagensSociais.forEach(([elemento, criado, anterior]) => {
        if (criado) elemento.remove();
        else if (anterior === null) elemento.removeAttribute('content');
        else elemento.setAttribute('content', anterior);
      });
    };
  }, [modelo, slug]);

  useEffect(() => {
    if (!imagemAmpliada) return undefined;
    const fecharComEsc = (evento) => {
      if (evento.key === 'Escape') setImagemAmpliada(null);
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', fecharComEsc);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', fecharComEsc);
    };
  }, [imagemAmpliada]);

  if (!modelo) {
    return <main className="produto-nao-encontrado"><h1>Modelo não encontrado</h1><Link to="/#modelos">Voltar ao catálogo</Link></main>;
  }

  const tutorial = tutoriais[slug];
  const temTutorial = Boolean(tutorial);
  const whatsapp = whatsappPara(modelo.nome);

  return <div className="produto-pagina">
    <header className="produto-header">
      <Link to="/" className="produto-logo" aria-label="Mosquiteira.com — início"><img src={`${BASE}logo.png`} alt="Mosquiteira.com" /></Link>
      <nav aria-label="Navegação da página do produto">
        <Link to="/#modelos">← Todos os modelos</Link>
        <a className="produto-header-cta" href={whatsapp} target="_blank" rel="noreferrer">Solicitar orçamento <span>↗</span></a>
      </nav>
    </header>

    <main>
      <section className="produto-hero">
        <div className="produto-container produto-hero-grid">
          <div className="produto-hero-copy">
            <p className="produto-eyebrow">Catálogo · {modelo.uso}</p>
            <h1>{modelo.nome}</h1>
            <p className="produto-resumo">{modelo.resumo}</p>
            <div className="produto-tags">{modelo.destaques.map((item) => <span key={item}>{item}</span>)}</div>
            <a className="produto-botao" href={whatsapp} target="_blank" rel="noreferrer">Pedir orçamento pelo WhatsApp <span>↗</span></a>
          </div>
          <figure className="produto-hero-imagem"><span>MODELO / {Object.keys(modelos).indexOf(slug) + 1}</span><img src={modelo.imagem} alt={`${modelo.nome} instalada`} /><button className="produto-lupa" type="button" onClick={() => setImagemAmpliada({ src: modelo.imagem, alt: `${modelo.nome} instalada`, zoom: 1, x: 0, y: 0 })} aria-label={`Ampliar imagem de ${modelo.nome}`}><i aria-hidden="true" /></button></figure>
        </div>
      </section>

      <section className="produto-sobre">
        <div className="produto-container produto-sobre-grid">
          <div><p className="produto-eyebrow escuro">Pensada para o seu espaço</p><h2>Proteção que acompanha<br />a arquitetura da casa.</h2></div>
          <div className="produto-sobre-textos"><article><small>INDICADA PARA</small><p>{modelo.indicado}</p></article><article><small>COMO FUNCIONA</small><p>{modelo.detalhe}</p></article></div>
        </div>
      </section>

      {temTutorial ? <section className="produto-tutorial" id="como-medir">
        <div className="produto-container">
          <div className="produto-tutorial-cabecalho">
            <div><p className="produto-eyebrow escuro">Tutorial de orçamento</p><h2>Como tirar as<br />medidas iniciais.</h2></div>
            <div><p>Identifique abaixo o tipo da sua janela e siga as indicações de largura (L) e altura (A). Envie as medidas junto com uma foto frontal pelo WhatsApp.</p><strong>Não precisa ter precisão de milímetros nesta etapa.</strong></div>
          </div>
          <ol className={`produto-passos ${tutorial.length === 1 ? 'um-passo' : ''}`}>{tutorial.map((passo, indice) => <li className={passo.poster ? 'produto-passo-poster' : ''} key={passo.titulo}>
            <div className="produto-passo-imagem"><span>0{indice + 1}</span><img src={passo.imagem} alt={`Esquema de medição: ${passo.titulo}`} loading="lazy" /><button className="produto-lupa" type="button" onClick={() => setImagemAmpliada({ src: passo.imagem, alt: `Esquema de medição: ${passo.titulo}`, zoom: 1, x: 0, y: 0 })} aria-label={`Ampliar ${passo.titulo}`}><i aria-hidden="true" /></button></div>
            <div><small>PASSO {indice + 1}</small><h3>{passo.titulo}</h3><p>{passo.texto}</p></div>
          </li>)}</ol>
          <aside className="produto-aviso"><span>ESTIMATIVA INICIAL</span><p>As medidas enviadas pelo WhatsApp são utilizadas para calcular uma estimativa de orçamento. O valor final poderá ser ajustado após a visita técnica, quando nossa equipe conferir as medidas e as condições do local antes da fabricação.</p></aside>
        </div>
      </section> : <section className="produto-orcamento">
        <div className="produto-container produto-orcamento-grid">
          <div><p className="produto-eyebrow">Orçamento orientado</p><h2>Comece enviando<br />uma foto do espaço.</h2></div>
          <div><p>Fotografe o vão de frente e, se possível, envie também um detalhe da esquadria ou do trilho. Nossa equipe analisa o local e orienta quais medidas iniciais serão necessárias.</p><a className="produto-botao" href={whatsapp} target="_blank" rel="noreferrer">Enviar fotos pelo WhatsApp <span>↗</span></a></div>
        </div>
      </section>}

      <section className="produto-cta"><div className="produto-container"><p className="produto-eyebrow">Atendimento humano do início ao fim</p><h2>Seu espaço.<br />Sua medida.</h2><p>Envie uma foto e descubra qual solução funciona melhor para a sua casa.</p><a className="produto-botao" href={whatsapp} target="_blank" rel="noreferrer">Solicitar orçamento <span>↗</span></a></div></section>
    </main>

    <footer className="produto-footer"><div className="produto-container"><img src={`${BASE}logo.png`} alt="Mosquiteira.com" /><p>Telas mosquiteiras sob medida<br />em Santos.</p><Link to="/">Voltar à página inicial ↑</Link></div></footer>

    {imagemAmpliada && <div className="produto-lightbox" role="dialog" aria-modal="true" aria-label="Visualização ampliada da imagem" onClick={(evento) => { if (evento.target === evento.currentTarget) setImagemAmpliada(null); }}>
      <button type="button" className="produto-lightbox-fechar" onClick={() => setImagemAmpliada(null)} aria-label="Fechar imagem ampliada" autoFocus>×</button>
      <div className={`produto-lightbox-viewport ${imagemAmpliada.zoom > 1 ? 'esta-ampliada' : ''}`} onWheel={(evento) => { evento.preventDefault(); alterarZoom(evento.deltaY < 0 ? 0.25 : -0.25); }} onPointerDown={iniciarArraste} onPointerMove={moverImagem} onPointerUp={encerrarArraste} onPointerCancel={encerrarArraste}>
        <img src={imagemAmpliada.src} alt={imagemAmpliada.alt} draggable="false" onDoubleClick={() => alterarZoom(imagemAmpliada.zoom >= 3 ? 1 - imagemAmpliada.zoom : 1)} style={{ transform: `translate(${imagemAmpliada.x}px, ${imagemAmpliada.y}px) scale(${imagemAmpliada.zoom})` }} />
      </div>
      <p className="produto-lightbox-ajuda">{imagemAmpliada.zoom > 1 ? 'Arraste para explorar a imagem' : 'Clique em + ou dê dois cliques para ampliar'}</p>
      <div className="produto-lightbox-controles" aria-label="Controles de zoom">
        <button type="button" onClick={() => alterarZoom(-0.5)} disabled={imagemAmpliada.zoom <= 1} aria-label="Diminuir zoom">−</button>
        <button type="button" className="produto-lightbox-nivel" onClick={() => setImagemAmpliada((atual) => ({ ...atual, zoom: 1, x: 0, y: 0 }))} aria-label="Restaurar tamanho original">{Math.round(imagemAmpliada.zoom * 100)}%</button>
        <button type="button" onClick={() => alterarZoom(0.5)} disabled={imagemAmpliada.zoom >= 4} aria-label="Aumentar zoom">+</button>
      </div>
    </div>}
  </div>;
}
