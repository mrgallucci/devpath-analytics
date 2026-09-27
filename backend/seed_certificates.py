from database import SessionLocal
import models
db = SessionLocal()
certificados = [
    {
        "titulo": "Bem-vindo à DIO",
        "instituicao": "DIO",
        "categoria": "Fundamentos",
        "data_conclusao": "2021-04-19",
        "url": None,
    },
    {
        "titulo": "Lógica de Programação Essencial",
        "instituicao": "DIO",
        "categoria": "Fundamentos",
        "data_conclusao": "2021-04-22",
        "url": None,
    },
    {
        "titulo": "Introdução ao Git e ao GitHub",
        "instituicao": "DIO",
        "categoria": "Engenharia",
        "data_conclusao": "2021-04-23",
        "url": None,
    },
    {
        "titulo": "Introdução a Criação de Websites com HTML5 e CSS3",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-04-23",
        "url": None,
    },
    {
        "titulo": "Recriando a Página Inicial do Instagram",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-04-25",
        "url": None,
    },
    {
        "titulo": "Programação para internet com JavaScript",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-04-25",
        "url": None,
    },
    {
        "titulo": "Recriando a Interface do Netflix",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-04-27",
        "url": None,
    },
    {
        "titulo": "Construindo páginas para internet com Bootstrap",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-04-28",
        "url": None,
    },
    {
        "titulo": "HTML Web Developer",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-04-28",
        "url": None,
    },
    {
        "titulo": "Recriando o Jogo da Cobrinha com JavaScript",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-04-28",
        "url": None,
    },
        {
        "titulo": "Lógica de Programação Essencial",
        "instituicao": "DIO",
        "categoria": "Fundamentos",
        "data_conclusao": "2021-04-29",
        "url": None,
    },
    {
        "titulo": "Conheça o Banco Carrefour",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2021-04-29",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp Take Blip Fullstack Developer",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2021-04-29",
        "url": None,
    },
    {
        "titulo": "Conceitos e Melhores Práticas com Bancos de Dados PostgreSQL",
        "instituicao": "DIO",
        "categoria": "Dados",
        "data_conclusao": "2021-05-11",
        "url": None,
    },
    {
        "titulo": "SQL SERVER - Criando suas primeiras consultas",
        "instituicao": "DIO",
        "categoria": "Dados",
        "data_conclusao": "2021-05-17",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp Santander Fullstack Developer",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2021-06-24",
        "url": None,
    },
    {
        "titulo": "Conceitos e Melhores Práticas com Bancos de Dados PostgreSQL",
        "instituicao": "DIO",
        "categoria": "Dados",
        "data_conclusao": "2021-06-30",
        "url": None,
    },
    {
        "titulo": "Conceitos de responsividade e experiência do usuário",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-07-07",
        "url": None,
    },
    {
        "titulo": "Primeiros passos para desenvolvimento web",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-07-23",
        "url": None,
    },
    {
        "titulo": "Aprenda o que são Estrutura de Dados e Algoritmos",
        "instituicao": "DIO",
        "categoria": "Fundamentos",
        "data_conclusao": "2021-07-28",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp Decola Tech",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2021-08-23",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp Take Blip Fullstack Developer #2",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2021-09-13",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp Impulso React Web Developer",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2021-09-29",
        "url": None,
    },
    {
        "titulo": "Instalação e Configuração do Visual Studio Code",
        "instituicao": "DIO",
        "categoria": "Ferramentas",
        "data_conclusao": "2021-09-29",
        "url": None,
    },
    {
        "titulo": "Recriando o Famoso Jogo do Dinossauro sem Internet",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-10-04",
        "url": None,
    },
    {
        "titulo": "Criando seu Primeiro Repositório no GitHub Para Compartilhar Seu Progresso",
        "instituicao": "DIO",
        "categoria": "Engenharia",
        "data_conclusao": "2021-10-06",
        "url": None,
    },
    {
        "titulo": "Resolvendo Desafios de Código em Javascript",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-10-11",
        "url": None,
    },
    {
        "titulo": "Sintaxe e Operadores JavaScript",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-10-12",
        "url": None,
    },
    {
        "titulo": "Sintaxe Básica em JavaScript",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-10-29",
        "url": None,
    },
    {
        "titulo": "Variáveis e Tipos com JavaScript",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2021-10-29",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp LocalizaLabs .NET Developer #2",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2021-12-27",
        "url": None,
    },
        {
        "titulo": "Boas-vindas ao Bootcamp Take Blip Web Developer",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2022-01-12",
        "url": None,
    },
    {
        "titulo": "Criando um Sistema de Reconhecimento de Voz para Aprender Cores em Inglês",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2022-02-06",
        "url": None,
    },
    {
        "titulo": "Introdução ao JavaScript",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2022-02-16",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp Órbi Web Games Developer",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2022-03-21",
        "url": None,
    },
    {
        "titulo": "Conceitos de responsividade e experiência do usuário",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2022-03-31",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Bootcamp - Impulso Fullstack Web Developer",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2022-04-25",
        "url": None,
    },
    {
        "titulo": "Pensamento Computacional",
        "instituicao": "DIO",
        "categoria": "Fundamentos",
        "data_conclusao": "2022-04-25",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao GFT Start #5 .NET",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2022-05-11",
        "url": None,
    },
    {
        "titulo": "Boas-vindas ao Decola Tech 3a edição",
        "instituicao": "DIO",
        "categoria": "Bootcamp",
        "data_conclusao": "2022-05-11",
        "url": None,
    },
    {
        "titulo": "Introdução ao Desenvolvimento Front-end com a Ri Happy",
        "instituicao": "DIO",
        "categoria": "Frontend",
        "data_conclusao": "2025-08-15",
        "url": None,
    },
]
adicionados = 0
ignorados = 0

try:
    for dados in certificados:
        existente = (
            db.query(models.Certificate)
            .filter(
                models.Certificate.titulo == dados["titulo"],
                models.Certificate.data_conclusao == dados["data_conclusao"],
            )
            .first()
        )

        if existente:
            print(
                f'IGNORADO: {dados["titulo"]} '
                f'({dados["data_conclusao"]})'
            )
            ignorados += 1
            continue

        certificado = models.Certificate(**dados)

        db.add(certificado)
        adicionados += 1

    db.commit()

    print()
    print("Carga concluída!")
    print(f"Adicionados: {adicionados}")
    print(f"Ignorados: {ignorados}")

finally:
    db.close()