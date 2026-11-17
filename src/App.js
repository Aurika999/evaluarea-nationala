import { useEffect, useState } from 'react';
import { useTablaGame } from './exam/useTablaGame';
import { NATIONAL_LEVELS, nationalYear, nationalTheme, questionCount, nationalMaxPoints } from './exam/nationalTest';
import GameCard from './exam/components/GameCard';
import ResultModal from './exam/components/ResultModal';
import { tr, useLang, setLang, LANGUAGES } from './exam/i18n';
import './exam/TablaInmultirii.css';
import './App.css';

const BEST_KEY = 'math-owl-evaluare:best';
const ICONS = { en2026: '🐶', en2025: '🌳', en2025b: '🐻‍❄️' };

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY)) || {};
  } catch {
    return {};
  }
}

// Testele de Evaluare Națională (clasa a II-a), fără cont: cel mai bun rezultat rămâne pe dispozitiv.
export default function App() {
  const lang = useLang();
  const [view, setView] = useState('home');
  const [best, setBest] = useState(loadBest);
  const {
    stats, current, answered, selected, hintOpen, feedback, modal, toast,
    questionsPerLevel, selectLevel, restartLevel, skipItem, goToItem, isExam,
    handleAnswer, toggleHint, goToNextQuestionOrFinish,
  } = useTablaGame(NATIONAL_LEVELS[0], view !== 'game');

  useEffect(() => {
    document.title = tr('Evaluarea Națională · clasa a II-a');
  }, [lang]);

  // La finalul testului păstrăm cel mai bun punctaj.
  useEffect(() => {
    if (!modal || !NATIONAL_LEVELS.includes(stats.level)) return;
    setBest(prev => {
      const old = prev[stats.level];
      if (old && old.points >= stats.examPoints) return prev;
      const next = { ...prev, [stats.level]: { points: stats.examPoints, correct: stats.correct } };
      try {
        localStorage.setItem(BEST_KEY, JSON.stringify(next));
      } catch {
        // Fără localStorage, rezultatul ține doar până se închide pagina.
      }
      return next;
    });
  }, [modal, stats.level, stats.examPoints, stats.correct]);

  const startTest = (level) => {
    selectLevel(level);
    setView('game');
  };

  const goHome = () => {
    restartLevel();
    setView('home');
  };

  return (
    <div className="tabla-inmultirii" key={lang}>
      <div className="app exam-app">
        <header>
          <button className="logo exam-logo" onClick={goHome}>🎓 <span className="logo-title">{tr('Evaluarea Națională')}<span className="logo-motto">{tr('clasa a II-a · Matematică și Explorarea mediului')}</span></span></button>
          <select className="exam-lang" value={lang} onChange={e => setLang(e.target.value)} aria-label="Language">
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.short}</option>)}
          </select>
        </header>

        {view === 'home' ? (
          <main className="exam-home">
            <p className="exam-intro">
              {tr('Alege un test de la Evaluarea Națională! 🎓 Itemii sunt după testele oficiale publicate de Ministerul Educației (CNPEE).')}
            </p>
            <div className="exam-cards">
              {NATIONAL_LEVELS.map(level => (
                <button key={level} className="exam-card" onClick={() => startTest(level)}>
                  <span className="exam-card-icon">{ICONS[level]}</span>
                  <b>{tr('EVALUAREA NAȚIONALĂ {v0}', { v0: nationalYear(level) })}</b>
                  <span>{nationalTheme(level)} · {tr('{n} itemi', { n: questionCount(level) })}</span>
                  {best[level] && (
                    <small>{tr('🏅 Cel mai bun: {p} din {max} de puncte', { p: best[level].points, max: nationalMaxPoints(level) })}</small>
                  )}
                  <span className="exam-card-cta">{tr('🎓 Începe testul')}</span>
                </button>
              ))}
            </div>
            <p className="exam-note">{tr('Aplicația nu este oficială și nu aparține Ministerului Educației.')}</p>
          </main>
        ) : (
          <main className="exam-game">
            <button className="bigbtn blue exam-back" onClick={goHome}>{tr('← Toate testele')}</button>
            <GameCard
              current={current}
              stats={stats}
              questionsPerLevel={questionsPerLevel}
              answered={answered}
              selected={selected}
              hintOpen={hintOpen}
              feedback={feedback}
              toast={toast}
              onAnswer={handleAnswer}
              onToggleHint={toggleHint}
              onNext={goToNextQuestionOrFinish}
              isExam={isExam}
              onSkip={skipItem}
              onGoToItem={goToItem}
              onRestart={restartLevel}
            />
          </main>
        )}
      </div>
      {view === 'game' && (
        <ResultModal modal={modal} onRestart={restartLevel} onMap={goHome} />
      )}
    </div>
  );
}
