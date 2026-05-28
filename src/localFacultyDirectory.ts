import type { FacultyDirectoryEntry } from "./types";

const udemAliases = [
  "Université de Montréal",
  "University of Montreal",
  "University of Montréal",
  "UdeM",
  "Montreal University"
];

const diroSourceUrl = "https://diro.umontreal.ca/repertoire-departement/professeurs/";
const diroBase = {
  institutionName: "Université de Montréal",
  institutionAliases: udemAliases,
  facultyName: "Faculté des arts et des sciences",
  departmentName: "Département d'informatique et de recherche opérationnelle",
  sourceUrl: diroSourceUrl
};

export const localFacultyDirectory: FacultyDirectoryEntry[] = [
  {
    ...diroBase,
    id: "aishwarya-agrawal",
    fullName: "Aishwarya Agrawal",
    role: "Professeure adjointe",
    email: "aishwarya.agrawal@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in32415/sg/Aishwarya%20Agrawal/",
    expertise: ["Intelligence artificielle", "Apprentissage profond"]
  },
  {
    ...diroBase,
    id: "noam-aigerman",
    fullName: "Noam Aigerman",
    role: "Professeur agrégé",
    email: "noam.aigerman@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in36606/sg/Noam%20Aigerman/",
    expertise: ["Apprentissage profond", "Vision par ordinateur"]
  },
  {
    ...diroBase,
    id: "esma-aimeur",
    fullName: "Esma Aïmeur",
    role: "Professeure titulaire",
    email: "esma.aimeur@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14256/sg/Esma%20A%C3%AFmeur/",
    expertise: ["Intelligence artificielle", "Sécurité informatique"]
  },
  {
    ...diroBase,
    id: "ian-arawjo",
    fullName: "Ian Arawjo",
    role: "Professeur adjoint",
    email: "ian.arawjo@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in36890/sg/Ian%20Arawjo/",
    expertise: ["Interaction humain-ordinateur", "Interaction humain-IA"]
  },
  {
    ...diroBase,
    id: "pierre-luc-bacon",
    fullName: "Pierre-Luc Bacon",
    role: "Professeur agrégé",
    email: "pierre-luc.bacon@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in31636/sg/Pierre-Luc%20Bacon/",
    expertise: ["Processus d'apprentissage", "Alignement de séquences"]
  },
  {
    ...diroBase,
    id: "fabian-bastin",
    fullName: "Fabian Bastin",
    role: "Professeur titulaire",
    email: "fabian.bastin@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in19037/sg/Fabian%20Bastin/",
    expertise: ["Estimation", "Optimisation mathématique"]
  },
  {
    ...diroBase,
    id: "benoit-baudry",
    fullName: "Benoit Baudry",
    role: "Professeur titulaire",
    email: "benoit.baudry@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in36891/sg/Benoit%20Baudry/",
    expertise: ["Génie logiciel", "Test de systèmes informatiques"]
  },
  {
    ...diroBase,
    id: "yoshua-bengio",
    fullName: "Yoshua Bengio",
    role: "Professeur titulaire",
    email: "yoshua.bengio@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in13599/sg/Yoshua%20Bengio/",
    expertise: ["Apprentissage automatique", "Apprentissage de représentations"]
  },
  {
    ...diroBase,
    id: "glen-berseth",
    fullName: "Glen Berseth",
    role: "Professeur adjoint",
    email: "glen.berseth@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in33191/sg/Glen%20Berseth/",
    expertise: ["Apprentissage par renforcement", "Robotique"]
  },
  {
    ...diroBase,
    id: "mikhail-bessmeltsev",
    fullName: "Mikhail Bessmeltsev",
    role: "Professeur agrégé",
    email: "mikhail.bessmeltsev@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in30075/sg/Mikhail%20Bessmeltsev/",
    expertise: ["Reconstruction 3D à partir d'images", "Reconnaissance de formes"]
  },
  {
    ...diroBase,
    id: "michel-boyer",
    fullName: "Michel Boyer",
    role: "Professeur agrégé",
    email: "michel.boyer@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in18862/sg/Michel%20Boyer/",
    expertise: ["Calcul quantique", "Informatique théorique"]
  },
  {
    ...diroBase,
    id: "gilles-brassard",
    fullName: "Gilles Brassard",
    role: "Professeur titulaire",
    email: "gilles.brassard@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in13606/sg/Gilles%20Brassard/",
    expertise: ["Calcul quantique", "Cryptographie"]
  },
  {
    ...diroBase,
    id: "margarida-carvalho",
    fullName: "Margarida Carvalho",
    role: "Professeure agrégée",
    email: "margarida.da.silva.carvalho@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in30076/sg/Margarida%20Carvalho/",
    expertise: ["Algorithmique", "Théorie des jeux"]
  },
  {
    ...diroBase,
    id: "aaron-courville",
    fullName: "Aaron Courville",
    role: "Professeur titulaire",
    email: "aaron.courville@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in19017/sg/Aaron%20Courville/",
    expertise: ["Apprentissage automatique", "Apprentissage de représentations"]
  },
  {
    ...diroBase,
    id: "miklos-csuros",
    fullName: "Miklós Csűrös",
    role: "Professeur agrégé",
    email: "miklos.csuros@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14308/sg/Mikl%C3%B3s%20Cs%C5%B1r%C3%B6s/",
    expertise: ["Bio-informatique", "Génomique évolutive"]
  },
  {
    ...diroBase,
    id: "frederic-dupont-dupuis",
    fullName: "Frédéric Dupont-Dupuis",
    role: "Professeur agrégé",
    email: "frederic.dupont-dupuis@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in31130/sg/Fr%C3%A9d%C3%A9ric%20Dupont-Dupuis/",
    expertise: ["Informatique quantique"]
  },
  {
    ...diroBase,
    id: "nadia-el-mabrouk",
    fullName: "Nadia El-Mabrouk",
    role: "Professeure titulaire",
    email: "nadia.el-mabrouk@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14341/sg/Nadia%20El-Mabrouk/",
    expertise: ["Algorithmique", "Évolution (Biologie)"]
  },
  {
    ...diroBase,
    id: "michalis-famelis",
    fullName: "Michalis Famelis",
    role: "Professeur agrégé",
    email: "michalis.famelis@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in28320/sg/Michalis%20Famelis/",
    expertise: ["Analyse de logiciels", "Conception de logiciels"]
  },
  {
    ...diroBase,
    id: "marc-feeley",
    fullName: "Marc Feeley",
    role: "Professeur titulaire",
    email: "marc.feeley@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14344/sg/Marc%20Feeley/",
    expertise: ["Compilation", "Langages de programmation de haut niveau"]
  },
  {
    ...diroBase,
    id: "emma-frejinger",
    fullName: "Emma Frejinger",
    role: "Professeure titulaire",
    email: "emma.frejinger@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in15868/sg/Emma%20Frejinger/",
    expertise: ["Apprentissage statistique", "Économétrie"]
  },
  {
    ...diroBase,
    id: "gauthier-gidel",
    fullName: "Gauthier Gidel",
    role: "Professeur agrégé",
    email: "gauthier.gidel@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in32247/sg/Gauthier%20Gidel/",
    expertise: ["Apprentissage profond", "Optimisation réseau"]
  },
  {
    ...diroBase,
    id: "vincent-gripon",
    fullName: "Vincent Gripon",
    role: "Chercheur invité",
    email: "vincent.gripon@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in30356/sg/Vincent%20Gripon/",
    expertise: []
  },
  {
    ...diroBase,
    id: "abdelhakim-hafid",
    fullName: "Abdelhakim Hafid",
    role: "Professeur titulaire",
    email: "abdelhakim.hafid@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in15300/sg/Abdelhakim%20Hafid/",
    expertise: ["Chaine de blocs", "Internet des objets"]
  },
  {
    ...diroBase,
    id: "gena-hahn",
    fullName: "Gena Hahn",
    role: "Professeur titulaire",
    email: "gena.hahn@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14367/sg/Gena%20Hahn/",
    expertise: ["Algorithmes de graphes", "Algorithmes de routage"]
  },
  {
    ...diroBase,
    id: "sylvie-hamel",
    fullName: "Sylvie Hamel",
    role: "Directrice de département",
    email: "sylvie.hamel@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14705/sg/Sylvie%20Hamel/",
    expertise: ["Analyse combinatoire", "Combinatoire des mots"]
  },
  {
    ...diroBase,
    id: "alex-hernandez-garcia",
    fullName: "Alex Hernandez-Garcia",
    role: "Professeur adjoint",
    email: "alejandro.hernandez.garcia@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in36609/sg/Alex%20Hernandez-Garcia/",
    expertise: ["Apprentissage automatique", "Apprentissage profond"]
  },
  {
    ...diroBase,
    id: "daehyun-ji",
    fullName: "Daehyun Ji",
    role: "Chercheur invité",
    email: "daehyun.ji@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in30357/sg/Daehyun%20Ji/",
    expertise: []
  },
  {
    ...diroBase,
    id: "hler-kristjansson",
    fullName: "Hlér Kristjánsson",
    role: "Professeur adjoint",
    email: "hler.kristjansson@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in37991/sg/Hl%C3%A9r%20Kristj%C3%A1nsson/",
    expertise: ["Informatique quantique", "Calcul quantique"]
  },
  {
    ...diroBase,
    id: "david-krueger",
    fullName: "David Krueger",
    role: "Professeur adjoint",
    email: "david.krueger@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in38219/sg/David%20Krueger/",
    expertise: []
  },
  {
    ...diroBase,
    id: "simon-lacoste-julien",
    fullName: "Simon Lacoste-Julien",
    role: "Professeur titulaire",
    email: "simon.lacoste-julien@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in28264/sg/Simon%20Lacoste-Julien/",
    expertise: ["Apprentissage automatique", "Apprentissage de représentations"]
  },
  {
    ...diroBase,
    id: "philippe-langlais",
    fullName: "Philippe Langlais",
    role: "Professeur titulaire",
    email: "philippe.langlais@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14396/sg/Philippe%20Langlais/",
    expertise: ["Alignement de séquences", "Apprentissage statistique"]
  },
  {
    ...diroBase,
    id: "bang-liu",
    fullName: "Bang Liu",
    role: "Professeur agrégé",
    email: "bang.liu@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in32097/sg/Bang%20Liu/",
    expertise: ["Traitement automatique du langage naturel (TALN)", "Apprentissage profond"]
  },
  {
    ...diroBase,
    id: "francois-major",
    fullName: "François Major",
    role: "Professeur titulaire",
    email: "francois.major@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in13773/sg/Fran%C3%A7ois%20Major/",
    expertise: ["Bio-informatique", "Génomique"]
  },
  {
    ...diroBase,
    id: "damien-masson",
    fullName: "Damien Masson",
    role: "Professeur adjoint",
    email: "damien.masson@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in37834/sg/Damien%20Masson/",
    expertise: ["Interaction humain-ordinateur", "Interaction humain-IA"]
  },
  {
    ...diroBase,
    id: "max-mignotte",
    fullName: "Max Mignotte",
    role: "Professeur titulaire",
    email: "max.mignotte@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14436/sg/Max%20Mignotte/",
    expertise: ["Traitement d'images", "Télédétection"]
  },
  {
    ...diroBase,
    id: "ioannis-mitliagkas",
    fullName: "Ioannis Mitliagkas",
    role: "Professeur agrégé",
    email: "ioannis.mitliagkas@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in29391/sg/Ioannis%20Mitliagkas/",
    expertise: ["Apprentissage automatique", "Apprentissage de représentations"]
  },
  {
    ...diroBase,
    id: "stefan-monnier",
    fullName: "Stefan Monnier",
    role: "Professeur agrégé",
    email: "stefan.monnier@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14751/sg/Stefan%20Monnier/",
    expertise: ["Assistants de preuve", "Compilation"]
  },
  {
    ...diroBase,
    id: "jian-yun-nie",
    fullName: "Jian-Yun Nie",
    role: "Professeur titulaire",
    email: "jian-yun.nie@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14445/sg/Jian-Yun%20Nie/",
    expertise: ["Intelligence artificielle", "Forage de données textuelles"]
  },
  {
    ...diroBase,
    id: "liam-paull",
    fullName: "Liam Paull",
    role: "Professeur agrégé",
    email: "liam.paull@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in29390/sg/Liam%20Paull/",
    expertise: ["Vision par ordinateur", "Robotique"]
  },
  {
    ...diroBase,
    id: "jean-yves-potvin",
    fullName: "Jean-Yves Potvin",
    role: "Professeur titulaire",
    email: "jean-yves.potvin@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14464/sg/Jean-Yves%20Potvin/",
    expertise: ["Algorithmes génétiques", "Logistique"]
  },
  {
    ...diroBase,
    id: "guillaume-rabusseau",
    fullName: "Guillaume Rabusseau",
    role: "Professeur agrégé",
    email: "guillaume.rabusseau@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in30074/sg/Guillaume%20Rabusseau/",
    expertise: ["Apprentissage automatique", "Algorithmique"]
  },
  {
    ...diroBase,
    id: "irina-rish",
    fullName: "Irina Rish",
    role: "Professeure titulaire",
    email: "irina.rish@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in31339/sg/Irina%20Rish/",
    expertise: ["Apprentissage profond", "Science des données"]
  },
  {
    ...diroBase,
    id: "sebastien-roy",
    fullName: "Sébastien Roy",
    role: "Professeur agrégé",
    email: "sebastien.3d.roy@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in14484/sg/S%C3%A9bastien%20Roy/",
    expertise: ["Vision par ordinateur", "Stéréoscopie"]
  },
  {
    ...diroBase,
    id: "utsav-sadana",
    fullName: "Utsav Sadana",
    role: "Professeur adjoint",
    email: "utsav.sadana@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in35999/sg/Utsav%20Sadana/",
    expertise: ["Optimisation mathématique", "Apprentissage automatique"]
  },
  {
    ...diroBase,
    id: "houari-sahraoui",
    fullName: "Houari Sahraoui",
    role: "Professeur titulaire",
    email: "houari.sahraoui@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in15076/sg/Houari%20Sahraoui/",
    expertise: ["Génie logiciel", "Automatisation du génie logiciel"]
  },
  {
    ...diroBase,
    id: "louis-salvail",
    fullName: "Louis Salvail",
    role: "Professeur titulaire",
    email: "louis.salvail@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in15429/sg/Louis%20Salvail/",
    expertise: ["Calcul quantique", "Cryptographie"]
  },
  {
    ...diroBase,
    id: "dmitry-sokolov",
    fullName: "Dmitry Sokolov",
    role: "Professeur adjoint",
    email: "dmitry.sokolov@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in38851/sg/Dmitry%20Sokolov/",
    expertise: ["Théorie de la complexité (informatique théorique)", "Mathématiques discrètes"]
  },
  {
    ...diroBase,
    id: "dhanya-sridhar",
    fullName: "Dhanya Sridhar",
    role: "Professeure adjointe",
    email: "dhanya.sridhar@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in34361/sg/Dhanya%20Sridhar/",
    expertise: ["Science des données", "Intelligence artificielle"]
  },
  {
    ...diroBase,
    id: "eugene-syriani",
    fullName: "Eugene Syriani",
    role: "Professeur titulaire",
    email: "eugene.syriani@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in18930/sg/Eugene%20Syriani/",
    expertise: ["Génie logiciel", "Ingénierie dirigée par les modèles"]
  },
  {
    ...diroBase,
    id: "alain-tapp",
    fullName: "Alain Tapp",
    role: "Professeur titulaire",
    email: "alain.tapp@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in15599/sg/Alain%20Tapp/",
    expertise: ["Intelligence artificielle", "Informatique théorique"]
  },
  {
    ...diroBase,
    id: "kimberly-yu",
    fullName: "Kimberly Yu",
    role: "Professeure adjointe",
    email: "kimberly.yu@umontreal.ca",
    profileUrl: "https://diro.umontreal.ca/repertoire-departement/professeurs/professeur/in/in36888/sg/Kimberly%20Yu/",
    expertise: ["Programmation non linéaire", "Informatique théorique"]
  }
];
