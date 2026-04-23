--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: lstmenu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lstmenu (
    idrole integer NOT NULL,
    idmenu integer NOT NULL
);


ALTER TABLE public.lstmenu OWNER TO postgres;

--
-- Name: menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu (
    idmenu integer NOT NULL,
    titre character varying,
    description character varying,
    mem_routerlink character varying,
    mem_href character varying,
    mem_icon character varying,
    mem_target character varying,
    hassubmenu boolean,
    parentid integer
);


ALTER TABLE public.menu OWNER TO postgres;

--
-- Name: menu_idmenu_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_idmenu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_idmenu_seq OWNER TO postgres;

--
-- Name: menu_idmenu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_idmenu_seq OWNED BY public.menu.idmenu;


--
-- Name: profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile (
    idprofil integer NOT NULL,
    nom character varying,
    description character varying
);


ALTER TABLE public.profile OWNER TO postgres;

--
-- Name: profile_idprofil_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profile_idprofil_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profile_idprofil_seq OWNER TO postgres;

--
-- Name: profile_idprofil_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profile_idprofil_seq OWNED BY public.profile.idprofil;


--
-- Name: refreshtoken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refreshtoken (
    id integer NOT NULL,
    token character varying,
    expiresatutc timestamp without time zone,
    revoked boolean,
    iduser integer
);


ALTER TABLE public.refreshtoken OWNER TO postgres;

--
-- Name: refreshtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refreshtoken_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refreshtoken_id_seq OWNER TO postgres;

--
-- Name: refreshtoken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refreshtoken_id_seq OWNED BY public.refreshtoken.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    idrole integer NOT NULL,
    nom character varying,
    description character varying,
    idprofile integer,
    idroleparent integer
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_idrole_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_idrole_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_idrole_seq OWNER TO postgres;

--
-- Name: roles_idrole_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_idrole_seq OWNED BY public.roles.idrole;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    iduser integer NOT NULL,
    nom character varying,
    username character varying,
    motpass character varying,
    email character varying,
    telephone character varying,
    idrole integer
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_iduser_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_iduser_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilisateur_iduser_seq OWNER TO postgres;

--
-- Name: utilisateur_iduser_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_iduser_seq OWNED BY public.utilisateur.iduser;


--
-- Name: menu idmenu; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu ALTER COLUMN idmenu SET DEFAULT nextval('public.menu_idmenu_seq'::regclass);


--
-- Name: profile idprofil; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile ALTER COLUMN idprofil SET DEFAULT nextval('public.profile_idprofil_seq'::regclass);


--
-- Name: refreshtoken id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken ALTER COLUMN id SET DEFAULT nextval('public.refreshtoken_id_seq'::regclass);


--
-- Name: roles idrole; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN idrole SET DEFAULT nextval('public.roles_idrole_seq'::regclass);


--
-- Name: utilisateur iduser; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN iduser SET DEFAULT nextval('public.utilisateur_iduser_seq'::regclass);


--
-- Data for Name: lstmenu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lstmenu (idrole, idmenu) FROM stdin;
\.


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu (idmenu, titre, description, mem_routerlink, mem_href, mem_icon, mem_target, hassubmenu, parentid) FROM stdin;
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profile (idprofil, nom, description) FROM stdin;
1	Admin	Profile Administrateur
\.


--
-- Data for Name: refreshtoken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refreshtoken (id, token, expiresatutc, revoked, iduser) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (idrole, nom, description, idprofile, idroleparent) FROM stdin;
1	Administrateur	Administarteur	1	1
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (iduser, nom, username, motpass, email, telephone, idrole) FROM stdin;
2	Tounsie Aziz	oper	$2a$11$1QYq4q7bnFHMTs8i7b0dzOKwwBn07654Ln8tJQ/rg.5dOIayWX0gS	oper@ttt.tn	122222222	1
1	Foulen Ben Foulen	foulen	$2a$11$1QYq4q7bnFHMTs8i7b0dzOKwwBn07654Ln8tJQ/rg.5dOIayWX0gS	foulen@ttt.tn	122222222	1
\.


--
-- Name: menu_idmenu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_idmenu_seq', 1, false);


--
-- Name: profile_idprofil_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profile_idprofil_seq', 1, false);


--
-- Name: refreshtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refreshtoken_id_seq', 1, false);


--
-- Name: roles_idrole_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_idrole_seq', 1, false);


--
-- Name: utilisateur_iduser_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_iduser_seq', 2, true);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (idmenu);


--
-- Name: lstmenu pk_lst; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lstmenu
    ADD CONSTRAINT pk_lst PRIMARY KEY (idrole, idmenu);


--
-- Name: profile pk_profile; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT pk_profile PRIMARY KEY (idprofil);


--
-- Name: refreshtoken refreshtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (idrole);


--
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (iduser);


--
-- Name: utilisateur utilisateur_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_username_key UNIQUE (username);


--
-- Name: lstmenu lstmenu_idmenu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lstmenu
    ADD CONSTRAINT lstmenu_idmenu_fkey FOREIGN KEY (idmenu) REFERENCES public.menu(idmenu) ON DELETE CASCADE;


--
-- Name: lstmenu lstmenu_idrole_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lstmenu
    ADD CONSTRAINT lstmenu_idrole_fkey FOREIGN KEY (idrole) REFERENCES public.roles(idrole) ON DELETE CASCADE;


--
-- Name: menu menu_parentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_parentid_fkey FOREIGN KEY (parentid) REFERENCES public.menu(idmenu) ON DELETE CASCADE;


--
-- Name: refreshtoken refreshtoken_iduser_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtoken
    ADD CONSTRAINT refreshtoken_iduser_fkey FOREIGN KEY (iduser) REFERENCES public.utilisateur(iduser);


--
-- Name: roles roles_idprofile_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_idprofile_fkey FOREIGN KEY (idprofile) REFERENCES public.profile(idprofil) ON DELETE CASCADE;


--
-- Name: roles roles_idroleparent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_idroleparent_fkey FOREIGN KEY (idroleparent) REFERENCES public.roles(idrole) ON DELETE CASCADE;


--
-- Name: utilisateur utilisateur_idrole_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_idrole_fkey FOREIGN KEY (idrole) REFERENCES public.roles(idrole) ON DELETE CASCADE;


--
-- Stock microservice schema
--

CREATE TABLE IF NOT EXISTS public.categorie (
    idcategorie integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nom character varying NOT NULL UNIQUE,
    description character varying
);

CREATE TABLE IF NOT EXISTS public.fournisseur (
    idfournisseur integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nom character varying NOT NULL,
    email character varying,
    telephone character varying
);

CREATE TABLE IF NOT EXISTS public.article (
    idarticle integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nom character varying NOT NULL,
    description character varying,
    prix numeric(18,2) NOT NULL DEFAULT 0,
    quantitestock integer NOT NULL DEFAULT 0,
    seuilminimum integer NOT NULL DEFAULT 0,
    idcategorie integer,
    CONSTRAINT article_idcategorie_fkey FOREIGN KEY (idcategorie)
        REFERENCES public.categorie(idcategorie) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.article_fournisseur (
    idarticle integer NOT NULL,
    idfournisseur integer NOT NULL,
    PRIMARY KEY (idarticle, idfournisseur),
    CONSTRAINT article_fournisseur_idarticle_fkey FOREIGN KEY (idarticle)
        REFERENCES public.article(idarticle) ON DELETE CASCADE,
    CONSTRAINT article_fournisseur_idfournisseur_fkey FOREIGN KEY (idfournisseur)
        REFERENCES public.fournisseur(idfournisseur) ON DELETE CASCADE
);

INSERT INTO public.categorie (nom, description)
SELECT 'Générale', 'Catégorie par défaut'
WHERE NOT EXISTS (SELECT 1 FROM public.categorie WHERE nom = 'Générale');

CREATE TABLE IF NOT EXISTS public.client (
    idclient integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nom character varying NOT NULL,
    email character varying UNIQUE,
    telephone character varying,
    adresse character varying
);

CREATE TABLE IF NOT EXISTS public.commande (
    idcommande integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    datecommande timestamp without time zone NOT NULL DEFAULT now(),
    idclient integer NOT NULL,
    totalcommande numeric(18,2) NOT NULL DEFAULT 0,
    statut character varying NOT NULL DEFAULT 'Brouillon',
    CONSTRAINT commande_idclient_fkey FOREIGN KEY (idclient)
        REFERENCES public.client(idclient) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.ligne_commande (
    idlignecommande integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    idcommande integer NOT NULL,
    idarticle integer NOT NULL,
    quantite integer NOT NULL,
    prixunitaire numeric(18,2) NOT NULL,
    montantligne numeric(18,2) NOT NULL,
    CONSTRAINT ligne_commande_idcommande_fkey FOREIGN KEY (idcommande)
        REFERENCES public.commande(idcommande) ON DELETE CASCADE,
    CONSTRAINT ligne_commande_idarticle_fkey FOREIGN KEY (idarticle)
        REFERENCES public.article(idarticle) ON DELETE CASCADE,
    CONSTRAINT ligne_commande_idcommande_idarticle_key UNIQUE (idcommande, idarticle)
);

CREATE TABLE IF NOT EXISTS public.facture (
    idfacture integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    idcommande integer NOT NULL UNIQUE,
    datefacture timestamp without time zone NOT NULL DEFAULT now(),
    montantttc numeric(18,2) NOT NULL,
    statut character varying NOT NULL DEFAULT 'Générée',
    CONSTRAINT facture_idcommande_fkey FOREIGN KEY (idcommande)
        REFERENCES public.commande(idcommande) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.paiement (
    idpaiement integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    idfacture integer NOT NULL,
    datepaiement timestamp without time zone NOT NULL DEFAULT now(),
    montant numeric(18,2) NOT NULL,
    modepaiement character varying,
    reference character varying,
    CONSTRAINT paiement_idfacture_fkey FOREIGN KEY (idfacture)
        REFERENCES public.facture(idfacture) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.livraison (
    idlivraison integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    idcommande integer NOT NULL UNIQUE,
    datelivraison timestamp without time zone NOT NULL DEFAULT now(),
    adresse character varying,
    statut character varying NOT NULL DEFAULT 'Préparée',
    CONSTRAINT livraison_idcommande_fkey FOREIGN KEY (idcommande)
        REFERENCES public.commande(idcommande) ON DELETE CASCADE
);


--
-- PostgreSQL database dump complete
--

