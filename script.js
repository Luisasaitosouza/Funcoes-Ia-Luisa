// Base de Conhecimento com Perguntas, Respostas e Links de Notícias/Fontes
const baseConhecimento = [
    {
        chaves: ["rapido", "veloz", "guepardo", "cheetah"],
        resposta: "O guepardo (ou chita) é o animal terrestre mais rápido do mundo, podendo atingir velocidades entre 100 km/h e 120 km/h em curtas distâncias.",
        linkNoticia: "https://globoenergia.globo.com/natureza/noticia/guepardo-velocidade-maxima-curiosidades.ghtml"
    },
    {
        chaves: ["maior", "gigante", "baleia", "mamifero"],
        resposta: "A baleia-azul é o maior animal e maior mamífero que já existiu na Terra, podendo chegar a até 30 metros de comprimento e pesar mais de 170 toneladas.",
        linkNoticia: "https://www.nationalgeographicbrasil.com/animais/baleia-azul-maior-animal-do-mundo"
    },
    {
        chaves: ["urso polar", "viver", "onde vive", "artico"],
        resposta: "Os ursos-polares vivem na região do Círculo Polar Ártico. Eles dependem do gelo marinho para caçar focas e sobreviver.",
        linkNoticia: "https://www.wwf.org.br/natureza_brasileira/especies/urso_polar/"
    },
    {
        chaves: ["gato", "gatos", "escuro", "noite", "visao"],
        resposta: "Os gatos enxergam muito melhor que os humanos no escuro porque possuem uma camada reflexiva atrás da retina chamada Tapetum Lucidum, além de mais fotorreceptores sensíveis à luz.",
        linkNoticia: "https://www.comportamentoanimal.com.br/gatos-enxergam-no-escuro"
    },
    {
        chaves: ["golfinho", "dorme", "dormir"],
        resposta: "Os golfinhos dormem com apenas metade do cérebro de cada vez (sono uni-hemisférico) para continuarem subindo à superfície e respirar.",
        linkNoticia: "https://super.abril.com.br/mundo-estranho/como-os-golfinhos-dormem-sem-se-afogar"
    }
];

// Seleção de Elementos DOM
const formPergunta = document.getElementById("form-pergunta");
const campoPergunta = document.getElementById("campo-pergunta");
const caixaResposta = document.getElementById("caixa-resposta");
const textoResposta = document.getElementById("texto-resposta");
const linkNoticia = document.getElementById("link-noticia");
const btnVoz = document.getElementById("btn-voz");
const chipsSugestao = document.querySelectorAll(".chip");

// Inicialização da API Web Speech (Síntese de Voz I.A)
const synth = window.speechSynthesis;
let vozSelecionada = null;

// Função para obter a melhor voz em Português disponível
function carregarVozes() {
    const vozes = synth.getVoices();
    vozSelecionada = vozes.find(v => v.lang.includes("pt-BR") || v.lang.includes("pt"));
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = carregarVozes;
}

// Processar a pergunta e gerar resposta
function buscarResposta(perguntaTexto) {
    const textoFormatado = perguntaTexto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Procura por correspondência nas chaves
    const resultado = baseConhecimento.find(item => 
        item.chaves.some(chave => textoFormatado.includes(chave))
    );

    if (resultado) {
        exibirResposta(resultado.resposta, resultado.linkNoticia);
    } else {
        // Resposta genérica quando a pergunta específica não estiver no banco
        const respostaPadrao = `Interessante pergunta sobre "${perguntaTexto}". A maioria das espécies animais possui adaptações fantásticas ao seu ecossistema. Consulte notícias e estudos recentes sobre o tema!`;
        const linkBusca = `https://news.google.com/search?q=${encodeURIComponent(perguntaTexto + " animais")}&hl=pt-BR`;
        exibirResposta(respostaPadrao, linkBusca);
    }
}

// Exibe os resultados no card de resposta
function exibirResposta(resposta, urlNoticia) {
    // Parar qualquer voz anterior
    synth.cancel();
    btnVoz.classList.remove("falando");
    btnVoz.innerHTML = `<i class="fa-solid fa-volume-high"></i> Ouvir Voz`;

    textoResposta.textContent = resposta;
    linkNoticia.href = urlNoticia;
    
    caixaResposta.classList.remove("oculto");
}

// Leitura de Voz I.A
function lerTextoEmVozAlta() {
    if (synth.speaking) {
        synth.cancel();
        btnVoz.classList.remove("falando");
        btnVoz.innerHTML = `<i class="fa-solid fa-volume-high"></i> Ouvir Voz`;
        return;
    }

    const mensagem = new SpeechSynthesisUtterance(textoResposta.textContent);
    
    if (vozSelecionada) {
        mensagem.voice = vozSelecionada;
    }
    
    mensagem.lang = "pt-BR";
    mensagem.rate = 1.0; // Velocidade normal da voz

    mensagem.onstart = () => {
        btnVoz.classList.add("falando");
        btnVoz.innerHTML = `<i class="fa-solid fa-square"></i> Parar Voz`;
    };

    mensagem.onend = () => {
        btnVoz.classList.remove("falando");
        btnVoz.innerHTML = `<i class="fa-solid fa-volume-high"></i> Ouvir Voz`;
    };

    synth.speak(mensagem);
}

// Event Listeners
formPergunta.addEventListener("submit", (e) => {
    e.preventDefault();
    if (campoPergunta.value.trim() !== "") {
        buscarResposta(campoPergunta.value);
    }
});

btnVoz.addEventListener("click", lerTextoEmVozAlta);

// Clique nas sugestões (Chips)
chipsSugestao.forEach(chip => {
    chip.addEventListener("click", () => {
        campoPergunta.value = chip.textContent;
        buscarResposta(chip.textContent);
    });
});