import type { FacultyDirectoryEntry } from "./types";

const udemAliases = [
  "Université de Montréal",
  "University of Montreal",
  "University of Montréal",
  "UdeM",
  "Montreal University"
];

const ucDavisAliases = [
  "University of California, Davis",
  "University of California Davis",
  "University of California-Davis",
  "UC Davis",
  "UCD"
];

const mcmasterAliases = [
  "McMaster University",
  "McMaster",
  "Mac",
  "McMaster Engineering"
];

const uclaAliases = [
  "University of California, Los Angeles",
  "University of California Los Angeles",
  "UCLA",
  "UC Los Angeles",
  "UCLA Samueli"
];

const uscAliases = [
  "University of Southern California",
  "USC",
  "Southern California",
  "USC Viterbi"
];

function makeLocalFacultyId(prefix: string, fullName: string) {
  return `${prefix}-${fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

const mcmasterFacultyDirectoryUrl = "https://www.eng.mcmaster.ca/faculty-staff/faculty-directory/";
const uclaComputerScienceRosterUrl = "https://catalog.registrar.ucla.edu/browse/Departments/ComputerScience/Faculty-Roster";
const uclaEceRosterUrl =
  "https://catalog.registrar.ucla.edu/browse/Departments/ElectricalandComputerEngineering/Faculty-Roster";
const uscComputerScienceDirectoryUrl = "https://www.cs.usc.edu/directory/faculty/";
const uscEceDirectoryUrl = "https://minghsiehece.usc.edu/faculty-directory/";

const mcmasterRawRows = [
  ["Dr. Alan Wassyng", "Graduate Advisor for Software Engineering", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-alan-wassyng/"],
  ["Dr. Allison Lahnala", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/allison-lahnala/"],
  ["Dr. Angela Zavaleta Bernuy", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/angela-zavaleta-bernuy/"],
  ["Dr. Antoine Deza", "Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-antoine-deza/"],
  ["Dr. Bill Smyth", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-bill-smyth/"],
  ["Dr. Charles Welch", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-charles-welch/"],
  ["Dr. Christian Brodbeck", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/christian-brodbeck/"],
  ["Dr. Christopher Anand", "Graduate Advisor for MEng in Computing and Software", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-christopher-anand/"],
  ["Dr. David Parnas", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/prof-david-parnas/"],
  ["Dr. Denise Geiskkovitch", "Barber-Gennum Endowed Chair in Information Technology", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-denise-geiskkovitch/"],
  ["Dr. Douglas Down", "Undergraduate Advisor for Mechatronics (January to June 2026)", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-douglas-down/"],
  ["Dr. Emil Sekerinski", "Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-emil-sekerinski/"],
  ["Dr. Fei Chiang", "Associate Chair for Research", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-fei-chiang/"],
  ["Dr. Frantisek (Franya) Franek", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-frantisek-franya-franek/"],
  ["Dr. George Karakostas", "Associate Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-george-karakostas/"],
  ["Dr. Hassan Ashtiani", "Associate Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-hassan-ashtiani/"],
  ["Dr. Irene Ye Yuan", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-irene-ye-yuan/"],
  ["Dr. Istvan David", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-istvan-david/"],
  ["Dr. Ivan Bruha", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/ivan-bruha/"],
  ["Dr. Jacques Carette", "Associate Chair for Graduate Studies", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-jacques-carette/"],
  ["Dr. Jake Doliskani", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/jake-doliskani/"],
  ["Dr. Jeffery Zucker", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-jeffery-zucker/"],
  ["Dr. Jelle Hellings", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-jelle-hellings/"],
  ["Dr. Lingyang Chu", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-lingyang-chu/"],
  ["Dr. Mark Lawford", "Graduate Advisor for M.Eng Program", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-mark-lawford/"],
  ["Dr. Martin v. Mohrenschildt", "Associate Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-martin-v-mohrenschildt/"],
  ["Dr. Matthew Giamou", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/matthew-giamou/"],
  ["Dr. Mehdi Moradi", "Associate Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-mehdi-moradi/"],
  ["Dr. Ned Nedialkov", "Undergraduate Advisor for Computer Science", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-ned-nedialkov/"],
  ["Dr. Neerja Mhaskar", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-neerja-mhaskar/"],
  ["Dr. Onaizah Onaizah", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-onaizah-onaizah/"],
  ["Dr. Patrick Ryan", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-patrick-ryan/"],
  ["Dr. Richard Paige", "Chair", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-richard-paige/"],
  ["Dr. Ridha Khedri", "Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-ridha-khedri/"],
  ["Dr. Rong Zheng", "Professor, PEng", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-rong-zheng/"],
  ["Dr. Ryan Leduc", "Associate Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-ryan-leduc/"],
  ["Dr. Ryszard Janicki", "Graduate Advisor for Computer Science", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-ryszard-janicki/"],
  ["Dr. Sam Scott", "Associate Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-sam-scott/"],
  ["Dr. Sanzheng Qiao", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/sanzheng-qiao/"],
  ["Dr. Shahab Asoodeh", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-shahab-asoodeh/"],
  ["Dr. Sivan Sabato", "Graduate Advisor for Computer Science", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-sivan-sabato/"],
  ["Dr. Spencer Smith", "Undergraduate Advisor for Software Engineering", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-spencer-smith/"],
  ["Dr. Stephen Kelly", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-stephen-kelly/"],
  ["Dr. Swati Mishra", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-swati-mishra/"],
  ["Dr. Sébastien Mosser", "Associate Chair for Undergraduate Studies - Internal", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-sebastien-mosser/"],
  ["Dr. Tom Maibaum", "Professor Emeritus", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-tom-maibaum/"],
  ["Dr. Vincent Maccio", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-vincent-maccio/"],
  ["Dr. Wenbo He", "Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-wenbo-he/"],
  ["Dr. William M. Farmer", "Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-william-m-farmer/"],
  ["Dr. Wolfram Kahl", "Associate Chair for Undergraduate Studies - External", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-wolfram-kahl/"],
  ["Dr. Yingying Wang", "Assistant Professor", "Computing and Software", "https://www.eng.mcmaster.ca/cas/faculty/dr-yingying-wang/"],
  ["Dr. Aleksandar Jeremic", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-aleksandar-jeremic/"],
  ["Dr. Ameer Abdelhadi", "Assistant Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-ameer-abdelhadi/"],
  ["Dr. Babak Nahid-Mobarakeh", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-babak-nahid-mobarakeh/"],
  ["Dr. Berker Bilgin", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-berker-bilgin/"],
  ["Dr. Chih-Hung (James) Chen", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-chih-hung-james-chen/"],
  ["Dr. Dongmei Zhao", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-dongmei-zhao/"],
  ["Dr. Hubert deBruin", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-hubert-debruin/"],
  ["Dr. Ian Bruce", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-ian-bruce/"],
  ["Dr. Jamal Deen", "Distinguished University Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-jamal-deen/"],
  ["Dr. James (Jim) Reilly", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-james-jim-reilly/"],
  ["Dr. Jennifer Bauman", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-jennifer-bauman/"],
  ["Dr. Jian Kang (JK) Zhang (dec.)", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-jian-kang-jk-zhang-dec/"],
  ["Dr. John Bandler, OC (dec.)", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-john-bandler-oc/"],
  ["Dr. Jun Chen", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-jun-chen/"],
  ["Dr. Kanwarpal Singh", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-kanwarpal-singh/"],
  ["Dr. Kazem Cheshmi", "Assistant Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-kazem-cheshmi/"],
  ["Dr. Kon (Max) Wong", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-kon-max-wong/"],
  ["Dr. Matiar Howlader", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-matiar-howlader/"],
  ["Dr. Mehdi Narimani", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-mehdi-narimani/"],
  ["Dr. Michael Noseworthy", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-michael-noseworthy/"],
  ["Dr. Mohamed Bakr", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-mohamed-bakr/"],
  ["Dr. Mohamed Elamien", "Assistant Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-mohamed-elamien/"],
  ["Dr. Mohamed Hassan", "Assistant Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-mohamed-hassan/"],
  ["Dr. Moshe Schwartz", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-moshe-schwartz/"],
  ["Dr. Natalia Nikolova", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-natalia-nikolova/"],
  ["Dr. Nicola Nicolici", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-nicola-nicolici/"],
  ["Dr. Peter M. Smith", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-peter-m-smith/"],
  ["Dr. Phil Kollmeyer", "Assistant Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-phil-kollmeyer/"],
  ["Dr. Ratnasingham (Thamas) Tharmarasa", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-ratnasingham-thamas-tharmarasa/"],
  ["Dr. Scott Chen", "Assistant Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-scott-chen/"],
  ["Dr. Shahin Sirouspour", "Associate Chair (Undergraduate Studies)", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-shahin-sirouspour/"],
  ["Dr. Shahram Shirani", "Department Chair", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-shahram-shirani/"],
  ["Dr. Shahrukh Athar", "Assistant Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-shahrukh-athar/"],
  ["Dr. Shiva Kumar", "Associate Chair (Graduate Studies)", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-shiva-kumar/"],
  ["Dr. Simon Haykin (dec.)", "Distinguished University Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-simon-haykin/"],
  ["Dr. Sorina Dumitrescu", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-sorina-dumitrescu/"],
  ["Dr. Steve Hranilovic", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-steve-hranilovic/"],
  ["Dr. Ted Szymanski", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-ted-szymanski/"],
  ["Dr. Telex Ngatched", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-telex-ngatched/"],
  ["Dr. Terry Todd", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-terry-todd/"],
  ["Dr. Thia (Kiruba) Kirubarajan", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-thia-kiruba-kirubarajan/"],
  ["Dr. Thomas E. Doyle", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-thomas-e-doyle/"],
  ["Dr. Tim Davidson", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-tim-davidson/"],
  ["Dr. Tim Field", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-tim-field/"],
  ["Dr. Xiaolin Wu", "Professor Emeritus", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-xiaolin-wu/"],
  ["Dr. Xun Li", "Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-xun-li/"],
  ["Dr. Yaser Haddara", "Associate Professor", "Electrical and Computer Engineering", "https://www.eng.mcmaster.ca/ece/faculty/dr-yaser-haddara/"]
] as const;

const mcmasterRows = mcmasterRawRows.map(([fullName, role, department, profileUrl]) => ({
  id: makeLocalFacultyId("mcmaster", fullName),
  fullName,
  facultyName: "Faculty of Engineering",
  departmentName: `Department of ${department}`,
  role,
  email: null,
  profileUrl,
  expertise:
    department === "Computing and Software"
      ? ["Computer science", "Software engineering", "Computing systems"]
      : ["Electrical and computer engineering", "Computer engineering", "Systems"],
  sourceUrl: mcmasterFacultyDirectoryUrl
}));

const uscComputerScienceRows = [
  ["Leonard M Adleman", "Henry Salvatori Chair in Computer Science and Distinguished Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Adleman&fname=Leonard"],
  ["Jose-Luis Ambite", "Research Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Ambite-Molina&fname=Jose-Luis"],
  ["Murali Annavaram", "Lloyd F. Hunt Chair of Electrical Power Engineering and Professor of Electrical and Computing Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Annavaram&fname=Murali"],
  ["Salman Avestimehr", "Dean's Professor of Electrical and Computer Engineering and Professor of Electrical and Computer Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Avestimehr&fname=Salman"],
  ["Corey E. Baker", "Assistant Professor of Electrical and Computer Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Baker&fname=Corey"],
  ["Jernej Barbic", "Andrew and Erna Viterbi Early Career Chair and Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Barbic&fname=Jernej"],
  ["Erdem Biyik", "Assistant Professor of Computer Science and Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Biyik&fname=Erdem"],
  ["Paul Bogdan", "Jack Munushian Early Career Chair and Associate Professor of Electrical and Computer Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Bogdan&fname=Paul"],
  ["Souti Rini Chattopadhyay", "WiSE Gabilan Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Chattopadhyay&fname=Souti"],
  ["Muhao Chen", "Research Adjunct Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Chen&fname=Muhao"],
  ["Ewa Deelman", "Research Professor of Computer Science and Principal Scientist at USC Information Sciences Institute", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Deelman&fname=Ewa"],
  ["Jyo Deshmukh", "Associate Professor of Computer Science and of Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Deshmukh&fname=Jyotirmoy"],
  ["Bistra Dilkina", "Dr. Allen and Charlotte Ginsburg Early Career Chair in Computer Science and Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Dilkina&fname=Bistra"],
  ["Shaddin Dughmi", "Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Dughmi&fname=Shaddin"],
  ["Emilio Ferrara", "Professor of Computer Science and Communication", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Ferrara&fname=Emilio"],
  ["Shahram Ghandeharizadeh", "Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Ghandeharizadeh&fname=Shahram"],
  ["Yolanda Gil", "Research Professor of Computer Science and Spatial Sciences and Principal Scientist at USC Information Sciences Institute", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Gil&fname=Yolanda"],
  ["Leana Golubchik", "Stephen and Etta Varra Professor, and Professor of Electrical and Computer Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Golubchik&fname=Leana"],
  ["Ramesh Govindan", "Northrop Grumman Chair in Electrical and Computer Engineering and Professor of Computer Science and Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Govindan&fname=Ramesh"],
  ["William G.J. Halfond", "Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Halfond&fname=William"],
  ["John S. Heidemann", "Research Professor of Computer Science and Principal Scientist at USC Information Sciences Institute", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Heidemann&fname=John"],
  ["Robin Jia", "Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Jia&fname=Robin"],
  ["Sai Praneeth Karimireddy", "Assistant Professor of Computer Science and Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Karimireddy&fname=Sai-Praneeth-Reddy"],
  ["David Kempe", "Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Kempe&fname=David"],
  ["Carl F Kesselman", "William H. Keck Professor of Engineering and Professor of Industrial and Systems Engineering, Computer Science, Population and Public Health Sciences, and Biomedical Sciences", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Kesselman&fname=Carl"],
  ["Craig A. Knoblock", "Research Professor of Computer Science and Spatial Sciences", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Knoblock&fname=Craig"],
  ["Sven Koenig", "Adjunct Research Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Koenig&fname=Sven"],
  ["Aleksandra Korolova", "Adjunct Research Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Korolova&fname=Aleksandra"],
  ["Bhaskar Krishnamachari", "Ming Hsieh Faculty Fellow in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Krishnamachari&fname=Bhaskar"],
  ["C.-C. Jay Kuo", "Distinguished Professor of Electrical Engineering and Computer Science, and holder of the Ming Hsieh Chair in Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Kuo&fname=Chung-Chieh"],
  ["Mengyuan Li", "Assistant Professor of Computer Science and Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Li&fname=Mengyuan"],
  ["Ruishan Liu", "WiSE Gabilan Assistant Professor of Computer Science and Quantitative and Computational Biology", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Liu&fname=Ruishan"],
  ["Yan Liu", "Professor of Computer Science, Electrical and Computer Engineering, and Biomedical Sciences, and Fletcher Jones Foundation Chair in Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Liu&fname=Yan"],
  ["Haipeng Luo", "IBM Early Career Chair and Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Luo&fname=Haipeng"],
  ["Harsha V. Madhyastha", "Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Madhyastha&fname=Harsha"],
  ["Maja Mataric", "Chan Soon-Shiong Chair and Distinguished Professor of Computer Science, Neuroscience, and Pediatrics", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Mataric&fname=Maja"],
  ["Nenad Medvidovic", "TRW Professorship in Engineering and Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Medvidovic&fname=Nenad"],
  ["Jelena Mirkovic", "Research Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Mirkovic&fname=Jelena"],
  ["Premkumar Natarajan", "Research Professor of Computer Science with Distinction", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Natarajan&fname=Premkumar"],
  ["Willie Neiswanger", "Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Neiswanger&fname=Willie"],
  ["Ram Nevatia", "Fletcher Jones Professor in Computer Science and Professor of Computer Science and Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Nevatia&fname=Ramakant"],
  ["Stefanos Nikolaidis", "Fluor Early Career Chair in Engineering and Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Nikolaidis&fname=Stefanos"],
  ["Viktor K. Prasanna", "Charles Lee Powell Chair in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Prasanna&fname=Viktor"],
  ["Jay Pujara", "Research Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Pujara&fname=Jay"],
  ["Feng Qian", "Associate Professor of Electrical and Computer Engineering and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Qian&fname=Feng"],
  ["Barath Raghavan", "Associate Professor of Computer Science and Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Raghavan&fname=Barath"],
  ["Mukund Raghothaman", "Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Raghothaman&fname=Mukund"],
  ["Sean (Xiang) Ren", "Andrew and Erna Viterbi Early Career Chair and Associate Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Ren&fname=Xiang"],
  ["Ibrahim Sabek", "Assistant Professor of Computer Science and Spatial Sciences", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Sabek&fname=Ibrahim"],
  ["Daniel Seita", "Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Seita&fname=Daniel"],
  ["Cyrus Shahabi", "Helen N. and Emmett H. Jones Professorship in Engineering and Professor of Computer Science, Electrical and Computer Engineering, and Spatial Sciences", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Shahabi&fname=Cyrus"],
  ["Maryam Shanechi", "Alexander A. Sawchuk Chair in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering, Biomedical Engineering, and Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Shanechi&fname=Maryam"],
  ["Mahdi Soltanolkotabi", "Andrew and Erna Viterbi Early Career Chair and Professor of Electrical and Computer Engineering, Computer Science, and Industrial and Systems Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Soltanolkotabi&fname=Mahdi"],
  ["Gaurav Sukhatme", "Donald M. Alstadt Chair in Advanced Computing and Professor of Computer Science and Electrical and Computer Engineering", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Sukhatme&fname=Gaurav"],
  ["Swabha Swayamdipta", "WiSE Gabilan Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Swayamdipta&fname=Swabha"],
  ["Jesse Thomason", "Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Thomason&fname=Jesse"],
  ["Yue Wang", "Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Wang&fname=Yue"],
  ["Jieyu Zhao", "WiSE Gabilan Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Zhao&fname=Jieyu"],
  ["Yue Zhao", "Assistant Professor of Computer Science", "https://www.cs.usc.edu/directory/faculty/profile/?lname=Zhao&fname=Yue"]
] as const;

const uscElectricalComputerEngineeringRows = [
  ["Murali Annavaram", "Lloyd F. Hunt Chair of Electrical Power Engineering and Professor of Electrical and Computing Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Annavaram&fname=Murali"],
  ["Salman Avestimehr", "Dean's Professor of Electrical and Computer Engineering and Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Avestimehr&fname=Salman"],
  ["Corey E. Baker", "Assistant Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Baker&fname=Corey"],
  ["Peter A. Beerel", "Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Beerel&fname=Peter"],
  ["Erdem Biyik", "Assistant Professor of Computer Science and Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Biyik&fname=Erdem"],
  ["Paul Bogdan", "Jack Munushian Early Career Chair and Associate Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Bogdan&fname=Paul"],
  ["Jyo Deshmukh", "Associate Professor of Computer Science and of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Deshmukh&fname=Jyotirmoy"],
  ["Leana Golubchik", "Stephen and Etta Varra Professor, and Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Golubchik&fname=Leana"],
  ["Ramesh Govindan", "Northrop Grumman Chair in Electrical and Computer Engineering and Professor of Computer Science and Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Govindan&fname=Ramesh"],
  ["Sandeep Gupta", "Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Gupta&fname=Sandeep"],
  ["Justin P. Haldar", "Professor of Electrical and Computer Engineering and Biomedical Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Haldar&fname=Justin"],
  ["Hossein Hashemi", "Ming Hsieh Faculty Fellow in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Hashemi&fname=Hossein"],
  ["Rahul Jain", "Professor of Electrical and Computer Engineering, Computer Science, and Industrial and Systems Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Jain&fname=Rahul"],
  ["Rehan Kapadia", "Colleen and Roberto Padovani Early Career Chair in Electrical and Computer Engineering, and Associate Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Kapadia&fname=Rehan"],
  ["Sai Praneeth Karimireddy", "Assistant Professor of Computer Science and Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Karimireddy&fname=Sai-Praneeth-Reddy"],
  ["Bhaskar Krishnamachari", "Ming Hsieh Faculty Fellow in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Krishnamachari&fname=Bhaskar"],
  ["C.-C. Jay Kuo", "Distinguished Professor of Electrical Engineering and Computer Science, and holder of the Ming Hsieh Chair in Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Kuo&fname=Chung-Chieh"],
  ["Mengyuan Li", "Assistant Professor of Computer Science and Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Li&fname=Mengyuan"],
  ["Daniel Lidar", "Viterbi Professorship in Engineering and Professor of Electrical and Computer Engineering, Chemistry, and Physics and Astronomy", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Lidar&fname=Daniel"],
  ["Sung-Kyu Lim", "Dean's Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Lim&fname=Sung-Kyu"],
  ["Yan Liu", "Professor of Computer Science, Electrical and Computer Engineering, and Biomedical Sciences, and Fletcher Jones Foundation Chair in Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Liu&fname=Yan"],
  ["Urbashi Mitra", "Gordon S. Marshall Chair in Engineering and Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Mitra&fname=Urbashi"],
  ["Mahta Moghaddam", "Ming Hsieh Chair in Electrical and Computer Engineering and Distinguished Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Moghaddam&fname=Mahta"],
  ["Andreas Molisch", "Solomon Golomb - Andrew and Erna Viterbi Chair, and Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Molisch&fname=Andreas"],
  ["Shri Narayanan", "Niki and Max Nikias Chair in Engineering and University Professor of Electrical and Computer Engineering, Computer Science, Linguistics, Psychology, Pediatrics, and Otolaryngology", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Narayanan&fname=Shrikanth"],
  ["Ashutosh Nayyar", "Associate Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Nayyar&fname=Ashutosh"],
  ["Michael James Neely", "Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Neely&fname=Michael"],
  ["Antonio Ortega", "Dean's Professor of Electrical and Computer Engineering and Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Ortega&fname=Antonio"],
  ["Priyadarshini Panda", "Lloyd F. Hunt Early Career Chair of Electrical & Computer Engineering and Associate Professor of Electrical & Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Panda&fname=Priyadarshini"],
  ["Massoud Pedram", "Charles Lee Powell Chair in Electrical and Computer Engineering and Computer Science and Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Pedram&fname=Massoud"],
  ["Timothy M. Pinkston", "George Pfleger Chair in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Pinkston&fname=Timothy"],
  ["Viktor K. Prasanna", "Charles Lee Powell Chair in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Prasanna&fname=Viktor"],
  ["Konstantinos Psounis", "Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Psounis&fname=Konstantinos"],
  ["Feng Qian", "Associate Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Qian&fname=Feng"],
  ["Paria Rashidinejad", "WiSE Gabilan Assistant Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Rashidinejad&fname=Paria"],
  ["Meisam Razaviyayn", "Andrew and Erna Viterbi Early Career Chair and Associate Professor Industrial and Systems Engineering, Computer Science, and Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Razaviyayn&fname=Meisam"],
  ["Mark William Redekopp", "Professor of Electrical and Computer Engineering and Computer Science Practice", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Redekopp&fname=Mark"],
  ["Cyrus Shahabi", "Helen N. and Emmett H. Jones Professorship in Engineering and Professor of Computer Science, Electrical and Computer Engineering, and Spatial Sciences", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Shahabi&fname=Cyrus"],
  ["Maryam Shanechi", "Alexander A. Sawchuk Chair in Electrical and Computer Engineering and Professor of Electrical and Computer Engineering, Biomedical Engineering, and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Shanechi&fname=Maryam"],
  ["Constantine Sideris", "Andrew and Erna Viterbi Early Career Chair and Associate Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Sideris&fname=Constantine"],
  ["Mahdi Soltanolkotabi", "Andrew and Erna Viterbi Early Career Chair and Professor of Electrical and Computer Engineering, Computer Science, and Industrial and Systems Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Soltanolkotabi&fname=Mahdi"],
  ["Gaurav Sukhatme", "Donald M. Alstadt Chair in Advanced Computing and Professor of Computer Science and Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Sukhatme&fname=Gaurav"],
  ["Christopher Torng", "Assistant Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Torng&fname=Christopher"],
  ["Stephen Tu", "Assistant Professor of Electrical and Computer Engineering and Computer Science", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Tu&fname=Stephen"],
  ["Alan E. Willner", "Andrew and Erna Viterbi Professorial Chair and Distinguished Professor of Electrical and Computer Engineering", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Willner&fname=Alan"],
  ["Quntao Zhuang", "Associate Professor of Electrical and Computer Engineering and Physics and Astronomy", "https://minghsiehece.usc.edu/directory/faculty/profile/?lname=Zhuang&fname=Quntao"]
] as const;

const uscRows = [
  ...uscComputerScienceRows.map(([fullName, role, profileUrl]) => ({
    id: makeLocalFacultyId("usc-cs", fullName),
    fullName,
    facultyName: "USC Viterbi School of Engineering",
    departmentName: "Thomas Lord Department of Computer Science",
    role,
    email: null,
    profileUrl,
    expertise: ["Computer science", "Artificial intelligence", "Software and systems"],
    sourceUrl: uscComputerScienceDirectoryUrl
  })),
  ...uscElectricalComputerEngineeringRows.map(([fullName, role, profileUrl]) => ({
    id: makeLocalFacultyId("usc-ece", fullName),
    fullName,
    facultyName: "USC Viterbi School of Engineering",
    departmentName: "Ming Hsieh Department of Electrical and Computer Engineering",
    role,
    email: null,
    profileUrl,
    expertise: ["Electrical and computer engineering", "Computer engineering", "Systems"],
    sourceUrl: uscEceDirectoryUrl
  }))
];

const uclaComputerScienceRosterSections = [
  {
    role: "Professor",
    names: [
      "John Junghoo Cho",
      "Jason Jingsheng Cong",
      "Adnan Y. Darwiche",
      "Jason Ernst",
      "Eleazar Eskin",
      "Miryung Kim",
      "Songwu Lu",
      "Raghu Meka",
      "Todd D. Millstein",
      "Stanley J. Osher",
      "Rafail Ostrovsky",
      "Jens Palsberg",
      "Miodrag Potkonjak",
      "Glenn D. Reinman",
      "Amit Sahai",
      "Sriram Sankararaman",
      "Majid Sarrafzadeh",
      "Alexander Sherstov",
      "Stefano Soatto",
      "Mani B. Srivastava",
      "Yizhou Sun",
      "Demetri Terzopoulos",
      "Guy Van den Broeck",
      "George Varghese",
      "Wei Wang",
      "Harry G. Xu",
      "Lixia Zhang"
    ]
  },
  {
    role: "Professor Emeritus",
    names: [
      "Algirdas A. Avizienis",
      "Rajive L. Bagrodia",
      "Alfonso F. Cardenas",
      "Wesley W. Chu",
      "Joseph J. DiStefano III",
      "Michael G. Dyer",
      "Milos D. Ercegovac",
      "Eliezer M. Gafni",
      "Sheila A. Greibach",
      "Leonard Kleinrock",
      "Allen Klinger",
      "Richard E. Korf",
      "Richard R. Muntz",
      "Judea Pearl",
      "Carlo A. Zaniolo"
    ]
  },
  {
    role: "Associate Professor",
    names: [
      "Omid Abari",
      "Kai-Wei Chang",
      "Xiang Anthony Chen",
      "Quanquan Gu",
      "Choi-Jui Hsieh",
      "Achuta Kadambi",
      "Jonathan C. Kao",
      "Anthony J. Nowatzki",
      "Violet Nanyun Peng",
      "Yuval Tamir",
      "Yuan Tian",
      "Bolei Zhou"
    ]
  },
  {
    role: "Assistant Professor",
    names: [
      "Yuchen Cui",
      "Saadia Gabriel",
      "Aditya Grover",
      "Eunice Jun",
      "Konstantinos Kallas",
      "Sam Kumar",
      "Baharan Mirzasoleiman",
      "Harold Pimentel",
      "Blaise-Pascal Tine",
      "Remy Wang"
    ]
  },
  {
    role: "Professor of Teaching",
    names: ["Paul R. Eggert", "David A. Smallberg"]
  },
  {
    role: "Assistant Professor of Teaching",
    names: ["Sandra Batista", "Tobias Dürschmid"]
  },
  {
    role: "Adjunct Professor",
    names: ["Eran Halperin", "Alan C. Kay"]
  },
  {
    role: "Adjunct Associate Professor",
    names: ["Carey S. Nachenberg", "Giovanni Pau", "Ramin Ramezani", "Fabien Scalzo"]
  }
] as const;

const uclaElectricalComputerEngineeringRosterSections = [
  {
    role: "Professor",
    names: [
      "Asad A. Abidi",
      "Elaheh Ahmadi",
      "Abeer A.H. Alwan",
      "Katsushi Arisaka",
      "Corey W. Arnold",
      "Aydin Babakhani",
      "Danijela Cabric",
      "Robert N. Candler",
      "M.-C. Frank Chang",
      "Panagiotis D. Christofides",
      "Jingsheng Jason Cong",
      "Suhas N. Diggavi",
      "Lara Dolecek",
      "Christina P. Fragouli",
      "Puneet Gupta",
      "Subramanian S. Iyer",
      "Mona Jarrahi",
      "Chandrashekhar J. Joshi",
      "Douglas G. Lichtman",
      "Jia-Ming Liu",
      "Wentai Liu",
      "Dejan Markovic",
      "Ali Mosleh",
      "Stanley J. Osher",
      "Aydogan Ozcan",
      "Sudhakar Pamarti",
      "Jason R. Petta",
      "Yahya Rahmat-Samii",
      "Behzad Razavi",
      "Vwani P. Roychowdhury",
      "Henry Samueli",
      "Majid Sarrafzadeh",
      "Stefano Soatto",
      "Jason L. Speyer",
      "Mani B. Srivastava",
      "Paulo Tabuada",
      "Lieven Vandenberghe",
      "John D. Villasenor",
      "Kang L. Wang",
      "Yuanxun Ethan Wang",
      "Richard D. Wesel",
      "Benjamin S. Williams",
      "Chee Wei Wong",
      "Jason C.S. Woo",
      "C.-K. Ken Yang",
      "Lixia Zhang"
    ]
  },
  {
    role: "Professor Emeritus",
    names: [
      "Frederick G. Allen",
      "Francis F. Chen",
      "Babak Daneshrad",
      "Harold R. Fetterman",
      "Lei He",
      "Stephen E. Jacobsen",
      "Rajeev Jain",
      "Bahram Jalali",
      "William J. Kaiser",
      "Alan J. Laub",
      "Warren B. Mori",
      "Dee-Son Pan",
      "Gregory J. Pottie",
      "Izhak Rubin",
      "Ali H. Sayed",
      "Gabor C. Temes",
      "Mihaela van der Schaar",
      "Alan N. Willson, Jr.",
      "Kung Yao"
    ]
  },
  {
    role: "Associate Professor",
    names: [
      "Omid Abari",
      "Sergio Carbajo",
      "Xiang Anthony Chen",
      "Anushri Dixit",
      "Sam Emaminejad",
      "Achuta Kadambi",
      "Jonathan C. Kao",
      "Ankur M. Mehta",
      "Prineha Narang",
      "Yuan Tian",
      "Lin F. Yang"
    ]
  },
  {
    role: "Assistant Professor",
    names: ["Xiaofan Cui", "Liz Izhikevich", "Di Luo", "Ian P. Roberts", "Nader Sehatbakhsh", "Yang Zhang", "Leo Zhou"]
  },
  {
    role: "Lecturer",
    names: ["Dennis M. Briggs", "Hooman Darabi", "Flavio Lorenzelli", "Farid Mesghali", "Dana Cairns Watson"]
  },
  {
    role: "Adjunct Professor",
    names: [
      "Young-Kai Chen",
      "Dariush Divsalar",
      "Dan M. Goebel",
      "Mark Gyure",
      "Asad M. Madni",
      "Yair Rivenson",
      "Ernest K. Ryu",
      "Marko Sokolich",
      "Eli Yablonovitch"
    ]
  },
  {
    role: "Adjunct Assistant Professor",
    names: ["Shervin Moloudi"]
  }
] as const;

const uclaComputerScienceRows = uclaComputerScienceRosterSections.flatMap(({ role, names }) =>
  names.map((fullName) => ({
    id: makeLocalFacultyId("ucla-cs", fullName),
    fullName,
    facultyName: "UCLA Samueli School of Engineering",
    departmentName: "Computer Science Department",
    role,
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Artificial intelligence", "Software and systems"],
    sourceUrl: uclaComputerScienceRosterUrl
  }))
);

const uclaElectricalComputerEngineeringRows = uclaElectricalComputerEngineeringRosterSections.flatMap(({ role, names }) =>
  names.map((fullName) => ({
    id: makeLocalFacultyId("ucla-ece", fullName),
    fullName,
    facultyName: "UCLA Samueli School of Engineering",
    departmentName: "Electrical and Computer Engineering Department",
    role,
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Computer engineering", "Systems"],
    sourceUrl: uclaEceRosterUrl
  }))
);

const uclaRows = [...uclaComputerScienceRows, ...uclaElectricalComputerEngineeringRows];

const ucDavisRows = [
  {
    id: "uc-davis-cs-zhaojun-bai",
    fullName: "Zhaojun Bai",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Distinguished Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Mathematics"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-matt-bishop",
    fullName: "Matt Bishop",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Software", "Security"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-hao-chen",
    fullName: "Hao Chen",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Software", "Systems"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-muhao-chen",
    fullName: "Muhao Chen",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Artificial intelligence", "Machine learning"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-raissa-dsouza",
    fullName: "Raissa M. D'Souza",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor and Associate Dean for Research",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Interdisciplinary topics", "Complex systems"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-ian-davidson",
    fullName: "Ian Davidson",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Artificial intelligence", "Machine learning"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-david-doty",
    fullName: "David Doty",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Interdisciplinary topics"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-matthew-farrens",
    fullName: "Matthew Farrens",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Computer architecture"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-vladimir-filkov",
    fullName: "Vladimir Filkov",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Artificial intelligence", "Machine learning", "Software"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-alexander-gamero-garrido",
    fullName: "Alexander Gamero-Garrido",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-dipak-ghosal",
    fullName: "Dipak Ghosal",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor, Bucher Family Chair",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Artificial intelligence", "Interdisciplinary topics"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-francois-gygi",
    fullName: "Francois Gygi",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-lifu-huang",
    fullName: "Lifu Huang",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Artificial intelligence", "Machine learning"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-isaac-kim",
    fullName: "Isaac Kim",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-sam-king",
    fullName: "Sam King",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Software", "Systems"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-patrice-koehl",
    fullName: "Patrice Koehl",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-greg-kuperberg",
    fullName: "Greg Kuperberg",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Distinguished Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Mathematics"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-jasper-lee",
    fullName: "Jasper Lee",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-dongyu-liu",
    fullName: "Dongyu Liu",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Visualization"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-xin-liu",
    fullName: "Xin Liu",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-jason-lowe-power",
    fullName: "Jason Lowe-Power",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Computer architecture", "Systems"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-kwan-liu-ma",
    fullName: "Kwan-Liu Ma",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Distinguished Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Visualization"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-joshua-mccoy",
    fullName: "Joshua McCoy",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Cinema and digital media"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-slobodan-mitrovic",
    fullName: "Slobodan Mitrovic",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-michael-neff",
    fullName: "Michael Neff",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor, Chair of Graduate Group",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Cinema and digital media"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-christopher-nitta",
    fullName: "Christopher Nitta",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor of Teaching",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Teaching"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-randall-oreilly",
    fullName: "Randall O'Reilly",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Psychology", "Neuroscience"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-tapti-palit",
    fullName: "Tapti Palit",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-julian-panetta",
    fullName: "Julian Panetta",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-hamed-pirsiavash",
    fullName: "Hamed Pirsiavash",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Artificial intelligence", "Machine learning"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-joel-porquet-lupine",
    fullName: "Joël Porquet-Lupine",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor of Teaching",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Teaching"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-setareh-rafatirad",
    fullName: "Setareh Rafatirad",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor of Teaching",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Teaching"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-amanda-raybuck",
    fullName: "Amanda Raybuck",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-cindy-rubio-gonzalez",
    fullName: "Cindy Rubio González",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Software"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-mohammad-sadoghi",
    fullName: "Mohammad Sadoghi",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor, Chancellor's Fellow",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Data systems"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-zubair-shafiq",
    fullName: "Zubair Shafiq",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-maike-sonnewald",
    fullName: "Maike Sonnewald",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Computational climate"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-caleb-stanford",
    fullName: "Caleb Stanford",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-ilias-tagkopoulos",
    fullName: "Ilias Tagkopoulos",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Genome Center"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-aditya-thakur",
    fullName: "Aditya Thakur",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Software"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-hao-chuan-wang",
    fullName: "Hao-Chuan Wang",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science", "Human-computer interaction"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-jiawei-zhang",
    fullName: "Jiawei Zhang",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-zhe-zhao",
    fullName: "Zhe Zhao",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-cs-yang-zhou",
    fullName: "Yang Zhou",
    facultyName: "College of Engineering",
    departmentName: "Department of Computer Science",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Computer science"],
    sourceUrl: "https://cs.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-soheil-ghiasi",
    fullName: "Soheil Ghiasi",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Computer science", "Computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-j-sebastian-gomez-diaz",
    fullName: "J. Sebastian Gomez-Diaz",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-an-gundes",
    fullName: "A.N. Gundes",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-houman-homayoun",
    fullName: "Houman Homayoun",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-hyoyoung-jeong",
    fullName: "Hyoyoung Jeong",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Assistant Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Machine learning"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-lifeng-lai",
    fullName: "Lifeng Lai",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Information systems"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-omeed-momeni",
    fullName: "Omeed Momeni",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-john-owens",
    fullName: "John Owens",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Child Family Professor of Engineering and Entrepreneurship",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-anh-vu-pham",
    fullName: "Anh-Vu Pham",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor and Vice Chair for Graduate Studies",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-william-putnam",
    fullName: "William Putnam",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-marina-radulaski",
    fullName: "Marina Radulaski",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Associate Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Physics"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-avesta-sasan",
    fullName: "Avesta Sasan",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-weijian-yang",
    fullName: "Weijian Yang",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Associate Professor and Graduate Advisor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-sj-ben-yoo",
    fullName: "S.J. Ben Yoo",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Distinguished Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Information systems"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  },
  {
    id: "uc-davis-ece-junshan-zhang",
    fullName: "Junshan Zhang",
    facultyName: "College of Engineering",
    departmentName: "Department of Electrical and Computer Engineering",
    role: "Professor",
    email: null,
    profileUrl: null,
    expertise: ["Electrical and computer engineering", "Artificial intelligence", "Robotics", "Edge research"],
    sourceUrl: "https://ece.ucdavis.edu/directory"
  }
] as const;

const udemRows = [
  {
    "id": "5e4a8b20-a4c7-45b1-b122-7a99c40305f7",
    "fullName": "Sergio Crespo-Garcia",
    "facultyName": "École d'optométrie",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in34983/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "309fe19b-1e1d-47cd-96bd-3dab585f0a26",
    "fullName": "David Buetti",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37593/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b6352a94-f879-4b3f-a5ad-259be4386e80",
    "fullName": "Emmanuelle Arpin",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37760/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "790e30cc-0b60-4e0a-8df7-9d92e2632ce3",
    "fullName": "Francesco Montani",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37713/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "03487971-2573-4f5a-a732-31087b0dbabc",
    "fullName": "François M. Castonguay",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36575/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "cdd02133-905a-4d0d-a29b-42266266083a",
    "fullName": "Marie-Josée Fleury",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19074/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b0897c87-93d9-4fe1-b389-eaeefca6e09e",
    "fullName": "Mira Johri",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14377/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "a95546ac-b79e-4175-b508-ad4f99bc91d6",
    "fullName": "Morgane Gabet",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37598/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ef732200-518d-4386-88fd-aac1e899addf",
    "fullName": "Nadia Sourial",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32654/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5e1bc6c4-9c35-4c45-b60b-30f2ab4dbca0",
    "fullName": "Nathalie Clavel",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36576/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "d10e272b-3820-49a5-a4db-eb1f888ae6d0",
    "fullName": "Olivier Jacques",
    "facultyName": "École de santé publique",
    "departmentName": "Département de gestion, d’évaluation et de politique de santé",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33028/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b242902a-8047-4a02-aa4b-b22f570f55db",
    "fullName": "Alena Valderrama",
    "facultyName": "École de santé publique",
    "departmentName": "Département de médecine sociale et préventive",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in28482/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "65b51c0d-38c7-4203-84fa-0cb2d7c157ee",
    "fullName": "Bouchra Nasri",
    "facultyName": "École de santé publique",
    "departmentName": "Département de médecine sociale et préventive",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31933/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "0e0aa4e1-c99d-4793-a98a-aca8baa19c84",
    "fullName": "Muriel Mac-Seing",
    "facultyName": "École de santé publique",
    "departmentName": "Département de médecine sociale et préventive",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36586/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5b015516-f275-4493-93d3-3e6334dcaaef",
    "fullName": "Réjean Dion",
    "facultyName": "École de santé publique",
    "departmentName": "Département de médecine sociale et préventive",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19062/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "a9aeaf8f-4489-46e7-aea6-e386c2999883",
    "fullName": "Rodney Knight",
    "facultyName": "École de santé publique",
    "departmentName": "Département de médecine sociale et préventive",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35005/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "41ef6b5b-c0ce-4597-bcf8-14afad759e41",
    "fullName": "Rosanne Blanchet",
    "facultyName": "École de santé publique",
    "departmentName": "Département de médecine sociale et préventive",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in34193/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2621423c-dd1f-4535-aee9-5931a1f8857e",
    "fullName": "Yan Kestens",
    "facultyName": "École de santé publique",
    "departmentName": "Département de médecine sociale et préventive",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15325/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3d6e3d38-881c-441a-9655-d1b0c3fafe0d",
    "fullName": "Ludwig Vinches",
    "facultyName": "École de santé publique",
    "departmentName": "Département de santé environnementale et santé au travail",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31341/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "e642f53c-bd3c-46aa-81ca-bff6d883c555",
    "fullName": "Maryse Bouchard",
    "facultyName": "École de santé publique",
    "departmentName": "Département de santé environnementale et santé au travail",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15555/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5ef95654-3b37-473b-b0fb-d1498a87be08",
    "fullName": "Stéphane Buteau",
    "facultyName": "École de santé publique",
    "departmentName": "Département de santé environnementale et santé au travail",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32120/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2ea022f9-3b4e-4001-8cb9-0e851c5b601e",
    "fullName": "Han-Ru Zhou",
    "facultyName": "Faculté de droit",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14851/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "8300a9ed-2da7-4390-84a8-835fadd25f5b",
    "fullName": "Noura Karazivan",
    "facultyName": "Faculté de droit",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19058/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "d8373533-8bb9-49a4-8754-f4d84f271d00",
    "fullName": "Bechara Helal",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "Direction",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29417/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3a79e1d6-7356-46fe-a14a-cb0d00412cfc",
    "fullName": "Carmela Cucuzzella",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "Direction",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36600/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3be1af64-9584-4658-a088-a7629b6b980c",
    "fullName": "Philippe Gauthier",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "Direction",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14603/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "c94fcbda-b2b5-4f5d-be07-e2659be9a9b9",
    "fullName": "Alice Covatta",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École d'architecture",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32414/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "594b2ed7-ad0e-4e83-b60e-1fdc538066cd",
    "fullName": "Béatrice Gervais-Bergeron",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École d'urbanisme et d'architecture de paysage",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37932/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ea6c5cf7-b2f5-4396-acca-df98c2d18934",
    "fullName": "Shin Koseki",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École d'urbanisme et d'architecture de paysage",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32496/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "061253ab-15b2-4c3c-9e6d-2fbae617a1c0",
    "fullName": "Caoimhe Isha Beaulé",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École de design",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in27163/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b861bf72-d14e-480c-89b1-160d96987923",
    "fullName": "Marie Tremblay-Laliberté",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École de design",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in20694/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4a3da461-e0a5-4103-9029-33d4ef1640b6",
    "fullName": "Olivier Vallerand",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École de design",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33100/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b552ead9-5c6f-44a3-acd5-5698aab9e4d2",
    "fullName": "Tomás Dorta",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École de design",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14696/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "66755dac-58ad-4f45-9b1b-05e6e877990c",
    "fullName": "Virginie Tessier",
    "facultyName": "Faculté de l'aménagement",
    "departmentName": "École de design",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29191/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "30df921e-3bb1-48ce-a691-64cce78d8a9f",
    "fullName": "Gabrielle Pagé",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département d'anesthésiologie et de médecine de la douleur",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30363/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "baaa2dce-257d-4203-864d-d49efd042c21",
    "fullName": "Alexandre Dubrac",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département d'ophtalmologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29907/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "82bde882-6aff-4d6a-9fc3-53e448ef7e94",
    "fullName": "Christos Boutopoulos",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département d'ophtalmologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29439/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ffb80407-5338-4dbb-8d36-5ead5d8dfc73",
    "fullName": "Mark Richard Lesk",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département d'ophtalmologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14420/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "f8748a3d-c6d8-4079-9d83-d7328694de4d",
    "fullName": "Przemyslaw (Mike) Sapieha",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département d'ophtalmologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14996/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4916f8d2-fa7d-4531-a956-1544ce270059",
    "fullName": "Daniel Zenklusen",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de biochimie et médecine moléculaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15458/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "307d0e11-0343-4f72-aece-47e4f360d4ce",
    "fullName": "Gertraud Burger",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de biochimie et médecine moléculaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13686/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "93feef01-9d35-4b08-a37d-6cd08ed4912c",
    "fullName": "Jacques Drouin",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de biochimie et médecine moléculaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14334/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "63808ce8-40a0-41c3-ac73-a28a834fed64",
    "fullName": "Jean-Benoît Lalanne",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de biochimie et médecine moléculaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38068/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "946d4e6c-3d83-4a5f-89c8-8e26a8272ccc",
    "fullName": "Marie Beauséjour",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de chirurgie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29436/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "108c35ca-6c4b-4aa0-b56f-1cb68b00ddfb",
    "fullName": "Nicolas Noiseux",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de chirurgie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15025/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "980be73b-a466-4d56-bd95-3fdd76dd8d79",
    "fullName": "Amélie Bernier-Jean",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in34595/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "66c92ecc-d9b6-41e7-814c-fdf5f73d78d8",
    "fullName": "Andréane Richard-Denis",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31178/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "958790a1-4676-4613-867a-5f12f367a302",
    "fullName": "Annie Claire Nadeau-Fredette",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31521/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "fd4fa746-c0c2-4b62-8857-09304d554573",
    "fullName": "Catherine Martel",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in17014/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4766c1dc-2cc9-42a5-8447-5a5a27ad8aa2",
    "fullName": "Guido Simonelli",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32989/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3a79320a-e41e-41bd-aa6b-f7ecd858e5bb",
    "fullName": "Guillaume Lettre",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14995/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "74da078d-8a34-41f4-9be5-62f947d9bbd1",
    "fullName": "Guillaume Marquis-Gravel",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32191/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ed904746-f94d-43d9-b8cd-4db5d58ad6cf",
    "fullName": "Jean-Paul Makhzoum",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36363/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "66d6a90c-de3e-4486-a69f-df524c202c0d",
    "fullName": "Johanne Martel-Pelletier",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14149/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "95ed8bee-5339-4569-8817-e31c5a3673f4",
    "fullName": "Manuela Santos",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15075/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "a57e9291-0669-4d94-a58c-7a1f33368930",
    "fullName": "Marie-Pierre Dubé",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14859/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "e6ac6cf2-45bd-4f79-b27b-d320a9f842b5",
    "fullName": "Mathieu Ferron",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in16018/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "6905d600-3526-4eec-a9b6-88a1ce885e53",
    "fullName": "Rémi Goupil",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31526/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "27a62884-0474-45cb-b1b4-a2f242bd29ec",
    "fullName": "Roddy Hiram",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33162/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "731456ef-d041-4a78-9b91-b9a48fea9d22",
    "fullName": "Sarah Gagliano Taliun",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32070/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "61935291-f27c-46b0-bb78-b79681d21e89",
    "fullName": "William Beaubien-Souligny",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32949/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "58206e7e-4fc9-4528-8e7b-c1feff8fdf9a",
    "fullName": "Adelina Artenie",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine de famille et de médecine d'urgence",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38018/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "96e9aea0-d6c5-412c-828d-1564a01aa3d7",
    "fullName": "Antoine Boivin",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine de famille et de médecine d'urgence",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in16035/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2868191c-da81-434e-a9e6-cd8c1c4e5702",
    "fullName": "Claude Julie Bourque",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine de famille et de médecine d'urgence",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31313/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "146b3d64-a742-45c5-b214-a760db511a3b",
    "fullName": "Géraldine Layani",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de médecine de famille et de médecine d'urgence",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33755/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3925be1c-f083-4ed1-9746-1f60f5497fa4",
    "fullName": "Frédérique Le Roux",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de microbiologie, infectiologie et immunologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36694/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "15d4ebcd-2338-47f0-9458-b4af0ef9a3ae",
    "fullName": "Mark Keezer",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de neurosciences",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31523/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2ce8c2e1-0dce-46c1-b560-d47478c7086f",
    "fullName": "Matthieu Vanni",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de neurosciences",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30374/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "74c0b173-bbb8-4c6c-bdfb-8971c3f8a912",
    "fullName": "Chantal Bémeur",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de nutrition",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in17667/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "8af4f011-e497-49ef-93f1-2242f3b18e9b",
    "fullName": "Étienne Caron",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pathologie et biologie cellulaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30451/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "00c38f7d-1ba0-4fc3-a344-68ee20bc3efd",
    "fullName": "Gilles Hickson",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pathologie et biologie cellulaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15307/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "09d65f34-03fd-46af-bfbe-178bf83fbe15",
    "fullName": "Rubén Marín Juez",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pathologie et biologie cellulaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32819/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2ce58d89-7cd9-474d-b294-ec41781f7ca2",
    "fullName": "Anne-Marie Laberge",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pédiatrie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14957/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "7babbfdd-7f04-494a-b053-d9a07dd2625d",
    "fullName": "Christophe Faure",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pédiatrie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in17747/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "0c9d76ac-adb1-48c8-b533-fb18387ba385",
    "fullName": "Francine M. Ducharme",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pédiatrie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14917/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "d6bd4238-e4a0-4cff-b1c0-938f46fafd51",
    "fullName": "Serge Sultan",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pédiatrie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15882/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "11e04ebc-11a2-4b39-b144-e98fc3dac21b",
    "fullName": "Alexa Pichet Binette",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pharmacologie et physiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37969/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "0bfdec3d-519a-409d-ab66-cffc4f7dbf9b",
    "fullName": "Houman Savoji",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pharmacologie et physiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31629/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "e4cfdf94-f48e-4d5e-bf86-3605a65e7075",
    "fullName": "Jonathan Brouillette",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pharmacologie et physiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in17687/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "cf73a8b3-7993-4b81-a164-0b52a87565d3",
    "fullName": "Noël J-M Raynal",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pharmacologie et physiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15981/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "7eb71e14-a8d3-4a58-9de9-241b89d7d929",
    "fullName": "Rikard Blunck",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de pharmacologie et physiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15049/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "227cc90b-2990-4038-9faa-be39db612057",
    "fullName": "Baudouin Forgeot d'Arc",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de psychiatrie et d’addictologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in16722/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b424ee7c-017b-4015-990f-be4da46eaa79",
    "fullName": "Frederick Aardema",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de psychiatrie et d’addictologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15160/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "39295e84-fb3d-452d-8cc1-0c3d0f3d8286",
    "fullName": "Marc Lavoie",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de psychiatrie et d’addictologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15345/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "df71be67-fea2-4a2a-a99d-9a02e0d96f97",
    "fullName": "François Yu",
    "facultyName": "Faculté de médecine",
    "departmentName": "Département de radiologie, radio-oncologie et médecine nucléaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29358/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "c124a379-a21f-4863-a997-f7a2233425c8",
    "fullName": "Karine Marcotte",
    "facultyName": "Faculté de médecine",
    "departmentName": "École d'orthophonie et d'audiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in17719/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "9b0d82e7-b282-46f9-a439-2721b2c0f4d8",
    "fullName": "Daniel Gagnon",
    "facultyName": "Faculté de médecine",
    "departmentName": "École de kinésiologie et des sciences de l'activité physique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in22433/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "db1bee09-23df-4c54-8c57-829f7090f384",
    "fullName": "Julie Lavoie",
    "facultyName": "Faculté de médecine",
    "departmentName": "École de kinésiologie et des sciences de l'activité physique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14918/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "f986ab30-467c-4e44-a2e6-950874984ed6",
    "fullName": "Yosra Cherni",
    "facultyName": "Faculté de médecine",
    "departmentName": "École de kinésiologie et des sciences de l'activité physique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36142/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "41dbed05-cdcd-43e2-ac63-f5ac122027f5",
    "fullName": "Anne Hudon",
    "facultyName": "Faculté de médecine",
    "departmentName": "École de réadaptation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in20722/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "7c41d54d-02cc-4fa9-a92d-b0d77e02daa8",
    "fullName": "Nicolas Dumont",
    "facultyName": "Faculté de médecine",
    "departmentName": "École de réadaptation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in22300/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "505394ce-79a1-415d-ab82-2e05fd02bdaf",
    "fullName": "Cibele Dal Fabbro",
    "facultyName": "Faculté de médecine dentaire",
    "departmentName": "Département de dentisterie de restauration",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37672/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "d019ade2-b563-46f6-a46d-a0687b6dd359",
    "fullName": "Antonio Nanci",
    "facultyName": "Faculté de médecine dentaire",
    "departmentName": "Département de stomatologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13883/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "0325edf0-360d-450b-9790-b33b56ad4e92",
    "fullName": "Tran Vo Long Dao",
    "facultyName": "Faculté de médecine dentaire",
    "departmentName": "Département de stomatologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19291/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "cd9f5c3e-8e5d-485e-b869-7ad63bca9363",
    "fullName": "Alexandre Boyer",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de biomédecine vétérinaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19192/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "9bec5626-b9ae-4d77-a446-76055a4b9c5f",
    "fullName": "Imourana Alassane-Kpembi",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de biomédecine vétérinaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31588/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b8f96224-9a88-42e4-8abc-4db1910e6a75",
    "fullName": "José Denis-Robichaud",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de biomédecine vétérinaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38443/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "1a105f6c-99cf-479a-a604-1a8e4d01bb72",
    "fullName": "Kalidou Ndiaye",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de biomédecine vétérinaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19385/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5d97749c-ca3e-4441-86e9-f461e077a393",
    "fullName": "Lia Gomes Paim",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de biomédecine vétérinaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38476/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "c390e0a2-3ea6-455e-8ba7-146740b116be",
    "fullName": "Marcio Costa",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de biomédecine vétérinaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in28256/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ef391d6b-55e0-474a-9352-a4281b35f761",
    "fullName": "Reza Akbari Moghaddam Kakhki",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de biomédecine vétérinaire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38770/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "c08b2f5f-0a4a-4680-9bc3-fd1520c44651",
    "fullName": "Esdras Corrêa dos Santos",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de pathologie et microbiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38820/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b1e57162-2d51-413e-a9ea-c9eae4b68e4a",
    "fullName": "François Meurens",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de pathologie et microbiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35715/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "a83d7013-70fd-4550-ae43-4aca555c8ddf",
    "fullName": "Mariela Segura",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de pathologie et microbiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15436/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "51129dae-06e7-4efc-9967-d085571253f5",
    "fullName": "Sylvain Quessy",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de pathologie et microbiologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13617/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5b6bce2a-c185-43e8-956d-32eb5f931270",
    "fullName": "Bertrand Lussier",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de sciences cliniques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14137/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "e3adba9f-6efe-43ad-a89d-2723c9c0e761",
    "fullName": "Marie-Ève Lambert",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de sciences cliniques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in28789/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2efc298f-a13c-4948-b8e4-faa4cd5e51c5",
    "fullName": "Marion Desmarchelier",
    "facultyName": "Faculté de médecine vétérinaire",
    "departmentName": "Département de sciences cliniques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29915/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "7078a89f-4798-4af4-9dfa-b6909e7f1422",
    "fullName": "Robert Normandeau",
    "facultyName": "Faculté de musique",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15399/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "c8c0f47a-8ce8-4aba-bb74-ca4453914a48",
    "fullName": "Marc Servant",
    "facultyName": "Faculté de pharmacie",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14496/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "301990f9-18fd-4782-a337-04019493d88a",
    "fullName": "Rami Al Batran",
    "facultyName": "Faculté de pharmacie",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31575/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "280dd797-dc68-4ae6-acc8-13d07f33401d",
    "fullName": "Simon-Pierre Gravel",
    "facultyName": "Faculté de pharmacie",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29097/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "a28687fe-9336-47d3-8d6a-2ca4cc9b1a86",
    "fullName": "Gabriel Fauveaud",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Centre d'études asiatiques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in28659/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b67f33a5-3412-4aa6-aa2f-5ff09aa9d0a8",
    "fullName": "Christian Gates St-Pierre",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'anthropologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15476/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "67e4ab23-c486-452b-a132-9be176836c37",
    "fullName": "Marie-Pierre Bousquet",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'anthropologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14621/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "f595245c-fa8e-49c7-b744-00868fe8ec2c",
    "fullName": "Samir Saul",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'histoire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14209/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "83e4bff7-ddc6-4f5a-8c59-1b517b59a9dd",
    "fullName": "Simplice Ayangma Bonoho",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'histoire",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36896/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ec10465c-8d22-4670-99f3-72236af99d94",
    "fullName": "Aaron Courville",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19017/",
    "expertise": [
      "Apprentissage automatique",
      "Apprentissage de représentations",
      "Apprentissage profond",
      "Intelligence artificielle",
      "Modèles probabilistes",
      "Modèles statistiques",
      "Réseaux de neurones"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/9/"
  },
  {
    "id": "ee547309-9df8-469f-a141-79f813588319",
    "fullName": "Abdelhakim Hafid",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15300/",
    "expertise": [
      "Chaine de blocs",
      "Internet des objets",
      "Informatique en périphérie",
      "Informatique géodistribuée",
      "Systèmes de transport intelligent"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/16/"
  },
  {
    "id": "e144c8ad-3e57-4c15-96cd-811f82d94f54",
    "fullName": "Aishwarya Agrawal",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32415/",
    "expertise": [
      "Intelligence artificielle",
      "Apprentissage profond",
      "Traitement automatique du langage naturel (TALN)",
      "Vision par ordinateur"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/"
  },
  {
    "id": "baa9e244-d50e-4011-928d-4703a3111a2a",
    "fullName": "Alain Tapp",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15599/",
    "expertise": [
      "Intelligence artificielle",
      "Informatique théorique",
      "Traitement automatique du langage naturel (TALN)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/33/"
  },
  {
    "id": "ebf71789-e678-4f03-9f4f-3fd4a09d5859",
    "fullName": "Alex Hernandez-Garcia",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36609/",
    "expertise": [
      "Apprentissage automatique",
      "Apprentissage profond",
      "Intelligence artificielle",
      "Modélisation"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/16/"
  },
  {
    "id": "b44a0952-4acd-4a70-9887-166d726e3e90",
    "fullName": "Anna Huang",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in34327/",
    "expertise": [
      "Intelligence artificielle",
      "Apprentissage profond"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/17/"
  },
  {
    "id": "b0af5d82-724b-4fa1-8fd5-ddfa76950e5d",
    "fullName": "Bang Liu",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32097/",
    "expertise": [
      "Traitement automatique du langage naturel (TALN)",
      "Apprentissage profond",
      "Science des données"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/22/"
  },
  {
    "id": "5102bcc5-9e57-4600-86a5-ee62109956bb",
    "fullName": "Benjamin Seamone",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19798/",
    "expertise": [
      "Théorie des graphes",
      "Analyse combinatoire",
      "Théorie combinatoire des nombres",
      "Optimisation combinatoire"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/31/"
  },
  {
    "id": "d84977c0-434a-45ae-a16c-134ccdbfbb2b",
    "fullName": "Benoit Baudry",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36891/",
    "expertise": [
      "Génie logiciel",
      "Test de systèmes informatiques",
      "Conception de logiciels",
      "Automatisation du génie logiciel"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/2/"
  },
  {
    "id": "d221aa45-5eff-4a08-b4ca-e5be85a7b259",
    "fullName": "Bernard Gendron (In memoriam)",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13736/",
    "expertise": [
      "Optimisation combinatoire",
      "Optimisation linéaire en nombres entiers",
      "Problèmes de planification de grande taille",
      "Recherche opérationnelle",
      "Réseaux de transports",
      "Parallélisme (informatique)",
      "Recherche heuristique en génie logiciel",
      "Algorithmique",
      "Optimistation des systèmes de transports",
      "Transports"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/14/"
  },
  {
    "id": "857d65ae-ca36-48d7-94df-30e21f9e7d02",
    "fullName": "Christopher Pal",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30350/",
    "expertise": [
      "Intelligence artificielle",
      "Vision par ordinateur",
      "Reconnaissance de formes",
      "Apprentissage automatique",
      "Infographie",
      "Traitement automatique du langage naturel (TALN)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/26/"
  },
  {
    "id": "538da561-fae9-4e98-a240-60fdf227c32d",
    "fullName": "Claude Frasson",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13631/",
    "expertise": [
      "Intelligence artificielle",
      "Enseignement à distance",
      "Intelligence émotionnelle",
      "Interface neuronale directe",
      "Processus d'apprentissage",
      "Stratégies pédagogiques",
      "Technologies de l'information et de la communication",
      "Technologies de l'information et de la communication pour l'éducation",
      "Tutoriels",
      "Internet"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/13/"
  },
  {
    "id": "e17b81d8-1f26-4fca-95d2-0b24b719fa97",
    "fullName": "Damien Masson",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37834/",
    "expertise": [
      "Interaction humain-ordinateur",
      "Interaction humain-IA",
      "Visualisation de l'information",
      "Intelligence artificielle"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/23/"
  },
  {
    "id": "96510301-40fc-4de3-942a-afced31cf1ac",
    "fullName": "Dhanya Sridhar",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in34361/",
    "expertise": [
      "Science des données",
      "Intelligence artificielle",
      "Apprentissage automatique",
      "Réseaux sociaux",
      "Modèles statistiques",
      "Traitement automatique du langage naturel (TALN)",
      "Modèles probabilistes"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/32/"
  },
  {
    "id": "b65cf150-190b-45ae-91a5-d8366b095215",
    "fullName": "Emma Frejinger",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15868/",
    "expertise": [
      "Apprentissage statistique",
      "Économétrie",
      "Optimisation des opérations ferroviaires",
      "Optimisation réseau",
      "Optimistation des systèmes de transports",
      "Prédiction de demande",
      "Recherche opérationnelle",
      "Science des données"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/13/"
  },
  {
    "id": "fe109efe-57eb-4b5f-b273-c81bfb9a72d0",
    "fullName": "Esma Aïmeur",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14256/",
    "expertise": [
      "Intelligence artificielle",
      "Sécurité informatique",
      "Cyber-éducation",
      "Acquisition des connaissances (Systèmes experts)",
      "Commerce électronique",
      "Enseignement à distance",
      "Médias sociaux",
      "Protection de la vie privée",
      "Réseaux sociaux",
      "Sécurité de l'information",
      "Sécurité des systèmes d'information",
      "Sécurité des technologies de l'information et de la communication",
      "Stratégies d'apprentissage"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/"
  },
  {
    "id": "604ae2f7-db34-4dbd-9c60-e7caf3268d2c",
    "fullName": "Eugene Belilovsky",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32583/",
    "expertise": [
      "Vision par ordinateur",
      "Simulation distribuée",
      "Apprentissage profond",
      "Traitement automatique du langage naturel (TALN)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/3/"
  },
  {
    "id": "f7018ccb-254b-4f41-80e4-abdfa5fef9fe",
    "fullName": "Eugene Syriani",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in18930/",
    "expertise": [
      "Génie logiciel",
      "Ingénierie dirigée par les modèles",
      "Conception de logiciels",
      "Ingénierie de langages logiciels",
      "Simulation à événements discrets"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/32/"
  },
  {
    "id": "a36a1641-1068-43a6-8e9f-5962dd297aae",
    "fullName": "Fabian Bastin",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19037/",
    "expertise": [
      "Estimation",
      "Optimisation mathématique",
      "Programmation non linéaire",
      "Programmation stochastique",
      "Simulation",
      "Théorie des choix discrets",
      "Transports",
      "Optimistation des systèmes de transports",
      "Réseaux de transports"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/2/"
  },
  {
    "id": "4cc80d5b-7097-40f4-8b41-9f44706fc26c",
    "fullName": "Frédéric Dupont-Dupuis",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31130/",
    "expertise": [
      "Informatique quantique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/12/"
  },
  {
    "id": "48ef5cce-351d-46b4-9cdb-a1b4ce7dc9d8",
    "fullName": "Gauthier Gidel",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32247/",
    "expertise": [
      "Apprentissage profond",
      "Optimisation réseau"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/15/"
  },
  {
    "id": "ad179d81-33ed-4e42-be27-0c0a9ec771ed",
    "fullName": "Gena Hahn",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14367/",
    "expertise": [
      "Algorithmes de graphes",
      "Algorithmes de routage",
      "Colorations des graphes",
      "Graphe de Cayley",
      "Graphes infinis",
      "Homomorphismes de graphes",
      "Jeux poursuite évasion",
      "Mathématiques discrètes",
      "Symétries des graphes",
      "Théorie des graphes"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/16/"
  },
  {
    "id": "f4448d9a-0cdc-4011-b89b-61963c14b813",
    "fullName": "Gilles Brassard",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13606/",
    "expertise": [
      "Calcul quantique",
      "Cryptographie",
      "Cryptographie quantique",
      "Fondements de la théorie quantique",
      "Informatique quantique",
      "Informatique théorique",
      "Intrication quantique",
      "Mécanique quantique",
      "Protection de la vie privée",
      "Pseudotélépathie",
      "Téléportation quantique",
      "Optimisation mathématique",
      "Théorie de l'information quantique",
      "Protocole de distribution quantique de clés"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/5/"
  },
  {
    "id": "5f92d6a7-091c-4970-ad7b-6acc90345346",
    "fullName": "Glen Berseth",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33191/",
    "expertise": [
      "Apprentissage par renforcement",
      "Robotique",
      "Apprentissage profond",
      "Apprentissage automatique",
      "Planification"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/3/"
  },
  {
    "id": "c372eae4-f8e6-415f-a96e-4467f26364af",
    "fullName": "Golnoosh Farnadi",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32584/",
    "expertise": [
      "Intelligence artificielle",
      "Modèles probabilistes",
      "Apprentissage profond"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/12/"
  },
  {
    "id": "2d59bed9-f516-4460-8cde-056b0e22d36c",
    "fullName": "Gregor V. Bochmann",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14834/",
    "expertise": [
      "Protocoles de communication",
      "Conception de logiciels"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/4/"
  },
  {
    "id": "ea18063e-18ef-440d-8f7b-06e13ffe39af",
    "fullName": "Guillaume Rabusseau",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30074/",
    "expertise": [
      "Apprentissage automatique",
      "Algorithmique",
      "Processus d'apprentissage",
      "Structures de données",
      "Programmation non linéaire",
      "Imagerie multispectrale"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/29/"
  },
  {
    "id": "cecac57d-6743-4b36-9da7-f2854b77519a",
    "fullName": "Guy Lapalme",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14105/",
    "expertise": [
      "Génération automatique de textes",
      "Résumé automatique de texte",
      "Traduction assistée par ordinateur",
      "Traitement automatique du langage naturel (TALN)",
      "Web sémantique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/20/"
  },
  {
    "id": "b2a72dcf-5403-471d-a4b1-816d728a557b",
    "fullName": "Hlér Kristjánsson",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37991/",
    "expertise": [
      "Informatique quantique",
      "Calcul quantique",
      "Théorie de l'information quantique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/18/"
  },
  {
    "id": "558a68d5-f5c8-45bc-bfa1-f8c4bd260f90",
    "fullName": "Hugo Larochelle",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in28751/",
    "expertise": [
      "Réseaux de neurones",
      "Apprentissage profond",
      "Apprentissage automatique",
      "Mégadonnées",
      "Intelligence artificielle",
      "Vision par ordinateur",
      "Traitement automatique du langage naturel (TALN)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/20/"
  },
  {
    "id": "a0e81254-0744-4709-9497-5c5d8ff82378",
    "fullName": "Ian Arawjo",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36890/",
    "expertise": [
      "Interaction humain-ordinateur",
      "Interaction humain-IA",
      "Intelligence artificielle",
      "Langages de programmation dynamiques"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/"
  },
  {
    "id": "b87f9b36-448b-4c07-8a34-0ec6c75fa58d",
    "fullName": "Ioannis Mitliagkas",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29391/",
    "expertise": [
      "Apprentissage automatique",
      "Apprentissage de représentations",
      "Apprentissage profond",
      "Intelligence artificielle",
      "Modèles statistiques",
      "Programmation non linéaire",
      "Réseaux de neurones",
      "Technologies de l'information et de la communication",
      "Apprentissage statistique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/24/"
  },
  {
    "id": "2540599f-44dd-40db-a183-df4b5950b62b",
    "fullName": "Irina Rish",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31339/",
    "expertise": [
      "Apprentissage profond",
      "Science des données",
      "Interface neuronale directe",
      "Réseaux de neurones",
      "Modélisation",
      "Modèles probabilistes",
      "COVID-19",
      "COVID19"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/29/"
  },
  {
    "id": "d76cf022-3d8d-4e20-b644-fca65fe09736",
    "fullName": "Jacques St-Pierre",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15709/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/32/"
  },
  {
    "id": "39a44dd3-4787-4154-b30d-084a9864d17e",
    "fullName": "Jean Meunier",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13785/",
    "expertise": [
      "Génie biomédical",
      "Reconstruction 3D à partir d'images",
      "Gérontechnologie",
      "Imagerie médicale",
      "Reconnaissance d'activités en domotique",
      "Vision par ordinateur",
      "Traitement d'images",
      "Vidéosurveillance"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/24/"
  },
  {
    "id": "228f1f8a-db4f-4d02-bc15-f87412e6e2ea",
    "fullName": "Jean-Yves Potvin",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14464/",
    "expertise": [
      "Algorithmes génétiques",
      "Logistique",
      "Métaheuristique",
      "Problèmes de tournées",
      "Recherche tabou",
      "Transports",
      "Optimisation combinatoire",
      "Protocoles de communication",
      "Conception des réseaux",
      "Apprentissage automatique",
      "Parallélisme (informatique)",
      "Intelligence artificielle"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/28/"
  },
  {
    "id": "669dd534-5b2d-4a52-adf2-75aa54672f75",
    "fullName": "Jian Tang",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30351/",
    "expertise": [
      "Apprentissage profond",
      "Théorie des graphes",
      "Traitement automatique du langage naturel (TALN)",
      "Génie biomédical"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/33/"
  },
  {
    "id": "2bf1155c-9db1-45c1-8e82-d0b7e84c241f",
    "fullName": "Jian-Yun Nie",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14445/",
    "expertise": [
      "Intelligence artificielle",
      "Forage de données textuelles",
      "Moteurs de recherche",
      "Recherche d'informations",
      "Traitement automatique du langage naturel (TALN)",
      "Web sémantique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/26/"
  },
  {
    "id": "9a3fe81b-a05f-42f5-a82d-f6cc9e606919",
    "fullName": "Kimberly Yu",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36888/",
    "expertise": [
      "Programmation non linéaire",
      "Informatique théorique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/35/"
  },
  {
    "id": "f7948819-939e-4280-aadb-52e62a394a15",
    "fullName": "Laurent Charlin",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in28756/",
    "expertise": [
      "Apprentissage automatique",
      "Intelligence artificielle",
      "Inférence Bayésienne",
      "Modèles statistiques",
      "Apprentissage profond"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/7/"
  },
  {
    "id": "7329fa23-7355-478c-9284-9b66749d17a5",
    "fullName": "Liam Paull",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29390/",
    "expertise": [
      "Vision par ordinateur",
      "Robotique",
      "Véhicules autonomes",
      "Apprentissage profond"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/27/"
  },
  {
    "id": "585f1b85-85c1-4519-99a9-1e8f05bd7f5c",
    "fullName": "Louis Salvail",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15429/",
    "expertise": [
      "Calcul quantique",
      "Cryptographie",
      "Cryptographie quantique",
      "Informatique quantique",
      "Théorie de l'information quantique",
      "Fondements de la théorie quantique",
      "Informatique théorique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/31/"
  },
  {
    "id": "9f312bbb-cca5-4368-a68b-3b2dc8fb1715",
    "fullName": "Marc Feeley",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14344/",
    "expertise": [
      "Compilation",
      "Langages de programmation de haut niveau",
      "Langages de programmation dynamiques",
      "Langages de programmation fonctionnels",
      "Reconfiguration dynamique des FPGAs",
      "Traitement parallèle (parallélisme)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/13/"
  },
  {
    "id": "917b03d6-a155-4a15-a587-f7b46188b224",
    "fullName": "Marc Gendron-Bellemare",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32538/",
    "expertise": [
      "Apprentissage profond",
      "Informatique théorique",
      "Algorithmique",
      "Apprentissage automatique",
      "Modèles probabilistes",
      "Apprentissage statistique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/14/"
  },
  {
    "id": "c7a6cf66-92f3-46b7-9f0b-a671f0dcbf94",
    "fullName": "Margarida Carvalho",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30076/",
    "expertise": [
      "Algorithmique",
      "Théorie des jeux",
      "Programmation à deux niveaux",
      "Optimisation combinatoire",
      "Théorie de la complexité (informatique théorique)",
      "Conception des réseaux",
      "Recherche opérationnelle",
      "Science des données"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/7/"
  },
  {
    "id": "dd261fcf-f366-49db-9c45-ac347941bf4f",
    "fullName": "Martin Trépanier",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in22656/",
    "expertise": [
      "Transports",
      "Logistique",
      "Recherche opérationnelle",
      "Gestion de réseaux",
      "Optimistation des systèmes de transports",
      "Réseaux de transports",
      "Systèmes de transport intelligent"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/34/"
  },
  {
    "id": "686465dc-2c61-4999-ac5f-390b1c4f0e4f",
    "fullName": "Max Mignotte",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14436/",
    "expertise": [
      "Traitement d'images",
      "Télédétection",
      "Estimateur (statistique)",
      "Estimation des paramètres des modèles",
      "Fusion",
      "Imagerie multispectrale",
      "Inférence Bayésienne",
      "Modélisation procédurale",
      "Reconnaissance de formes",
      "Reconstruction des formes",
      "Segmentation d'image",
      "Techniques hiérarchiques de relaxation"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/24/"
  },
  {
    "id": "e8b35f84-5f18-40b5-a71a-a9a0dc787f2f",
    "fullName": "Michael Florian",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13723/",
    "expertise": [
      "Recherche opérationnelle",
      "Optimistation des systèmes de transports",
      "Réseaux de transports",
      "Transports",
      "Problèmes de planification de grande taille",
      "Conception des réseaux",
      "Optimisation réseau"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/13/"
  },
  {
    "id": "eb930d7e-066e-4097-898e-751b7521f102",
    "fullName": "Michalis Famelis",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in28320/",
    "expertise": [
      "Analyse de logiciels",
      "Conception de logiciels",
      "Génie logiciel empirique",
      "Ingénierie dirigée par les modèles",
      "Lignes des produits logiciels",
      "Méthodes formelles"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/12/"
  },
  {
    "id": "8d11db80-73d4-4547-ac2f-07168ca97e0e",
    "fullName": "Michel Boyer",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in18862/",
    "expertise": [
      "Calcul quantique",
      "Informatique théorique",
      "Protocole de distribution quantique de clés"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/5/"
  },
  {
    "id": "980d6de8-ae83-4151-80bd-336e586036f4",
    "fullName": "Michel Gendreau",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in18848/",
    "expertise": [
      "Recherche opérationnelle",
      "Transports",
      "Réseaux de transports",
      "Métaheuristique",
      "Optimistation des systèmes de transports",
      "Optimisation Stochastique",
      "Apprentissage automatique",
      "Logistique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/14/"
  },
  {
    "id": "25fe24fc-837a-4c1f-938a-5f2be0b76525",
    "fullName": "Mikhail Bessmeltsev",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30075/",
    "expertise": [
      "Reconstruction 3D à partir d'images",
      "Reconnaissance de formes",
      "Reconstruction des formes",
      "Géométrie combinatoire"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/4/"
  },
  {
    "id": "aef59e98-00a9-4b79-9b96-3f6ed040e72d",
    "fullName": "Miklós Csűrös",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14308/",
    "expertise": [
      "Bio-informatique",
      "Génomique évolutive",
      "Séquençage de génomes",
      "Modélisation",
      "Algorithmes génétiques"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/9/"
  },
  {
    "id": "8462fe35-0ea6-4f13-9208-830e591d1f2b",
    "fullName": "Nadia El-Mabrouk",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14341/",
    "expertise": [
      "Algorithmique",
      "Évolution (Biologie)",
      "Famille multigénique",
      "Bio-informatique",
      "Génomique comparative",
      "Optimisation combinatoire",
      "Réarrangement de génomes"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/12/"
  },
  {
    "id": "854b5dce-23ce-4334-9445-fa89b6df2790",
    "fullName": "Neil Frederick Stewart",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13893/",
    "expertise": [
      "Conception paramétrique",
      "Infographie",
      "Robustesse d'algorithmes",
      "Surfaces de subdivision",
      "Vision par ordinateur"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/32/"
  },
  {
    "id": "cb5e7ed1-d0ef-4139-bf22-c8f0ce7fbdbc",
    "fullName": "Nicolas Le Roux",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32585/",
    "expertise": [
      "Vision par ordinateur",
      "Apprentissage profond",
      "Apprentissage automatique",
      "Réseaux de neurones",
      "Modélisation",
      "Modèles statistiques"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/21/"
  },
  {
    "id": "211f2aa7-46ee-4d1a-91c7-9fc256ca6004",
    "fullName": "Pablo Samuel Castro",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35922/",
    "expertise": [
      "Apprentissage par renforcement",
      "Intelligence artificielle",
      "Comprendre et créer",
      "Apprentissage automatique",
      "Langages de programmation de haut niveau"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/7/"
  },
  {
    "id": "d71228ce-34c0-4db2-a5ed-17fadd208658",
    "fullName": "Pascal Vincent",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15603/",
    "expertise": [
      "Apprentissage automatique",
      "Apprentissage de représentations",
      "Apprentissage profond",
      "Intelligence artificielle",
      "Mégadonnées",
      "Modèles statistiques",
      "Reconnaissance de formes",
      "Réseaux de neurones",
      "Algorithmique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/35/"
  },
  {
    "id": "28cbd1c6-41ae-4e74-83e5-315c3055b602",
    "fullName": "Philippe Lamontagne",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35101/",
    "expertise": [
      "Cryptographie quantique",
      "Cryptographie",
      "Théorie de l'information quantique",
      "Informatique quantique",
      "Sécurité de l'information",
      "Calcul quantique",
      "Sécurité des systèmes d'information",
      "Sécurité informatique",
      "Sécurité des technologies de l'information et de la communication"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/19/"
  },
  {
    "id": "5c284d0c-f608-4dd1-b665-b6a5a8758fb5",
    "fullName": "Philippe Langlais",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14396/",
    "expertise": [
      "Alignement de séquences",
      "Apprentissage statistique",
      "Apprentissage analogique",
      "Traduction assistée par ordinateur",
      "Traitement automatique du langage naturel (TALN)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/20/"
  },
  {
    "id": "5e24b71d-6718-4d2f-9eeb-a54d3212d121",
    "fullName": "Pierre L'Écuyer",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14084/",
    "expertise": [
      "Centres d'appels",
      "Finances",
      "Générateur de nombres aléatoires",
      "Méthode de Monte-Carlo",
      "Méthode de quasi-Monte-Carlo",
      "Modélisation",
      "Optimisation Stochastique",
      "Réduction de la variance",
      "Simulation",
      "Simulation stochastique",
      "Systèmes d'information de gestion"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/19/"
  },
  {
    "id": "8e12156b-54e8-461a-b413-ba5b3d5dea16",
    "fullName": "Pierre McKenzie",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14154/",
    "expertise": [
      "Automates finis",
      "Circuits booléens",
      "Langage formel",
      "Logique",
      "Théorie de la complexité (informatique théorique)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/24/"
  },
  {
    "id": "9c212c47-2ef7-4262-93d3-9b68dc5592f5",
    "fullName": "Pierre Poulin",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13809/",
    "expertise": [
      "Animation par ordinateur",
      "Infographie",
      "Modélisation de l'éclairage",
      "Modélisation procédurale",
      "Phénomènes naturels",
      "Processeurs graphiques (GPU)",
      "Rendu",
      "Synthèse d'images"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/28/"
  },
  {
    "id": "de65dd0b-f6cb-42c5-8833-383239c494c6",
    "fullName": "Pierre Robert",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in22352/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/30/"
  },
  {
    "id": "dc2fcd35-3def-4616-94b0-8a08ff04bb2e",
    "fullName": "Pierre-Luc Bacon",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31636/",
    "expertise": [
      "Processus d'apprentissage",
      "Alignement de séquences",
      "Base de données temporelle"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/2/"
  },
  {
    "id": "5df8c307-076a-4368-a45b-aaa442c49073",
    "fullName": "Sanjay Dominik Jena",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35914/",
    "expertise": [
      "Planification",
      "Recherche opérationnelle",
      "Intelligence artificielle",
      "Optimisation mathématique",
      "Optimistation des systèmes de transports",
      "Systèmes de transport intelligent",
      "Transports"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/17/"
  },
  {
    "id": "61e49368-c23b-4711-8773-a1ef59c63fbe",
    "fullName": "Sarath Chandar Anbil Parthipan",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32539/",
    "expertise": [
      "Réseaux de neurones",
      "Apprentissage profond",
      "Traitement automatique du langage naturel (TALN)",
      "Intelligence artificielle"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/"
  },
  {
    "id": "bcd8476d-6812-4a11-a385-4c2156547542",
    "fullName": "Sébastien Roy",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14484/",
    "expertise": [
      "Vision par ordinateur",
      "Stéréoscopie",
      "Reconstruction 3D à partir d'images",
      "Capture de mouvements immersive",
      "Immersion (réalité virtuelle)"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/31/"
  },
  {
    "id": "27f06ad7-f071-484c-89a7-a79daabdad31",
    "fullName": "Stefan Monnier",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14751/",
    "expertise": [
      "Assistants de preuve",
      "Compilation",
      "Gestion de la mémoire",
      "Programmation fonctionnelle",
      "Système de types",
      "Types dépendants",
      "Sécurité informatique",
      "Langages de programmation fonctionnels"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/25/"
  },
  {
    "id": "d75eeb09-2899-478f-8552-87a5133eeb85",
    "fullName": "Sylvie Hamel",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14705/",
    "expertise": [
      "Analyse combinatoire",
      "Combinatoire des mots",
      "Génomique comparative",
      "Géométrie combinatoire",
      "Logique combinatoire",
      "Optimisation combinatoire",
      "Recherche de motifs biologiques",
      "Théorie combinatoire des ensembles",
      "Théorie combinatoire des groupes",
      "Théorie combinatoire des nombres",
      "Topologie combinatoire",
      "Séquençage de génomes"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/16/"
  },
  {
    "id": "9f294470-3c96-473b-98cb-5187bb0505f6",
    "fullName": "Teodor Gabriel Crainic",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in18847/",
    "expertise": [
      "Optimistation des systèmes de transports",
      "Logistique",
      "Recherche opérationnelle",
      "Réseaux de transports",
      "Transports",
      "Véhicules autonomes"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/9/"
  },
  {
    "id": "a902442f-82c0-4f65-bdf4-124574e0223e",
    "fullName": "Utsav Sadana",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35999/",
    "expertise": [
      "Optimisation mathématique",
      "Apprentissage automatique",
      "Théorie des jeux",
      "Robustesse d'algorithmes",
      "Apprentissage profond",
      "Sécurité informatique"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/31/"
  },
  {
    "id": "425803f3-66bc-43e4-97cd-949acd5326bc",
    "fullName": "Yoshua Bengio",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département d'informatique et de recherche opérationnelle",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13599/",
    "expertise": [
      "Apprentissage automatique",
      "Apprentissage de représentations",
      "Apprentissage profond",
      "Base de données temporelle",
      "Intelligence artificielle",
      "Modèles probabilistes",
      "Modèles statistiques",
      "Réseaux de neurones",
      "Vision par ordinateur",
      "Science des données",
      "Traitement automatique du langage naturel (TALN)",
      "Modélisation",
      "COVID19"
    ],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/3/"
  },
  {
    "id": "3732d336-8e6e-46d9-bf75-87978ec2e5c4",
    "fullName": "Ayla Rigouts Terryn",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de linguistique et de traduction",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37660/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "bf05e48b-432d-43ae-9c01-3036669dd694",
    "fullName": "Caroline Bem",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de littératures et de langues du monde",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37677/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "06af6221-d0f0-4c43-beae-42e31cc5dbcc",
    "fullName": "Katharina Clausius",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de littératures et de langues du monde",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31233/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "eb434054-02c9-4be7-b90c-5cdbaeb4f47d",
    "fullName": "Philippe Gagnon",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de mathématiques et de statistique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in21933/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "782d5107-bfa9-4719-b4d9-a9daf5681e29",
    "fullName": "Ahmad Hamdan",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de physique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29092/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "c4d5d568-1eb2-4fd5-93a6-c37bca0f5f87",
    "fullName": "Philippe St-Jean",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de physique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33038/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ee76d095-edd2-440a-baf2-f3c151158cb5",
    "fullName": "Audrey-Ann Deneault",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de psychologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36755/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "e30b0f8d-b948-466f-8ef3-c4f44de19b17",
    "fullName": "Diana Cárdenas Mesa",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de psychologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35423/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "47aed24b-a669-4b3b-852c-1db8f21099a1",
    "fullName": "Julie Laurin",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de psychologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in23730/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3a2821e1-6516-4979-8027-858c1bad30b2",
    "fullName": "Kabir Daljeet",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de psychologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32568/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4fe8e0aa-0e3b-45e2-b53b-4c3dd67f9ad3",
    "fullName": "Maxime Montembeault",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de psychologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36932/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3b93da3f-8562-46b0-87bb-2b885f4a03cd",
    "fullName": "Emily Ruth Larson",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de sciences biologiques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37784/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4ea2d068-1a81-4a1c-88ea-e59520a61e31",
    "fullName": "Marc Amyot",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de sciences biologiques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14694/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b1f3ec14-bcca-4798-a837-3caf3a696afb",
    "fullName": "Matthew Regan",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de sciences biologiques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32818/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "36db658e-9b51-48f3-ac2d-249338e3bc3d",
    "fullName": "Sophie Breton",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de sciences biologiques",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19401/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "d5a60b60-d0a7-4729-bfa1-cc16be5dffed",
    "fullName": "Éric Lacourse",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Département de sociologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14715/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4bc47522-8c0c-43ec-9c4b-2733855919d2",
    "fullName": "Nathalie Fontaine",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de criminologie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19193/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "7272d533-53a9-4aa8-bb2e-c578ae90b764",
    "fullName": "Linda S. Pagani",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de psychoéducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in13887/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "9b03b4ce-aaa5-4f87-b653-8f836f4c7193",
    "fullName": "Marie-Michèle Dufour",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de psychoéducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33037/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "82e05dd8-e10c-422a-814f-6b1700bb5e99",
    "fullName": "Sarah Dufour",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de psychoéducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in16026/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "9c21c855-435d-422a-b24c-80638039ac18",
    "fullName": "Valérie Hervieux",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de relations industrielles",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37685/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4da7e4f9-7499-4ad2-9789-0de827d743c2",
    "fullName": "Diahara Traoré",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de travail social",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37644/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3de4b130-9e90-437b-8c09-fcaf4d91f654",
    "fullName": "Dominique Gaulin",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de travail social",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38422/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5012ba30-588a-41ce-8c90-eb955a880d9a",
    "fullName": "Emmanuelle Khoury",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de travail social",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31998/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "399cca18-9f16-47f1-ba09-40292a2900cb",
    "fullName": "Isabelle Raffestin",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de travail social",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38423/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4cabef23-dce1-472f-89bb-09f3f3783a9d",
    "fullName": "Marie Dumollard",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de travail social",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35190/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "72e569b3-d5d5-4366-9361-dd8418daa3f6",
    "fullName": "Patrick Cloos",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de travail social",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19271/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3be19e6e-bc52-467d-9747-92a5f8b9efaa",
    "fullName": "Rossio Motta Ochoa",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "École de travail social",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35787/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "e0c000a0-e6d9-4a44-a7b3-a77d891e246b",
    "fullName": "Solange Lefebvre",
    "facultyName": "Faculté des arts et des sciences",
    "departmentName": "Institut d'études religieuses",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14123/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3844df8d-7806-4ae0-8601-20e21751fcc9",
    "fullName": "Alexandre Beaupré-Lavallée",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département d'administration et fondements de l'éducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19526/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b0b6db39-10db-4208-8d5c-e9994968a646",
    "fullName": "Bruce Maxwell",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département d'administration et fondements de l'éducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32080/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b71b1d7e-a6f4-48b0-884c-6c206444fe3f",
    "fullName": "Judicaël Alladatin",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département d'administration et fondements de l'éducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37540/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "cd490c7c-5da2-4985-a648-ac1591fd1693",
    "fullName": "Marie-Aimée Lamarche",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département d'administration et fondements de l'éducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in29744/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "76536e39-81fe-4f96-b0dc-0a52c5827718",
    "fullName": "Marie-Odile Magnan",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département d'administration et fondements de l'éducation",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in19363/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "23996e78-3bca-42f4-bf91-0c2c4a945046",
    "fullName": "Amélie Lemieux",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de didactique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32970/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "3ed165ce-d2c1-4695-82f3-2549e5180da3",
    "fullName": "Emma June Huebner",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de didactique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38575/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "7db42ebb-62e9-48b7-bee8-31937403d942",
    "fullName": "Geneviève Barabé",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de didactique",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35007/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "effc772c-f55b-4780-b3ab-ccf4900d14eb",
    "fullName": "Caterina Mamprin",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de psychopédagogie et d'andragogie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33110/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5594042d-fb53-4938-9b8b-4d987e955aba",
    "fullName": "Elizabeth Olivier",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de psychopédagogie et d'andragogie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in32905/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "8ea2948d-7859-4b2a-9cc5-607aa5716e1a",
    "fullName": "Élodie Marion",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de psychopédagogie et d'andragogie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in30233/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "95ef6015-c5de-4bc2-a07d-c85de36d78ff",
    "fullName": "Isabelle Vivegnis",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de psychopédagogie et d'andragogie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31996/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "4d2a1a01-8e9a-4eb1-b1d9-9f3effed554f",
    "fullName": "Rola Koubeissy",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de psychopédagogie et d'andragogie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in33106/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "752d5a28-97c9-406e-b7e8-f67ff2291f8e",
    "fullName": "Sarah Landry",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Département de psychopédagogie et d'andragogie",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in16845/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "48466ec0-45a7-4bb4-9db4-e073b98d60a3",
    "fullName": "Cecilia Borges",
    "facultyName": "Faculté des sciences de l'éducation",
    "departmentName": "Direction",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in16014/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "86d0e412-b989-4a41-b74a-94f873dcefb5",
    "fullName": "Alexandre Castonguay",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in35083/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "1d5ab74d-0b77-4fa8-8b59-cc4c38f9d36e",
    "fullName": "Anne Bourbonnais",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14988/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "14b622fd-e281-4faf-a300-389b45a54b60",
    "fullName": "Carmen-Édith Belleï-Rodriguez",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37676/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "55b0cdb8-9ae5-441e-bb07-e4121b504983",
    "fullName": "Christian Vincelette",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in38391/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "8ca16286-86c5-403a-83aa-603f4cbec607",
    "fullName": "Christine Genest",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in16084/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "05630eb1-4e72-4a0b-9b6f-0c17c889f78c",
    "fullName": "Dimitri Létourneau",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31799/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "7414220e-41b2-4856-8dc1-53e0f54ae62b",
    "fullName": "Émilie Dufour",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in37535/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2841a19b-ada4-4575-8581-f0bf8e2b4147",
    "fullName": "Etienne Paradis-Gagné",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in31955/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "5bb090e7-a488-4d9c-97bd-a93ccc1ff1a7",
    "fullName": "Marcela Ferrada",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in36914/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "a03801b0-9b3b-4809-8bd8-a82e724e73d9",
    "fullName": "Maria-Pilar Ramírez García",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in14881/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "ced0a4b7-1632-4884-a49e-e473be400326",
    "fullName": "Marie-Hélène Goulet",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in21652/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "2970b729-722f-47b3-b9d8-cb3a8e778394",
    "fullName": "Patrick Lavoie",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in21904/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "74c8673a-d49c-40fa-a9c5-4c78d7c40bf2",
    "fullName": "Tanya Mailhot",
    "facultyName": "Faculté des sciences infirmières",
    "departmentName": "Academic department",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in21798/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  },
  {
    "id": "b4f3e859-35f6-4f52-89ca-1fbfa9a1eff8",
    "fullName": "Luc Vinet",
    "facultyName": "IVADO",
    "departmentName": "Administration",
    "role": null,
    "email": null,
    "profileUrl": "https://recherche.umontreal.ca/chercheur/is/in15747/",
    "expertise": [],
    "sourceUrl": "https://recherche.umontreal.ca/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/"
  }
] as const;

function mapLocalFacultyRows(
  rows: readonly {
    id: string;
    fullName: string;
    facultyName: string;
    departmentName: string;
    role?: string | null;
    email?: string | null;
    profileUrl?: string | null;
    expertise: readonly string[];
    sourceUrl: string;
  }[],
  institutionName: string,
  aliases: readonly string[]
): FacultyDirectoryEntry[] {
  return rows.map((entry) => ({
    id: entry.id,
    fullName: entry.fullName,
    institutionName,
    institutionAliases: [...aliases],
    facultyName: entry.facultyName,
    departmentName: entry.departmentName,
    role: entry.role ?? undefined,
    email: entry.email ?? undefined,
    profileUrl: entry.profileUrl ?? undefined,
    expertise: [...entry.expertise],
    sourceUrl: entry.sourceUrl
  }));
}

export const localFacultyDirectory: FacultyDirectoryEntry[] = [
  ...mapLocalFacultyRows(udemRows, "Université de Montréal", udemAliases),
  ...mapLocalFacultyRows(ucDavisRows, "University of California, Davis", ucDavisAliases),
  ...mapLocalFacultyRows(mcmasterRows, "McMaster University", mcmasterAliases),
  ...mapLocalFacultyRows(uclaRows, "University of California, Los Angeles", uclaAliases),
  ...mapLocalFacultyRows(uscRows, "University of Southern California", uscAliases)
];
