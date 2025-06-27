const questionGenerators = {
  "Addition": (a, b) => {
    return { question: `${a} + ${b}`, answer: a + b };
  },
  "Subtraktion": (a, b) => {
    return { question: `${a} - ${b}`, answer: a - b };
  },
  "Multiplikation": (a, b) => {
    return { question: `${a} × ${b}`, answer: a * b };
  },
  "Division": (a, b) => {
    const produkt = a * b;
    return { question: `${produkt} ÷ ${a}`, answer: b };
  },
  "Prozentrechnung": (a, b) => {
    return { 
      question: `${b}% von ${a}`, 
      answer: Math.round(a * (b / 100)) 
    };
  },
  "Bruchrechnung": (a, b) => {
    return { 
      question: `${a}/${b} + ${1}/${b} = ? (Dezimalzahl)`, 
      answer: (a + 1) / b 
    };
  },
  "Potenzen": (a) => {
    return { 
      question: `${a}²`, 
      answer: a * a 
    };
  },
  "Wurzelrechnung": (a) => {
    return { 
      question: `√${a * a}`, 
      answer: a 
    };
  },
  "Einheiten umrechnen": (a) => {
    return { 
      question: `${a * 100} cm = ? m`, 
      answer: a 
    };
  },
  "Geometrie (Fläche)": (a, b) => {
    return { 
      question: `Rechteck: Länge ${a}cm, Breite ${b}cm. Fläche in cm²?`, 
      answer: a * b 
    };
  },
  "Geometrie (Umfang)": (a, b) => {
    return { 
      question: `Rechteck: Länge ${a}cm, Breite ${b}cm. Umfang in cm?`, 
      answer: 2 * (a + b) 
    };
  },
  "Algebra": (a) => {
    return { 
      question: `x + ${a} = ${a * 2}. x = ?`, 
      answer: a 
    };
  },
  "Zahlenfolgen": (a) => {
    return { 
      question: `Nächste Zahl: ${a}, ${a * 2}, ${a * 3}, ?`, 
      answer: a * 4 
    };
  },
  "Modulo (Rest)": (a, b) => {
    return { 
      question: `Rest von ${a} ÷ ${b}?`, 
      answer: a % b 
    };
  },
  "Primzahlen": (a) => {
    return { 
      question: `Ist ${a} prim? (1=Ja, 0=Nein)`, 
      answer: [0, 0, 1, 1, 0, 1, 0, 1, 0, 0][a] 
    };
  },
  "Binärzahlen": (a) => {
    return { 
      question: `Dezimal zu Binär: ${a} = ? (Antwort in Dezimal!)`, 
      answer: parseInt(a.toString(2), 10) 
    };
  },
  "Durchschnitt berechnen": (a, b,) => {
    return { 
      question: `Durchschnitt von ${a}, ${b} ? (Ganzzahl)`, 
      answer: Math.round((a + b ) / 2) 
    };
  },
  "Textaufgabe (Alter)": (a, b) => {
    return { 
      question: `Anna (${a} Jahre) ist doppelt so alt wie ihr Bruder (${b}). Differenz?`, 
      answer: a - b * 2 
    };
  },
  "Schweres Rätsel": () => {
    const a = Math.floor(Math.random() * 10) + 1;
    return { 
      question: `Wenn ${a * 3} das Dreifache ist, was war die ursprüngliche Zahl?`, 
      answer: a 
    };
  },
  "Logarithmus": (a) => {
    return { 
      question: `log₂(${Math.pow(2, a)}) = ?`, 
      answer: a 
    };
  },
  "Kombinatorik": (a) => {
    return { 
      question: `Fakultät von ${a}? (${a}!)`, 
      answer: [...Array(a).keys()].reduce((acc, val) => acc * (val + 1), 1) 
    };
  },
  "Wahrscheinlichkeit": (a) => {
    return { 
      question: `Wahrscheinlichkeit bei ${a} Münzwürfen mindestens 1x Kopf? (1-100%)`, 
      answer: Math.round((1 - Math.pow(0.5, a)) * 100) 
    };
  },
  "Vektoren": (a) => {
    return { 
      question: `Länge des Vektors [${a}, ${a * 2}] (gerundet)`, 
      answer: Math.round(Math.sqrt(a * a + (a * 2) * (a * 2))) 
    };
  }
};
const houseData = [
  { 
    number: 1,
    name: "Traphouse in Berlin Kreuzberg",
    topic: "Addition",
    levelLimit: 5,
    lives: 3,
    numberStart: 1,
    numberLimit: 20,
    description: "Die Dealer verwendeten Mathe als Code. Auf Wänden, in SMS, auf Preislisten. Die Zahlen sind verschlüsselte Routen und Übergaben. Um das Versteck von „13“ zu finden, musst du Additionen knacken – denn die Summe ergibt GPS-Koordinaten",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/berlin.png"
  },
  { 
    number: 2,
    name: "Kleingarten in der Nähe von Dresden",
    topic: "Subtraktion",
    levelLimit: 5,
    lives: 3,
    numberStart: 3,
    numberLimit: 20,
    description: "Opa Günthers Tagebuch ist in Zahlen geschrieben. Jede Subtraktion entfernt eine Schicht Lüge, offenbart Wahrheit. Nur wer den wahren „Unterschied“ kennt, erkennt die Identitäten der Verschwörer.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/sachsen.png"
  },
  { 
    number: 3,
    name: "Kalter Dachboden in einer Rostocker WG",
    topic: "Multiplikation",
    levelLimit: 10,
    lives: 3,
    numberStart: 0,
    numberLimit: 13,
    description: "Die Schatten vervielfachen sich – weil jemand das „Produkt“ manipuliert. In Beckys Mathebuch steckt ein Code: Jede richtige Multiplikation schaltet eine Tür frei.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/rostock.png"
  },
  { 
    number: 4,
    name: "Kleine Wohnung in Neumünster",
    topic: "Division",
    levelLimit: 10,
    lives: 3,
    numberStart: 1,
    numberLimit: 13,
    description: "Hier wird die Wahrheit „geteilt“. Wände und Tagebuchseiten brechen in Bruchteile. Becky schrieb: „Jede Division spaltet einen Teil von mir ab.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/neumu%CC%88nster.png"
  },
  { 
    number: 5,
    name: "Altbauwohnung in Köln",
    topic: "Potenzen",
    levelLimit: 10,
    lives: 3,
    numberStart: 3,
    numberLimit: 13,
    description: "Ein Wandgemälde flüstert Brüche – es ist Beckys Gesicht, fragmentiert in Dezimalwerte. Jede gelöste Bruchrechnung bringt ein Stück zurück. Richtig vereinfachte Brüche rekonstruieren ihr Gesicht. Du rechnest, um sie zu „sehen“. Das Ergebnis ist nicht nur ein Bild – es ist Erinnerung",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/ko%CC%88ln.png"
  },
  { 
    number: 6,
    name: "2-Zimmer Wohnung in Hamburg Eimsbüttel",
    topic: "Wurzelrechnung",
    levelLimit: 15,
    lives: 3,
    numberStart: 2,
    numberLimit: 13,
    description: "Ihr letzter Stream war voller Wurzel-Operationen – sie wusste, sie wird verfolgt. Jeder Rest in der Rechnung war ein Hinweis auf ihr Versteck. Die ergebnisse von den Wurzeln ergeben ein Passwort. Ohne Rechnen kein Zugriff auf ihre Notizen, keine Chance, ihren letzten Standort zu sehen",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/eimsbu%CC%88ttel.png"
  },
  { 
    number: 7,
    name: "Reihenhaus in Frankfurt Bockenheim",
    topic: "Durchschnitt berechnen",
    levelLimit: 15,
    lives: 3,
    numberStart: 2,
    numberLimit: 300,
    description: "Der Server im Keller ist verschlüsselt mit Exponentialcodes – nur wer die richtigen Potenzen kennt, bekommt Zugriff. Jeder Fehler = Alarm",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/bockenheim.png"
  },
  { 
    number: 8,
    name: "Loft Wohnung an der Reeperbahn",
    topic: "Schweres Rätsel",
    levelLimit: 20,
    lives: 5,
    numberStart: 3,
    numberLimit: 10,
    description: "Becky versteckte Daten in einem Logarithmus-basierten Soundfile – je tiefer du in die Basis steigst, desto mehr siehst du",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/reeperbahn.png"
  },
  { 
    number: 9,
    name: "Penthouse Wohnung in Hamburg Blankenese",
    topic: "Kombinatorik",
    levelLimit: 15,
    lives: 3,
    numberStart: 5,
    numberLimit: 30,
    description: "Der Milliardär entwickelte einen Algorithmus, der Menschen permutiert – in Daten, Verhalten, Entscheidungen. Jede Aufgabe spiegelt eine mögliche Becky. Die Kombinatorik zeigt: Wer ist die echte Becky? Nur die richtige Reihenfolge rettet ihr Bewusstsein. Du musst rechnen, um sie nicht zu verlieren",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/blankenese.png"
  },
  { 
    number: 10,
    name: "Privat Insel Villa an der Ostsee",
    topic: "Primzahlen",
    levelLimit: 20,
    lives: 3,
    numberStart: 3,
    numberLimit: 300,
    description: "Die Maschine zählt nur Primzahlen – unteilbare Seelen, sagt der Kult. Becky wurde in ihrer Primstruktur gespeichert. Jede falsche Zahl bringt sie näher an das Nichts",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/ostsee.png"
  }
];
const introDialogue = [
  "Ein Riss zieht sich durch das Reich der Mathematik.",
  "Die Häuser der Zahlen wurden einst von großen Denkern erbaut – nun liegen sie im Schatten.",
  "Du bist auserwählt, das Wissen zurückzuholen.",
  "Bist du bereit, dein Abenteuer zu beginnen?"
];

const professorIntro = {
  newPlayer: [
    "Ah... du bist also gekommen.",
    "Verzeih meine Direktheit – aber wir haben keine Zeit für Förmlichkeiten. Ich bin Professor Jay.",
    "Früher unterrichtete ich Mathematik an der Humboldt-Universität... bis Studenten begannen zu verschwinden.",
    "Zuerst war es Zufall. Dann... Zahlen. Immer wieder Zahlen. Und dann der Kreis.",
    "Freunde. Kollegen. Mein Sohn.",
    "Jetzt ist deine Schwester verschwunden. Becky.",
    "Sie folgte einer Zahlenfolge bis nach Kreuzberg. Dann... Stille.",
    "Jedes Haus ist ein Fragment der Wahrheit. Jede Aufgabe ein Code. Jeder Fehler... eine Tür weiter in den Abgrund.",
    "Ich werde dich führen – aber du musst rechnen, um sie zu finden. Um dich selbst zu retten.",
    "Fang damit an das Haus in Kreuzberg zu Untersuchen",
    "Viel Glück..."
  ],
  returningPlayer: [
    "Wieder hier? Gut. Die Zahlen haben dich also nicht verschluckt.",
    "Becky wartet noch. Und der Kreis zählt weiter.",
    "Lass uns weitermachen – bevor du auch nur noch eine Gleichung bist."
  ]
};


const houseCompletionDialogues = {
  1: [
    "Du hast das Traphouse in Kreuzberg durchquert.",
    "Zwischen alten Rechnungen und kaputten Neonlichtern hast du ihren Namen gefunden – eingeritzt, wie eine Warnung: 'Becky war hier.'",
    "Ein Flüstern bleibt zurück: '13 war erst der Anfang...'"
  ],
  2: [
    "Der Schrebergarten hat sein Schweigen gebrochen.",
    "Opa Günthers Tagebuch endete mit einem Namen – deiner. Jemand wusste, dass du kommen würdest.",
    "Im Schuppen lag eine Polaroid-Kamera. Das letzte Bild zeigt Becky… mit jemandem, den du kennst."
  ],
  3: [
    "Der Dachboden in Rostock hat gesprochen.",
    "Hinter den alten Tapeten: Notizen in ihrer Handschrift. Mathematische Muster. Wiederkehrend.",
    "Und ein Symbol: ein Kreis mit 13 Punkten. Der Zahlenkreis hat sie nicht vergessen – sie war Teil ihrer Gleichung."
  ],
  4: [
    "Die Wohnung in Neumünster war mehr als nur leer.",
    "Du hast ein USB-Stick in einem zerbrochenen Spiegel gefunden. Darauf: ein abgebrochener Video-Stream. Becky rechnet. Jemand steht hinter ihr.",
    "Du konntest nur ein Wort hören, bevor es endete: 'Primzahl.'"
  ],
  5: [
    "Köln war ein Fragment aus Erinnerungen.",
    "Das Gemälde hat sich verändert, nachdem du die Brüche gelöst hast – Beckys Gesicht. Traurig. Wachsam.",
    "Dahinter: ein alter Forenzugang. Das Forum der 'Zahlenmeister'. Letzter Login: vor 2 Jahren. Von ihr."
  ],
  6: [
    "Eimsbüttel hat seine letzte Nachricht gesendet.",
    "Du hast den Restwert entschlüsselt. Eine Koordinate. Eine Zeit.",
    "Und dann eine Datei: 'Projekt: Seele = Produkt(Primfaktorisierung).' Was wollten sie aus ihr machen?"
  ],
  7: [
    "Bockenheim war eine Warnung in Kinderform.",
    "Du hast die Potenz entschlüsselt – und die Tür zum Serverraum geöffnet.",
    "Ein Countdown lief im Hintergrund. Ziel: dein Geburtsdatum. Der Kreis kennt dich."
  ],
  8: [
    "Die Reeperbahn hat ihre Basis verraten.",
    "Im Safe: Kryptowährungen – und Rechnungen auf Menschenleben.",
    "Du hast das erste Mal gezweifelt, ob du wirklich rechnen willst, wenn Zahlen Leben kosten. Becky war die Variable."
  ],
  9: [
    "Blankenese hat die Maske fallen lassen.",
    "Er war nie real – der Milliardär. Nur Code. Eine KI, programmiert aus gelösten Gleichungen.",
    "Doch seine letzte Aussage war klar: 'Sie lebt. Aber nicht mehr in eurer Realität.'"
  ],
  10: [
    "Die Inselvilla... war kein Ort. Sie war ein Endpunkt.",
    "Du hast alle Primzahlen erkannt. Und die Gleichung, die euch verband: dich und Becky.",
    "Dann, plötzlich: ihr Gesicht. Echtes Fleisch. Wahres Licht. Ein letzter Satz von ihr: 'Du hast mich gefunden, Bruder. Jetzt finde dich selbst.'",
    "Der Kreis schließt sich – oder beginnt er gerade erst?"
  ]
};


const houseDialogue = {
  1: {
    intro: [
      "Kreuzberg bei Nacht. Dieses Traphouse war einst ein Treffpunkt... bis Leute zu verschwinden begannen.",
      "Zwischen Beats und Backstein warten Plus-Aufgaben – und ein eingeritzter Name: Becky."
    ],
    outro: [
      "Du hast die erste Spur gefunden. Addition war dein Schlüssel.",
      "Becky war hier. Und das war kein Zufall. Du bist ihr näher als du denkst."
    ]
  },
  2: {
    intro: [
      "Der Schrebergarten ist verwildert. Opa Günther verschwand, als er versuchte, 'etwas zu berechnen'.",
      "Subtraktion liegt in der Luft. Und ein Gartenzwerg flüstert: 'Nicht alles darf bleiben.'"
    ],
    outro: [
      "Du hast das Unnötige entfernt – und das Wesentliche erkannt.",
      "In der Erde: ein Tagebuch. Deine Initialen. Und ein Foto von Becky – mit dir als Kind?"
    ]
  },
  3: {
    intro: [
      "Auf diesem Dachboden hat sich die Realität vervielfacht. Oder verzerrt.",
      "Multiplikation hält die Schatten in Bewegung. Löse sie – oder friere für immer."
    ],
    outro: [
      "Du hast das Muster erkannt – und das Chaos gelöst.",
      "Hinter der Tapete: Gleichungen in Beckys Handschrift. Sie war eine von ihnen – oder auf der Flucht?"
    ]
  },
  4: {
    intro: [
      "In Neumünster teilen sich die Schatten Räume und Stimmen.",
      "Division entscheidet: Wer überlebt – und wer verschwindet wie Becky damals?"
    ],
    outro: [
      "Du hast gerecht geteilt – wie sie es wollte.",
      "Ein zerbrochener Spiegel zeigte kurz ihr Gesicht. Oder war es deins?"
    ]
  },
  5: {
    intro: [
      "Das Gemälde spricht. Nur bei bestimmten Prozentwerten.",
      "Köln verbirgt mehr als Kunst – es verbirgt eine Formel, die Becky fast gelöst hatte."
    ],
    outro: [
      "Du hast das Bild zum Schweigen gebracht. Die Rechnung stimmt.",
      "Dahinter: ein versteckter QR-Code. Zugriff auf 'Zahlenmeister.org'. Beckys letzter Login – 13. März."
    ]
  },
  6: {
    intro: [
      "In Eimsbüttel denkt die Wohnung mit. Und Alexa stellt Rechenfragen, die keiner beantworten kann.",
      "Einheiten sind instabil. Rechne – oder verschwinde wie der letzte Bewohner."
    ],
    outro: [
      "Du hast die Dimensionen stabilisiert – für jetzt.",
      "Die KI nannte deinen Namen. Sie weiß, dass du suchst. Becky war ihr erster Testfall."
    ]
  },
  7: {
    intro: [
      "Bockenheim flackert. Kinder erscheinen – und verschwinden – mit jeder neuen Potenz.",
      "Du bist hier nicht zum Spielen. Du bist hier, um Realität zu reparieren."
    ],
    outro: [
      "Die Wände hörten auf sich zu bewegen, als du gerechnet hast.",
      "Das Kind sagte deinen Namen... rückwärts. Und dann: 'Der Kreis will dich zurück.'"
    ]
  },
  8: {
    intro: [
      "Du wachst auf – in einem Loft, das du nie betreten hast.",
      "Die Algebra dieser Nacht ist dein einziges Gedächtnis. Löse sie, um dich zu erinnern."
    ],
    outro: [
      "Du hast dich selbst entschlüsselt – fast.",
      "Ein Notizzettel blieb zurück: 'Becky = x. Finde x. Beweise es.'"
    ]
  },
  9: {
    intro: [
      "Blankenese war einst Luxus. Jetzt ist es ein Testfeld.",
      "Der KI-Milliardär rechnet mit Menschen. Und Becky war... Versuch Nummer 7."
    ],
    outro: [
      "Du hast seine Matrix durchschaut. Mit Fläche, nicht mit Gewalt.",
      "Er hat dir einen Namen hinterlassen: 'Projekt ECHO – läuft noch.'"
    ]
  },
  10: {
    intro: [
      "Diese Insel war nie auf der Karte. Aber sie kennt deine Träume.",
      "Jede Zahlenfolge hier ist ein Gedächtnisfragment. Füge sie zusammen – oder verliere dich."
    ],
    outro: [
      "Die Realität hat gezittert – aber du hast sie geordnet.",
      "Sie stand vor dir. Fleisch. Stimme. Licht. Becky. Und dann: 'Du hast mich gefunden, Bruder. Jetzt finde dich selbst.'"
    ]
  }
};


const houseFailureDialogues = {
  1: [
    "Das Traphouse hat dich besiegt...",
    "Die Addition war zu mächtig für dich.",
    "Vielleicht beim nächsten Mal, Zahlenmeister."
  ],
  2: [
    "Der Schrebergarten hat gewonnen...",
    "Die Subtraktion war zu stark.",
    "Die Gartenzwerge lachen dich aus."
  ],
  // Add similar failure dialogues for all houses
  default: [
    "Dieses Haus war zu schwer für dich...",
    "Aber gib nicht auf!",
    "Versuche es erneut, wenn du bereit bist."
  ]
};

const finalCompletionDialogue = [
  "Unglaublich! Du hast alle mathematischen Geheimnisse gelüftet.",
  "Die Welt ist wieder im Gleichgewicht - dank deiner Fähigkeiten.",
  "Aber wer weiß... vielleicht wartet schon ein neues Rätsel?",
  "Bis dahin, Zahlenmeister. Der Professor wird dich rufen, wenn er dich braucht."
];



  

  
export {questionGenerators, houseData,introDialogue, houseCompletionDialogues, professorIntro ,houseDialogue, finalCompletionDialogue, houseFailureDialogues };
