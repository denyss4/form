// Polish copy (D5, from the user). Same shape as the English in copy.ts; the type checker refuses a missing or extra key.
// Wording rules carry over (MASTER_PROMPT §7, CLAUDE.md): readiness, energy, planning; never diagnosis, treatment or symptoms; food and
// weight neutral. The second person stays gender-neutral (no "zrobiłaś / zrobiłeś"): present tense, impersonal forms, or nouns.
// Polish needs grammar the English does not: plural forms (1 dzień, 2 dni, 5 dni), and weekdays in the accusative after "w" and "na"
// ("w środę", "na środę"). The weekday arrives in the nominative from format.ts and is turned here.
// [GAP G57: written by the build, not by a native copywriter. Needs a native review before release.]
import type { Copy } from './copy.ts';

/** Polish plural: one (1), few (2-4, but not 12-14), many (everything else, including 0 and 5-21). */
const plural = (n: number, one: string, few: string, many: string) =>
  n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many;
const dni = (n: number) => plural(n, 'dzień', 'dni', 'dni');

// Weekdays after "w" (on that day) and "na" (moved to that day).
const onDay: Record<string, string> = {
  poniedziałek: 'w poniedziałek',
  wtorek: 'we wtorek',
  środa: 'w środę',
  czwartek: 'w czwartek',
  piątek: 'w piątek',
  sobota: 'w sobotę',
  niedziela: 'w niedzielę',
};
const toDay: Record<string, string> = {
  poniedziałek: 'na poniedziałek',
  wtorek: 'na wtorek',
  środa: 'na środę',
  czwartek: 'na czwartek',
  piątek: 'na piątek',
  sobota: 'na sobotę',
  niedziela: 'na niedzielę',
};
const on = (day: string) => onDay[day] ?? `w ${day}`;
const to = (day: string) => toDay[day] ?? `na ${day}`;
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
// The calendar's event labels arrive in English (fixtures); here in the accusative, after "masz" (you have).
const eventLabel: Record<string, string> = { dinner: 'kolację', flight: 'lot' };
const event = (what: string) => eventLabel[what] ?? what;
// Ratings read out of 10, with a decimal comma (Polish): "6,5 z 10" (first-launch plan, 3 Oct, item 15; GAP G62).
const tenths = (felt: number) => {
  const n = Math.round(felt) / 10;
  return (Number.isInteger(n) ? String(n) : n.toFixed(1)).replace('.', ',');
};
const list = (items: string[]) => (items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} i ${items[items.length - 1]}`);

export const pl: Omit<Copy, 'dev'> = {
  list,
  range: (lo: number, hi: number) => `Prawdopodobnie ${lo}–${hi}`,
  inputsBasis: (used: number, total: number) => `Na podstawie ${used} z ${total} danych`,
  basis: {
    typical: 'wobec typowego dnia',
    personal: 'wobec twojej normy',
  },
  noDrivers: 'Twój zwykły poziom',
  whyHeading: 'Co wpłynęło na wynik',

  plan: {
    hard: 'Mocny trening',
    light: 'Lekki trening',
    recover: 'Regeneracja',
    deepwork: 'Dzień skupienia',
  },

  dial: {
    label: (score: number, lo: number, hi: number) => `Wynik Form ${score}. Prawdopodobnie od ${lo} do ${hi}.`,
    empty: 'Brak wyniku',
  },

  driver: {
    value: (direction: 'up' | 'down', magnitude: number) => `${direction === 'up' ? '+' : '−'}${Math.round(magnitude)}`,
    a11y: (label: string, direction: 'up' | 'down', magnitude: number, basis: string) => {
      const n = Math.round(magnitude);
      return `${label}, ${direction === 'up' ? 'dodaje' : 'odejmuje'} ${n} ${plural(n, 'punkt', 'punkty', 'punktów')}, ${basis}`;
    },
  },

  today: {
    title: 'Dziś',
    dateCaption: (date: string) => `Dziś, ${date}`,
    why: {
      hard: (session: string) => `Twój wynik jest wysoki, więc sesja ${session} zostaje mocna.`,
      toned: (session: string) => `Twój wynik jest bliski typowemu dniu, więc sesja ${session} będzie lżejsza.`,
      lightSession: (session: string) => `Sesja ${session} jest lekka.`,
      lowSession: (session: string) => `Twój wynik jest niski, więc sesja ${session} ustępuje regeneracji.`,
      deepwork: 'Brak zaplanowanej sesji. Dobry dzień na skupioną pracę.',
      lowDay: 'Twój wynik jest niski, więc dziś stawiasz na regenerację.',
      travelDay: 'Dzień podróży, więc dziś stawiasz na regenerację.',
      restDay: 'Nic nie zaplanowano, więc dziś stawiasz na regenerację.',
    },
    pulling: (items: string, many: boolean) => `${items} ${many ? 'obniżają' : 'obniża'} twój wynik.`,
    helping: (items: string, many: boolean) => `${items} ${many ? 'pomagają' : 'pomaga'}.`,
    usual: 'Twój wynik jest na zwykłym poziomie.',
    notUsed: (items: string, more: number) => `Pominięte w tej prognozie: ${items}${more > 0 ? ` i jeszcze ${more}` : ''}.`,
    fewInputs: 'Mało danych dziś. Dodaj więcej, by obraz był pełniejszy.',
    logTonight: 'Zrób wieczorny wpis',
    logged: 'Zapisano. Plan na jutro pojawi się rano.',
    day1: {
      body: 'Twój plan pojawi się jutro, po dzisiejszym wieczornym wpisie.',
    },
    error: {
      title: 'Nie udało się obliczyć wyniku.',
      body: 'Spróbuj ponownie za chwilę.',
      retry: 'Spróbuj ponownie',
    },
    rating: {
      title: 'Jak się dziś rano czujesz?',
      scale: '1 to bardzo słabo, 10 to bardzo dobrze.',
      skip: 'Przejdź do planu',
      spoken: 'Jak się dziś rano czujesz? Ocena od 1 do 10, jeszcze bez oceny',
      value: (n: number) => `${n} z 10. Stuknij dwukrotnie, aby zapisać.`,
      hint: 'Przesuń w górę lub w dół, by wybrać, potem stuknij dwukrotnie, by zapisać.',
    },
  },

  log: {
    title: 'Wieczorny wpis',
    close: 'Zamknij',
    save: 'Zapisz wpis',
    effort: {
      question: (session: string) => `Jak ciężka była sesja ${session}?`,
      skipped: 'Pominięta',
      easy: 'Lekka',
      moderate: 'Umiarkowana',
      hard: 'Ciężka',
    },
    alcohol: { question: 'Czy był dziś alkohol?', no: 'Nie', yes: 'Tak' },
    unusual: { question: 'Czy dziś było coś nietypowego?', no: 'Nie', yes: 'Tak' },
    fit: {
      question: 'Czy dzisiejszy plan pasował?',
      optional: 'Opcjonalnie',
      yes: 'Tak',
      tooHard: 'Za ciężki',
      tooEasy: 'Za lekki',
      other: 'Było coś innego',
    },
    remaining: (n: number) =>
      n === 1 ? 'Odpowiedz jeszcze na jedno pytanie, by zapisać.' : `Odpowiedz jeszcze na ${n} ${plural(n, 'pytanie', 'pytania', 'pytań')}, by zapisać.`,
    ring: (done: number, total: number) => `Odpowiedzi: ${done} z ${total}`,
  },

  nav: { back: 'Wstecz', settings: 'Ustawienia', profile: 'Profil', close: 'Zamknij' },
  tabs: { today: 'Dziś', week: 'Tydzień', progress: 'Postępy' },
  tag: { work: 'Praca', training: 'Trening', social: 'Spotkanie', travel: 'Podróż', rest: 'Odpoczynek' },

  onboarding: {
    title: 'Planuj tydzień pod to, jak będziesz się czuć.',
    intro: 'Form zamienia krótki wpis i twój kalendarz w jeden plan na każdy dzień.',
    points: ['Wieczorny wpis w trzech stuknięciach.', 'Jeden plan na jutro, z uzasadnieniem.', 'Zobacz, gdzie w tygodniu pasują mocne sesje.'],
    start: 'Zaczynamy',
    example: 'Przykład',
    exampleA11y: (score: number, lo: number, hi: number) => `Przykład: wynik Form ${score}. Prawdopodobnie od ${lo} do ${hi}.`,
    notice: 'Form służy do planowania. Niczego nie diagnozuje ani nie leczy.',
  },

  launch: { label: 'Form, wczytywanie' },

  welcome: {
    wordmark: 'Form',
    tagline: 'Planuj tydzień pod to, jak będziesz się czuć.',
    start: 'Zaczynamy',
    haveAccount: 'Mam już konto',
    legal: 'Regulamin i prywatność',
    a11y: 'Form. Planuj tydzień pod to, jak będziesz się czuć. Przykładowy tydzień planów wschodzi nad horyzontem.',
  },

  legal: {
    title: 'Regulamin i prywatność',
    body: 'Korzystając z Form, akceptujesz:',
    terms: 'Regulamin',
    privacy: 'Informacja o prywatności',
    health: 'O zgodę na dane o zdrowiu pytamy osobno, dla każdego celu z osobna.',
    notice: 'Form służy do planowania. Niczego nie diagnozuje ani nie leczy.',
    placeholder: (doc: string) => `${doc}: tekst jeszcze nie powstał. Przed wydaniem wymaga przeglądu prawnego.`,
    back: 'Wstecz',
  },

  intro: {
    done: 'Kontynuuj',
    chipA11y: (plan: string, score: number, lo: number, hi: number) => `Przykład: ${plan}. Wynik Form ${score}. Prawdopodobnie od ${lo} do ${hi}.`,
    // One screen (first-launch plan, 3 Oct, item 4): slides 2 and 3 are gone.
    title: 'Jeden plan na dzień, z uzasadnieniem.',
    body: 'Każdego ranka Form zamienia wczorajszy wpis w plan i prawdopodobny zakres.',
  },

  stepper: {
    short: (step: number, total: number) => `Krok ${step} z ${total}`,
    label: (step: number, total: number, name: string) => `Krok ${step} z ${total}, ${name}`,
    steps: { account: 'Konto', consent: 'Zgody', calendar: 'Kalendarz', notifications: 'Powiadomienia' },
  },

  notifications: {
    title: 'Twój plan każdego ranka',
    body: 'Dostawaj plan każdego ranka i przypomnienie o wieczornym wpisie.',
    allow: 'Zezwól na powiadomienia',
    later: 'Nie teraz',
    cardApp: 'Form',
    cardTime: 'teraz',
    card: (plan: string, lo: number, hi: number) => `${plan}. Prawdopodobnie ${lo}–${hi}`,
    cardA11y: (plan: string, lo: number, hi: number) => `Przykładowe powiadomienie: ${plan}. Prawdopodobnie od ${lo} do ${hi}.`,
    demoNote: 'Demo: w wersji demo systemowe pytanie jest pomijane.',
    error: {
      title: 'Nie udało się zapytać o powiadomienia',
      body: 'Plan i tak pojawi się rano w zakładce Dziś. Powiadomienia możesz włączyć później w ustawieniach telefonu.',
      continue: 'Kontynuuj',
    },
  },

  field: {
    show: (label: string) => `Pokaż ${label.toLowerCase()}`,
    hide: (label: string) => `Ukryj ${label.toLowerCase()}`,
  },

  auth: {
    signUpTitle: 'Załóż konto',
    signInTitle: 'Zaloguj się',
    name: 'Imię',
    nameOptional: 'Imię (opcjonalnie)',
    email: 'E-mail',
    password: 'Hasło',
    passwordHint: 'Co najmniej 8 znaków.',
    terms: 'Akceptuję regulamin i informację o prywatności.',
    termsLink: 'Przeczytaj regulamin i informację o prywatności',
    termsA11y: 'Akceptuję regulamin i informację o prywatności',
    create: 'Załóż konto',
    signIn: 'Zaloguj się',
    forgot: 'Nie pamiętasz hasła?',
    haveAccount: 'Mam już konto',
    noAccount: 'Zamiast tego załóż konto',
    asMarta: 'Kontynuuj jako Marta',
    asMartaNote: 'Tylko w wersji demo. Loguje na profil demo.',
    demoNote: 'Demo: konta istnieją na tym telefonie do zamknięcia aplikacji. Nic nie jest nigdzie wysyłane.',
    errors: {
      name: 'Wpisz swoje imię.',
      email: 'Wpisz e-mail w formacie imie@example.com.',
      password: 'Użyj co najmniej 8 znaków.',
      terms: 'Zaznacz zgodę, zanim założysz konto.',
      unknownTitle: 'Żadne konto tutaj nie używa tego e-maila',
      unknownBody: 'Konta w tym demo istnieją na tym telefonie do zamknięcia aplikacji. Załóż konto albo sprawdź e-mail.',
    },
    created: 'Konto założone.',
    signedIn: (name: string) => `Zalogowano jako ${name}.`,
    forgotTitle: 'Zresetuj hasło',
    forgotBody: 'Wpisz e-mail użyty przy rejestracji. Wyślemy link do ustawienia nowego hasła.',
    forgotSend: 'Wyślij link',
    forgotSentTitle: 'Sprawdź skrzynkę',
    forgotSentBody: 'Jeśli jakieś konto używa tego e-maila, link do resetu jest w drodze. W tym demo nic nie jest wysyłane.',
    forgotBack: 'Wróć do logowania',
  },

  authPanel: {
    tabs: { label: 'Zaloguj się lub załóż konto', signIn: 'Zaloguj się', signUp: 'Załóż konto' },
    signInTitle: 'Witaj ponownie',
    signInBody: 'Zaloguj się na swoje konto.',
    signUpTitle: 'Załóż konto',
    signUpBody: 'Twój plan i wpisy zostają na tym telefonie.',
    strength: {
      label: (words: string) => `Siła hasła: ${words}`,
      levels: ['Bardzo słabe', 'Słabe', 'Średnie', 'Dobre', 'Silne'],
      needs: { length: 'Co najmniej 8 znaków', upper: 'Jedna wielka litera', lower: 'Jedna mała litera', number: 'Jedna cyfra', special: 'Jeden symbol' },
    },
    errors: {
      weak: 'Wybierz silniejsze hasło: spełnij co najmniej 3 punkty poniżej.',
    },
    doneTitle: 'Konto założone',
    doneBody: 'Twoje konto jest gotowe. Demo: istnieje na tym telefonie do zamknięcia aplikacji.',
    start: 'Zaczynamy',
    resetTitle: 'Zresetuj hasło',
    resetBody: 'Wpisz e-mail. Wyślemy link do ustawienia nowego hasła.',
    resetSend: 'Wyślij link',
    resetSent: 'Jeśli jakieś konto używa tego e-maila, link jest w drodze. W tym demo nic nie jest wysyłane.',
    backToSignIn: 'Wróć do logowania',
    signedIn: 'Zalogowano (podgląd: żadne konto się nie zmieniło).',
  },

  profile: {
    title: 'Profil',
    edit: 'Edytuj',
    editA11y: 'Edytuj profil',
    guestTitle: 'Form działa bez konta',
    guestBody: 'Konto zachowa twoją historię, gdy zmienisz telefon.',
    guestNote: 'Demo: konta istnieją na tym telefonie do zamknięcia aplikacji.',
    nameA11y: (name: string, email: string) => `${name}, ${email}`,
    photoA11y: (name: string) => `Zdjęcie profilowe: ${name}`,
    initialsA11y: (name: string) => `${name}, bez zdjęcia`,
    week: 'Ten tydzień',
    weekA11y: (summary: string) => `Ten tydzień: ${summary}. Otwiera Tydzień.`,
    weekDay: (day: string, plan: string, today: boolean) => `${day} ${plan}${today ? ', dziś' : ''}`,
    training: 'Trening',
    trainingDays: (n: number) => `${n} ${dni(n)} w tygodniu`,
    trainingTime: (time: string) => `Zwykle o ${time}`,
    sessions: (names: string) => `Sesje: ${names}`,
    noSessions: 'Brak sesji',
    trainingNote: 'Form odczytuje treningi z kalendarza.',
    work: 'Rytm pracy',
    workDays: (days: string) => `Dni pracy: ${days}`,
    noWorkDays: 'Brak stałych dni pracy',
    connections: 'Połączenia',
    calendar: 'Kalendarz',
    calendarOn: 'Połączony (demo)',
    calendarOff: 'Niepołączony',
    notifications: 'Powiadomienia',
    morningPlan: 'Poranny plan',
    morningPlanCaption: 'Twój plan na dzień, każdego ranka.',
    eveningReminder: 'Wieczorne przypomnienie',
    eveningReminderCaption: 'Przypomnienie o wpisie, o godzinie poniżej.',
    eveningTime: 'Godzina przypomnienia',
    notificationsNote: 'Demo: nic nie jest jeszcze zaplanowane.',
    privacy: 'Prywatność',
    consents: 'Z czego Form może korzystać',
    consentsCaption: (allowed: number, total: number) => `Dozwolone: ${allowed} z ${total}`,
    export: 'Eksportuj moje dane',
    deleteData: 'Usuń moje dane',
    account: 'Konto',
    changeEmail: 'Zmień e-mail',
    changePassword: 'Zmień hasło',
    signOut: 'Wyloguj się',
    signedOut: 'Wylogowano. Form działa dalej bez konta.',
    deleteAccount: 'Usuń konto',
    about: 'O aplikacji',
    legal: 'Regulamin i prywatność',
    version: (v: string) => `Wersja ${v}`,
    language: 'Język',
    languageNote: 'Zmienia od razu wszystkie ekrany.',
  },

  editProfile: {
    title: 'Edytuj profil',
    cancel: 'Anuluj',
    save: 'Zapisz',
    saved: 'Zapisano.',
    photo: 'Zdjęcie',
    addPhoto: 'Dodaj zdjęcie',
    changePhoto: 'Zmień zdjęcie',
    removePhoto: 'Usuń zdjęcie',
    photoError: 'Nie udało się otworzyć zdjęć. Pozwól Form korzystać ze Zdjęć w ustawieniach telefonu albo zostaw inicjały.',
    trainingDays: 'Dni treningowe w tygodniu',
    trainingDaysValue: (n: number) => `${n} z 7`,
    trainingTime: 'Zwykła godzina treningu',
    trainingTimeHint: 'Na przykład 18:00.',
    timePlaceholder: 'Wybierz godzinę',
    timeSearch: 'Szukaj godziny, na przykład 18',
    timeEmpty: 'Brak pasującej godziny.',
    sessions: 'Moje sesje',
    sessionsHint: 'Nazwy, które Form pokazuje w Tygodniu i w wieczornym wpisie.',
    sessionName: (n: number) => `Sesja ${n}`,
    addSession: 'Dodaj sesję',
    newSession: 'Nowa sesja',
    moveUp: (name: string) => `Przesuń ${name} w górę`,
    moveDown: (name: string) => `Przesuń ${name} w dół`,
    remove: (name: string) => `Usuń ${name}`,
    workDays: 'Zwykłe dni pracy',
    workDaysHint: 'Pomaga Form przewidzieć dzień pracy, gdy kalendarz jest pusty.',
    errors: {
      name: 'Wpisz swoje imię.',
      time: 'Użyj godziny w formacie 18:00.',
      session: 'Nazwij sesję albo ją usuń.',
      duplicate: 'Dwie sesje mają tę samą nazwę. Nadaj każdej własną.',
      fix: (n: number) =>
        n === 1
          ? 'Jedno pole wymaga poprawki przed zapisem.'
          : `${n} ${plural(n, 'pole', 'pola', 'pól')} ${plural(n, 'wymaga', 'wymagają', 'wymaga')} poprawki przed zapisem.`,
    },
    discardTitle: 'Wyjść bez zapisywania?',
    discardBody: 'Zmiany na tym ekranie przepadną.',
    discard: 'Odrzuć zmiany',
    keep: 'Edytuj dalej',
  },

  privacy: {
    title: 'Prywatność',
    intro: 'Każdy wybór możesz zmienić w dowolnej chwili. „Nie teraz” wybiera się tak samo łatwo jak „Zezwól”.',
    exportTitle: 'Eksportuj moje dane',
    exportBody: 'Twoje wpisy, poranne oceny i ustawienia w jednym pliku do zachowania.',
    exportAction: 'Przygotuj eksport',
    exportDoneTitle: 'Eksport gotowy (demo)',
    exportDoneBody: 'W tym demo plik nie powstaje. Wersja produkcyjna zapisałaby plik JSON do udostępnienia.',
    deleteTitle: 'Usuń moje dane',
    deleteBody: 'To usunie z tego telefonu twoje wpisy, poranne oceny, ustawienia i zgody, a Form zacznie od ekranu powitalnego.',
    deleteAction: 'Usuń moje dane',
    deleteConfirmTitle: 'Usunąć wszystkie twoje dane?',
    deleteConfirmBody: 'Tego nie można cofnąć.',
    deleteConfirm: 'Usuń wszystko',
    cancel: 'Anuluj',
  },

  accountScreens: {
    emailTitle: 'Zmień e-mail',
    newEmail: 'Nowy e-mail',
    emailSave: 'Zapisz e-mail',
    emailSaved: 'E-mail zmieniony.',
    passwordTitle: 'Zmień hasło',
    current: 'Obecne hasło',
    next: 'Nowe hasło',
    passwordSave: 'Zapisz hasło',
    passwordSaved: 'Hasło zmienione (demo: hasło nie jest przechowywane).',
    deleteTitle: 'Usuń konto',
    deleteBody: 'To usuwa konto. Plan i wpisy zostają na tym telefonie, a Form działa dalej bez konta.',
    deleteType: 'Wpisz USUŃ, aby potwierdzić',
    deleteWord: 'USUŃ',
    deleteHint: 'Wielkimi literami, jak powyżej.',
    deleteAction: 'Usuń konto',
    deleteMismatch: 'Wpisz USUŃ wielkimi literami, aby potwierdzić.',
    deleted: 'Konto usunięte.',
  },

  consent: {
    title: 'Z czego Form może korzystać',
    intro: 'Wybierz dla każdego z osobna. Każdy wybór zmienisz później w Profilu.',
    allow: 'Zezwól',
    decline: 'Nie teraz',
    whatThisMeans: 'Co to oznacza',
    purposes: {
      scoring: {
        name: 'Wynik i plan',
        what: 'Twój wieczorny wpis i poranna ocena, np. wysiłek, alkohol, sen i nastrój. Form oblicza wynik na twoim telefonie.',
      },
      personalModel: {
        name: 'Nauka twojego wzorca',
        what: 'Twoje wpisy i oceny w czasie. Po 21 dniach Form sprawdza, czy twój własny wzorzec przewiduje cię lepiej niż typowy.',
      },
      calendar: {
        name: 'Odczyt kalendarza',
        what: 'Tytuły i godziny wydarzeń, by przewidzieć typy dni, np. praca, trening i podróż. Form tylko odczytuje kalendarz.',
      },
      health: {
        name: 'Odczyt danych o zdrowiu',
        what: 'Kroki, spalone kalorie, aktywne minuty i sen z Apple Zdrowie lub Health Connect.',
      },
    },
    continue: 'Kontynuuj',
    incomplete: 'Wybierz Zezwól lub Nie teraz dla każdego, by kontynuować.',
    demoNote: 'Tekst demo. Ostateczna treść wymaga przeglądu prawnego.',
  },

  calendar: {
    title: 'Połącz kalendarz',
    body: 'Form odczytuje tytuły i godziny wydarzeń w tygodniu i przewiduje typ każdego dnia: praca, trening, spotkanie, podróż lub odpoczynek.',
    provider: 'Google Calendar',
    mockNote: 'Demo: to symulowane logowanie. Żadne konto nie jest używane.',
    allow: 'Zezwól na odczyt',
    skip: 'Na razie pomiń',
    reading: 'Odczytuję kalendarz',
    readingNote: 'To chwilę potrwa.',
    error: {
      title: 'Odmówiono dostępu do kalendarza.',
      body: 'Spróbuj ponownie albo kontynuuj bez kalendarza. Możesz go połączyć później w Tygodniu.',
      retry: 'Spróbuj ponownie',
      without: 'Kontynuuj bez kalendarza',
    },
    off: {
      title: 'Kalendarz jest wyłączony.',
      body: 'Dla kalendarza wybrano „Nie teraz”. Zmień to w Profilu, w sekcji Prywatność, by go połączyć.',
      settings: 'Otwórz Prywatność',
      without: 'Kontynuuj bez kalendarza',
    },
  },

  week: {
    tapHint: 'Stuknij dzień, by zobaczyć jego plan, typ dnia i sesję.',
    openHint: 'Otwiera szczegóły dnia.',
    title: 'Tydzień',
    planNote: 'Plany na kolejne dni wynikają z kalendarza. Poranny wynik może je zmienić.',
    coverage: (found: number, total: number) => `Wydarzenia znalezione dla ${found} z ${total} dni.`,
    lowConfidence: 'Większość typów dni odgadnięto na podstawie dnia tygodnia.',
    estimated: 'Szacunkowo',
    noSession: 'Brak sesji',
    day: (spoken: string, plan: string, estimated: boolean, today: boolean) =>
      `${spoken}, ${plan}${estimated ? ', szacunkowo' : ''}${today ? ', dziś' : ''}`,
    session: (name: string, time: string) => `${name}, ${time}`,
    empty: {
      title: 'Brak kalendarza',
      body: 'Połącz kalendarz, by zobaczyć typy dni i to, gdzie pasują mocne sesje.',
      action: 'Połącz kalendarz',
    },
    error: {
      title: 'Nie udało się odczytać kalendarza.',
      body: 'Sprawdź uprawnienie i spróbuj ponownie.',
      retry: 'Spróbuj ponownie',
    },
  },

  suggestion: {
    // "Po Heavy legs w czwartek masz wieczorem kolację i w piątek lot."
    reason: (session: string, day: string, parts: string[]) => `Po ${session} ${on(day)} masz ${list(parts)}.`,
    lateEvent: (what: string) => `wieczorem ${event(what)}`,
    dayEvent: (day: string, what: string) => `${on(day)} ${event(what)}`,
    move: (day: string) => `Przenieś ${to(day)}`,
    keep: (day: string) => `Zostaw ${on(day)}`,
    moved: (session: string, day: string) => `${session}: przeniesiono ${to(day)}.`,
    undo: 'Cofnij',
    undone: (session: string, day: string) => `${session} wraca ${to(day)}.`,
    kept: (session: string, day: string) => `${session} zostaje ${on(day)}.`,
    preview: (toDayName: string, toPlan: string, fromDayName: string, fromPlan: string) =>
      `${cap(toDayName)}: ${toPlan}. ${cap(fromDayName)}: ${fromPlan}.`,
  },

  settings: {
    title: 'Ustawienia',
    privacy: 'Prywatność',
    privacyNote: 'Każdy wybór możesz zmienić w dowolnej chwili.',
    licences: 'Licencje',
    fonts: 'Czcionki: Manrope i Source Sans 3, na licencji SIL Open Font License 1.1.',
    model: 'Model wytrenowano na PMData (Simula, CC BY 4.0).',
    shaders: 'Płynny metal: powered by Paper Shaders (shaders.paper.design), licencja Apache 2.0.',
    connections: 'Połączenia',
    healthRow: { label: 'Dane o zdrowiu', status: 'Podgląd, niepołączone' },
    calendarWriteRow: { label: 'Zmiany w kalendarzu', status: 'Podgląd, wyłączone' },
  },

  progress: {
    title: 'Postępy',
    demoNote: 'Dane demo: zaplanowany tydzień Marty. To nie są prawdziwe dane użytkownika.',
    fit: {
      title: 'Dopasowanie planu',
      headline: (fit: number, answered: number, notFollowed: number) =>
        `Plan pasował w ${fit} z ${answered} ${plural(answered, 'dnia', 'dni', 'dni')}.` +
        (notFollowed > 0 ? ` ${notFollowed} ${dni(notFollowed)} poza planem.` : ''),
      source: 'Z twoich odpowiedzi na „Czy plan pasował?”.',
      legend: 'Wypełnione: plan pasował. Obrys: za ciężki albo za lekki. Linia przerywana: brak odpowiedzi albo poza planem.',
      tooFew: (n: number) => (n === 1 ? 'Na razie jeden dzień. Za mało, by wiele wyczytać.' : `Na razie ${n} ${dni(n)}. Za mało, by wiele wyczytać.`),
      status: { yes: 'Pasował', tooHard: 'Za ciężki', tooEasy: 'Za lekki', other: 'Poza planem', none: 'Brak odpowiedzi' },
      day: (day: string, plan: string, status: string) => `${day}, ${plan}, ${status}`,
    },
    logging: (days: number, of: number) => `Wpisy w ${days} z ostatnich ${of} dni.`,

    felt: { title: 'Odczucie a prognoza', note: 'Twoja poranna ocena obok prognozy Form.' },
    tabs: { label: 'Widoki postępów', fit: 'Dopasowanie', felt: 'Odczucie' },
    empty: {
      title: 'Brak ocen planu',
      body: 'Odpowiedz na „Czy plan pasował?” w wieczornym wpisie. Wynik pojawi się tutaj.',
      action: 'Przejdź do Dziś',
    },
    error: { title: 'Nie udało się wczytać historii.', body: 'Spróbuj ponownie za chwilę.', retry: 'Spróbuj ponownie' },
  },

  feltVsForecast: {
    title: 'Odczucie a prognoza',
    intro: 'Każdego ranka oceniasz, jak się czujesz. Tutaj ta ocena stoi obok prognozy Form z poprzedniego wieczoru.',
    scale: 'Twoja poranna ocena jest w skali do 10. Na linii pokazujemy ją ×10, obok prognozy 0–100.',
    chart: {
      title: 'Samopoczucie każdego ranka',
      a11y: (bars: string) => `Wykres słupkowy, samopoczucie każdego ranka, w skali do 10. ${bars}.`,
      bar: (day: string, felt: number) => `${day} ${tenths(felt)} z 10`,
      value: (felt: number) => `${tenths(felt)} z 10`,
      pill: (felt: number) => tenths(felt),
      dayCaption: 'Ranek',
      hint: 'Stuknij lub przesuń palcem po słupkach, by zobaczyć dany ranek.',
    },
    legend: { forecast: 'Prognoza', felt: 'Odczucie', range: 'Prawdopodobny zakres' },
    row: (felt: number, forecast: number, lo: number, hi: number) => `Odczucie ${tenths(felt)} z 10, prognoza ${forecast}, prawdopodobnie ${lo}–${hi}`,
    summary: (inside: number, days: number) =>
      `W ${inside} z ${days} ${plural(days, 'dnia', 'dni', 'dni')} odczucie mieściło się w prawdopodobnym zakresie.`,
    outside: 'Poza prawdopodobnym zakresem',
    a11y: (day: string, felt: number, forecast: number, lo: number, hi: number, inside: boolean) =>
      `${day}: odczucie ${tenths(felt)} z 10, prognoza ${forecast}, prawdopodobnie od ${lo} do ${hi}. ${inside ? 'W prawdopodobnym zakresie' : 'Poza prawdopodobnym zakresem'}.`,
    labelled: (n: number, of: number) => `Dni z oceną do tej pory: ${n} z ${of}.`,
    learning: 'W 21. dniu Form sprawdza, czy twój własny wzorzec przewiduje cię lepiej niż typowy.',
    tooFew: 'Za mało dni, by wiele wyczytać.',
    empty: {
      title: 'Brak ocen',
      body: 'Oceniaj każdego ranka w zakładce Dziś, jak się czujesz. Ocena pojawi się tutaj obok prognozy.',
      action: 'Przejdź do Dziś',
    },
    error: { title: 'Nie udało się wczytać historii.', body: 'Spróbuj ponownie za chwilę.', retry: 'Spróbuj ponownie' },
  },

  health: {
    title: 'Dane o zdrowiu',
    preview: 'Podgląd. W tym demo nic nie jest połączone.',
    body: 'Form odczytywałby kroki, spalone kalorie, aktywne minuty i sen z Apple Zdrowie lub Health Connect, by wpis uzupełniał się sam.',
    allow: 'Zezwól na dostęp (podgląd)',
    notNow: 'Nie teraz',
    reading: 'Łączenie z danymi o zdrowiu',
    done: { title: 'Tylko podgląd.', body: 'Nie odczytano żadnych danych o zdrowiu.', action: 'Gotowe' },
    error: {
      title: 'Odmówiono dostępu do danych o zdrowiu.',
      body: 'Spróbuj ponownie albo działaj bez nich. Możesz je połączyć później w Profilu.',
      retry: 'Spróbuj ponownie',
      without: 'Kontynuuj bez nich',
    },
    off: {
      title: 'Dane o zdrowiu są wyłączone.',
      body: 'Dla danych o zdrowiu wybrano „Nie teraz”. Zmień to w Profilu, w sekcji Prywatność, by je połączyć.',
      settings: 'Otwórz Prywatność',
    },
  },

  calendarWrite: {
    title: 'Zmiany w kalendarzu',
    preview: 'Podgląd. W tym demo nic nie jest połączone.',
    body: 'Form dodawałby do kalendarza sesje, które planujesz lub przenosisz, np. sesję przeniesioną na inny dzień. To coś innego niż odczyt kalendarza i pozostaje wyłączone, dopóki nie zezwolisz.',
    allow: 'Zezwól na zmiany (podgląd)',
    notNow: 'Nie teraz',
    reading: 'Łączenie z kalendarzem',
    done: { title: 'Tylko podgląd.', body: 'Kalendarz nie został zmieniony.', action: 'Gotowe' },
    error: {
      title: 'Odmówiono zmian w kalendarzu.',
      body: 'Spróbuj ponownie albo zostaw Form tylko z odczytem. Możesz to zmienić później w Profilu.',
      retry: 'Spróbuj ponownie',
      without: 'Zostaw tylko odczyt',
    },
    off: {
      title: 'Kalendarz jest wyłączony.',
      body: 'Zmiany wymagają najpierw dostępu do kalendarza. Włącz kalendarz w Profilu, w sekcji Prywatność.',
      settings: 'Otwórz Prywatność',
    },
  },

  drivers: {
    'recent-readiness': 'Ostatnia gotowość',
    sleep: 'Sen',
    'mood-and-stress': 'Nastrój i stres',
    'fatigue-and-soreness': 'Zmęczenie i zakwasy',
    'training-load': 'Obciążenie treningowe',
    'daily-activity': 'Codzienna aktywność',
    alcohol: 'Alkohol',
    'tomorrows-day-type': 'Typ jutrzejszego dnia',
  },

  inputs: {
    readiness: 'Poranna gotowość',
    sleep_hours: 'Godziny snu',
    sleep_quality: 'Jakość snu',
    mood: 'Nastrój',
    stress: 'Stres',
    fatigue: 'Zmęczenie',
    soreness: 'Zakwasy',
    workout_minutes: 'Minuty treningu',
    steps: 'Kroki',
    calories_burned: 'Spalone kalorie',
    very_active_minutes: 'Aktywne minuty',
  },
};
