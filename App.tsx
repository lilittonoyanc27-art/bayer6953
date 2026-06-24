import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Flame,
  Trophy,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Shuffle,
  RotateCcw,
  Volume2,
  Check,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Layers,
  Sparkle,
  Undo2,
  Bookmark,
  ChevronDown,
  Info
} from 'lucide-react';
import {
  coreSentences,
  regularConjugations,
  irregularVerbs,
  dialogueData,
  generateMatchCardsByCount,
  SentenceItem,
  MatchCard
} from './data';

// Application main language translations
const translations = {
  hy: {
    appTitle: 'Aprende Imperativo',
    appSubtitle: 'Իսպաներենի հրամայական եղանակի ինտերակտիվ ուսուցում',
    theory: 'Տեսություն և Աղյուսակներ',
    interactiveGames: 'Ինտերակտիվ Խաղեր',
    dictionary: 'Բառարան / Նախադասություններ',
    score: 'Միավորներ',
    streak: 'Անընդմեջ',
    correct: 'Ճիշտ է՛',
    incorrect: 'Սխալ է',
    check: 'Ստուգել',
    next: 'Հաջորդը',
    reset: 'Սկսել նորից',
    giveUp: 'Բաց թողնել',
    typeTranslation: 'Գրեք հրամայական նախադասությունը...',
    pronounHelp: 'Օգնություն դերանվան համար',
    listen: 'Լսել',
    allForms: 'Բոլոր ձևերը',
    notes: 'Կարևոր նշումներ',
    chooseGame: 'Ընտրեք խաղը',
    exceptionTitle: 'Բացառություններ և Անկանոն բայեր',
    conjugationTitle: 'Կանոնավոր խոնարհում',
    reflexiveTitle: 'Անդրադարձ բայեր',
    successRate: 'Արդյունավետություն',
    congrats: 'Շնորհավորո՜ւմ ենք',
    gameFinished: 'Խաղն ավարտվեց:',
    restartGame: 'Խաղալ կրկին',
    hint: 'Հուշում'
  },
  ru: {
    appTitle: 'Aprende Imperativo',
    appSubtitle: 'Интерактивное изучение повелительного наклонения испанского языка',
    theory: 'Теория и Таблицы',
    interactiveGames: 'Интерактивные Игры',
    dictionary: 'Словарь / Предложения',
    score: 'Очки',
    streak: 'Рекорд',
    correct: 'Правильно!',
    incorrect: 'Неверно',
    check: 'Проверить',
    next: 'Далее',
    reset: 'Сбросить',
    giveUp: 'Пропустить',
    typeTranslation: 'Введите предложение в повелительном наклонении...',
    pronounHelp: 'Справка по местоимениям',
    listen: 'Слушать',
    allForms: 'Все формы',
    notes: 'Важные примечания',
    chooseGame: 'Выберите игру',
    exceptionTitle: 'Исключения и неправильные глаголы',
    conjugationTitle: 'Спряжение правильных глаголов',
    reflexiveTitle: 'Возвратные глаголы',
    successRate: 'Успешность',
    congrats: 'Поздравляем!',
    gameFinished: 'Игра окончена!',
    restartGame: 'Играть снова',
    hint: 'Подсказка'
  },
  en: {
    appTitle: 'Aprende Imperativo',
    appSubtitle: 'Interactive Spanish Imperative Mood Trainer',
    theory: 'Theory & Tables',
    interactiveGames: 'Interactive Games',
    dictionary: 'Dictionary / Sentences',
    score: 'Score',
    streak: 'Streak',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    check: 'Check',
    next: 'Next',
    reset: 'Reset',
    giveUp: 'Skip',
    typeTranslation: 'Type the command sentence...',
    pronounHelp: 'Pronoun help',
    listen: 'Listen',
    allForms: 'All forms',
    notes: 'Important Notes',
    chooseGame: 'Choose a Game',
    exceptionTitle: 'Exceptions & Irregular Verbs',
    conjugationTitle: 'Regular Conjugations',
    reflexiveTitle: 'Reflexive Verbs',
    successRate: 'Success Rate',
    congrats: 'Congratulations!',
    gameFinished: 'Game Finished!',
    restartGame: 'Play Again',
    hint: 'Hint'
  }
};

export default function App() {
  const [uiLang, setUiLang] = useState<'hy' | 'ru' | 'en'>('ru');
  const [activeTab, setActiveTab] = useState<'dictionary' | 'games' | 'theory'>('games');
  
  // Game stats
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Selected game
  // 1: Transformer, 2: Conjugation Master, 3: Reflexive builder, 4: Dialogue Roleplay, 5: Match memory
  const [activeGame, setActiveGame] = useState<number | null>(null);

  const t = translations[uiLang];

  // TTS helper
  const speakSpanish = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove upside-down exclamation mark and clean
      const cleaned = text.replace(/[¡!¿?]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCorrectAnswer = (pts = 10) => {
    setScore(prev => prev + pts);
    setStreak(prev => {
      const next = prev + 1;
      if (next > maxStreak) setMaxStreak(next);
      return next;
    });
  };

  const handleIncorrectAnswer = () => {
    setStreak(0);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF0] text-slate-800 font-sans selection:bg-amber-200 selection:text-slate-900 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <nav id="sidebar-nav" className="w-full md:w-80 bg-[#6366F1] rounded-[32px] md:rounded-[40px] p-6 md:p-8 flex flex-col justify-between gap-6 shadow-2xl text-white shrink-0">
        <div className="flex flex-col gap-6">
          {/* Logo and App Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-indigo-950 font-black text-2xl shadow-lg shadow-indigo-900/10">
              !
            </div>
            <div>
              <h1 className="text-2.5xl font-black tracking-wider text-white uppercase font-sans">
                Imperativo
              </h1>
              <p className="text-[10px] text-indigo-200 font-semibold">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="bg-indigo-900/40 p-1 rounded-2xl border border-indigo-500/20 flex shadow-inner">
            {(['ru', 'hy', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setUiLang(lang)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  uiLang === lang
                    ? 'bg-white text-indigo-950 shadow-md'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang === 'ru' ? 'RU' : lang === 'hy' ? 'ՀԱՅ' : 'EN'}
              </button>
            ))}
          </div>

          {/* Nav Links / Tabs */}
          <div className="flex flex-col gap-3">
            <button
              id="tab-games"
              onClick={() => { setActiveTab('games'); }}
              className={`w-full flex items-center gap-4 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all border-2 ${
                activeTab === 'games'
                  ? 'bg-white/20 border-white/10 text-white font-black'
                  : 'border-transparent text-indigo-100 hover:bg-white/10'
              }`}
            >
              <Gamepad2 className="w-5 h-5 text-yellow-300" />
              <span>{t.interactiveGames}</span>
            </button>

            <button
              id="tab-theory"
              onClick={() => { setActiveTab('theory'); }}
              className={`w-full flex items-center gap-4 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all border-2 ${
                activeTab === 'theory'
                  ? 'bg-white/20 border-white/10 text-white font-black'
                  : 'border-transparent text-indigo-100 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-5 h-5 text-yellow-300" />
              <span>{t.theory}</span>
            </button>

            <button
              id="tab-dictionary"
              onClick={() => { setActiveTab('dictionary'); }}
              className={`w-full flex items-center gap-4 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all border-2 ${
                activeTab === 'dictionary'
                  ? 'bg-white/20 border-white/10 text-white font-black'
                  : 'border-transparent text-indigo-100 hover:bg-white/10'
              }`}
            >
              <Layers className="w-5 h-5 text-yellow-300" />
              <span>{t.dictionary}</span>
            </button>
          </div>
        </div>

        {/* Stats Block inside sidebar */}
        <div className="flex flex-col gap-3 mt-4">
          {/* Score stat */}
          <div id="stat-score" className="bg-indigo-800/40 border border-indigo-500/20 p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-indigo-950 shadow-md">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="font-sans">
                <span className="block text-[9px] text-indigo-200 uppercase font-black tracking-widest">{t.score}</span>
                <span className="text-lg font-black text-white">{score}</span>
              </div>
            </div>
          </div>

          {/* Streak stat */}
          <div id="stat-streak" className="bg-indigo-800/40 border border-indigo-500/20 p-4 rounded-3xl flex items-center justify-between">
            <div className={`flex items-center gap-3 transition-transform ${streak > 0 ? 'scale-105' : ''}`}>
              <div className="w-10 h-10 bg-[#FF5C00] rounded-xl flex items-center justify-center text-white shadow-md animate-bounce">
                <Flame className="w-5 h-5" />
              </div>
              <div className="font-sans">
                <span className="block text-[9px] text-indigo-200 uppercase font-black tracking-widest">{t.streak}</span>
                <span className="text-lg font-black text-white">{streak}</span>
              </div>
            </div>
            {maxStreak > 0 && (
              <span className="text-[10px] bg-white/10 text-indigo-100 px-2.5 py-1 rounded-md font-mono font-bold">
                Max {maxStreak}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'games' && (
            <motion.div
              key="games-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeGame === null ? (
                <div className="space-y-6">
                  {/* Game Hub Greeting */}
                  <div className="bg-[#FAF7ED] border border-amber-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 text-amber-500/5 pointer-events-none">
                      <Gamepad2 className="w-64 h-64" />
                    </div>
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-4">
                        <Sparkle className="w-3.5 h-3.5 animate-spin" />
                        <span>¡Imperativo en Acción!</span>
                      </div>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {uiLang === 'hy' ? 'Ինչպե՞ս կցանկանաք մարզվել այսօր' : uiLang === 'ru' ? 'Как вы хотите потренироваться сегодня?' : 'How would you like to practice today?'}
                      </h2>
                      <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
                        {uiLang === 'hy'
                          ? 'Ընտրեք 5 հատուկ պատրաստված խաղերից մեկը, որոնք կօգնեն ձեզ արագ և առանց լարվածության յուրացնել իսպաներենի հրամայական եղանակը:'
                          : uiLang === 'ru'
                          ? 'Выберите одну из 5 специально разработанных игр, которые помогут вам быстро и без стресса освоить повелительное наклонение испанского языка.'
                          : 'Choose one of 5 specially crafted games that will help you master the Spanish imperative mood fast and without stress.'}
                      </p>
                    </div>
                  </div>

                  {/* 5 Games Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Game 1 */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white border-4 border-indigo-100/50 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveGame(1)}
                    >
                      <div>
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-black text-xl mb-4 shadow-sm">1</div>
                        <h3 className="text-lg font-black text-slate-800 mb-2 font-sans tracking-tight">
                          {uiLang === 'hy' ? 'Նախադասությունների Տրանսֆորմատոր' : uiLang === 'ru' ? 'Трансформатор Предложений' : 'Sentence Transformer'}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {uiLang === 'hy'
                            ? 'Փոխակերպեք սովորական նախադասությունները հրամայականի: Գործնական վարժություններ թարգմանությամբ և հուշումներով:'
                            : uiLang === 'ru'
                            ? 'Преобразуйте обычные предложения в повелительные. Практика на реальных примерах с переводом и подсказками.'
                            : 'Transform regular sentences into imperatives. Real practice examples with translation and suggestions.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-600 border-t border-slate-50 pt-3">
                        <span>{uiLang === 'hy' ? 'Սկսել խաղը' : uiLang === 'ru' ? 'Начать играть' : 'Play Game'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Game 2 */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white border-4 border-indigo-100/50 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveGame(2)}
                    >
                      <div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl mb-4 shadow-sm">2</div>
                        <h3 className="text-lg font-black text-slate-800 mb-2 font-sans tracking-tight">
                          {uiLang === 'hy' ? 'Խոնարհման Վարպետ' : uiLang === 'ru' ? 'Мастер Сопряжения' : 'Conjugation Master'}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {uiLang === 'hy'
                            ? 'Արագ արձագանքման խաղ: Խոնարհեք բայերը տարբեր դեմքերով (Tú, Usted, Vosotros, Nosotros, Ustedes):'
                            : uiLang === 'ru'
                            ? 'Игра на быструю реакцию. Спрягайте глаголы для разных лиц: Tú, Usted, Vosotros, Nosotros, Ustedes.'
                            : 'Fast-paced conjugation challenge. Conjugate verbs for various pronouns: Tú, Usted, Vosotros, etc.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-600 border-t border-slate-50 pt-3">
                        <span>{uiLang === 'hy' ? 'Սկսել խաղը' : uiLang === 'ru' ? 'Начать играть' : 'Play Game'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Game 3 */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white border-4 border-indigo-100/50 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveGame(3)}
                    >
                      <div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl mb-4 shadow-sm">3</div>
                        <h3 className="text-lg font-black text-slate-800 mb-2 font-sans tracking-tight">
                          {uiLang === 'hy' ? 'Անդրադարձ Փազլներ' : uiLang === 'ru' ? 'Возвратный Конструктор' : 'Reflexive Builder'}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {uiLang === 'hy'
                            ? 'Հավաքեք բլոկներից անդրադարձ բայերի հրամայական ձևերը: Ուշադրություն դարձրեք շեշտադրությանը և դերանվան տեղին:'
                            : uiLang === 'ru'
                            ? 'Соберите из блоков повелительные формы возвратных глаголов. Практикуйте расстановку ударений и местоимений.'
                            : 'Assemble reflexive verb commands from puzzle blocks. Practice proper placement and missing written accents.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-600 border-t border-slate-50 pt-3">
                        <span>{uiLang === 'hy' ? 'Սկսել խաղը' : uiLang === 'ru' ? 'Начать играть' : 'Play Game'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Game 4 */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white border-4 border-indigo-100/50 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveGame(4)}
                    >
                      <div>
                        <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-black text-xl mb-4 shadow-sm">4</div>
                        <h3 className="text-lg font-black text-slate-800 mb-2 font-sans tracking-tight">
                          {uiLang === 'hy' ? 'Խոսակցական Դիալոգներ' : uiLang === 'ru' ? 'Диалоги с Приказами' : 'Dialogue Roleplay'}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {uiLang === 'hy'
                            ? 'Լրացրեք իրական կյանքից վերցված երկխոսությունները՝ մոր, մարզչի կամ կինոթատրոնում հաճախորդների կողմից տրվող հրահանգներով:'
                            : uiLang === 'ru'
                            ? 'Заполняйте диалоги из реальной жизни: указания от матери, тренера или инструкции в кинотеатре.'
                            : 'Fill in live conversational dialogues: instructions from a mother, a strict trainer, or guidance at the cinema.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-teal-600 border-t border-slate-50 pt-3">
                        <span>{uiLang === 'hy' ? 'Սկսել խաղը' : uiLang === 'ru' ? 'Начать играть' : 'Play Game'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Game 5 */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white border-4 border-indigo-100/50 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveGame(5)}
                    >
                      <div>
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 font-black text-xl mb-4 shadow-sm">5</div>
                        <h3 className="text-lg font-black text-slate-800 mb-2 font-sans tracking-tight">
                          {uiLang === 'hy' ? 'Հայ-Իսպանական Հրամանների Համընկնում' : uiLang === 'ru' ? 'Матч: Армянский & Испанский' : 'Armenian-Spanish Command Match'}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {uiLang === 'hy'
                            ? 'Մարզեք Ձեր հիշողությունը՝ գտնելով հայերեն հրամանների և դրանց իսպաներեն թարգմանությունների համապատասխան զույգերը:'
                            : uiLang === 'ru'
                            ? 'Тренируйте зрительную память, сопоставляя армянские фразы-команды с их точными испанскими переводами.'
                            : 'Match Armenian instructions with their corresponding Spanish imperative equivalents. Great for reinforcement.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-rose-600 border-t border-slate-50 pt-3">
                        <span>{uiLang === 'hy' ? 'Սկսել խաղը' : uiLang === 'ru' ? 'Начать играть' : 'Play Game'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                /* Sub-Game Router layout */
                <div>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 mb-6 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs rounded-2xl transition-all"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>{uiLang === 'hy' ? 'Վերադառնալ խաղերի ցանկ' : uiLang === 'ru' ? 'Назад к списку игр' : 'Back to Games'}</span>
                  </button>

                  <div className="bg-white border-4 border-indigo-100/55 shadow-2xl rounded-[32px] md:rounded-[40px] p-6 sm:p-10">
                    {activeGame === 1 && <SentenceTransformerGame t={t} uiLang={uiLang} handleCorrect={handleCorrectAnswer} handleIncorrect={handleIncorrectAnswer} speak={speakSpanish} />}
                    {activeGame === 2 && <ConjugationMasterGame t={t} uiLang={uiLang} handleCorrect={handleCorrectAnswer} handleIncorrect={handleIncorrectAnswer} speak={speakSpanish} />}
                    {activeGame === 3 && <ReflexiveBuilderGame t={t} uiLang={uiLang} handleCorrect={handleCorrectAnswer} handleIncorrect={handleIncorrectAnswer} speak={speakSpanish} />}
                    {activeGame === 4 && <DialogueQuestGame t={t} uiLang={uiLang} handleCorrect={handleCorrectAnswer} handleIncorrect={handleIncorrectAnswer} speak={speakSpanish} />}
                    {activeGame === 5 && <ArmenianSpanishMatchGame t={t} uiLang={uiLang} handleCorrect={handleCorrectAnswer} handleIncorrect={handleIncorrectAnswer} speak={speakSpanish} />}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Theory Section */}
          {activeTab === 'theory' && (
            <motion.div
              key="theory-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Introduction Box */}
              <div className="bg-[#FAF7ED] border border-amber-200 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <GraduationCap className="text-amber-500 w-5 h-5" />
                  <span>{uiLang === 'hy' ? 'Ի՞նչ է հրամայական եղանակը (El Imperativo)' : uiLang === 'ru' ? 'Что такое повелительное наклонение (El Imperativo)?' : 'What is the Imperative Mood?'}</span>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {uiLang === 'hy'
                    ? 'Հրամայական եղանակը (Imperativo) օգտագործվում է պատվերներ, հրահանգներ, խորհուրդներ տալու կամ խնդրանքներ արտահայտելու համար: Այն ունի երկու հիմնական ձև` Հաստատական (afirmativo) և Ժխտական (negativo): Իսպաներենում ժխտական հրամայականը լիովին համընկնում է Subjuntivo (ըղձական) եղանակի հետ, ուստի պահանջում է հատուկ ուշադրություն:'
                    : uiLang === 'ru'
                    ? 'Повелительное наклонение (Imperativo) служит для выражения приказов, советов, просьб или инструкций. Оно разделяется на Утвердительное (afirmativo) и Отрицательное (negativo). В испанском языке отрицательное повелительное полностью совпадает с сослагательным наклонением (Subjuntivo), поэтому требует особого внимания.'
                    : 'The Imperative Mood (Imperativo) is used to express commands, instructions, advice, or polite requests. It is divided into Affirmative (afirmativo) and Negative (negativo). In Spanish, the negative imperative fully matches the subjunctive layout, requiring focused attention.'}
                </p>
              </div>

              {/* Grid 1: Regular conjugations */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 border-b border-sans border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{t.conjugationTitle}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {regularConjugations.map((item, index) => (
                    <div key={index} className="bg-slate-55 bg-[#FCFBF7] rounded-xl border border-amber-100/50 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-sm uppercase text-slate-500 font-bold">{item.type}</span>
                        <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md">Regu</span>
                      </div>
                      <h4 className="text-md font-bold text-slate-900">{item.verb}</h4>
                      <p className="text-xs text-slate-500 mb-4">{item.translation}</p>

                      <div className="space-y-2.5">
                        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                          {uiLang === 'hy' ? 'Աֆիրմատիվ (Հաստատական)' : uiLang === 'ru' ? 'Утвердительное (Afirmativo)' : 'Affirmative'}
                        </div>
                        <ul className="text-xs space-y-1 bg-white p-2 rounded-lg border border-slate-100 font-mono">
                          <li className="flex justify-between">
                            <span className="text-slate-400">tú</span>
                            <span className="font-bold text-slate-800 font-sans">{item.forms.affirmative.tu}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-400">vosotros</span>
                            <span className="font-bold text-slate-800 font-sans">{item.forms.affirmative.vosotros}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-400">Ud. (usted)</span>
                            <span className="font-bold text-slate-800 font-sans">{item.forms.affirmative.usted}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-400">nosotros</span>
                            <span className="font-bold text-slate-800 font-sans">{item.forms.affirmative.nosotros}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-400">Uds. (ustedes)</span>
                            <span className="font-bold text-slate-800 font-sans">{item.forms.affirmative.ustedes}</span>
                          </li>
                        </ul>

                        <div className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md">
                          {uiLang === 'hy' ? 'Նեգատիվ (Ժխտական)' : uiLang === 'ru' ? 'Отрицательное (Negativo)' : 'Negative'}
                        </div>
                        <ul className="text-xs space-y-1 bg-white p-2 rounded-lg border border-slate-100 font-mono">
                          <li className="flex justify-between font-sans">
                            <span className="text-slate-400 font-mono">tú</span>
                            <span className="font-bold text-rose-600">{item.forms.negative.tu}</span>
                          </li>
                          <li className="flex justify-between font-sans">
                            <span className="text-slate-400 font-mono">vosotros</span>
                            <span className="font-bold text-rose-600">{item.forms.negative.vosotros}</span>
                          </li>
                          <li className="flex justify-between font-sans">
                            <span className="text-slate-400 font-mono">Ud. (usted)</span>
                            <span className="font-bold text-rose-600">{item.forms.negative.usted}</span>
                          </li>
                          <li className="flex justify-between font-sans">
                            <span className="text-slate-400 font-mono">nosotros</span>
                            <span className="font-bold text-rose-600">{item.forms.negative.nosotros}</span>
                          </li>
                          <li className="flex justify-between font-sans">
                            <span className="text-slate-400 font-mono">Uds. (ustedes)</span>
                            <span className="font-bold text-rose-600">{item.forms.negative.ustedes}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid 2: Exceptions and Irregulars */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 border-b border-sans border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>{t.exceptionTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {uiLang === 'hy'
                    ? 'Որոշ բայեր ունեն յուրահատուկ, կրճատված հաստատական ձևեր (մասնավորապես Tú ձևի համար): Ժխտական ձևերը կառուցվում են subjuntivo-ի արմատով:'
                    : uiLang === 'ru'
                    ? 'Некоторые глаголы имеют уникальные усечённые утвердительные формы (особенно для Tú). Отрицательные формы строятся на основе сослагательного наклонения.'
                    : 'A group of common verbs have shortened stems in the affirmative "tú" command. Negative formats trace their subjunctive equivalents.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {irregularVerbs.map((verb, vIdx) => (
                    <div key={vIdx} className="bg-[#FAF7ED]/30 rounded-xl border border-slate-100 p-4 hover:bg-amber-50/20 transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-extrabold text-slate-900">{verb.verb}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium">{verb.translationArmenian}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/30">
                          <span className="block text-[10px] text-emerald-800 uppercase font-bold tracking-wider">Tú (Afirmativo)</span>
                          <span className="text-sm font-bold text-emerald-700 animate-pulse">{verb.affirmativeTu}</span>
                        </div>
                        <div className="bg-rose-50/50 p-2 rounded-lg border border-rose-100/30">
                          <span className="block text-[10px] text-rose-800 uppercase font-bold tracking-wider">Tú (Negativo)</span>
                          <span className="text-sm font-bold text-rose-700">{verb.negativeTu}</span>
                        </div>
                      </div>

                      {/* Accordion snippet for completes */}
                      <details className="mt-2.5 text-xs text-slate-500 group">
                        <summary className="cursor-pointer list-none flex items-center justify-between py-1 bg-slate-50 px-2 rounded-md hover:bg-slate-100">
                          <span className="font-semibold text-slate-700">{t.allForms}</span>
                          <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="pt-2 grid grid-cols-2 gap-3 pl-1">
                          <div className="space-y-1 font-mono">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Afirmativo:</span>
                            <div className="flex justify-between"><span className="text-[10px]">tú</span> <span className="font-bold text-slate-700 font-sans">{verb.completeAffirmative.tu}</span></div>
                            <div className="flex justify-between"><span className="text-[10px]">vosotros</span> <span className="font-bold text-slate-700 font-sans">{verb.completeAffirmative.vosotros}</span></div>
                            <div className="flex justify-between"><span className="text-[10px]">Ud.</span> <span className="font-bold text-slate-700 font-sans">{verb.completeAffirmative.usted}</span></div>
                            <div className="flex justify-between"><span className="text-[10px]">nosotros</span> <span className="font-bold text-slate-700 font-sans">{verb.completeAffirmative.nosotros}</span></div>
                            <div className="flex justify-between"><span className="text-[10px]">Uds.</span> <span className="font-bold text-slate-700 font-sans">{verb.completeAffirmative.ustedes}</span></div>
                          </div>
                          <div className="space-y-1 font-mono">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Negativo:</span>
                            <div className="flex justify-between font-sans"><span className="text-[10px] font-mono">tú</span> <span className="font-bold text-rose-600">{verb.completeNegative.tu}</span></div>
                            <div className="flex justify-between font-sans"><span className="text-[10px] font-mono">vosotros</span> <span className="font-bold text-rose-600">{verb.completeNegative.vosotros}</span></div>
                            <div className="flex justify-between font-sans"><span className="text-[10px] font-mono">Ud.</span> <span className="font-bold text-rose-600">{verb.completeNegative.usted}</span></div>
                            <div className="flex justify-between font-sans"><span className="text-[10px] font-mono">nosotros</span> <span className="font-bold text-rose-600">{verb.completeNegative.nosotros}</span></div>
                            <div className="flex justify-between font-sans"><span className="text-[10px] font-mono">Uds.</span> <span className="font-bold text-rose-600">{verb.completeNegative.ustedes}</span></div>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 bg-amber-50/50 p-2 rounded border border-amber-100/30">
                          <strong>Note:</strong> {verb.note}
                        </p>
                      </details>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid 3: Pronoun Placement with Reflexive verbs */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 border-b border-sans border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{t.reflexiveTitle} (Reglas de Pronombres)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3 bg-[#FCFBF7] p-4 rounded-xl border border-amber-100/50">
                    <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{uiLang === 'hy' ? '1. Հաստատական ձև (Afirmativo)' : uiLang === 'ru' ? '1. Утвердительное (Afirmativo)' : '1. Affirmative Layout'}</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {uiLang === 'hy'
                        ? 'Դերանունները կպչում են բային հետևից՝ կազմելով մեկ բառ: Քանի որ բառը երկարում է, հաճախ պահանջվում է գրավոր շեշտ (tilde):'
                        : uiLang === 'ru'
                        ? 'Местоимения присоединяются прямо к концу глагола, образуя единое слово. Из-за удлинения слова часто требуется поставить письменное ударение (tilde).'
                        : 'Pronouns attach directly to the end of the verb, forming a single compound word. Adding ending particles often requires writing a graphical accent (tilde).'}
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-slate-100 font-mono text-xs space-y-2">
                      <div>
                        <span className="text-slate-400 block">Levantarse (tú):</span>
                        <span className="font-bold text-slate-800 font-sans">Levanta + te = <span className="text-emerald-700 font-bold underline">Levántate</span></span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Ducharse (tú):</span>
                        <span className="font-bold text-slate-800 font-sans">Ducha + te = <span className="text-emerald-700 font-bold underline">Dúchate</span></span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Lavarse (las manos):</span>
                        <span className="font-bold text-slate-800 font-sans">Lava + te = <span className="text-emerald-700 font-bold underline">Lávate</span> las manos</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-[#FCFBF7] p-4 rounded-xl border border-amber-100/50">
                    <h4 className="font-bold text-rose-800 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>{uiLang === 'hy' ? '2. Ժխտական ձև (Negativo)' : uiLang === 'ru' ? '2. Отрицательное (Negativo)' : '2. Negative Layout'}</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {uiLang === 'hy'
                        ? 'Դերանունները դրվում են բայից ԱՌԱՋ, «No» մասնիկից հետո առանձին բառով: Շեշտադրության փոփոխություն տեղի չի ունենում:'
                        : uiLang === 'ru'
                        ? 'Местоимения ставятся ОТДЕЛЬНО ПЕРЕД глаголом, сразу после частицы «No». Никаких дополнительных ударений ставить не нужно.'
                        : 'Pronouns are placed SEPARATELY BEFORE the verb, immediately following the "No" negation particle. No accent changes occur.'}
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-slate-100 font-mono text-xs space-y-2">
                      <div>
                        <span className="text-slate-400 block">No levantarse (tú):</span>
                        <span className="font-bold text-slate-800 font-sans">No <span className="text-rose-600 font-bold underline">te levantes</span></span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">No ducharse (tú):</span>
                        <span className="font-bold text-slate-800 font-sans">No <span className="text-rose-600 font-bold underline">te duches</span></span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">No lavarse (las manos):</span>
                        <span className="font-bold text-slate-800 font-sans">No <span className="text-rose-600 font-bold underline">te laves</span> las manos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dictionary / Vocabulary Lists Screen */}
          {activeTab === 'dictionary' && (
            <motion.div
              key="dictionary-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-[#FAF7ED] border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Layers className="text-amber-500 w-5 h-5" />
                    <span>{uiLang === 'hy' ? 'Կառուցվածքային ցանկեր' : uiLang === 'ru' ? 'Структурированные Списки' : 'Structured Tables'}</span>
                  </h3>
                  <p className="text-xs text-slate-600 max-w-2xl">
                    {uiLang === 'hy'
                      ? 'Դիտեք և սովորեք բոլոր նախադասությունները: Սեղմեք բարձրախոսի վրա` արտասանությունը լսելու համար: Կարող եք նաև թաքցնել իսպաներեն թարգմանությունները ինքնաստուգման համար:'
                      : uiLang === 'ru'
                      ? 'Изучайте повелительные конструкции по категориям. Нажмите на иконку звука, чтобы услышать правильное испанское произношение, или скройте ответы для самопроверки.'
                      : 'Explore instructions grouped by types. Tap the voice icon to hear natural pronounciation or toggle quiz mode for self-testing.'}
                  </p>
                </div>
              </div>

              {/* Sentences table with category selectors */}
              <DictionaryViewer t={t} uiLang={uiLang} speak={speakSpanish} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* =====================================================================================
   DICTIONARY / TABLE VIEWER COMPONENT (With interactive Self-Quiz toggles)
   ===================================================================================== */
function DictionaryViewer({ t, uiLang, speak }: { t: any; uiLang: 'hy' | 'ru' | 'en'; speak: (txt: string) => void }) {
  const [activeDictionaryTab, setActiveDictionaryTab] = useState<'all' | 'affirmative' | 'negative' | 'irregular' | 'reflexive' | 'exercise'>('all');
  const [hideSpanish, setHideSpanish] = useState<boolean>(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const filteredSentences = useMemo(() => {
    if (activeDictionaryTab === 'all') return coreSentences;
    return coreSentences.filter(s => s.category === activeDictionaryTab);
  }, [activeDictionaryTab]);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'affirmative': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'negative': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'irregular': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'reflexive': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (uiLang === 'hy') {
      switch(cat) {
        case 'affirmative': return 'Հաստատական';
        case 'negative': return 'Ժխտական';
        case 'irregular': return 'Անկանոն բայեր';
        case 'reflexive': return 'Անդրադարձ բայեր';
        default: return 'Վարժություն';
      }
    } else if (uiLang === 'ru') {
      switch(cat) {
        case 'affirmative': return 'Утвердительные';
        case 'negative': return 'Отрицательные';
        case 'irregular': return 'Неправильные';
        case 'reflexive': return 'Возвратные';
        default: return 'Упражнение';
      }
    } else {
      switch(cat) {
        case 'affirmative': return 'Affirmative';
        case 'negative': return 'Negative';
        case 'irregular': return 'Irregular';
        case 'reflexive': return 'Reflexive';
        default: return 'Exercise';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Filter Control Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#FAF7ED] rounded-xl border border-amber-100">
        {(['all', 'affirmative', 'negative', 'irregular', 'reflexive', 'exercise'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveDictionaryTab(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
              activeDictionaryTab === cat
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/30'
            }`}
          >
            {cat === 'all' ? (uiLang === 'hy' ? 'Բոլորը' : uiLang === 'ru' ? 'Все' : 'All') : getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hideSpanish}
            onChange={(e) => {
              setHideSpanish(e.target.checked);
              setRevealedIds({});
            }}
            className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400"
          />
          <span className="text-xs font-bold text-slate-700">
            {uiLang === 'hy'
              ? 'Թաքցնել պատասխանները (ինքնաստուգում)'
              : uiLang === 'ru'
              ? 'Скрыть ответы для самопроверки'
              : 'Hide answer columns (Self-test)'}
          </span>
        </label>
        {hideSpanish && (
          <span className="text-[10px] text-amber-600 font-bold uppercase animate-pulse">
            {uiLang === 'hy' ? 'Սեղմեք տողի վրա` բացելու համար' : uiLang === 'ru' ? 'Нажмите на строку для раскрытия' : 'Click row to reveal'}
          </span>
        )}
      </div>

      {/* Database list layout */}
      <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                <th className="px-4 py-3">{uiLang === 'hy' ? 'Կատեգորիա' : uiLang === 'ru' ? 'Категория' : 'Category'}</th>
                <th className="px-4 py-3">{uiLang === 'hy' ? 'Սովորական նախադասություն' : uiLang === 'ru' ? 'Обычная фраза' : 'Normal Phrase'}</th>
                <th className="px-4 py-3">{uiLang === 'hy' ? 'Հրամայական' : uiLang === 'ru' ? 'Повелительное' : 'Imperative mood'}</th>
                <th className="px-4 py-3">{uiLang === 'hy' ? 'Հայերեն' : uiLang === 'ru' ? 'Армянский' : 'Armenian'}</th>
                <th className="px-4 py-3 text-center">A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <AnimatePresence initial={false}>
                {filteredSentences.map((item) => {
                  const isRevealed = revealedIds[item.id] || !hideSpanish;
                  return (
                    <motion.tr
                      key={item.id}
                      layoutId={`row-${item.id}`}
                      onClick={() => hideSpanish && toggleReveal(item.id)}
                      className={`hover:bg-slate-50 transition-colors ${hideSpanish ? 'cursor-pointer' : ''}`}
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                          {getCategoryLabel(item.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600">
                        {item.original}
                      </td>
                      <td className="px-4 py-3.5 font-bold font-sans">
                        {isRevealed ? (
                          <span className="text-amber-800 flex items-center gap-1.5">
                            {item.imperative}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speak(item.imperative);
                              }}
                              className="text-slate-400 hover:text-amber-600 p-1 rounded-md hover:bg-amber-50 transition-colors"
                              title="Listen"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ) : (
                          <span className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-400 px-3 py-1 rounded-md font-mono select-none">
                            🔍 ???
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium font-sans">
                        {item.armenian}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(item.imperative);
                          }}
                          className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================================
   GAME 1: SENTENCE TRANSFORMER GAME
   ===================================================================================== */
function SentenceTransformerGame({ t, uiLang, handleCorrect, handleIncorrect, speak }: any) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Selected pool
  const pool = useMemo(() => {
    return [...coreSentences].sort(() => Math.random() - 0.5);
  }, []);

  const currentItem = pool[currentIdx] || pool[0];

  const checkAnswer = () => {
    if (!currentItem) return;
    const cleanUser = userInput.trim().replace(/[¡!.,]/g, '').toLowerCase();
    const cleanTarget = currentItem.imperative.trim().replace(/[¡!.,]/g, '').toLowerCase();

    const correct = cleanUser === cleanTarget;
    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      handleCorrect(15);
      speak(currentItem.imperative);
    } else {
      handleIncorrect();
    }
  };

  const nextQuestion = () => {
    setHasChecked(false);
    setUserInput('');
    setShowHint(false);
    setCurrentIdx((prev) => (prev + 1) % pool.length);
  };

  const insertChar = (char: string) => {
    setUserInput((prev) => prev + char);
  };

  if (!currentItem) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900 select-none">
          {uiLang === 'hy' ? 'Խաղ 1: Նախադասության Տրանսֆորմատոր' : uiLang === 'ru' ? 'Игра 1: Трансформатор предложений' : 'Game 1: Sentence Transformer'}
        </h3>
        <span className="text-xs text-slate-400 font-mono tracking-wider">{currentIdx + 1} / {pool.length}</span>
      </div>

      <div className="bg-[#FCFBF7] border border-amber-100/50 rounded-2xl p-5 text-center relative overflow-hidden">
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 text-amber-800 bg-amber-50 rounded-full border border-amber-200">
          {uiLang === 'hy' ? 'Սովորական նախադասություն' : uiLang === 'ru' ? 'Обычное предложение' : 'Normal statement'}
        </span>
        <h4 className="text-2xl font-extrabold text-slate-900 mt-2 select-all font-sans">
          {currentItem.original}
        </h4>
        <div className="h-px bg-slate-100 my-3.5" />
        <p className="text-sm text-slate-500 italic mt-1.5 flex items-center justify-center gap-1">
          <Bookmark className="w-3.5 h-3.5 text-amber-500" />
          <span>{currentItem.armenian}</span>
        </p>
      </div>

      {/* Input row */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-600 uppercase">
          {uiLang === 'hy' ? 'Գրեք հաստատական կամ ժխտական հրամայական ձևը:' : uiLang === 'ru' ? 'Введите утвердительную или отрицательную повелительную форму:' : 'Write affirmative or negative imperative:'}
        </label>
        
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={hasChecked}
            placeholder={t.typeTranslation}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !hasChecked) checkAnswer();
            }}
            className={`w-full px-4 py-3.5 text-base rounded-xl font-bold font-sans border transition-all ${
              hasChecked
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none'
            }`}
          />

          {hasChecked && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600" />
              )}
            </div>
          )}
        </div>

        {/* Special Letters Keyboard Helper */}
        {!hasChecked && (
          <div className="flex flex-wrap gap-1.5 justify-center py-2 bg-slate-50 rounded-xl px-2">
            {(['á', 'é', 'í', 'ó', 'ú', 'ñ', 'í', '¡', '¿'] as const).map((char) => (
              <button
                key={char}
                onClick={() => insertChar(char)}
                className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-amber-50 active:bg-amber-100 transition-colors shadow-xs"
              >
                {char}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feedback & Corrections UI */}
      {hasChecked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <div>
                <p className="text-sm font-bold text-emerald-800">{t.correct} 🎉</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs bg-emerald-100 font-bold px-2 py-0.5 rounded text-emerald-800">Target:</span>
                  <span className="font-bold text-slate-800 font-sans">{currentItem.imperative}</span>
                </div>
                {currentItem.explanation && (
                  <p className="text-xs text-emerald-700/80 mt-1.5">{currentItem.explanation}</p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-rose-800">{t.incorrect} 🧐</p>
                <div className="mt-1 font-sans">
                  <span className="text-xs bg-amber-100 font-bold px-2 py-0.5 rounded text-amber-800 mr-2">Corecta:</span>
                  <span className="font-extrabold text-slate-900 border-b-2 border-amber-300 pb-0.5 text-sm">{currentItem.imperative}</span>
                </div>
                {currentItem.explanation && (
                  <p className="text-xs text-rose-700/80 mt-1.5">{currentItem.explanation}</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Show hint */}
      {!hasChecked && showHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-amber-50 text-amber-800 border-amber-100 border text-xs rounded-xl flex items-start gap-2"
        >
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{t.hint}:</p>
            <p className="mt-0.5 font-mono">
              Empieza con: <span className="font-bold underline">{currentItem.imperative.split(' ')[0]}</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-2">
        {!hasChecked && (
          <button
            onClick={() => setShowHint(true)}
            className="px-4 py-2 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all flex items-center gap-1"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{uiLang === 'hy' ? 'Հուշում' : uiLang === 'ru' ? 'Предоставить подсказку' : 'Show Hint'}</span>
          </button>
        )}

        {!hasChecked ? (
          <button
            onClick={checkAnswer}
            disabled={!userInput.trim()}
            className="px-6 py-2.5 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            {t.check}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-6 py-2.5 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================================================================
   GAME 2: CONJUGATION MASTER
   ===================================================================================== */
function ConjugationMasterGame({ t, uiLang, handleCorrect, handleIncorrect, speak }: any) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  // Generate dynamic conjugation multiple-choice challenge
  const challenges = useMemo(() => {
    const list: {
      verb: string;
      subject: string;
      mode: 'affirmative' | 'negative';
      armenianContext: string;
      correctValue: string;
      options: string[];
    }[] = [];

    // Blend regular + irregular verbs together for high-quality variety
    regularConjugations.forEach((item) => {
      const modes: ('affirmative' | 'negative')[] = ['affirmative', 'negative'];
      modes.forEach((mode) => {
        const subjects: ('tu' | 'usted' | 'nosotros' | 'vosotros' | 'ustedes')[] = ['tu', 'usted', 'vosotros', 'ustedes', 'nosotros'];
        subjects.forEach((subj) => {
          const correctVal = item.forms[mode][subj];
          // Get 3 incorrect options from other forms
          const allPool = [
            ...Object.values(item.forms.affirmative),
            ...Object.values(item.forms.negative)
          ].filter(o => o !== correctVal);

          const uniqueOpts = Array.from(new Set(allPool)).slice(0, 3);
          const finalOpts = [...uniqueOpts, correctVal].sort(() => Math.random() - 0.5);

          list.push({
            verb: item.verb.split(' ')[0],
            subject: subj,
            mode: mode,
            armenianContext: `${item.translation.split(' ')[0]} - (${subj.toUpperCase()})`,
            correctValue: correctVal,
            options: finalOpts
          });
        });
      });
    });

    irregularVerbs.forEach((item) => {
      const modeIdx: ('affirmative' | 'negative')[] = ['affirmative', 'negative'];
      modeIdx.forEach((mode) => {
        const prons: ('tu' | 'usted' | 'nosotros' | 'vosotros' | 'ustedes')[] = ['tu', 'usted', 'nosotros', 'vosotros', 'ustedes'];
        prons.forEach((p) => {
          const correctVal = mode === 'affirmative' ? item.completeAffirmative[p] : item.completeNegative[p];
          // Get other options
          const allPool = [
            ...Object.values(item.completeAffirmative),
            ...Object.values(item.completeNegative)
          ].filter(o => o !== correctVal);

          const uniqueOpts = Array.from(new Set(allPool)).slice(0, 3);
          const finalOpts = [...uniqueOpts, correctVal].sort(() => Math.random() - 0.5);

          list.push({
            verb: item.verb,
            subject: p,
            mode: mode,
            armenianContext: `${item.translationArmenian} - (${p.toUpperCase()})`,
            correctValue: correctVal,
            options: finalOpts
          });
        });
      });
    });

    return list.sort(() => Math.random() - 0.5);
  }, []);

  const challenge = challenges[currentIdx] || challenges[0];

  const handleSelect = (opt: string) => {
    if (hasChecked) return;
    setSelectedOpt(opt);
  };

  const processCheck = () => {
    if (!selectedOpt) return;
    setHasChecked(true);

    if (selectedOpt === challenge.correctValue) {
      handleCorrect(10);
      speak(challenge.correctValue);
    } else {
      handleIncorrect();
    }
  };

  const handleNext = () => {
    setHasChecked(false);
    setSelectedOpt(null);
    setCurrentIdx((prev) => (prev + 1) % challenges.length);
  };

  if (!challenge) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900 select-none">
          {uiLang === 'hy' ? 'Խաղ 2: Խոնարհման Վարպետ' : uiLang === 'ru' ? 'Игра 2: Мастер Сопряжения' : 'Game 2: Conjugation Master'}
        </h3>
        <span className="text-xs text-slate-400 font-mono tracking-wider">{currentIdx + 1} / {challenges.length}</span>
      </div>

      {/* Target card */}
      <div className="bg-[#FAF7ED] border border-amber-200/60 rounded-2xl p-6 text-center space-y-3">
        <div className="flex justify-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 rounded-md px-2.5 py-1 uppercase">
            {challenge.verb}
          </span>
          <span className={`text-xs font-bold rounded-md px-2.5 py-1 uppercase ${
            challenge.mode === 'affirmative' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {challenge.mode === 'affirmative' ? (uiLang === 'hy' ? 'Հաստատական +' : 'Утверждение +') : (uiLang === 'hy' ? 'Ժխտական -' : 'Отрицание -')}
          </span>
        </div>

        <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1">
          <span className="text-amber-600 font-mono italic">¡</span>
          <span className="uppercase text-slate-800">{challenge.subject}</span>
          <span className="text-slate-400 font-sans text-lg lowercase ml-2">({challenge.verb})</span>
          <span className="text-amber-600 font-mono italic">!</span>
        </h4>
        <p className="text-xs text-slate-500 italic">Context: {challenge.armenianContext}</p>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {challenge.options.map((opt, idx) => {
          const isSelected = selectedOpt === opt;
          const isCorrectAnswer = opt === challenge.correctValue;
          
          let btnClass = 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/25';
          if (isSelected && !hasChecked) btnClass = 'border-amber-500 ring-2 ring-amber-500 bg-amber-50/30';
          if (hasChecked) {
            if (isCorrectAnswer) {
              btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20';
            } else if (isSelected) {
              btnClass = 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20';
            } else {
              btnClass = 'opacity-40 bg-slate-50 border-slate-100';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={hasChecked}
              className={`py-3.5 px-4 rounded-xl border text-sm font-bold text-center transition-all cursor-pointer flex items-center justify-between font-sans ${btnClass}`}
            >
              <span className="text-base text-slate-800 font-sans capitalize">{opt}</span>
              {hasChecked && isCorrectAnswer && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {hasChecked && isSelected && !isCorrectAnswer && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action panel */}
      <div className="flex gap-2 justify-end pt-4">
        {!hasChecked ? (
          <button
            onClick={processCheck}
            disabled={!selectedOpt}
            className="px-6 py-2.5 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            {t.check}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================================================================
   GAME 3: REFLEXIVE WORD BUILDER / PUZZLE
   ===================================================================================== */
function ReflexiveBuilderGame({ t, uiLang, handleCorrect, handleIncorrect, speak }: any) {
  // Hardcoded puzzle elements for reflexive commands to guarantee supreme quality and clear design
  const puzzles = useMemo(() => {
    return [
      {
        id: 'p1',
        instruction: 'Tú te levantas temprano (Afirmativo)',
        armenian: 'Շուտ վե՛ր կաց։',
        correctAnswer: ['levántate', 'temprano'],
        parts: ['levánta', 'te', 'no', 'te levantes', 'temprano'],
        correctSentence: 'Levántate temprano.'
      },
      {
        id: 'p2',
        instruction: 'Tú te duchas por la mañana (Afirmativo)',
        armenian: 'Առավոտյան լոգանք ընդունի՛ր։',
        correctAnswer: ['dúchate', 'por', 'la', 'mañana'],
        parts: ['dúcha', 'te', 'no', 'te duches', 'por', 'la', 'mañana'],
        correctSentence: 'Dúchate por la mañana.'
      },
      {
        id: 'p3',
        instruction: 'No te sientes aquí (Negativo)',
        armenian: 'Այստեղ մի՛ նստիր։',
        correctAnswer: ['no', 'te', 'sientes', 'aquí'],
        parts: ['siéntate', 'no', 'te', 'sientas', 'sientes', 'aquí'],
        correctSentence: 'No te sientes aquí.'
      },
      {
        id: 'p4',
        instruction: 'Tú te lavas las manos (Afirmativo)',
        armenian: 'Լվա՛ ձեռքերդ։',
        correctAnswer: ['lávate', 'las', 'manos'],
        parts: ['láva', 'te', 'no', 'te laves', 'las', 'manos'],
        correctSentence: 'Lávate las manos.'
      },
      {
        id: 'p5',
        instruction: 'Tú te relajas un poco (Afirmativo)',
        armenian: 'Մի քիչ հանգստացի՛ր։',
        correctAnswer: ['relájate', 'un', 'poco'],
        parts: ['relája', 'te', 'no', 'te relaxes', 'un', 'poco'],
        correctSentence: 'Relájate un poco.'
      },
      {
        id: 'p6',
        instruction: 'No te acuestes tarde (Negativo)',
        armenian: 'Ուշ մի՛ պառկիր։',
        correctAnswer: ['no', 'te', 'acuestes', 'tarde'],
        parts: ['acuéstate', 'no', 'te', 'acuestas', 'acuestes', 'tarde'],
        correctSentence: 'No te acuestes tarde.'
      }
    ].sort(() => Math.random() - 0.5);
  }, []);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const activePuzzle = puzzles[currentIdx] || puzzles[0];

  // Helper of combined forms (e.g. Levánta + te helper)
  const combineSpecialParts = (parts: string[]) => {
    // If we have 'levánta' and 'te' adjacent, they should fuse together! This is incredibly intuitive.
    let fused: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const curr = parts[i];
      const next = parts[i + 1];
      if ((curr === 'levánta' && next === 'te')) {
        fused.push('levántate');
        i++;
      } else if (curr === 'dúcha' && next === 'te') {
        fused.push('dúchate');
        i++;
      } else if (curr === 'láva' && next === 'te') {
        fused.push('lávate');
        i++;
      } else if (curr === 'relája' && next === 'te') {
        fused.push('relájate');
        i++;
      } else {
        fused.push(curr);
      }
    }
    return fused;
  };

  const handlePartClick = (part: string) => {
    if (hasChecked) return;
    if (selectedParts.includes(part)) {
      setSelectedParts(prev => prev.filter(p => p !== part));
    } else {
      setSelectedParts(prev => [...prev, part]);
    }
  };

  const checkSolution = () => {
    setHasChecked(true);
    const fusedUser = combineSpecialParts(selectedParts).join(' ').toLowerCase();
    const cleanTarget = activePuzzle.correctSentence.replace(/[.]/g, '').toLowerCase();

    const correct = fusedUser === cleanTarget;
    setIsCorrect(correct);

    if (correct) {
      handleCorrect(20);
      speak(activePuzzle.correctSentence);
    } else {
      handleIncorrect();
    }
  };

  const resetSelection = () => {
    setSelectedParts([]);
  };

  const proceedNext = () => {
    setHasChecked(false);
    setSelectedParts([]);
    setCurrentIdx(prev => (prev + 1) % puzzles.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900 select-none">
          {uiLang === 'hy' ? 'Խաղ 3: Անդրադարձ Բայերի Կոնստրուկտոր' : uiLang === 'ru' ? 'Игра 3: Возвратный Конструктор' : 'Game 3: Reflexive Builder'}
        </h3>
        <span className="text-xs text-slate-400 font-mono tracking-wider">{currentIdx + 1} / {puzzles.length}</span>
      </div>

      <div className="bg-[#FAF7ED] p-4 sm:p-5 rounded-2xl border border-amber-100 flex items-start gap-3">
        <div className="bg-amber-100 p-2 rounded-xl text-amber-700 animate-pulse">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold bg-[#E6F3FF] text-[#1E3A8A] px-2 py-0.5 rounded uppercase">
            {activePuzzle.instruction}
          </span>
          <h4 className="text-lg font-extrabold text-slate-800 mt-2 font-sans select-none">
            {activePuzzle.armenian}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {uiLang === 'hy' ? 'Քարշ տվեք կամ սեղմեք բլոկները` ճիշտ տարբերակը հավաքելու համար: Միացրեք «levánta» + «te»` մեկ բառ ստանալու համար:' : 'Кликайте на блоки в правильном порядке, чтобы составить фразу. Например, соединение «levánta» + «te» автоматически преобразуется в единое слово «levántate»!'}
          </p>
        </div>
      </div>

      {/* Assembly stage */}
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 min-h-[90px] flex flex-wrap gap-2.5 items-center justify-center">
        {selectedParts.length === 0 ? (
          <span className="text-xs text-slate-400 italic">
            [ {uiLang === 'hy' ? 'Դատարկ է' : uiLang === 'ru' ? 'Кликните по блокам ниже для сборки предложения' : 'Select blocks below to assemble'} ]
          </span>
        ) : (
          combineSpecialParts(selectedParts).map((part, pIdx) => (
            <motion.span
              layout
              key={pIdx}
              className="px-3.5 py-2 bg-amber-500 text-white font-extrabold text-sm rounded-xl shadow-xs font-sans flex items-center gap-1 cursor-pointer"
              onClick={() => handlePartClick(selectedParts[pIdx])}
            >
              <span>{part}</span>
              <span className="text-amber-100 text-[10px]">×</span>
            </motion.span>
          ))
        )}
      </div>

      {/* Parts bin */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          {uiLang === 'hy' ? 'Բլոկների տուփ:' : uiLang === 'ru' ? 'Доступные блоки:' : 'Parts chest:'}
        </span>
        <div className="flex flex-wrap gap-2 p-2 bg-white border border-slate-100 rounded-xl justify-center">
          {activePuzzle.parts.map((p, idx) => {
            const isUsed = selectedParts.includes(p);
            return (
              <button
                key={idx}
                disabled={hasChecked}
                onClick={() => handlePartClick(p)}
                className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all cursor-pointer font-sans shadow-xs ${
                  isUsed
                    ? 'opacity-30 bg-slate-100 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 text-slate-700'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Solution status */}
      {hasChecked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-xl border font-sans ${
            isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isCorrect ? (
              <div>
                <p className="font-bold">{t.correct} 🎉</p>
                <p className="text-sm mt-1">¡Perfecto! El imperativo correcto es: <strong className="underline">{activePuzzle.correctSentence}</strong></p>
              </div>
            ) : (
              <div>
                <p className="font-bold">{t.incorrect} 🧐</p>
                <p className="text-sm mt-1">
                  Tu propuesta resultó: <code className="bg-rose-100 px-1 py-0.5 rounded font-bold font-sans">"{combineSpecialParts(selectedParts).join(' ')}"</code>
                </p>
                <p className="text-sm mt-1">
                  Respuesta correcta: <strong className="underline font-bold text-slate-900 font-sans">{activePuzzle.correctSentence}</strong>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Control buttons */}
      <div className="flex justify-between items-center pt-2">
        {!hasChecked ? (
          <button
            onClick={resetSelection}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            {uiLang === 'hy' ? 'Մաքրել' : uiLang === 'ru' ? 'Сбросить' : 'Clear'}
          </button>
        ) : <div />}

        {!hasChecked ? (
          <button
            onClick={checkSolution}
            disabled={selectedParts.length === 0}
            className="px-6 py-2.5 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            {t.check}
          </button>
        ) : (
          <button
            onClick={proceedNext}
            className="px-6 py-2.5 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================================================================
   GAME 4: DIALOGUE ROLEPLAY QUEST
   ===================================================================================== */
function DialogueQuestGame({ t, uiLang, handleCorrect, handleIncorrect, speak }: any) {
  const [activeDialogueIdx, setActiveDialogueIdx] = useState<number>(0);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const dialogue = dialogueData[activeDialogueIdx] || dialogueData[0];
  const totalDialogueLines = dialogue.lines;
  
  // Find current line that is a gap to fill, or skip non-gaps
  const originalGapLine = totalDialogueLines[currentLineIdx];
  const isGapOfLine = originalGapLine?.options && originalGapLine.options.length > 0;

  const handleChoose = (opt: string) => {
    if (isChecked) return;
    setSelectedOption(opt);
  };

  const checkGapAnswer = () => {
    if (!selectedOption) return;
    setIsChecked(true);

    const isMatch = selectedOption === originalGapLine.correctAnswer;
    if (isMatch) {
      handleCorrect(15);
      speak(originalGapLine.correctAnswer);
    } else {
      handleIncorrect();
    }
  };

  const handleNextLine = () => {
    setIsChecked(false);
    setSelectedOption(null);

    if (currentLineIdx < totalDialogueLines.length - 1) {
      setCurrentLineIdx(prev => prev + 1);
    } else {
      setIsDone(true);
    }
  };

  const restartQuest = () => {
    setCurrentLineIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsDone(false);
  };

  const changeDialogue = (idx: number) => {
    setActiveDialogueIdx(idx);
    setCurrentLineIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsDone(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900 select-none">
          {uiLang === 'hy' ? 'Խաղ 4: Երկխոսության Դերախաղ' : uiLang === 'ru' ? 'Игра 4: Диалог-Квест' : 'Game 4: Dialogue Roleplay'}
        </h3>
        {/* Dialogue selection list */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
          {dialogueData.map((d, dIdx) => (
            <button
              key={dIdx}
              onClick={() => changeDialogue(dIdx)}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                activeDialogueIdx === dIdx ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              № {dIdx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario header card */}
      <div className="bg-[#FAF7ED] p-4 rounded-xl border border-amber-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-amber-800 block uppercase">
            {uiLang === 'hy' ? 'Իրավիճակի նկարագրություն:' : 'Контекст ситуации:'}
          </span>
          <p className="text-sm font-extrabold text-slate-800 mt-0.5 font-sans leading-tight">
            {dialogue.context}
          </p>
          <p className="text-xs text-slate-500 font-medium">({dialogue.contextArm})</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
      </div>

      {/* Dialogue Thread container */}
      <div className="space-y-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
        {totalDialogueLines.slice(0, currentLineIdx + 1).map((line, lIdx) => {
          const isCurrentGapLine = lIdx === currentLineIdx;
          const isGap = line.options && line.options.length > 0;

          return (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={lIdx}
              className={`p-3.5 rounded-xl border ${
                isCurrentGapLine
                  ? 'bg-amber-50/55 border-amber-200 shadow-sm'
                  : 'bg-white border-slate-100 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 select-none font-sans">
                <span className="font-extrabold text-xs tracking-wide text-slate-500 capitalize">{line.speaker}</span>
                {line.pronoun && (
                  <span className="text-[10px] bg-slate-100 font-bold text-slate-500 px-1.5 py-0.5 rounded">
                    ({line.pronoun})
                  </span>
                )}
              </div>

              {/* Text representing the response */}
              <div className="text-slate-800 text-sm font-bold font-sans">
                {isCurrentGapLine && isGap && !isDone ? (
                  // Display line text with highlighting gap
                  <span>
                    {line.text.split('_________')[0]}
                    <span className="inline-block px-4 py-1 mx-2 bg-amber-100 border-b-2 border-amber-400 font-black text-amber-800 rounded font-sans animate-bounce min-w-[70px] text-center">
                      {selectedOption ? selectedOption : '???'}
                    </span>
                    {line.text.split('_________')[1]}
                  </span>
                ) : (
                  // Filled text
                  <span>{line.text.replace('_________', line.correctAnswer)}</span>
                )}
              </div>

              {/* Translation subtext */}
              <p className="text-xs text-slate-500 italic mt-1 font-sans">{line.translation}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Gap option choice box */}
      {!isDone && originalGapLine && isGapOfLine && (
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {uiLang === 'hy' ? 'Ընտրեք ճիշտ տարբերակը:' : uiLang === 'ru' ? 'Выберите подходящее слово:' : 'Select the matching word:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {originalGapLine.options.map((opt, oIdx) => {
              const isSelected = selectedOption === opt;
              let clName = 'bg-white border-slate-200 hover:bg-slate-50';
              if (isSelected && !isChecked) clName = 'border-amber-400 ring-2 ring-amber-400 font-black bg-amber-50/20';
              if (isChecked) {
                if (opt === originalGapLine.correctAnswer) {
                  clName = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black ring-2 ring-emerald-500/10';
                } else if (isSelected) {
                  clName = 'bg-rose-50 border-rose-500 text-rose-800 line-through ring-2 ring-rose-500/10';
                } else {
                  clName = 'opacity-30 border-slate-100';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={isChecked}
                  onClick={() => handleChoose(opt)}
                  className={`py-3 px-4 border rounded-xl text-sm font-bold text-center transition-all cursor-pointer font-sans shadow-2xs ${clName}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isChecked && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-3.5 text-xs font-bold rounded-xl border ${
                selectedOption === originalGapLine.correctAnswer
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {selectedOption === originalGapLine.correctAnswer ? (
                <span>¡Fantástico! "{originalGapLine.correctAnswer}" es la forma gramatical precisa para {originalGapLine.pronoun}.</span>
              ) : (
                <span>Ups. No es correcto. La forma imperativa correcta es <strong className="underline">"{originalGapLine.correctAnswer}"</strong>.</span>
              )}
            </motion.div>
          )}

          {/* Dialog verification buttons */}
          <div className="flex justify-end gap-2.5">
            {!isChecked ? (
              <button
                onClick={checkGapAnswer}
                disabled={!selectedOption}
                className="px-5 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {t.check}
              </button>
            ) : (
              <button
                onClick={handleNextLine}
                className="px-5 py-2 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>{uiLang === 'hy' ? 'Շարունակել' : uiLang === 'ru' ? 'Далее' : 'Continue'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* When current line is a speaker dialogue text but has NO gap, we just show a button to advance */}
      {!isDone && originalGapLine && !isGapOfLine && (
        <div className="flex justify-end">
          <button
            onClick={handleNextLine}
            className="px-5 py-2.5 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl flex items-center gap-1.5"
          >
            <span>{t.next}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dialogue complete layout */}
      {isDone && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto text-2xl font-extrabold animate-bounce">
            🎉
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{t.congrats}!</h4>
            <p className="text-xs text-slate-500 mt-1">
              {uiLang === 'hy' ? 'Դուք հաջողությամբ լրացրեցիք այս երկխոսության բոլոր հրամանները:' : 'Вы успешно разобрали все повелительные формы для этого диалога!'}
            </p>
          </div>
          <button
            onClick={restartQuest}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
          >
            {t.restartGame}
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* =====================================================================================
   GAME 5: ARMENIAN-SPANISH MATCHING MATCH
   ===================================================================================== */
function ArmenianSpanishMatchGame({ t, uiLang, handleCorrect, handleIncorrect, speak }: any) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);

  // Load random selection cards
  const initGame = () => {
    const cardPool = generateMatchCardsByCount(5); // 5 pairs = 10 cards to keep design neat
    setCards(cardPool);
    setSelectedCards([]);
    setMatchedPairs([]);
    setCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2 || selectedCards.includes(cardId) || matchedPairs.includes(cardId)) return;

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard) return;

    const newSelections = [...selectedCards, cardId];
    setSelectedCards(newSelections);

    if (newSelections.length === 2) {
      const first = cards.find(c => c.id === newSelections[0]);
      const second = cards.find(c => c.id === newSelections[1]);

      if (first && second && first.pairId === second.pairId && first.lang !== second.lang) {
        // Matched correctly!
        setTimeout(() => {
          setMatchedPairs(prev => {
            const up = [...prev, first.id, second.id];
            if (up.length === cards.length) {
              setCompleted(true);
            }
            return up;
          });
          setSelectedCards([]);
          handleCorrect(20);

          // Speak Spanish command if speech supported
          const spCmd = first.lang === 'es' ? first.text : second.text;
          speak(spCmd);
        }, 500);
      } else {
        // Mis-match!
        setTimeout(() => {
          setSelectedCards([]);
          handleIncorrect();
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900 select-none">
          {uiLang === 'hy' ? 'Խաղ 5: Հայ-Իսպանական Հրամանների Համընկնում' : 'Игра 5: Соответствие испанских и армянских выражений'}
        </h3>
        <button
          onClick={initGame}
          className="text-slate-400 hover:text-amber-500 p-1.5 rounded-lg hover:bg-slate-100"
          title="Shuffle / Regenerate"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-500 text-center italic select-none">
        {uiLang === 'hy'
          ? 'Սեղմեք իսպաներեն հաստատական կամ ժխտական հրամանի վրա և գտեք դրա ճիշտ հայերեն թարգմանությունը:'
          : 'Найдите совпадения между испанскими повелительными выражениями и их армянскими переводами. Отличный тест на подсознательные рефлексы!'}
      </p>

      {/* Cards layouts */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 pt-2">
        {cards.map((c) => {
          const isSelected = selectedCards.includes(c.id);
          const isMatched = matchedPairs.includes(c.id);

          let frameClass = 'bg-white border-slate-200 hover:border-amber-300';
          if (isSelected) frameClass = 'border-amber-500 ring-2 ring-amber-500 font-extrabold bg-amber-50/20';
          if (isMatched) frameClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold opacity-60';

          return (
            <motion.div
              whileTap={{ scale: 0.98 }}
              key={c.id}
              onClick={() => handleCardClick(c.id)}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer min-h-[90px] flex items-center justify-center font-sans shadow-2xs select-none ${frameClass}`}
            >
              <div>
                <span className={`block text-[8px] uppercase tracking-wider font-bold mb-1 ${
                  c.lang === 'es' ? 'text-amber-700 bg-amber-50 rounded px-1' : 'text-indigo-700 bg-indigo-50 rounded px-1'
                }`}>
                  {c.lang === 'es' ? 'Español' : 'Armenian'}
                </span>
                <span className={`${isMatched ? 'text-emerald-900 font-bold' : 'text-slate-800 font-semibold'} text-xs font-sans`}>
                  {c.text}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {completed && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-emerald-100 rounded-2xl p-6 text-center border border-emerald-200 mt-4 space-y-3"
        >
          <Trophy className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <h4 className="text-lg font-bold text-slate-900">{t.congrats}!</h4>
          <p className="text-xs text-slate-500">{uiLang === 'hy' ? 'Բոլոր զույգերը հաջողությամբ գտնվել են:' : 'Потрясающая работа! Все карточки успешно сопоставлены.'}</p>
          <button
            onClick={initGame}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
          >
            {uiLang === 'hy' ? 'Խաղալ կրկին' : 'Сыграть ещё раз'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
