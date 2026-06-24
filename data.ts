// Data and translations for Spanish Imperative practice
// Includes Armenian translations and dynamic sentence transformation exercises

export interface SentenceItem {
  id: string;
  original: string; // normal Spanish sentence
  imperative: string; // correct imperative Spanish sentence
  armenian: string; // Armenian translation
  category: 'affirmative' | 'negative' | 'irregular' | 'reflexive' | 'exercise';
  explanation?: string;
}

export interface ConjugationTable {
  verb: string;
  translation: string;
  type: '-ar' | '-er' | '-ir';
  regular: boolean;
  forms: {
    affirmative: {
      tu: string;
      usted: string;
      nosotros: string;
      vosotros: string;
      ustedes: string;
    };
    negative: {
      tu: string;
      usted: string;
      nosotros: string;
      vosotros: string;
      ustedes: string;
    };
  };
}

export interface IrregularException {
  verb: string;
  translationArmenian: string;
  affirmativeTu: string;
  negativeTu: string;
  completeAffirmative: {
    tu: string;
    vosotros: string;
    usted: string;
    ustedes: string;
    nosotros: string;
  };
  completeNegative: {
    tu: string;
    vosotros: string;
    usted: string;
    ustedes: string;
    nosotros: string;
  };
  note: string;
}

export interface DialogueItem {
  context: string;
  contextArm: string;
  lines: {
    speaker: string;
    text: string; // e.g. "¡____ (hacer - tu) la tarea ahora!"
    translation: string;
    verb: string;
    correctAnswer: string;
    options: string[];
    pronoun: string;
  }[];
}

// 1. Core Sentences defined by user
export const coreSentences: SentenceItem[] = [
  // 1. Frases afirmativas
  {
    id: 'aff_1',
    original: 'Tú hablas más despacio.',
    imperative: 'Habla más despacio.',
    armenian: 'Խոսի՛ր ավելի դանդաղ։',
    category: 'affirmative',
    explanation: 'Para la segunda persona (Tú), el imperativo afirmativo coincide con la 3ª persona del singular del presente de indicativo.'
  },
  {
    id: 'aff_2',
    original: 'Tú comes fruta.',
    imperative: 'Come fruta.',
    armenian: 'Միրգ կե՛ր։',
    category: 'affirmative'
  },
  {
    id: 'aff_3',
    original: 'Tú escribes la respuesta.',
    imperative: 'Escribe la respuesta.',
    armenian: 'Գրիր պատասխանը։',
    category: 'affirmative'
  },
  {
    id: 'aff_4',
    original: 'Tú escuchas al profesor.',
    imperative: 'Escucha al profesor.',
    armenian: 'Լսի՛ր ուսուցչին։',
    category: 'affirmative'
  },
  {
    id: 'aff_5',
    original: 'Tú estudias la lección.',
    imperative: 'Estudia la lección.',
    armenian: 'Սովորի՛ր դասը։',
    category: 'affirmative'
  },
  {
    id: 'aff_6',
    original: 'Tú bebes agua.',
    imperative: 'Bebe agua.',
    armenian: 'Ջուր խմի՛ր։',
    category: 'affirmative'
  },
  {
    id: 'aff_7',
    original: 'Tú lees el texto.',
    imperative: 'Lee el texto.',
    armenian: 'Կարդա՛ տեքստը։',
    category: 'affirmative'
  },
  {
    id: 'aff_8',
    original: 'Tú abres la ventana.',
    imperative: 'Abre la ventana.',
    armenian: 'Բա՛ց պատուհանը։',
    category: 'affirmative'
  },
  {
    id: 'aff_9',
    original: 'Tú preparas la comida.',
    imperative: 'Prepara la comida.',
    armenian: 'Պատրաստի՛ր ուտելիքը։',
    category: 'affirmative'
  },
  {
    id: 'aff_10',
    original: 'Tú ayudas a tu madre.',
    imperative: 'Ayuda a tu madre.',
    armenian: 'Օգնի՛ր մայրիկիդ։',
    category: 'affirmative'
  },

  // 2. Frases negativas
  {
    id: 'neg_1',
    original: 'Tú hablas muy rápido.',
    imperative: 'No hables muy rápido.',
    armenian: 'Շատ արագ մի՛ խոսիր։',
    category: 'negative',
    explanation: 'El imperativo negativo se forma con NO + Presente de Subjuntivo.'
  },
  {
    id: 'neg_2',
    original: 'Tú comes mucho azúcar.',
    imperative: 'No comas mucho azúcar.',
    armenian: 'Շատ շաքար մի՛ կեր։',
    category: 'negative'
  },
  {
    id: 'neg_3',
    original: 'Tú escribes con errores.',
    imperative: 'No escribas con errores.',
    armenian: 'Սխալներով մի՛ գրիր։',
    category: 'negative'
  },
  {
    id: 'neg_4',
    original: 'Tú llegas tarde.',
    imperative: 'No llegues tarde.',
    armenian: 'Ուշ մի՛ արի։',
    category: 'negative',
    explanation: 'El verbo llegar cambia g -> gu en subjuntivo (no llegues) para mantener el sonido [g].'
  },
  {
    id: 'neg_5',
    original: 'Tú miras el móvil en clase.',
    imperative: 'No mires el móvil en clase.',
    armenian: 'Դասի ժամանակ հեռախոսին մի՛ նայիր։',
    category: 'negative'
  },
  {
    id: 'neg_6',
    original: 'Tú dejas los deberes para mañana.',
    imperative: 'No dejes los deberes para mañana.',
    armenian: 'Տնային աշխատանքները վաղվան մի՛ թող։',
    category: 'negative'
  },
  {
    id: 'neg_7',
    original: 'Tú corres en la calle.',
    imperative: 'No corras en la calle.',
    armenian: 'Փողոցում մի՛ վազիր։',
    category: 'negative'
  },
  {
    id: 'neg_8',
    original: 'Tú bebes poca agua.',
    imperative: 'No bebas poca agua.',
    armenian: 'Քիչ ջուր մի՛ խմիր։',
    category: 'negative'
  },
  {
    id: 'neg_9',
    original: 'Tú duermes muy tarde.',
    imperative: 'No duermas muy tarde.',
    armenian: 'Շատ ուշ մի՛ քնիր։',
    category: 'negative'
  },
  {
    id: 'neg_10',
    original: 'Tú gritas en casa.',
    imperative: 'No grites en casa.',
    armenian: 'Տանը մի՛ բղավիր։',
    category: 'negative'
  },

  // 3. Con verbos irregulares
  {
    id: 'irr_1',
    original: 'Tú dices la verdad.',
    imperative: 'Di la verdad.',
    armenian: 'Ասա՛ ճշմարտությունը։',
    category: 'irregular',
    explanation: 'Decir tiene imperativo afirmativo irregular para "tú": di.'
  },
  {
    id: 'irr_2',
    original: 'Tú haces los deberes.',
    imperative: 'Haz los deberes.',
    armenian: 'Արա՛ տնային աշխատանքները։',
    category: 'irregular',
    explanation: 'Hacer tiene imperativo afirmativo irregular para "tú": haz.'
  },
  {
    id: 'irr_3',
    original: 'Tú vas a clase.',
    imperative: 'Ve a clase.',
    armenian: 'Գնա՛ դասի։',
    category: 'irregular',
    explanation: 'Ir tiene imperativo afirmativo irregular para "tú": ve.'
  },
  {
    id: 'irr_4',
    original: 'Tú pones la mesa.',
    imperative: 'Pon la mesa.',
    armenian: 'Սեղանը գցի՛ր։',
    category: 'irregular',
    explanation: 'Poner tiene imperativo afirmativo irregular para "tú": pon.'
  },
  {
    id: 'irr_5',
    original: 'Tú sales de casa.',
    imperative: 'Sal de casa.',
    armenian: 'Դուրս արի՛ տնից։',
    category: 'irregular',
    explanation: 'Salir tiene imperativo afirmativo irregular para "tú": sal.'
  },
  {
    id: 'irr_6',
    original: 'Tú eres paciente.',
    imperative: 'Sé paciente.',
    armenian: 'Համբերատար եղի՛ր։',
    category: 'irregular',
    explanation: 'Ser tiene imperativo afirmativo irregular para "tú": sé.'
  },
  {
    id: 'irr_7',
    original: 'Tú tienes cuidado.',
    imperative: 'Ten cuidado.',
    armenian: 'Զգույշ եղի՛ր։',
    category: 'irregular',
    explanation: 'Tener tiene imperativo afirmativo irregular para "tú": ten.'
  },
  {
    id: 'irr_8',
    original: 'Tú vienes aquí.',
    imperative: 'Ven aquí.',
    armenian: 'Արի՛ այստեղ։',
    category: 'irregular',
    explanation: 'Venir tiene imperativo afirmativo irregular para "tú": ven.'
  },

  // 4. Con verbos reflexivos
  {
    id: 'ref_1',
    original: 'Tú te levantas temprano.',
    imperative: 'Levántate temprano.',
    armenian: 'Շուտ վե՛ր կաց։',
    category: 'reflexive',
    explanation: 'En imperativo afirmativo, los pronombres se unen por detrás formando una sola palabra. Se añade tilde si es esdrújula.'
  },
  {
    id: 'ref_2',
    original: 'Tú te duchas por la mañana.',
    imperative: 'Dúchate por la mañana.',
    armenian: 'Առավոտյան լոգանք ընդունի՛ր։',
    category: 'reflexive'
  },
  {
    id: 'ref_3',
    original: 'Tú te lavas las manos.',
    imperative: 'Lávate las manos.',
    armenian: 'Լվա՛ ձեռքերդ։',
    category: 'reflexive'
  },
  {
    id: 'ref_4',
    original: 'Tú te cepillas los dientes.',
    imperative: 'Cepíllate los dientes.',
    armenian: 'Մաքրի՛ր ատամներդ։',
    category: 'reflexive'
  },
  {
    id: 'ref_5',
    original: 'Tú te sientas aquí.',
    imperative: 'Siéntate aquí.',
    armenian: 'Նստի՛ր այստեղ։',
    category: 'reflexive'
  },
  {
    id: 'ref_6',
    original: 'Tú te acuestas temprano.',
    imperative: 'Acuéstate temprano.',
    armenian: 'Շուտ պառկի՛ր քնելու։',
    category: 'reflexive'
  },
  {
    id: 'ref_7',
    original: 'Tú te relajas un poco.',
    imperative: 'Relájate un poco.',
    armenian: 'Մի քիչ հանգստացի՛ր։',
    category: 'reflexive'
  },
  {
    id: 'ref_8',
    original: 'Tú te preparas para el examen.',
    imperative: 'Prepárate para el examen.',
    armenian: 'Պատրաստվի՛ր քննությանը։',
    category: 'reflexive'
  },

  // 5. Ejercicios para practicar
  {
    id: 'exe_1',
    original: 'Tú estudias español.',
    imperative: 'Estudia español.',
    armenian: 'Սովորի՛ր իսպաներեն։',
    category: 'exercise'
  },
  {
    id: 'exe_2',
    original: 'Tú comes verduras.',
    imperative: 'Come verduras.',
    armenian: 'Բանջարեղե՛ն կեր։',
    category: 'exercise'
  },
  {
    id: 'exe_3',
    original: 'Tú lees el libro.',
    imperative: 'Lee el libro.',
    armenian: 'Կարդա՛ գիրքը։',
    category: 'exercise'
  },
  {
    id: 'exe_4',
    original: 'Tú haces la tarea.',
    imperative: 'Haz la tarea.',
    armenian: 'Արա՛ տնային աշխատանքը։',
    category: 'exercise'
  },
  {
    id: 'exe_5',
    original: 'Tú dices la respuesta.',
    imperative: 'Di la respuesta.',
    armenian: 'Ասա՛ պատասխանը։',
    category: 'exercise'
  },
  {
    id: 'exe_6',
    original: 'Tú vas al supermercado.',
    imperative: 'Ve al supermercado.',
    armenian: 'Գնա՛ սուպերմարկետ։',
    category: 'exercise'
  },
  {
    id: 'exe_7',
    original: 'Tú pones el libro en la mesa.',
    imperative: 'Pon el libro en la mesa.',
    armenian: 'Գիրքը դի՛ր սեղանին։',
    category: 'exercise'
  },
  {
    id: 'exe_8',
    original: 'Tú te levantas temprano.',
    imperative: 'Levántate temprano.',
    armenian: 'Շուտ վե՛ր կաց։',
    category: 'exercise'
  },
  {
    id: 'exe_9',
    original: 'Tú te duchas ahora.',
    imperative: 'Dúchate ahora.',
    armenian: 'Հիմա՛ լոգանք ընդունիր։',
    category: 'exercise'
  },
  {
    id: 'exe_10',
    original: 'Tú no hablas en clase.',
    imperative: 'No hables en clase.',
    armenian: 'Դասի ժամանակ մի՛ խոսիր։',
    category: 'exercise'
  }
];

// Conjugation tables for theory (Regular verbs in all forms: positive and negative)
export const regularConjugations: ConjugationTable[] = [
  {
    verb: 'Hablar (Cantar)',
    translation: 'Խոսել (Երգել) [-AR]',
    type: '-ar',
    regular: true,
    forms: {
      affirmative: {
        tu: 'habla',
        usted: 'hable',
        nosotros: 'hablemos',
        vosotros: 'hablad',
        ustedes: 'hablen'
      },
      negative: {
        tu: 'no hables',
        usted: 'no hable',
        nosotros: 'no hablemos',
        vosotros: 'no habléis',
        ustedes: 'no hablen'
      }
    }
  },
  {
    verb: 'Comer (Aprender)',
    translation: 'Ուտել (Սովորել) [-ER]',
    type: '-er',
    regular: true,
    forms: {
      affirmative: {
        tu: 'come',
        usted: 'coma',
        nosotros: 'comamos',
        vosotros: 'comed',
        ustedes: 'coman'
      },
      negative: {
        tu: 'no comas',
        usted: 'no coma',
        nosotros: 'no comamos',
        vosotros: 'no comáis',
        ustedes: 'no coman'
      }
    }
  },
  {
    verb: 'Escribir (Abrir)',
    translation: 'Գրել (Բացել) [-IR]',
    type: '-ir',
    regular: true,
    forms: {
      affirmative: {
        tu: 'escribe',
        usted: 'escriba',
        nosotros: 'escribamos',
        vosotros: 'escribid',
        ustedes: 'escriban'
      },
      negative: {
        tu: 'no escribas',
        usted: 'no escriba',
        nosotros: 'no escribamos',
        vosotros: 'no escribáis',
        ustedes: 'no escriban'
      }
    }
  }
];

// Common Irregular Verbs (Exceptions) with all forms
export const irregularVerbs: IrregularException[] = [
  {
    verb: 'Decir',
    translationArmenian: 'Ասել',
    affirmativeTu: 'di',
    negativeTu: 'no digas',
    completeAffirmative: {
      tu: 'di',
      vosotros: 'decid',
      usted: 'diga',
      ustedes: 'digan',
      nosotros: 'digamos'
    },
    completeNegative: {
      tu: 'no digas',
      vosotros: 'no digáis',
      usted: 'no diga',
      ustedes: 'no digan',
      nosotros: 'no digamos'
    },
    note: 'Su raíz del presente cambia a "dig-", excepto para vosotros. La afirmativa de tú es muy corta: "di".'
  },
  {
    verb: 'Hacer',
    translationArmenian: 'Անել',
    affirmativeTu: 'haz',
    negativeTu: 'no hagas',
    completeAffirmative: {
      tu: 'haz',
      vosotros: 'haced',
      usted: 'haga',
      ustedes: 'hagan',
      nosotros: 'hagamos'
    },
    completeNegative: {
      tu: 'no hagas',
      vosotros: 'no hagáis',
      usted: 'no haga',
      ustedes: 'no hagan',
      nosotros: 'no hagamos'
    },
    note: 'La forma afirmativa de tú se abrevia a junta dental: "haz". En las formas negativas toma la raíz del subjuntivo "hag-".'
  },
  {
    verb: 'Ir',
    translationArmenian: 'Գնալ',
    affirmativeTu: 've',
    negativeTu: 'no vayas',
    completeAffirmative: {
      tu: 've',
      vosotros: 'id',
      usted: 'vaya',
      ustedes: 'vayan',
      nosotros: 'vayamos'
    },
    completeNegative: {
      tu: 'no vayas',
      vosotros: 'no vayáis',
      usted: 'no vaya',
      ustedes: 'no vayan',
      nosotros: 'no vayamos'
    },
    note: 'Altamente irregular. El afirmativo "vosotros" es simplemente "id". Las formas negativas se basan en el verbo "ir" usando su conjugación en subjuntivo.'
  },
  {
    verb: 'Poner',
    translationArmenian: 'Դնել',
    affirmativeTu: 'pon',
    negativeTu: 'no pongas',
    completeAffirmative: {
      tu: 'pon',
      vosotros: 'poned',
      usted: 'ponga',
      ustedes: 'pongan',
      nosotros: 'pongamos'
    },
    completeNegative: {
      tu: 'no pongas',
      vosotros: 'no pongáis',
      usted: 'no ponga',
      ustedes: 'no pongan',
      nosotros: 'no pongamos'
    },
    note: 'El afirmativo recortado "pon". Formas negativas con raíz subjuntiva "pong-".'
  },
  {
    verb: 'Salir',
    translationArmenian: 'Դուրս գալ',
    affirmativeTu: 'sal',
    negativeTu: 'no salgas',
    completeAffirmative: {
      tu: 'sal',
      vosotros: 'salid',
      usted: 'salga',
      ustedes: 'salgan',
      nosotros: 'salgamos'
    },
    completeNegative: {
      tu: 'no salgas',
      vosotros: 'no salgáis',
      usted: 'no salga',
      ustedes: 'no salgan',
      nosotros: 'no salgamos'
    },
    note: 'Afirmativo recortado "sal". Formas negativas con raíz "salg-".'
  },
  {
    verb: 'Ser',
    translationArmenian: 'Լինել',
    affirmativeTu: 'sé',
    negativeTu: 'no seas',
    completeAffirmative: {
      tu: 'sé',
      vosotros: 'sed',
      usted: 'sea',
      ustedes: 'sean',
      nosotros: 'seamos'
    },
    completeNegative: {
      tu: 'no seas',
      vosotros: 'no seáis',
      usted: 'no sea',
      ustedes: 'no sean',
      nosotros: 'no seamos'
    },
    note: 'El afirmativo lleva tilde diacrítica en "sé" para distinguirlo del pronombre se. Las negativas usan la forma "sea".'
  },
  {
    verb: 'Tener',
    translationArmenian: 'Ունենալ',
    affirmativeTu: 'ten',
    negativeTu: 'no tengas',
    completeAffirmative: {
      tu: 'ten',
      vosotros: 'tened',
      usted: 'tenga',
      ustedes: 'tengan',
      nosotros: 'tengamos'
    },
    completeNegative: {
      tu: 'no tengas',
      vosotros: 'no tengáis',
      usted: 'no tenga',
      ustedes: 'no tengan',
      nosotros: 'no tengamos'
    },
    note: 'Afirmativo recortado "ten". Formas negativas usan la raíz de presente en primera persona "teng-".'
  },
  {
    verb: 'Venir',
    translationArmenian: 'Գալ / Մոտենալ',
    affirmativeTu: 'ven',
    negativeTu: 'no vengas',
    completeAffirmative: {
      tu: 'ven',
      vosotros: 'venid',
      usted: 'venga',
      ustedes: 'vengan',
      nosotros: 'vengamos'
    },
    completeNegative: {
      tu: 'no vengas',
      vosotros: 'no vengáis',
      usted: 'no venga',
      ustedes: 'no vengan',
      nosotros: 'no vengamos'
    },
    note: 'Afirmativo recortado "ven". Formas negativas usan la raíz actual "veng-".'
  },
  {
    verb: 'Dar',
    translationArmenian: 'Տալ',
    affirmativeTu: 'da',
    negativeTu: 'no des',
    completeAffirmative: {
      tu: 'da',
      vosotros: 'dad',
      usted: 'dé',
      ustedes: 'den',
      nosotros: 'demos'
    },
    completeNegative: {
      tu: 'no des',
      vosotros: 'no deis',
      usted: 'no dé',
      ustedes: 'no den',
      nosotros: 'no demos'
    },
    note: 'Tiene tilde en "dé" (usted) para distinguirlo de la preposición "de".'
  },
  {
    verb: 'Estar',
    translationArmenian: 'Գտնվել / Լինել',
    affirmativeTu: 'está',
    negativeTu: 'no estés',
    completeAffirmative: {
      tu: 'está',
      vosotros: 'estad',
      usted: 'esté',
      ustedes: 'estén',
      nosotros: 'estemos'
    },
    completeNegative: {
      tu: 'no estés',
      vosotros: 'no estéis',
      usted: 'no esté',
      ustedes: 'no estén',
      nosotros: 'no estemos'
    },
    note: 'Lleva tilde en todas las formas de imperativo excepto en vosotros.'
  }
];

// Interactive Dialogue Filling practice
export const dialogueData: DialogueItem[] = [
  {
    context: 'Una madre habla con su hijo en casa',
    contextArm: 'Մայրը տանը խոսում է որդու հետ',
    lines: [
      {
        speaker: 'Madre',
        text: 'Hijo, por favor, ya son las cinco. ¡_________ (hacer - tú) los deberes de español!',
        translation: 'Որդի՛ս, խնդրում եմ, արդեն ժամը հինգն է։ Արա՛ իսպաներենի տնային աշխատանքները։',
        verb: 'hacer',
        correctAnswer: 'haz',
        options: ['hace', 'haz', 'hagas', 'hazte'],
        pronoun: 'tú'
      },
      {
        speaker: 'Hijo',
        text: '¡Pero mamá! Es muy difícil. Tengo sueño.',
        translation: 'Բայց մա՛մ։ Շատ դժվար է։ Քունս տանում է։',
        verb: 'dormir',
        correctAnswer: 'duerme',
        options: [],
        pronoun: ''
      },
      {
        speaker: 'Madre',
        text: 'No pongas excusas. ¡_________ (lavarse - tú) la cara y después siéntate!',
        translation: 'Պատրվակներ մի՛ հորինիր։ Լվա՛ դեմքդ և հետո նստի՛ր։',
        verb: 'lavarse',
        correctAnswer: 'lávate',
        options: ['lávate', 'lavate', 'te lavas', 'no te laves'],
        pronoun: 'tú'
      },
      {
        speaker: 'Madre',
        text: 'Y ¡no _________ (mirar - tú) el móvil en tu habitación!',
        translation: 'Եվ սենյակումդ հեռախոսին մի՛ նայիր։',
        verb: 'mirar',
        correctAnswer: 'mires',
        options: ['mira', 'mires', 'no mires', 'miras'],
        pronoun: 'tú'
      }
    ]
  },
  {
    context: 'Un entrenador habla con su equipo antes del partido',
    contextArm: 'Մարզիչը խաղից առաջ խոսում է իր թիմի հետ',
    lines: [
      {
        speaker: 'Entrenador',
        text: '¡Chicos, _________ (escuchar - vosotros) atentamente la estrategia de hoy!',
        translation: 'Տղանե՛ր, ուշադիր լսե՛ք այսօրվա ռազմավարությունը։',
        verb: 'escuchar',
        correctAnswer: 'escuchad',
        options: ['escucha', 'escuchad', 'escuchen', 'escucháis'],
        pronoun: 'vosotros'
      },
      {
        speaker: 'Entrenador',
        text: '¡_________ (correr - vosotros) por toda la banda, no tengáis miedo!',
        translation: 'Վազե՛ք ամբողջ եզրագծով, մի՛ վախեցեք։',
        verb: 'correr',
        correctAnswer: 'corred',
        options: ['correr', 'corred', 'corran', 'corres'],
        pronoun: 'vosotros'
      },
      {
        speaker: 'Entrenador',
        text: 'Pero ¡no _________ (perder - vosotros) el balón fácilmente!',
        translation: 'Բայց գնդակը հեշտությամբ մի՛ կորցրեք։',
        verb: 'perder',
        correctAnswer: 'perdáis',
        options: ['perded', 'perdéis', 'perdáis', 'pierdan'],
        pronoun: 'vosotros'
      }
    ]
  },
  {
    context: 'Un empleado del cine da instrucciones a los clientes',
    contextArm: 'Կինոթատրոնի աշխատակիցը հրահանգներ է տալիս հաճախորդներին',
    lines: [
      {
        speaker: 'Empleado',
        text: '¡_________ (pasar - ustedes) a la sala número tres, la película va a comenzar!',
        translation: 'Անցե՛ք համար երեք դահլիճ, ֆիլմը պատրաստվում է սկսվել: (ustedes)',
        verb: 'pasar',
        correctAnswer: 'pasen',
        options: ['pasa', 'pasen', 'pasad', 'pasan'],
        pronoun: 'ustedes'
      },
      {
        speaker: 'Empleado',
        text: 'Y por favor, ¡no _________ (hablar - ustedes) en voz alta durante la función!',
        translation: 'Եվ խնդրում եմ, սեանսի ժամանակ բարձրաձայն մի՛ խոսեք: (ustedes)',
        verb: 'hablar',
        correctAnswer: 'hablen',
        options: ['hablen', 'hablad', 'hablas', 'hablan'],
        pronoun: 'ustedes'
      },
      {
        speaker: 'Cliente',
        text: 'Está bien, gracias. ¡Vamos a ver la película!',
        translation: 'Լավ է, շնորհակալություն։ Գնանք ֆիլմը դիտելու։',
        verb: 'ir',
        correctAnswer: 'vamos',
        options: [],
        pronoun: ''
      }
    ]
  }
];

// Spanish-Armenian pairings for match memory cards
export interface MatchCard {
  id: string;
  text: string;
  lang: 'es' | 'hy';
  pairId: string;
}

export const armenianSpanishPairsRaw = [
  { id: '1', es: '¡Habla más despacio!', hy: 'Խոսի՛ր ավելի դանդաղ։' },
  { id: '2', es: '¡Come fruta!', hy: 'Միրգ կե՛ր։' },
  { id: '3', es: '¡Abre la ventana!', hy: 'Բա՛ց պատուհանը։' },
  { id: '4', es: '¡No hables muy rápido!', hy: 'Շատ արագ մի՛ խոսիր։' },
  { id: '5', es: '¡No duermas muy tarde!', hy: 'Շատ ուշ մի՛ քնիր։' },
  { id: '6', es: '¡Di la verdad!', hy: 'Ասա՛ ճշմարտությունը։' },
  { id: '7', es: '¡Haz los deberes!', hy: 'Արա՛ տնային աշխատանքները։' },
  { id: '8', es: '¡Lávate las manos!', hy: 'Լվա՛ ձեռքերդ։' },
  { id: '9', es: '¡Levántate temprano!', hy: 'Շուտ վե՛ր կաց։' },
  { id: '10', es: '¡Haz la tarea!', hy: 'Արա՛ տնային աշխատանքը։' }
];

export const generateMatchCardsByCount = (count: number = 6): MatchCard[] => {
  const slicedPairs = [...armenianSpanishPairsRaw]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  const cards: MatchCard[] = [];
  slicedPairs.forEach((pair) => {
    cards.push({
      id: `es-${pair.id}`,
      text: pair.es,
      lang: 'es',
      pairId: pair.id
    });
    cards.push({
      id: `hy-${pair.id}`,
      text: pair.hy,
      lang: 'hy',
      pairId: pair.id
    });
  });

  return cards.sort(() => Math.random() - 0.5);
};
