# AgendaFlow

**Demo:** https://pedrodereky.github.io/AgendaFlow/

AgendaFlow é um projeto desenvolvido com foco em aprendizado prático de desenvolvimento Full Stack. A proposta do sistema é simular uma plataforma de agendamento online, permitindo que clientes escolham serviços, profissionais e horários disponíveis de forma simples e organizada.

O projeto foi criado como parte dos estudos em desenvolvimento web, com o objetivo de praticar conceitos de interface, lógica de programação, organização de sistema e experiência do usuário.

## Objetivo do Projeto

O principal objetivo do AgendaFlow é demonstrar como funciona a estrutura de um sistema real de agendamentos, semelhante aos utilizados por clínicas, barbearias, salões e empresas de atendimento.

Além disso, o projeto serve como prática para:

* Estruturação de aplicações web;
* Manipulação de dados no navegador;
* Organização de componentes do sistema;
* Desenvolvimento de interfaces modernas;
* Simulação de regras de negócio reais.

---

# Tecnologias Utilizadas

## HTML5

Utilizado para estruturar toda a aplicação, criando páginas, formulários, botões e áreas do sistema.

## CSS3

Responsável pela estilização da interface, deixando o sistema moderno, responsivo e agradável visualmente.

## JavaScript

Utilizado para toda a lógica do sistema, incluindo:

* Criação de horários;
* Cadastro de agendamentos;
* Controle de conflitos de horários;
* Atualização de informações em tempo real;
* Manipulação de dados.

## LocalStorage

Ferramenta do navegador utilizada para salvar os dados localmente, permitindo que os agendamentos permaneçam armazenados mesmo após atualizar a página.

---

# Funcionalidades do Sistema

## Área do Cliente

* Escolha de serviços;
* Seleção de profissionais;
* Escolha de data e horário;
* Formulário de agendamento;
* Confirmação do horário marcado.

## Painel Administrativo

* Visualização dos agendamentos;
* Controle de status;
* Organização de atendimentos;
* Filtros de pesquisa.

## Regras Implementadas

* Impede horários duplicados para o mesmo profissional;
* Bloqueia horários de hoje que já passaram;
* Concluído e cancelado são status finais;
* Datas sempre no fuso local do navegador;
* Organiza horários disponíveis automaticamente;
* Atualiza os dados dinamicamente.

---

# Estrutura do Projeto

```text
.
├── index.html
├── src
│   ├── logic.js      # regras puras: datas, escape de HTML, horários ocupados e passados
│   ├── app.js        # interface: renderização, eventos e localStorage
│   └── styles.css
├── tests
│   └── logic.test.js # testes das regras (node:test)
└── README.md
```

---

# Como Executar o Projeto

1. Baixe os arquivos do projeto;
2. Abra o arquivo `index.html` no navegador;
3. O sistema funcionará localmente sem necessidade de instalação adicional.

## Testes

As regras de `src/logic.js` têm testes com o executor nativo do Node (18+), sem dependências:

```sh
node --test "tests/**/*.test.js"
```

O GitHub Actions roda os testes em todo push e pull request.

---

# Aprendizados com o Projeto

Durante o desenvolvimento deste projeto, foram praticados conceitos importantes como:

* Manipulação do DOM;
* Organização de código;
* Estruturação de projetos Front-End;
* Lógica de programação;
* Responsividade;
* Experiência do usuário;
* Simulação de regras de negócio.

---

# Próximas Melhorias

Algumas melhorias planejadas para futuras versões:

* Integração com banco de dados;
* Sistema de login;
* Backend com Node.js;
* API para gerenciamento dos dados;
* Sistema de notificações;
* Deploy online do sistema.

---

# Considerações Finais

O AgendaFlow foi desenvolvido como projeto de estudos para aprimorar conhecimentos em desenvolvimento web Full Stack, simulando um sistema utilizado no mercado real. O projeto busca unir organização, praticidade e experiência do usuário em uma aplicação simples e funcional.
