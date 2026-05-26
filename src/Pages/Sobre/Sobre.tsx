import { motion, type Variants } from "framer-motion";

import TeamPeopleCore from "../../Components/About/TeamPeopleCore";

import "../../Style/Css/Pages/Sobre.css";
import "../../Style/Css/Components/About/TeamPeopleCore.css";

const equipe = [
  {
    nome: "Victor Ferreira",
    cargo: "Desenvolvedor",
    foto: "/AboutUs/victor-ferreira.png",
  },
  {
    nome: "Bianca Nascimento",
    cargo: "Desenvolvedor",
    foto: "/AboutUs/bianca-nascimento.webp",
  },
  {
    nome: "Jhonatan Alves",
    cargo: "Desenvolvedor",
    foto: "/AboutUs/jhonatan-alves.png",
  },
  {
    nome: "Kauã Moraes",
    cargo: "Desenvolvedor",
    foto: "/AboutUs/kaua-moraes.png",
  },
  {
    nome: "Kefilwe Lourenço",
    cargo: "Desenvolvedor",
    foto: "/AboutUs/kefilwe-lourenco.png",
  },
  {
    nome: "Letícia Fonseca",
    cargo: "Desenvolvedor",
    foto: "/AboutUs/leticia-fonseca.png",
  },
  {
    nome: "Taís Bernardini",
    cargo: "Desenvolvedor",
    foto: "/AboutUs/tais-bernardini.png",
  },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};

const containerAnimation: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

function Sobre() {
  return (
    <main className="sobre">
      <section className="sobre__hero">
        <motion.div
          className="sobre__hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <span className="sobre__tag">SOBRE O PEOPLECORE</span>

          <h1>
            Tecnologia, organização e gestão de pessoas em uma única experiência.
          </h1>

          <p>
            O PeopleCore nasceu como uma solução para simplificar a rotina de RH,
            centralizando informações de funcionários, departamentos e dados
            essenciais em uma interface moderna, clara e acessível.
          </p>
        </motion.div>

        <motion.div
          className="sobre__hero-logo"
          initial={{
            opacity: 0,
            scale: 0.72,
            rotate: -12,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 0.85,
            ease: "easeOut",
          }}
        >
          <motion.img
            src="/logoa.png"
            alt="Logo PeopleCore"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 1.5, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </section>

      <section className="sobre__intro-grid">
        <motion.article
          className="sobre__info-card"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.35,
          }}
          variants={fadeUp}
        >
          <span>01</span>

          <h2>Propósito</h2>

          <p>
            Criar uma plataforma intuitiva para apoiar processos internos de
            gestão de pessoas, tornando dados e ações mais fáceis de acompanhar.
          </p>
        </motion.article>

        <motion.article
          className="sobre__info-card"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.35,
          }}
          variants={fadeUp}
        >
          <span>02</span>

          <h2>Experiência</h2>

          <p>
            Desenvolver uma navegação fluida, com layout profissional, feedbacks
            visuais e componentes pensados para uso real no dia a dia.
          </p>
        </motion.article>

        <motion.article
          className="sobre__info-card"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.35,
          }}
          variants={fadeUp}
        >
          <span>03</span>

          <h2>Desenvolvimento</h2>

          <p>
            O projeto foi construído com React, TypeScript, integração com API,
            autenticação, rotas protegidas e estrutura escalável de componentes.
          </p>
        </motion.article>
      </section>

      <section className="team-peoplecore">
        <motion.div
          className="team-peoplecore__header"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.35,
          }}
          variants={fadeUp}
        >
          <span className="team-peoplecore__tag">
            TIME DE DESENVOLVIMENTO
          </span>

          <h2>Pessoas por trás do projeto</h2>

          <p>
            Todos os 7 integrantes atuaram como desenvolvedores na construção do
            PeopleCore, contribuindo para transformar a proposta em uma aplicação
            funcional, visual e integrada.
          </p>
        </motion.div>

        <motion.div
          className="team-peoplecore__grid"
          variants={containerAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {equipe.map((membro) => (
            <TeamPeopleCore
              key={membro.nome}
              titulo={membro.nome}
              subtitulo={membro.cargo}
              imagem={membro.foto}
            />
          ))}
        </motion.div>
      </section>

      <motion.section
        className="sobre__project-note"
        initial={{
          opacity: 0,
          y: 26,
          scale: 0.97,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.35,
        }}
        transition={{
          duration: 0.65,
          ease: "easeOut",
        }}
      >
        <div>
          <span>Importante</span>

          <h2>Projeto demonstrativo</h2>
        </div>

        <p>
          Os dados exibidos na plataforma são fictícios e utilizados apenas para
          fins acadêmicos, apresentação e demonstração das funcionalidades do
          sistema.
        </p>
      </motion.section>
    </main>
  );
}

export default Sobre;