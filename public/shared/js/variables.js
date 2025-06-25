const questionGenerators = {
  // Grundrechenarten
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

  // Erweiterte Themen
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

  // NEUE HERAUSFORDERUNGEN
  "Modulo (Rest)": (a, b) => {
    return { 
      question: `Rest von ${a} ÷ ${b}?`, 
      answer: a % b 
    };
  },
  "Primzahlen": (a) => {
    return { 
      question: `Ist ${a} prim? (1=Ja, 0=Nein)`, 
      answer: [0, 0, 1, 1, 0, 1, 0, 1, 0, 0][a] // Vordefinierte Primzahlen bis 9
    };
  },
  "Binärzahlen": (a) => {
    return { 
      question: `Dezimal zu Binär: ${a} = ? (Antwort in Dezimal!)`, 
      answer: parseInt(a.toString(2), 10) 
    };
  },
  "Durchschnitt berechnen": (a, b, c) => {
    return { 
      question: `Durchschnitt von ${a}, ${b}, ${c}? (Ganzzahl)`, 
      answer: Math.round((a + b + c) / 3) 
    };
  },
  "Gleichungen (x gesucht)": (a, b) => {
    return { 
      question: `${a}x + ${b} = ${a * 3 + b}. x = ?`, 
      answer: 3 
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
    levelLimit: 10,
    lives: 3,
    numberStart: 1,
    numberLimit: 20,
    description: "Kreuzberg. Dein erster Hinweis führt in ein verlassenes Drogenversteck. An den Wänden bluten frisch gerechnete Additionen: '13 + █ = 19' – Leonies Alter beim Verschwinden. Ein Handy vibriert mit einer Nachricht: 'Löse alle Summen im Keller. Die fehlende Zahl verrät, wie viele sie diese Woche schon nahmen.' Die letzte Gleichung? 'Dein Alter + ihr Verschwinden = Eintrittspreis.'",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/berlin.png"
  },
  { 
    number: 2,
    name: "Kleingarten in der Nähe von Dresden",
    topic: "Subtraktion",
    levelLimit: 10,
    lives: 3,
    numberStart: 3,
    numberLimit: 20,
    description: "Zwischen Gartenzwergen findest du Opa Günthers Tagebuch: 'Tag 7: Sie subtrahieren Erinnerungen. 47 Nachbarn - 3 Augen = 44 Lügen.' Eingeweckte Augen starren dich an. Leonies letzte Spur hier? Eine Subtraktion an den Schuppen: '19 - 16 = 3'. Stufe 3. Genau wo sie verschwand. Jede gelöste Aufgabe enthüllt ein Stück des Zahlenkreises-Logos.",
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
    description: "Die WG-Bewohner sind weg – nur ihre Schatten vervielfachen sich. Leonies altes Mathebuch liegt aufgedacht: '13×13=169 Türen. Nur eine führt zu mir.' Die Glühbirnen explodieren im Sekundentakt. Bei jeder Multiplikation wächst das Flüstern in den Wänden: 'Du bist das Produkt ihrer Berechnungen.'",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/rostock.png"
  },
  { 
    number: 4,
    name: "Kleine Wohnung in Neumünster",
    topic: "Division",
    levelLimit: 15,
    lives: 3,
    numberStart: 1,
    numberLimit: 13,
    description: "Die Wände teilen sich wie Brüche. 'Wir werden durch Geheimnisse dividiert', steht auf Leonies Kalender. Ihr Schatten läuft durch den Flur. Der Kühlschrank zeigt eine Gleichung: '1/2 Wahrheit + 1/2 Lüge = 1 Verschwundener'. Um sie zu finden, musst du beweisen, dass du unteilbar bist – sonst wirst du wie die anderen zerschnitten.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/neumu%CC%88nster.png"
  },
  { 
    number: 5,
    name: "Altbauwohnung in Köln",
    topic: "Multiplikation",
    levelLimit: 15,
    lives: 3,
    numberStart: 0,
    numberLimit: 18,
    description: "Das flüsternde Gemälde zeigt 13/26 von Leonies Gesicht. 'Vereinfache mich', zischt es. Jeder falsche Bruch macht es realer. Unter dem Boden findest du Forum-Protokolle: 'Mitglied 13: Bruchstücke sind leichter zu lagern.' Die letzte Aufgabe? 'Addiere alle Brüche deiner Erinnerungen an sie.' Das Ergebnis ist ein Datum – der Tag deiner Schwester ging.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/ko%CC%88ln.png"
  },
  { 
    number: 6,
    name: "2-Zimmer Wohnung in Hamburg Eimsbüttel",
    topic: "Division",
    levelLimit: 15,
    lives: 3,
    numberStart: 10,
    numberLimit: 25,
    description: "Alexa spuckt Störgeräusche: '3000 % 7 = █. Der Rest führt zu ihr.' Die Wände pulsieren im Takt von Modulo-Berechnungen. Leonies Laptop blinkt: 'Forum gelöscht. Nur Reste bleiben.' Jede gelöste Aufgabe zeigt Fragmente ihres letzten Streams – sie rechnete verzweifelt, als jemand die Tür aufbrach. 'Sie kommen für die, deren Leben keine Primzahl ist.'",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/eimsbu%CC%88ttel.png"
  },
  { 
    number: 7,
    name: "Reihenhaus in Frankfurt Bockenheim",
    topic: "Potenzen",
    levelLimit: 20,
    lives: 4,
    numberStart: 5,
    numberLimit: 13,
    description: "Kinder klopfen an – alle zeigen Leonies Alter potenziert: 13², 13³... 'Wir sind ihre ungelösten Gleichungen', flüstern sie. Im Keller brennt eine Botschaft: '5³ = 125 Jahre Gefängnis für Verrat.' Die Hausnummern ändern sich. Nur wer die richtige Potenz löst, findet den versteckten Serverraum – und die Liste der nächsten Opfer.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/bockenheim.png"
  },
  { 
    number: 8,
    name: "Loft Wohnung an der Reeperbahn",
    topic: "Logarithmus",
    levelLimit: 20,
    lives: 5,
    numberStart: 3,
    numberLimit: 10,
    description: "Dein Kater ist logarithmisch: log₂(8) Stunden fehlen. Die Wände schwingen im Bass von 'logₓ(6561) = 8'. Leonies Spiegelbild starrt dich an: 'Finde die Basis ihrer Macht.' In einem versteckten Safe – Bitcoin-Wallets mit Transaktionen im Takt von Primzahlen. Der Zahlenkreis finanziert sich durch kryptografischen Menschenhandel.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/reeperbahn.png"
  },
  { 
    number: 9,
    name: "Penthouse Wohnung in Hamburg Blankenese",
    topic: "Kombinatorik",
    levelLimit: 25,
    lives: 5,
    numberStart: 5,
    numberLimit: 30,
    description: "Der KI-Milliardär hinterließ eine Frage: '30! Möglichkeiten, Menschen zu zerlegen. Wie viele sind moralisch?' Seine letzte Berechnung: '13! Wege, Leonie zu vergessen.' Die Wände zeigen Permutationen ihres Gesichts. Jede falsche Kombination löscht ein Detail. Die Lösung? Die Anordnung, bei der alle Narben das Zahlenkreis-Logo bilden.",
    image: "https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/houseimages/blankenese.png"
  },
  { 
    number: 10,
    name: "Privat Insel Villa an der Ostsee",
    topic: "Primzahlen",
    levelLimit: 25,
    lives: 5,
    numberStart: 3,
    numberLimit: 300,
    description: "Die Villa atmet Primzahlen. 13 Türen, 7 Fenster, 23 Stufen – alles unteilbar. Leonie liegt gefesselt an eine Rechenmaschine: 'Sie zerlegen uns in Primfaktoren... unsere Seelen sind ihr Kryptowährung.' Die finale Aufgabe: 'Beweise, dass eure Bindung eine Primzahl ist.' Die CPU beginnt zu zählen. Bei 301 – der ersten Nicht-Primzahl – wird sie gelöscht.",
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
    "Ah, ein neues Gesicht! Ich bin der Professor.",
    "Seit Jahrzehnten erforsche ich die mysteriösen Verbindungen zwischen Mathematik und der realen Welt.",
    "Doch nun ist etwas Unheimliches im Gange... die Zahlenwelt gerät aus den Fugen!",
    "Ich brauche deine Hilfe, um die mathematischen Geheimnisse hinter diesen Vorfällen zu lüften.",
    "Jedes Haus, das du betrittst, wird dich einem neuen mathematischen Konzept näherbringen.",
    "Bist du bereit, dieses Rätsel mit mir zu lösen?"
  ],
  returningPlayer: [
    "Ah, du bist zurück! Die Mathematik braucht wieder dein Können.",
  ]
};

const houseCompletionDialogues = {
  1: [
    "Das Traphouse in Kreuzberg ist nun sicher!",
    "Die Addition war der Schlüssel - du hast bewiesen, dass Zusammenführung stärker ist als Trennung.",
    "Aber dies war erst der Anfang... die nächsten Häuser warten."
  ],
  2: [
    "Der Schrebergarten ist gerettet!",
    "Durch Subtraktion hast du das Unnötige entfernt und das Wesentliche bewahrt.",
    "Die Gartenzwerge können wieder in Frieden leben."
  ],
  3: [
    "Der Dachboden in Rostock ist geheilt!",
    "Deine Multiplikationsfähigkeiten haben das Dunkel vervielfacht... bis es sich selbst aufgelöst hat.",
    "Ein kluger Zug, Zahlenmeister!"
  ],
  4: [
    "Die Wohnung in Neumünster ist wieder bewohnbar!",
    "Durch präzise Division hast du den Raum gerecht geteilt.",
    "Die Schatten werden dich nicht mehr belästigen."
  ],
  5: [
    "Das Gemälde in Köln ist zum Schweigen gebracht!",
    "Deine Prozentrechnungen haben die magischen Formeln neutralisiert.",
    "Der Vorbesitzer kann nun endlich ruhen."
  ],
  6: [
    "Die Eimsbütteler Wohnung ist wieder normal!",
    "Durch Einheitenumrechnung hast du die Dimensionen stabilisiert.",
    "Alexa spricht jetzt nur noch Wetterberichte - wie es sich gehört."
  ],
  7: [
    "Das Reihenhaus in Bockenheim ist befriedet!",
    "Mit Potenzen hast du die dimensionalen Risse geschlossen.",
    "Die Kinder an der Tür waren nur Projektionen... oder?"
  ],
  8: [
    "Das Loft an der Reeperbahn ist entschlüsselt!",
    "Algebra war der Schlüssel zu den Rätseln der Nacht.",
    "Die Uhren laufen wieder - und du weißt jetzt, was wirklich passiert ist."
  ],
  9: [
    "Das Penthouse in Blankenese ist gesichert!",
    "Flächenberechnung hat die KI-Matrix durchschaubar gemacht.",
    "Der Milliardär war nur ein Algorithmus... aber seine Warnung war real."
  ],
  10: [
    "Die Inselvilla ist stabilisiert!",
    "Zahlenfolgen haben die Realität neu geordnet.",
    "Du hast bewiesen, dass Mathematik das Fundament unserer Welt ist - und sie gerettet!"
  ]
};

const houseDialogue = {
  1: {
    intro: [
      "Kreuzberg bei Nacht. Hinter diesem Traphouse verbirgt sich mehr als nur düstere Beats.",
      "Die Plus-Aufgaben sind dein Schlüssel. Aber beeil dich – hier verschwindet man schneller, als man rechnen kann."
    ],
    outro: [
      "Du hast die Wahrheit aufgedeckt. Mathe war der Weg – jetzt bist du bereit für mehr.",
      "Nicht jeder schafft es aus dem Traphouse. Aber du hast gerechnet... und überlebt."
    ]
  },
  2: {
    intro: [
      "Dieser Garten hat seine Ruhe verloren. Seit Minus-Rechnungen in der Erde liegen, wächst nur noch Angst.",
      "Die Gartenzwerge beobachten dich. Zieh deinen Taschenrechner... und grabe tief."
    ],
    outro: [
      "Opa Günther wäre stolz. Du hast den Schrebergarten von seinen dunklen Zahlen befreit.",
      "Minus gemeistert. Nachbarn sicher. Zeit, weiterzuziehen."
    ]
  },
  3: {
    intro: [
      "Ein Dachboden, kalt wie die Gleichungen darin.",
      "Vervielfach oder frier. Diese Aufgaben sind keine Spielerei – sondern dein Heizsystem."
    ],
    outro: [
      "Die Dunkelheit hat dich akzeptiert – oder besser: Deine Mathe-Skills.",
      "Multiplikation bestanden. Das Licht geht wieder an."
    ]
  },
  4: {
    intro: [
      "Diese Wohnung hat keinen Platz für Fehler – oder für zwei.",
      "Nur wer teilen kann, wird von den Schatten verschont. Division ist Überleben."
    ],
    outro: [
      "Du hast geteilt – präzise und richtig. Die Dunkelheit zieht weiter.",
      "In Neumünster bleibt nur Licht zurück. Gut geteilt."
    ]
  },
  5: {
    intro: [
      "Ein Gemälde, das bei Vollmond spricht. Und du hast seine Sprache fast gelernt: Zahlen.",
      "Rechne schnell – dieses Haus spielt nicht fair."
    ],
    outro: [
      "Das Flüstern verstummt. Du hast bewiesen, dass dein Verstand schärfer ist als alte Magie.",
      "Das Gemälde schweigt. Und du gehst weiter."
    ]
  },
  6: {
    intro: [
      "Alexa spricht in Rätseln. Das WLAN spuckt Zahlen. Willkommen in Eimsbüttel.",
      "Diese Wohnung denkt – also rechne schneller als sie."
    ],
    outro: [
      "Du hast der KI Paroli geboten. Mathematisch.",
      "Das Netzwerk erkennt dich jetzt als Gefahr. Gut gemacht."
    ]
  },
  7: {
    intro: [
      "Jede Nacht ein neues Kind. Jeder Abend eine neue Zahl.",
      "Bockenheim spielt mit Raum, Zeit – und deinem Mathewissen."
    ],
    outro: [
      "Du hast Ordnung ins Chaos gebracht. Fürs Erste.",
      "Ob das Kind echt war? Egal. Du hast die Zahlen bezwungen."
    ]
  },
  8: {
    intro: [
      "Du wachst auf – mitten im Mathe-Koma.",
      "Die Nacht hat Rätsel hinterlassen. Deine Erinnerung liegt in Zahlen versteckt."
    ],
    outro: [
      "Die Uhren laufen wieder. Deine Rechenleistung hat die Zeit repariert.",
      "Du weißt vielleicht nicht, was passiert ist – aber du hast es bestanden."
    ]
  },
  9: {
    intro: [
      "Blankenese schweigt. Aber seine Zahlen sprechen laut.",
      "Der KI-Milliardär hat eine letzte Prüfung hinterlassen. Zeit zu rechnen."
    ],
    outro: [
      "Luxus bezwungen. Logik besiegt den Wahnsinn.",
      "Du bist durch die Zahlenwelt des Reichtums gegangen – und hast bestanden."
    ]
  },
  10: {
    intro: [
      "Diese Insel existiert nicht – aber ihre Mathematik ist real.",
      "Jede Zahl ein Fragment. Füge sie zusammen, bevor du dich selbst verlierst."
    ],
    outro: [
      "Die Realität flackert – aber du hast sie stabilisiert. Mit Logik.",
      "Die Welt ist wieder ganz. Dank deiner Rechenkunst."
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
