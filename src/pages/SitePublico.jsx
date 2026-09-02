import { useEffect, useState } from 'react';
import './SitePublico.css';

const WHATSAPP = 'https://wa.me/551341412112?text=Ol%C3%A1%21%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20online%20de%20telas%20mosquiteiras.%20Podem%20me%20orientar%20sobre%20as%20fotos%20e%20medidas%20iniciais%3F';

const modelos = [
  { nome: 'Removível', slug: 'removivel', uso: 'Para janelas', texto: 'Encaixe preciso e remoção simples para limpeza.', imagem: '/site/catalogo-tela-removivel.webp' },
  { nome: 'De correr', slug: 'de-correr', uso: 'Para esquadrias com trilho', texto: 'Movimento leve e acabamento integrado ao ambiente.', imagem: '/site/catalogo-tela-correr.png' },
  { nome: 'De recolher', slug: 'de-recolher', uso: 'Para portas e vãos amplos', texto: 'Proteção prática, disponível somente quando necessária.', imagem: '/site/catalogo-tela-recolher.png' },
  { nome: 'Porta de giro', slug: 'porta-de-giro', uso: 'Para portas de passagem', texto: 'Abertura prática e estrutura resistente para proteger áreas de passagem.', imagem: '/site/porta-giro.png' },
];

const clientes = [
  ['Santos FC', '/site/clientes/santos-fc.png'],
  ['Hortifrutti', '/site/clientes/hortifrutti.png'],
  ['Clínica Radiológica de Santos', '/site/clientes/clinica-radiologica.webp'],
  ['Sindaport', '/site/clientes/sindaport.png'],
  ['Sodiê Doces', '/site/clientes/sodie.png'],
  ['Unifesp', '/site/clientes/unifesp.png'],
  ['Amil', '/site/clientes/amil.png'],
  ['Record TV', '/site/clientes/record-tv.png'],
  ['Hospital Ana Costa', '/site/clientes/ana-costa.webp'],
  ['Prevent Senior', '/site/clientes/prevent-senior.png'],
];

const perguntas = [
  ['Preciso saber medir?', 'Não. Tenha uma trena e um celular em mãos. Nossa equipe orienta quais fotos fazer e quais medidas iniciais enviar.'],
  ['Preciso receber uma visita para saber os valores?', 'Não. O orçamento começa online pelo WhatsApp. A visita presencial acontece somente após sua aprovação, para conferirmos as medidas.'],
  ['O que acontece depois da medição?', 'Fabricamos o pedido sob medida. Quando tudo estiver pronto, entramos em contato para escolher a melhor data de instalação.'],
  ['Quando faço o pagamento?', 'Somente após as telas estarem instaladas em sua residência.'],
  ['Como sei qual modelo escolher?', 'Envie fotos do espaço. Nossa equipe analisa o tipo de vão e orienta a solução mais adequada.'],
];

function Marca() {
  return <span className="luxo-marca"><img src="/logo.png" alt="Mosquiteira.com — a solução contra mosquitos" /></span>;
}

export default function SitePublico() {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    document.title = 'Telas Mosquiteiras sob Medida em Santos | Mosquiteira.com';
    const fecharComEsc = (evento) => { if (evento.key === 'Escape') setMenuAberto(false); };
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuAberto]);

  useEffect(() => {
    const raiz = document.querySelector('.luxo-site');
    if (!raiz) return undefined;

    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ponteiroPreciso = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const economizarDados = navigator.connection?.saveData;
    const progresso = raiz.querySelector('.luxo-progresso > span');
    const limpezas = [];
    let quadro = 0;

    const gruposReveal = [
      '.luxo-hero-copy > *',
      '.luxo-provas > div > div',
      '.luxo-evidencia-topo > *',
      '.luxo-evidencia-pontos article',
      '.luxo-processo .luxo-secao-cabecalho > *',
      '.luxo-etapas li',
      '.luxo-modelos .luxo-secao-cabecalho > *',
      '.luxo-modelo',
      '.luxo-pagamento-grid > *',
      '.luxo-clientes .luxo-secao-cabecalho > *',
      '.luxo-logos > div',
      '.luxo-faq-grid > *',
      '.luxo-cta > div',
      '.luxo-assinatura-conteudo > *',
    ];

    if (!movimentoReduzido) {
      raiz.classList.add('motion-enabled');
      const elementosReveal = [];
      gruposReveal.forEach((seletor) => {
        raiz.querySelectorAll(seletor).forEach((elemento, indice) => {
          elemento.classList.add('motion-reveal');
          elemento.style.setProperty('--motion-delay', `${Math.min(indice * 65, 260)}ms`);
          elementosReveal.push(elemento);
        });
      });

      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add('is-visible');
          observador.unobserve(entrada.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
      elementosReveal.forEach((elemento) => observador.observe(elemento));
      limpezas.push(() => observador.disconnect());
    }

    const atualizarRolagem = () => {
      quadro = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percentual = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      progresso?.style.setProperty('--progress', percentual);
      raiz.classList.toggle('pagina-rolada', window.scrollY > 40);
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizarRolagem);
    };
    atualizarRolagem();
    window.addEventListener('scroll', aoRolar, { passive: true });
    limpezas.push(() => window.removeEventListener('scroll', aoRolar));

    if (!movimentoReduzido && !economizarDados && ponteiroPreciso) {
      const desenho = raiz.querySelector('.luxo-desenho');
      const areasLuz = raiz.querySelectorAll('.luxo-hero, .luxo-evidencia, .luxo-pagamento, .luxo-cta');

      const moverHero = (evento) => {
        if (!desenho) return;
        const area = evento.currentTarget.getBoundingClientRect();
        const x = ((evento.clientX - area.left) / area.width) * 2 - 1;
        const y = ((evento.clientY - area.top) / area.height) * 2 - 1;
        desenho.style.setProperty('--tilt-x', `${(-y * 2.8).toFixed(2)}deg`);
        desenho.style.setProperty('--tilt-y', `${(x * 4).toFixed(2)}deg`);
        desenho.style.setProperty('--parallax-x', `${(x * 9).toFixed(2)}px`);
        desenho.style.setProperty('--parallax-y', `${(y * 7).toFixed(2)}px`);
      };
      const hero = raiz.querySelector('.luxo-hero');
      hero?.addEventListener('pointermove', moverHero, { passive: true });
      hero?.addEventListener('pointerleave', () => desenho?.removeAttribute('style'));
      limpezas.push(() => hero?.removeEventListener('pointermove', moverHero));

      const moverLuz = (evento) => {
        const area = evento.currentTarget.getBoundingClientRect();
        evento.currentTarget.style.setProperty('--spot-x', `${evento.clientX - area.left}px`);
        evento.currentTarget.style.setProperty('--spot-y', `${evento.clientY - area.top}px`);
      };
      areasLuz.forEach((area) => area.addEventListener('pointermove', moverLuz, { passive: true }));
      limpezas.push(() => areasLuz.forEach((area) => area.removeEventListener('pointermove', moverLuz)));

      raiz.querySelectorAll('.luxo-modelo').forEach((card) => {
        const moverCard = (evento) => {
          const area = card.getBoundingClientRect();
          const x = (evento.clientX - area.left) / area.width;
          const y = (evento.clientY - area.top) / area.height;
          card.style.setProperty('--card-rx', `${((.5 - y) * 5).toFixed(2)}deg`);
          card.style.setProperty('--card-ry', `${((x - .5) * 5).toFixed(2)}deg`);
          card.style.setProperty('--shine-x', `${(x * 100).toFixed(1)}%`);
          card.style.setProperty('--shine-y', `${(y * 100).toFixed(1)}%`);
        };
        const resetarCard = () => {
          card.style.setProperty('--card-rx', '0deg');
          card.style.setProperty('--card-ry', '0deg');
        };
        card.addEventListener('pointermove', moverCard, { passive: true });
        card.addEventListener('pointerleave', resetarCard);
        limpezas.push(() => {
          card.removeEventListener('pointermove', moverCard);
          card.removeEventListener('pointerleave', resetarCard);
        });
      });

      raiz.querySelectorAll('.luxo-botao, .luxo-header-cta').forEach((botao) => {
        const moverBotao = (evento) => {
          const area = botao.getBoundingClientRect();
          botao.style.setProperty('--mag-x', `${((evento.clientX - area.left - area.width / 2) * .09).toFixed(2)}px`);
          botao.style.setProperty('--mag-y', `${((evento.clientY - area.top - area.height / 2) * .12).toFixed(2)}px`);
        };
        const resetarBotao = () => {
          botao.style.setProperty('--mag-x', '0px');
          botao.style.setProperty('--mag-y', '0px');
        };
        botao.addEventListener('pointermove', moverBotao, { passive: true });
        botao.addEventListener('pointerleave', resetarBotao);
        limpezas.push(() => {
          botao.removeEventListener('pointermove', moverBotao);
          botao.removeEventListener('pointerleave', resetarBotao);
        });
      });
    }

    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      raiz.classList.remove('motion-enabled', 'pagina-rolada');
      limpezas.forEach((limpar) => limpar());
    };
  }, []);

  const fecharMenu = () => setMenuAberto(false);

  return <div className="luxo-site">
    <div className="luxo-progresso" aria-hidden="true"><span /></div>
    <a className="luxo-pular" href="#conteudo">Pular para o conteúdo</a>

    <header className="luxo-header">
      <a href="#inicio" aria-label="Mosquiteira.com — início"><Marca /></a>
      <button className={`luxo-menu-botao ${menuAberto ? 'aberto' : ''}`} type="button" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} aria-controls="luxo-menu" aria-expanded={menuAberto} onClick={() => setMenuAberto(!menuAberto)}><span></span><span></span></button>
      <nav id="luxo-menu" className={menuAberto ? 'aberto' : ''} aria-label="Navegação principal">
        <a href="#inicio" onClick={fecharMenu}>Início</a>
        <a href="#saude" onClick={fecharMenu}>OMS</a>
        <a href="#processo" onClick={fecharMenu}>Como funciona</a>
        <a href="#modelos" onClick={fecharMenu}>Catálogo</a>
        <a href="#pagamento" onClick={fecharMenu}>Pagamento</a>
        <a href="#clientes" onClick={fecharMenu}>Clientes</a>
        <a href="#perguntas" onClick={fecharMenu}>Perguntas frequentes</a>
        <a className="luxo-header-cta" href="#contato" onClick={fecharMenu}>Solicite seu orçamento <span>↓</span></a>
      </nav>
    </header>

    <main id="conteudo">
      <section className="luxo-hero" id="inicio">
        <div className="luxo-container luxo-hero-grid">
          <div className="luxo-hero-copy">
            <p className="luxo-sobretitulo">Santos · +10 anos protegendo seu lar</p>
            <h1>Telas mosquiteiras<br />sob medida.<br /><em>Comece por uma foto.</em></h1>
            <p className="luxo-lead">Solicite seu orçamento pelo WhatsApp. Nossa equipe orienta as fotos e medidas iniciais; após sua aprovação, conferimos tudo no local, fabricamos e instalamos.</p>
            <div className="luxo-acoes"><a className="luxo-botao" href={WHATSAPP} target="_blank" rel="noreferrer">Solicitar orçamento online <span>↗</span></a><a className="luxo-link" href="#processo">Entenda como funciona <span>↓</span></a></div>
            <small className="luxo-microcopy">Para começar, você só precisa de um celular e uma trena · Seg–sex, 9h–17h</small>
          </div>
          <div className="luxo-desenho" aria-hidden="true">
            <div className="luxo-cota cota-topo"><span>sob medida</span></div>
            <div className="luxo-janela">
              <div className="luxo-malha"></div>
              <i className="luxo-ponto ponto-superior-esquerdo"></i>
              <i className="luxo-ponto ponto-superior-meio"></i>
              <i className="luxo-ponto ponto-superior-direito"></i>
              <i className="luxo-ponto ponto-esquerdo-meio"></i>
              <i className="luxo-ponto ponto-direito-meio"></i>
              <i className="luxo-ponto ponto-inferior-esquerdo"></i>
              <i className="luxo-ponto ponto-inferior-meio"></i>
              <i className="luxo-ponto ponto-inferior-direito"></i>
            </div>
            <div className="luxo-cota cota-lateral"><span>conferência presencial</span></div>
            <small>PROJETO / 01</small>
          </div>
        </div>
      </section>

      <section className="luxo-provas" aria-label="Números da empresa"><div className="luxo-container"><div><strong>+2.600</strong><span>clientes atendidos</span></div><div><strong>+10 anos</strong><span>protegendo seu lar e sua família</span></div><div><strong>Fabricação</strong><span>sob medida</span></div><div><strong>Pagamento no final</strong><span>somente após a instalação</span></div></div></section>

      <section className="luxo-evidencia luxo-secao" id="saude" aria-labelledby="titulo-evidencia">
        <div className="luxo-container">
          <div className="luxo-evidencia-topo">
            <div>
              <p className="luxo-sobretitulo escuro">Habitação e saúde · OMS</p>
              <h2 id="titulo-evidencia">Uma barreira simples.<br />Uma casa mais protegida.</h2>
            </div>
            <div className="luxo-evidencia-resumo">
              <p>A Organização Mundial da Saúde destaca a moradia como parte importante da proteção contra insetos que podem transmitir doenças, como mosquitos. Entre as melhorias recomendadas está a instalação de telas em janelas, portas e outras aberturas da casa.</p>
              <a href="https://iris.who.int/server/api/core/bitstreams/f4fc85cd-249a-43fd-b95d-75e5d93535f2/content" target="_blank" rel="noreferrer">Abrir publicação original da OMS (PDF em inglês) <span>↗</span></a>
            </div>
          </div>

          <div className="luxo-evidencia-pontos">
            <article><span>01</span><h3>Fechar pontos de entrada</h3><p>Telas bem ajustadas em janelas e portas ajudam a dificultar a entrada de mosquitos e outros insetos no ambiente interno.</p></article>
            <article><span>02</span><h3>Olhar para a casa toda</h3><p>A proteção também envolve reduzir frestas, aberturas e locais que possam servir de passagem ou abrigo para esses insetos.</p></article>
            <article><span>03</span><h3>Somar medidas de proteção</h3><p>Melhorias na habitação fazem parte de uma estratégia integrada, junto aos cuidados com criadouros e às orientações de saúde pública.</p></article>
          </div>

          <p className="luxo-evidencia-nota">Síntese em português da publicação <em>Keeping the vector out: housing improvements for vector control and sustainable development</em>, OMS, 2017. Telas mosquiteiras são uma medida complementar e não substituem as recomendações das autoridades de saúde.</p>
        </div>
      </section>

      <section className="luxo-processo luxo-secao" id="processo">
        <div className="luxo-container">
          <div className="luxo-secao-cabecalho"><div><p className="luxo-sobretitulo escuro">Orientação do início ao fim</p><h2>Você envia as fotos.<br />Nós cuidamos dos próximos passos.</h2></div><p>Não sabe o que fotografar ou medir? Tudo bem. Pelo WhatsApp, mostramos exatamente o que precisamos para preparar seu orçamento.</p></div>
          <ol className="luxo-etapas">
            <li><span>01</span><h3>Orçamento online</h3><p>Com uma trena e um celular, envie as fotos indicadas. Orientamos as medidas iniciais e apresentamos os valores pelo WhatsApp.</p></li>
            <li><span>02</span><h3>Conferência e fabricação</h3><p>Após sua aprovação, vamos ao local conferir as medidas e produzimos cada tela especialmente para o seu espaço.</p></li>
            <li><span>03</span><h3>Instalação e pagamento</h3><p>Quando o pedido estiver pronto, combinamos a melhor data. Instalamos e você realiza o pagamento somente com o serviço concluído.</p></li>
          </ol>
          <a className="luxo-link destaque" href={WHATSAPP} target="_blank" rel="noreferrer">Começar pelo WhatsApp <span>↗</span></a>
        </div>
      </section>

      <section className="luxo-modelos luxo-secao" id="modelos">
        <div className="luxo-container">
          <div className="luxo-secao-cabecalho"><div><p className="luxo-sobretitulo escuro">Soluções sob medida</p><h2>Uma solução precisa<br />para cada tipo de vão.</h2></div><p>Envie uma foto e nossa equipe recomenda o sistema mais adequado ao seu espaço.</p></div>
          <div className="luxo-modelos-grid">{modelos.map((modelo, indice) => <article className="luxo-modelo" key={modelo.nome}><a className="luxo-modelo-visual" href={`/modelos/${modelo.slug}`}><span>0{indice + 1}</span><img src={modelo.imagem} alt={`Tela mosquiteira ${modelo.nome}`} loading="lazy" /></a><div className="luxo-modelo-info"><small>{modelo.uso}</small><h3><a href={`/modelos/${modelo.slug}`}>{modelo.nome}</a></h3><p>{modelo.texto}</p><a href={`/modelos/${modelo.slug}`}>Conhecer este modelo <span>→</span></a></div></article>)}</div>
        </div>
      </section>

      <section className="luxo-pagamento" id="pagamento">
        <div className="luxo-container luxo-pagamento-grid"><p className="luxo-sobretitulo">Compromisso com a entrega</p><div><h2>O pagamento<br />vem por último.</h2><p>Primeiro, conferimos as medidas. Depois, fabricamos e instalamos. Você realiza o pagamento somente quando as telas estiverem instaladas em sua residência.</p><a className="luxo-botao" href={WHATSAPP} target="_blank" rel="noreferrer">Solicitar orçamento online <span>↗</span></a></div></div>
      </section>

      <section className="luxo-clientes luxo-secao" id="clientes">
        <div className="luxo-container">
          <div className="luxo-secao-cabecalho"><div><p className="luxo-sobretitulo escuro">Confiança construída desde 2014</p><h2>Mais de 2.600<br />clientes atendidos.</h2></div><p>Experiência em projetos residenciais, empresariais e institucionais.</p></div>
          <p className="luxo-logos-titulo">Algumas empresas e instituições que já atendemos</p>
          <div className="luxo-logos">{clientes.map(([nome, logo]) => <div key={nome}><img src={logo} alt={nome} loading="lazy" /></div>)}</div>
        </div>
      </section>

      <section className="luxo-faq luxo-secao" id="perguntas">
        <div className="luxo-container luxo-faq-grid"><div><p className="luxo-sobretitulo escuro">Perguntas frequentes</p><h2>Simples desde<br />o primeiro contato.</h2></div><div>{perguntas.map(([pergunta, resposta]) => <details key={pergunta}><summary>{pergunta}<span>+</span></summary><p>{resposta}</p></details>)}</div></div>
      </section>

      <section className="luxo-cta" id="contato"><div className="luxo-container"><p className="luxo-sobretitulo">Orçamento online, com orientação humana</p><h2>Uma foto é<br />o primeiro passo.</h2><p>Nós mostramos quais fotos e medidas enviar pelo WhatsApp.</p><a className="luxo-botao" href={WHATSAPP} target="_blank" rel="noreferrer">Solicitar orçamento online <span>↗</span></a><small>Atendimento de segunda a sexta, das 9h às 17h.</small></div></section>

    </main>

    <footer className="luxo-footer" id="footer">
      <div className="luxo-container luxo-assinatura-conteudo"><Marca /><p>Telas mosquiteiras sob medida<br />em Santos desde 2014.</p></div>
      <div className="luxo-container luxo-footer-grid"><div><small>MOSQUITEIRA.COM</small><p>Proteção sob medida,<br />com atendimento próximo.</p></div><div><small>CONTATO</small><a href="tel:+551341412112">(13) 4141-2112</a><a href="mailto:contato@mosquiteira.com">contato@mosquiteira.com</a></div><address><small>ENDEREÇO</small><a href="https://www.google.com/maps/search/?api=1&query=Almirante+Tamandare+239+Santos+SP" target="_blank" rel="noreferrer">Almirante Tamandaré, 239<br />Santos — SP ↗</a></address><div><small>ATENDIMENTO</small><p>Segunda a sexta<br />9h às 17h</p></div></div>
      <div className="luxo-container luxo-footer-base"><span>© {new Date().getFullYear()} Mosquiteira.com</span><a href="/sistema">Área da equipe</a></div>
    </footer>

    <a className="luxo-whatsapp-fixo" href={WHATSAPP} target="_blank" rel="noreferrer"><span>Solicitar orçamento online</span><b>↗</b></a>
  </div>;
}
