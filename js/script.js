/* ==========================================================
   SCRIPT.JS
   Projeto: B2 Energia Solar
========================================================== */

"use strict";


/* ==========================================================
   EXECUTA O SITE APÓS O HTML SER CARREGADO
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    configurarHeader();
    configurarMenuMobile();
    configurarAnimacoesScroll();
    configurarAnoAtual();
    configurarLinksAtivos();
    configurarRolagemSuave();
    configurarContadores();
    configurarFiltrosDeObras();
    configurarLightbox();
    configurarFormularioOrcamento();

});


/* ==========================================================
   HEADER AO ROLAR A PÁGINA
========================================================== */

function configurarHeader() {

    const header = document.querySelector("#header");

    if (!header) {
        return;
    }

    let ultimaPosicaoScroll = window.scrollY;
    let aguardandoFrame = false;

    function atualizarHeader() {

        const posicaoAtual = window.scrollY;

        /*
         * Adiciona fundo branco ao cabeçalho
         * depois que o usuário começa a rolar.
         */

        if (posicaoAtual > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

        /*
         * Esconde o cabeçalho quando o usuário desce
         * e exibe novamente quando ele sobe.
         */

        const menuEstaAberto =
            document.body.classList.contains("menu-open");

        if (!menuEstaAberto && posicaoAtual > 250) {

            if (posicaoAtual > ultimaPosicaoScroll) {

                header.classList.add("hide");

            } else {

                header.classList.remove("hide");

            }

        } else {

            header.classList.remove("hide");

        }

        ultimaPosicaoScroll = Math.max(posicaoAtual, 0);
        aguardandoFrame = false;

    }

    function observarRolagem() {

        if (!aguardandoFrame) {

            window.requestAnimationFrame(atualizarHeader);
            aguardandoFrame = true;

        }

    }

    atualizarHeader();

    window.addEventListener(
        "scroll",
        observarRolagem,
        { passive: true }
    );

}


/* ==========================================================
   MENU MOBILE
========================================================== */

function configurarMenuMobile() {

    const botaoMenu = document.querySelector("#menuMobile");
    const navbar = document.querySelector("#navbar");
    const header = document.querySelector("#header");

    if (!botaoMenu || !navbar) {
        return;
    }

    const iconeMenu = botaoMenu.querySelector("i");

    function abrirMenu() {

        navbar.classList.add("active");
        document.body.classList.add("menu-open");

        botaoMenu.setAttribute("aria-expanded", "true");
        botaoMenu.setAttribute("aria-label", "Fechar menu de navegação");

        if (iconeMenu) {

            iconeMenu.classList.remove("fa-bars");
            iconeMenu.classList.add("fa-xmark");

        }

        if (header) {
            header.classList.remove("hide");
        }

    }

    function fecharMenu() {

        navbar.classList.remove("active");
        document.body.classList.remove("menu-open");

        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu de navegação");

        if (iconeMenu) {

            iconeMenu.classList.remove("fa-xmark");
            iconeMenu.classList.add("fa-bars");

        }

    }

    function alternarMenu() {

        const menuAberto = navbar.classList.contains("active");

        if (menuAberto) {

            fecharMenu();

        } else {

            abrirMenu();

        }

    }

    botaoMenu.addEventListener("click", alternarMenu);

    /*
     * Fecha o menu quando um link é selecionado.
     */

    const linksMenu = navbar.querySelectorAll("a");

    linksMenu.forEach((link) => {

        link.addEventListener("click", fecharMenu);

    });

    /*
     * Fecha ao clicar na área escura fora do menu.
     */

    document.addEventListener("click", (evento) => {

        const menuAberto = navbar.classList.contains("active");

        if (!menuAberto) {
            return;
        }

        const clicouNoMenu = navbar.contains(evento.target);
        const clicouNoBotao = botaoMenu.contains(evento.target);

        if (!clicouNoMenu && !clicouNoBotao) {

            fecharMenu();

        }

    });

    /*
     * Fecha o menu ao pressionar Escape.
     */

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {

            fecharMenu();

        }

    });

    /*
     * Fecha o menu caso o usuário aumente a tela.
     */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 860) {

            fecharMenu();

        }

    });

}


/* ==========================================================
   ANIMAÇÕES AO APARECER NA TELA
========================================================== */

function configurarAnimacoesScroll() {

    const elementosAnimados = document.querySelectorAll(
        ".fade-up, .fade-down, .fade-left, .fade-right, .zoom-in, .zoom-out"
    );

    if (elementosAnimados.length === 0) {
        return;
    }

    /*
     * Respeita usuários que preferem menos movimentos.
     */

    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduzirMovimento) {

        elementosAnimados.forEach((elemento) => {

            elemento.classList.add("show");

        });

        return;

    }

    /*
     * Exibe o conteúdo quando aproximadamente 12%
     * do elemento entra na tela.
     */

    const observador = new IntersectionObserver(
        (entradas, observer) => {

            entradas.forEach((entrada) => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("show");
                    observer.unobserve(entrada.target);

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    elementosAnimados.forEach((elemento, indice) => {

        /*
         * Pequeno atraso progressivo nos elementos
         * que aparecem em sequência.
         */

        const atraso = Math.min((indice % 4) * 90, 270);

        elemento.style.transitionDelay = `${atraso}ms`;

        observador.observe(elemento);

    });

}


/* ==========================================================
   ANO AUTOMÁTICO NO RODAPÉ
========================================================== */

function configurarAnoAtual() {

    const elementoAno = document.querySelector("#currentYear");

    if (!elementoAno) {
        return;
    }

    elementoAno.textContent = new Date().getFullYear();

}


/* ==========================================================
   LINK ATIVO NO MENU
========================================================== */

function configurarLinksAtivos() {

    const links = document.querySelectorAll(".nav-list a");

    if (links.length === 0) {
        return;
    }

    /*
     * Obtém o nome do arquivo atual.
     * Quando estiver apenas "/", considera index.html.
     */

    const caminhoAtual = window.location.pathname;

    let paginaAtual = caminhoAtual.split("/").pop();

    if (!paginaAtual) {
        paginaAtual = "index.html";
    }

    links.forEach((link) => {

        const destinoCompleto = link.getAttribute("href");

        if (!destinoCompleto) {
            return;
        }

        const destinoSemAncora = destinoCompleto
            .split("#")[0]
            .split("?")[0];

        link.classList.remove("active");
        link.removeAttribute("aria-current");

        if (destinoSemAncora === paginaAtual) {

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

        }

    });

}


/* ==========================================================
   ROLAGEM SUAVE PARA LINKS INTERNOS
========================================================== */

function configurarRolagemSuave() {

    const linksInternos = document.querySelectorAll('a[href^="#"]');

    if (linksInternos.length === 0) {
        return;
    }

    linksInternos.forEach((link) => {

        link.addEventListener("click", (evento) => {

            const seletor = link.getAttribute("href");

            if (!seletor || seletor === "#") {
                return;
            }

            let destino;

            try {

                destino = document.querySelector(seletor);

            } catch (erro) {

                return;

            }

            if (!destino) {
                return;
            }

            evento.preventDefault();

            const header = document.querySelector("#header");

            const alturaHeader = header
                ? header.offsetHeight
                : 0;

            const posicaoDestino =
                destino.getBoundingClientRect().top +
                window.scrollY -
                alturaHeader;

            window.scrollTo({
                top: posicaoDestino,
                behavior: "smooth"
            });

        });

    });

}


/* ==========================================================
   CONTADORES DOS NÚMEROS DA HOME
========================================================== */

function configurarContadores() {

    const numeros = document.querySelectorAll(".numero h2");

    if (numeros.length === 0) {
        return;
    }

    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduzirMovimento) {
        return;
    }

    const observador = new IntersectionObserver(
        (entradas, observer) => {

            entradas.forEach((entrada) => {

                if (!entrada.isIntersecting) {
                    return;
                }

                animarNumero(entrada.target);

                observer.unobserve(entrada.target);

            });

        },
        {
            threshold: 0.6
        }
    );

    numeros.forEach((numero) => {

        observador.observe(numero);

    });

}


function animarNumero(elemento) {

    const textoOriginal = elemento.textContent.trim();

    /*
     * Não anima conteúdos como:
     * "5 estrelas", "ES" ou outros textos sem número inicial.
     */

    const resultado = textoOriginal.match(/^([\d.,]+)(.*)$/);

    if (!resultado) {
        return;
    }

    const numeroTexto = resultado[1];
    const sufixo = resultado[2];

    const numeroFinal = Number(
        numeroTexto
            .replace(/\./g, "")
            .replace(",", ".")
    );

    if (!Number.isFinite(numeroFinal)) {
        return;
    }

    const duracao = 1500;
    const inicio = performance.now();

    function atualizarContador(tempoAtual) {

        const progresso = Math.min(
            (tempoAtual - inicio) / duracao,
            1
        );

        /*
         * Curva de animação mais natural.
         */

        const progressoSuave =
            1 - Math.pow(1 - progresso, 3);

        const valorAtual = Math.floor(
            numeroFinal * progressoSuave
        );

        elemento.textContent =
            valorAtual.toLocaleString("pt-BR") +
            sufixo;

        if (progresso < 1) {

            window.requestAnimationFrame(atualizarContador);

        } else {

            elemento.textContent = textoOriginal;

        }

    }

    elemento.textContent = `0${sufixo}`;

    window.requestAnimationFrame(atualizarContador);

}


/* ==========================================================
   FILTROS DA PÁGINA DE OBRAS
========================================================== */

function configurarFiltrosDeObras() {

    const botoesFiltro = document.querySelectorAll(".filtro-btn");
    const obras = document.querySelectorAll(".obra-card");

    if (botoesFiltro.length === 0 || obras.length === 0) {
        return;
    }

    botoesFiltro.forEach((botao) => {

        botao.addEventListener("click", () => {

            const filtro = botao.dataset.filter || "todos";

            botoesFiltro.forEach((item) => {

                item.classList.remove("active");

            });

            botao.classList.add("active");

            obras.forEach((obra) => {

                const categoria = obra.dataset.category || "";

                const deveAparecer =
                    filtro === "todos" ||
                    categoria === filtro;

                if (deveAparecer) {

                    obra.hidden = false;

                    requestAnimationFrame(() => {

                        obra.classList.add("show");

                    });

                } else {

                    obra.classList.remove("show");
                    obra.hidden = true;

                }

            });

        });

    });

}


/* ==========================================================
   LIGHTBOX DA GALERIA
========================================================== */

function configurarLightbox() {

    const itensGaleria = Array.from(
        document.querySelectorAll("[data-lightbox]")
    );

    if (itensGaleria.length === 0) {
        return;
    }

    let indiceAtual = 0;

    const lightbox = criarEstruturaLightbox();

    const imagemLightbox =
        lightbox.querySelector(".lightbox-image");

    const legendaLightbox =
        lightbox.querySelector(".lightbox-caption");

    const botaoFechar =
        lightbox.querySelector(".lightbox-close");

    const botaoAnterior =
        lightbox.querySelector(".lightbox-prev");

    const botaoProximo =
        lightbox.querySelector(".lightbox-next");


    function obterDadosDoItem(item) {

        const imagem = item.tagName === "IMG"
            ? item
            : item.querySelector("img");

        if (!imagem) {
            return null;
        }

        return {
            src:
                item.dataset.lightbox ||
                imagem.currentSrc ||
                imagem.src,

            alt:
                imagem.alt ||
                "Imagem de obra realizada pela B2 Energia Solar",

            legenda:
                item.dataset.caption ||
                imagem.alt ||
                ""
        };

    }


    function mostrarImagem(indice) {

        const quantidade = itensGaleria.length;

        indiceAtual =
            (indice + quantidade) % quantidade;

        const dados = obterDadosDoItem(
            itensGaleria[indiceAtual]
        );

        if (!dados) {
            return;
        }

        imagemLightbox.src = dados.src;
        imagemLightbox.alt = dados.alt;
        legendaLightbox.textContent = dados.legenda;

    }


    function abrirLightbox(indice) {

        mostrarImagem(indice);

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        botaoFechar.focus();

    }


    function fecharLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

    }


    itensGaleria.forEach((item, indice) => {

        item.setAttribute("tabindex", "0");
        item.setAttribute("role", "button");

        item.addEventListener("click", (evento) => {

            evento.preventDefault();
            abrirLightbox(indice);

        });

        item.addEventListener("keydown", (evento) => {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();
                abrirLightbox(indice);

            }

        });

    });


    botaoFechar.addEventListener(
        "click",
        fecharLightbox
    );

    botaoAnterior.addEventListener("click", () => {

        mostrarImagem(indiceAtual - 1);

    });

    botaoProximo.addEventListener("click", () => {

        mostrarImagem(indiceAtual + 1);

    });


    lightbox.addEventListener("click", (evento) => {

        if (evento.target === lightbox) {

            fecharLightbox();

        }

    });


    document.addEventListener("keydown", (evento) => {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        if (evento.key === "Escape") {

            fecharLightbox();

        }

        if (evento.key === "ArrowLeft") {

            mostrarImagem(indiceAtual - 1);

        }

        if (evento.key === "ArrowRight") {

            mostrarImagem(indiceAtual + 1);

        }

    });

}


function criarEstruturaLightbox() {

    const lightboxExistente =
        document.querySelector(".lightbox");

    if (lightboxExistente) {
        return lightboxExistente;
    }

    const lightbox = document.createElement("div");

    lightbox.className = "lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute(
        "aria-label",
        "Visualização ampliada da imagem"
    );

    lightbox.innerHTML = `
        <div class="lightbox-content">

            <button
                type="button"
                class="lightbox-close"
                aria-label="Fechar imagem"
            >
                <i
                    class="fa-solid fa-xmark"
                    aria-hidden="true"
                ></i>
            </button>

            <button
                type="button"
                class="lightbox-prev"
                aria-label="Imagem anterior"
            >
                <i
                    class="fa-solid fa-chevron-left"
                    aria-hidden="true"
                ></i>
            </button>

            <img
                class="lightbox-image"
                src=""
                alt=""
            >

            <p class="lightbox-caption"></p>

            <button
                type="button"
                class="lightbox-next"
                aria-label="Próxima imagem"
            >
                <i
                    class="fa-solid fa-chevron-right"
                    aria-hidden="true"
                ></i>
            </button>

        </div>
    `;

    document.body.appendChild(lightbox);

    return lightbox;

}


/* ==========================================================
   FORMULÁRIO DE ORÇAMENTO PARA WHATSAPP
========================================================== */

function configurarFormularioOrcamento() {

    const formulario = document.querySelector(
        "#formOrcamento"
    );

    if (!formulario) {
        return;
    }

    const numeroWhatsApp = "5527997875792";

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        limparErrosDoFormulario(formulario);

        const dados = new FormData(formulario);

        const campos = {

            nome:
                obterValorFormulario(dados, "nome"),

            telefone:
                obterValorFormulario(dados, "telefone"),

            conta:
                obterValorFormulario(dados, "conta"),

            padrao:
                obterValorFormulario(dados, "padrao"),

            telhado:
                obterValorFormulario(dados, "telhado"),

            aumentoConsumo:
                obterValorFormulario(
                    dados,
                    "aumentoConsumo"
                ),

            observacoes:
                obterValorFormulario(
                    dados,
                    "observacoes"
                )

        };

        const formularioValido = validarFormularioOrcamento(
            formulario,
            campos
        );

        if (!formularioValido) {

            mostrarAlertaFormulario(
                formulario,
                "Confira os campos destacados antes de continuar.",
                "error"
            );

            return;

        }

        const mensagem = montarMensagemOrcamento(campos);

        const linkWhatsApp =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        mostrarAlertaFormulario(
            formulario,
            "Tudo certo! Estamos abrindo o WhatsApp com seus dados.",
            "success"
        );

        /*
         * Pequeno intervalo para o cliente visualizar
         * a confirmação antes de abrir o WhatsApp.
         */

        window.setTimeout(() => {

            window.open(
                linkWhatsApp,
                "_blank",
                "noopener,noreferrer"
            );

        }, 500);

    });

}


/* ==========================================================
   VALIDAÇÃO DO FORMULÁRIO
========================================================== */

function validarFormularioOrcamento(formulario, campos) {

    let valido = true;

    if (campos.nome.length < 3) {

        definirErroCampo(
            formulario,
            "nome",
            "Informe seu nome completo."
        );

        valido = false;

    }

    const telefoneNumerico =
        campos.telefone.replace(/\D/g, "");

    if (telefoneNumerico.length < 10) {

        definirErroCampo(
            formulario,
            "telefone",
            "Informe um telefone válido com DDD."
        );

        valido = false;

    }

    const valorConta = converterMoedaParaNumero(
        campos.conta
    );

    if (!Number.isFinite(valorConta) || valorConta <= 0) {

        definirErroCampo(
            formulario,
            "conta",
            "Informe o valor médio da sua conta de energia."
        );

        valido = false;

    }

    if (!campos.padrao) {

        definirErroCampo(
            formulario,
            "padrao",
            "Selecione seu padrão de energia."
        );

        valido = false;

    }

    if (!campos.telhado) {

        definirErroCampo(
            formulario,
            "telhado",
            "Selecione o tipo de telhado."
        );

        valido = false;

    }

    if (!campos.aumentoConsumo) {

        definirErroCampo(
            formulario,
            "aumentoConsumo",
            "Informe se pretende aumentar o consumo."
        );

        valido = false;

    }

    return valido;

}


function definirErroCampo(
    formulario,
    nomeCampo,
    mensagem
) {

    const campo = formulario.elements[nomeCampo];

    if (!campo) {
        return;
    }

    /*
     * RadioNodeList não possui classList.
     * Nesse caso, procura os inputs pelo atributo name.
     */

    if (campo instanceof RadioNodeList) {

        const primeiroRadio = formulario.querySelector(
            `[name="${nomeCampo}"]`
        );

        if (!primeiroRadio) {
            return;
        }

        const grupo =
            primeiroRadio.closest(".form-group") ||
            primeiroRadio.parentElement;

        adicionarMensagemErro(grupo, mensagem);

        return;

    }

    campo.classList.add("error");
    campo.setAttribute("aria-invalid", "true");

    const grupo =
        campo.closest(".form-group") ||
        campo.parentElement;

    adicionarMensagemErro(grupo, mensagem);

}


function adicionarMensagemErro(grupo, mensagem) {

    if (!grupo) {
        return;
    }

    const erroExistente =
        grupo.querySelector(".input-error");

    if (erroExistente) {

        erroExistente.textContent = mensagem;
        return;

    }

    const elementoErro =
        document.createElement("small");

    elementoErro.className = "input-error";
    elementoErro.textContent = mensagem;

    grupo.appendChild(elementoErro);

}


function limparErrosDoFormulario(formulario) {

    formulario
        .querySelectorAll(".form-control.error")
        .forEach((campo) => {

            campo.classList.remove("error");
            campo.removeAttribute("aria-invalid");

        });

    formulario
        .querySelectorAll(".input-error")
        .forEach((erro) => {

            erro.remove();

        });

    const alerta =
        formulario.querySelector(".form-alert");

    if (alerta) {

        alerta.style.display = "none";
        alerta.classList.remove("success", "error");

    }

}


/* ==========================================================
   ALERTAS DO FORMULÁRIO
========================================================== */

function mostrarAlertaFormulario(
    formulario,
    mensagem,
    tipo
) {

    let alerta =
        formulario.querySelector(".form-alert");

    if (!alerta) {

        alerta = document.createElement("div");

        alerta.className = "form-alert";
        alerta.setAttribute("role", "alert");

        formulario.prepend(alerta);

    }

    alerta.textContent = mensagem;

    alerta.classList.remove("success", "error");
    alerta.classList.add(tipo);

    alerta.style.display = "block";

    alerta.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* ==========================================================
   MONTAGEM DA MENSAGEM DO WHATSAPP
========================================================== */

function montarMensagemOrcamento(campos) {

    const observacoes =
        campos.observacoes ||
        "Não informou observações adicionais.";

    return [
        "Olá, equipe da B2 Energia Solar! ☀️",
        "",
        "Gostaria de solicitar um orçamento de energia solar.",
        "",
        `Nome completo: ${campos.nome}`,
        `Telefone: ${campos.telefone}`,
        `Valor médio da conta: ${formatarValorConta(campos.conta)}`,
        `Padrão de energia: ${campos.padrao}`,
        `Tipo de telhado: ${campos.telhado}`,
        `Pretende aumentar o consumo: ${campos.aumentoConsumo}`,
        `Observações: ${observacoes}`,
        "",
        "Aguardo o contato da equipe da B2."
    ].join("\n");

}


/* ==========================================================
   FUNÇÕES AUXILIARES
========================================================== */

function obterValorFormulario(dados, campo) {

    const valor = dados.get(campo);

    if (typeof valor !== "string") {
        return "";
    }

    return valor.trim();

}


function converterMoedaParaNumero(valor) {

    if (!valor) {
        return NaN;
    }

    const somenteNumeros =
        valor.replace(/[^\d,.-]/g, "");

    /*
     * Para valores brasileiros:
     * 1.250,50 vira 1250.50.
     */

    const normalizado = somenteNumeros
        .replace(/\./g, "")
        .replace(",", ".");

    return Number(normalizado);

}


function formatarValorConta(valor) {

    const numero = converterMoedaParaNumero(valor);

    if (!Number.isFinite(numero)) {
        return valor;
    }

    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}