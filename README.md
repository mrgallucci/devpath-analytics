# DevPath Analytics

### Career & Learning Analytics — by SARG Technology

O **DevPath Analytics** é uma aplicação full-stack para acompanhar evolução técnica, estudos, projetos, certificações e geração de renda com tecnologia.

O projeto nasceu da necessidade de transformar uma jornada de aprendizado em dados mensuráveis, reunindo em um único dashboard informações que normalmente ficam espalhadas entre plataformas de cursos, GitHub, anotações e registros pessoais.

Mais do que registrar cursos concluídos, o DevPath busca responder perguntas como:

- Quanto tempo estou realmente estudando?
- Quais competências estão recebendo mais atenção?
- Quais tecnologias aparecem nos meus projetos?
- Como meu portfólio está evoluindo?
- Quanto da minha renda já está sendo gerada com tecnologia?

---

## Dashboard

O dashboard consolida indicadores da evolução profissional:

- Skills acompanhadas
- Horas de estudo registradas
- Projetos desenvolvidos
- Certificados relevantes
- Renda gerada com tecnologia
- Meta de renda tech
- Sessões de estudo
- Média de duração das sessões
- Competências estudadas

Os indicadores são calculados a partir dos dados armazenados pela própria aplicação.

---

## Funcionalidades

### Skills

Gerenciamento das competências técnicas acompanhadas durante a jornada.

Entre as tecnologias atualmente monitoradas estão:

- Python
- HTML5
- CSS3
- JavaScript
- TypeScript
- React
- Next.js
- FastAPI
- SQL
- PostgreSQL
- Git
- GitHub
- APIs REST
- Análise de Dados
- Inteligência Artificial Aplicada
- Prompt Engineering

Os cards utilizam métricas objetivas, como tempo de estudo registrado e participação em projetos.

---

### Registro de estudos

Permite registrar sessões de estudo e desenvolvimento contendo:

- Competência estudada
- Data
- Horário inicial
- Horário final
- Assunto
- Origem
- Observações

A duração da sessão é calculada automaticamente a partir dos horários informados.

Também é possível editar o horário final de uma sessão existente.

---

### Analytics de aprendizagem

O DevPath transforma as sessões registradas em indicadores como:

- Tempo total registrado
- Número de sessões
- Média de duração por sessão
- Quantidade de competências estudadas
- Distribuição do tempo por competência

As métricas são calculadas pelo backend a partir dos registros persistidos no banco.

---

### Projetos e integração com GitHub

Projetos podem ser importados a partir de repositórios do GitHub.

O importador analisa informações do repositório e identifica tecnologias utilizadas a partir de arquivos e dependências do projeto.

Entre os dados armazenados estão:

- Nome
- Descrição
- Status
- Repositório
- Deploy
- Tecnologias detectadas

O Analytics também apresenta a frequência das tecnologias encontradas no portfólio.

> A frequência representa presença da tecnologia nos projetos cadastrados, e não uma estimativa de nível de domínio.

---

### Certificados

O módulo de certificados mantém apenas credenciais relacionadas a aprendizado, formação ou prática técnica.

Registros puramente administrativos, como certificados de boas-vindas e onboarding, não são considerados nas métricas principais.

É possível:

- Cadastrar novos certificados
- Informar instituição
- Definir categoria
- Registrar data de conclusão
- Adicionar link externo
- Fazer upload de PDF, JPG ou PNG
- Vincular arquivos ou links a certificados históricos
- Abrir o comprovante diretamente pelo dashboard

Os arquivos enviados não são versionados no Git.

---

### Renda Tech

O módulo de carreira permite acompanhar receitas geradas por atividades relacionadas à tecnologia.

Cada registro pode armazenar:

- Data
- Categoria
- Descrição
- Valor
- Observação

O dashboard calcula automaticamente:

- Renda tech acumulada
- Progresso em relação à meta definida
- Histórico das receitas

O objetivo é acompanhar quantitativamente a transição entre aprendizado, projetos e geração de renda.

---

## Arquitetura

```text
┌──────────────────────────────┐
│          Frontend            │
│   Next.js + React + TS       │
│       Tailwind CSS           │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│           Backend            │
│          FastAPI             │
│        SQLAlchemy            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Database            │
│           SQLite             │
└──────────────────────────────┘
```

O frontend consome a API REST fornecida pelo FastAPI.

O backend concentra regras de negócio, cálculos analíticos, persistência e integração com dados externos.

---

## Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Uvicorn

### Banco de dados

- SQLite

### Ferramentas

- Git
- GitHub
- VS Code
- Swagger / OpenAPI

---

## Principais endpoints

### Dashboard

```http
GET /api/dashboard/summary
```

### Skills

```http
GET  /api/skills
POST /api/skills
```

### Projetos

```http
GET    /api/projects
POST   /api/projects/import
DELETE /api/projects/{project_id}
```

### Certificados

```http
GET   /api/certificates
POST  /api/certificates
POST  /api/certificates/upload
PATCH /api/certificates/{certificate_id}/arquivo
PATCH /api/certificates/{certificate_id}/url
```

### Estudos

```http
GET   /api/study-sessions
POST  /api/study-sessions
PATCH /api/study-sessions/{session_id}
```

### Analytics

```http
GET /api/analytics/study-by-skill
GET /api/analytics/summary
GET /api/analytics/project-technologies
```

### Renda Tech

O backend disponibiliza endpoints para registro, consulta e exclusão das receitas cadastradas.

---

## Executando localmente

### 1. Clone o projeto

```bash
git clone <URL-DO-REPOSITORIO>
cd devpath-analytics
```

### 2. Backend

Entre na pasta:

```bash
cd backend
```

Crie o ambiente virtual:

```bash
python -m venv .venv
```

No Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
python -m pip install -r requirements.txt
```

Execute:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

API:

```text
http://127.0.0.1:8000
```

Documentação Swagger:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Aplicação:

```text
http://localhost:3000
```

---

## Persistência e privacidade

O banco SQLite utilizado localmente não é versionado no repositório.

Arquivos pessoais enviados para o módulo de certificados também permanecem fora do Git.

Exemplos:

```gitignore
backend/devpath.db
backend/uploads/
backend/.venv/
```

Isso permite manter a estrutura da aplicação pública sem publicar os dados pessoais utilizados no dashboard.

---

## Decisões de projeto

### Métricas objetivas

O DevPath evita transformar conhecimento técnico em percentuais arbitrários.

Em vez de apresentar algo como:

```text
Python: 80%
```

a aplicação utiliza dados verificáveis, como:

```text
Tempo estudado
Número de projetos
Sessões registradas
Tecnologias utilizadas
Certificados concluídos
```

### Certificados relevantes

Certificados de onboarding, boas-vindas ou simples apresentação de plataformas são excluídos das métricas.

O objetivo não é maximizar a quantidade exibida, mas representar atividades que efetivamente envolveram aprendizado.

### Analytics baseado em atividade real

As visualizações são derivadas dos registros existentes no banco, evitando indicadores fictícios de proficiência.

---

## Estrutura simplificada

```text
devpath-analytics/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── seed.py
│   ├── seed_certificates.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   └── page.tsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Status

O projeto encontra-se em fase de finalização do MVP.

Principais módulos já implementados:

- Dashboard
- Skills
- Study Sessions
- Analytics
- Projetos
- Importação do GitHub
- Certificados e comprovantes
- Renda Tech

Próximas etapas:

- Testes finais
- Preparação para produção
- Deploy
- Evolução da persistência para PostgreSQL conforme necessidade

---

## SARG Technology

**SARG — Signal · Attribution · Retention · Growth**

O DevPath Analytics faz parte dos projetos desenvolvidos sob a identidade SARG Technology, com foco na aplicação de desenvolvimento de software, dados e inteligência artificial a problemas reais.

---

## Autor

**Maxwell Gallucci Rodrigues**

Desenvolvimento Full Stack · Data Analytics · Applied AI

GitHub: `mrgallucci`