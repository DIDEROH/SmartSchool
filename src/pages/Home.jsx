import React, { useState, } from 'react';
import { 
  Home, 
  Zap, 
  Battery, 
  Settings, 
  BookOpen, 
  HelpCircle, 
  Menu, 
  X,
  ChevronRight,
  Cpu,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function Accueil () {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- State Logic ---
  const [logicState, setLogicState] = useState({ a: 0, b: 0 });
  const [decimalValue, setDecimalValue] = useState(13);
  const [resistors, setResistors] = useState([10, 20, 30]);
  const [gears, setGears] = useState({ in: 20, out: 60, turns: 12 });
  const [speedKmh, setSpeedKmh] = useState(72);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizResults, setQuizResults] = useState({});

  // --- Helpers ---
  const binaryString = decimalValue.toString(2).padStart(4, '0');
  const totalResistance = resistors.reduce((a, b) => a + b, 0);
  const gearRatio = (gears.out / gears.in).toFixed(2);
  const gearOutputTurns = (gears.turns / (gears.out / gears.in)).toFixed(2);
  const speedMs = (speedKmh / 3.6).toFixed(2);

  const vocabData = [
    { id: 1, term: "Mécatronique", def: "Combinaison synergique de la mécanique, de l'électronique et de l'informatique." },
    { id: 2, term: "Actionneur", def: "Composant qui transforme l'énergie en mouvement physique (ex: moteur)." },
    { id: 3, term: "Capteur", def: "Dispositif transformant une grandeur physique en signal électrique." },
    { id: 4, term: "Bit de Poids Faible (LSB)", def: "Le bit le plus à droite, représentant $2^0$." },
    { id: 5, term: "Ohm (Ω)", def: "Unité de résistance électrique mesurant l'opposition au courant." },
    { id: 6, term: "Porte Logique", def: "Circuit réalisant une opération booléenne élémentaire (ET, OU, NON)." },
    { id: 7, term: "Asservissement", def: "Système bouclé s'autocorrigeant via des capteurs." },
    { id: 8, term: "Microcontrôleur", def: "Unité de traitement intégrée pilotant des systèmes embarqués." }
  ];

  const filteredVocab = vocabData.filter(v => 
    v.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.def.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Charts Config ---
  const binaryChartData = {
    labels: ['8 (2³)', '4 (2²)', '2 (2¹)', '1 (2⁰)'],
    datasets: [{
      label: 'Bit Actif',
      data: [8, 4, 2, 1].map(pow => (decimalValue & pow) ? 1 : 0),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    }]
  };

  const resistorChartData = {
    labels: ['R1', 'R2', 'R3', 'Total'],
    datasets: [{
      label: 'Valeur (Ω)',
      data: [...resistors, totalResistance],
      backgroundColor: ['#94a3b8', '#94a3b8', '#94a3b8', '#f59e0b'],
      borderRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  // --- Renderers ---
  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in duration-500 md:mt-10">
      <div className="bg-base-200 rounded-2xl shadow-sm">
        <img src="/durinfo.png" alt="" className='flex mx-auto w-full max-h-150 rounded-xl' />
        <div className='mt-1 p-4'>
          <h2 className="text-3xl font-bold text-indigo-800 mb-4 uppercase">Mécatro Durinfo</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Bienvenue sur votre plateforme d'étude interactive dédiée à la <strong>Mécatronique</strong>. 
            Ce portail transforme les concepts théoriques du guide d'admission en outils de simulation pratiques.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'logique', title: 'Logique & Numérique', desc: 'Binaire, portes logiques et algèbre de Boole.', icon: <Cpu className="text-indigo-600" />, color: 'indigo' },
          { id: 'elec', title: 'Électricité', desc: 'Lois des circuits, résistances et puissance.', icon: <Zap className="text-amber-500" />, color: 'amber' },
          { id: 'meca', title: 'Mécanique', desc: 'Transmission, engrenages et cinématique.', icon: <Settings className="text-emerald-500" />, color: 'emerald' },
          { id: 'quiz', title: 'Entraînement', desc: 'Auto-évaluation sur les questions types du concours.', icon: <HelpCircle className="text-rose-500" />, color: 'rose' },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex items-start p-6 bg-base-200 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 text-left group"
          >
            <div className={`p-4 rounded-lg bg-${item.color}-50 mr-4 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800">{item.title}</h3>
              <p className="text-slate-500 mt-1">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderLogique = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <Cpu className="w-8 h-8 text-indigo-600" />
        <h2 className="text-3xl font-bold">Systèmes Logiques</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-base-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            Simulateur Porte ET (AND)
          </h3>
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl space-y-8">
            <div className="flex items-center space-x-6">
              {[ 'a', 'b' ].map(input => (
                <div key={input} className="text-center">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Entrée {input.toUpperCase()}</span>
                  <button 
                    onClick={() => setLogicState(prev => ({ ...prev, [input]: prev[input] === 0 ? 1 : 0 }))}
                    className={`w-16 h-16 rounded-full font-bold text-2xl shadow-lg transition-all ${logicState[input] === 1 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-base-200 text-slate-400'}`}
                  >
                    {logicState[input]}
                  </button>
                </div>
              ))}
              <div className="text-3xl text-slate-300">→</div>
              <div className="text-center">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Sortie</span>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold shadow-inner border-2 ${logicState.a && logicState.b ? 'bg-green-500 border-green-400 text-white' : 'bg-slate-200 border-slate-300 text-slate-500'}`}>
                  {logicState.a && logicState.b ? '1' : '0'}
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-slate-500 italic">
              "En robotique, la porte ET est souvent utilisée pour les sécurités : 
              Capteur de présence (1) ET Bouton Start (1) = Moteur ON (1)."
            </p>
          </div>
        </div>

        <div className="bg-base-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center">Conversion Binaire</h3>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-500">Décimal</label>
                <input 
                  type="number" 
                  value={decimalValue} 
                  onChange={(e) => setDecimalValue(Math.max(0, Math.min(15, parseInt(e.target.value) || 0)))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xl font-mono"
                />
              </div>
              <ArrowRightLeft className="text-slate-300 mt-5" />
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-500">Binaire (4 bits)</label>
                <div className="w-full p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xl font-mono text-indigo-700 text-center font-bold">
                  {binaryString}
                </div>
              </div>
            </div>
            <div className="h-48">
              <Bar data={binaryChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderElec = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <Battery className="w-8 h-8 text-amber-500" />
        <h2 className="text-3xl font-bold">Génie Électrique</h2>
      </div>

      <div className="bg-base-200 p-8 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Résistances en Série</h3>
            <p className="text-slate-500">
              Formule : <strong>R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub></strong>. 
              La résistance totale augmente linéairement.
            </p>
          </div>

          <div className="space-y-6">
            {resistors.map((val, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-700">Résistance {idx + 1}</span>
                  <span className="text-indigo-600 font-bold">{val} Ω</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" value={val} 
                  onChange={(e) => {
                    const newRes = [...resistors];
                    newRes[idx] = parseInt(e.target.value);
                    setResistors(newRes);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            ))}
          </div>

          <div className="p-6 bg-amber-50 rounded-xl text-center border border-amber-100">
            <span className="text-amber-800 text-sm font-bold uppercase tracking-wider block mb-1">Résistance Équivalente</span>
            <span className="text-5xl font-black text-amber-600">{totalResistance} Ω</span>
          </div>
        </div>

        <div className="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="h-full min-h-[300px]">
            <Bar data={resistorChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeca = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <Settings className="w-8 h-8 text-emerald-500" />
        <h2 className="text-3xl font-bold">Mécanique & Transmission</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-base-200 p-6 rounded-2xl shadow-sm border-t-4 border-emerald-500">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            Rapport d'Engrenage
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Dents Entrée (A)</label>
                <input type="number" value={gears.in} onChange={e => setGears({...gears, in: parseInt(e.target.value) || 1})} className="w-full p-2 border rounded mt-1"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Dents Sortie (B)</label>
                <input type="number" value={gears.out} onChange={e => setGears({...gears, out: parseInt(e.target.value) || 1})} className="w-full p-2 border rounded mt-1"/>
              </div>
            </div>
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Tours Entrée (Moteur)</label>
              <input type="number" value={gears.turns} onChange={e => setGears({...gears, turns: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded mt-1"/>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl mt-4 border border-emerald-100 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-emerald-800 font-medium">Rapport :</span>
                <span className="text-2xl font-bold text-emerald-900">1:{gearRatio}</span>
              </div>
              <div className="flex justify-between items-end border-t border-emerald-200 pt-4">
                <span className="text-emerald-800 font-medium">Rotation Sortie :</span>
                <span className="text-4xl font-black text-emerald-600">{gearOutputTurns} tr</span>
              </div>
              <p className="text-xs text-emerald-700 italic text-center">
                {gears.out > gears.in ? "Multiplication du couple, réduction de la vitesse." : "Multiplication de la vitesse, réduction du couple."}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-base-200 p-6 rounded-2xl shadow-sm border-t-4 border-sky-500">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            Conversion de Vitesse
          </h3>
          <p className="text-sm text-slate-500 mb-6">Indispensable pour convertir les données réelles (km/h) en unités du SI (m/s) pour les calculs physiques.</p>
          
          <div className="space-y-8">
            <div className="flex items-center bg-slate-50 p-4 rounded-xl">
              <input 
                type="number" 
                value={speedKmh} 
                onChange={e => setSpeedKmh(parseFloat(e.target.value) || 0)}
                className="bg-transparent text-3xl font-bold text-slate-800 w-full outline-none"
              />
              <span className="text-xl font-bold text-slate-400">km/h</span>
            </div>

            <div className="flex justify-center">
              <div className="bg-sky-100 text-sky-600 p-2 rounded-full">
                <ArrowRightLeft className="rotate-90" />
              </div>
            </div>

            <div className="flex items-center bg-sky-600 p-6 rounded-xl text-white shadow-lg shadow-sky-100">
              <span className="text-4xl font-black flex-1">{speedMs}</span>
              <span className="text-xl font-bold opacity-80">m/s</span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${Math.min((speedKmh/200)*100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVocab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h2 className="text-3xl font-bold">Lexique Technique</h2>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Rechercher un terme (ex: actionneur)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 bg-base-200 rounded-2xl shadow-sm border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <HelpCircle className="absolute left-4 top-4 text-slate-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVocab.map(v => (
          <div key={v.id} className="bg-base-200 p-6 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
            <h4 className="font-bold text-lg text-indigo-800">{v.term}</h4>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed">{v.def}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuiz = () => {
    const questions = [
      { id: 1, q: "Dans une porte ET à 2 entrées, si A=1 et B=0, la sortie est ?", options: ["0", "1"], ans: "0" },
      { id: 2, q: "1010 en décimal est égal à ?", options: ["10", "12", "8"], ans: "10" },
      { id: 3, q: "Une résistance de 10Ω et une de 20Ω en série donnent ?", options: ["30Ω", "15Ω", "200Ω"], ans: "30Ω" },
      { id: 4, q: "L'actionneur typique d'un robot est ?", options: ["Moteur", "Capteur", "Microprocesseur"], ans: "Moteur" }
    ];

    const handleQuiz = (id, choice) => {
      setQuizResults(prev => ({ ...prev, [id]: choice }));
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-8 h-8 text-rose-500" />
            <h2 className="text-3xl font-bold">Auto-Évaluation</h2>
          </div>
          <div className="px-4 py-2 bg-rose-50 rounded-full text-rose-600 font-bold">
            Score: {Object.entries(quizResults).filter(([id, val]) => questions.find(q => q.id === Number(id)).ans === val).length} / {questions.length}
          </div>
        </div>

        <div className="space-y-4">
          {questions.map(q => (
            <div key={q.id} className="bg-base-200 p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-lg mb-4 text-slate-800">{q.id}. {q.q}</h4>
              <div className="flex flex-wrap gap-3">
                {q.options.map(opt => {
                  const isSelected = quizResults[q.id] === opt;
                  const isCorrect = isSelected && opt === q.ans;
                  const isWrong = isSelected && opt !== q.ans;
                  
                  return (
                    <button
                      key={opt}
                      onClick={() => handleQuiz(q.id, opt)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all border ${
                        isSelected 
                          ? isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-rose-500 text-white border-rose-500'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizResults[q.id] && (
                <div className={`mt-4 text-sm font-semibold flex items-center ${quizResults[q.id] === q.ans ? 'text-green-600' : 'text-rose-600'}`}>
                  {quizResults[q.id] === q.ans ? <ChevronRight className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                  {quizResults[q.id] === q.ans ? "Réponse exacte !" : `Incorrect. La réponse était ${q.ans}.`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-base-200 overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-base-200 border-r border-slate-200 shadow-xl z-20">
        <div className="p-8">
          <h1 className="text-2xl font-black text-indigo-600 leading-tight">MÉCATRO<br/>DURINFO</h1>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Guide Interactif 2026</p>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {[
            { id: 'home', label: 'Accueil', icon: Home },
            { id: 'logique', label: 'Logique', icon: Cpu },
            { id: 'elec', label: 'Électricité', icon: Battery },
            { id: 'meca', label: 'Mécanique', icon: Settings },
            { id: 'vocab', label: 'Lexique', icon: BookOpen },
            { id: 'quiz', label: 'Quiz', icon: HelpCircle },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Info className="w-5 h-5 text-indigo-400 mb-2" />
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Utilisez ce portail pour réviser les fondamentaux du génie industriel. Bonne chance pour le concours !
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="md:hidden fixed top-0 w-full bg-base-200 h-16 px-4 flex items-center justify-between border-b border-slate-200 z-30">
        <h1 className="font-black text-indigo-600">DURINFO ENSPD PORTAL </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-base-200 w-64 h-full p-6 animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
             <nav className="space-y-2">
              <div className='grid place-content-center'>
                <img src="/logo.webp" className='w-30' alt="" />
              </div>
               {['home', 'logique', 'elec', 'meca', 'vocab', 'quiz'].map(id => (
                 <button 
                  key={id}
                  onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left p-3 rounded-lg font-bold ${activeTab === id ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                 >
                   {id.charAt(0).toUpperCase() + id.slice(1)}
                 </button>
               ))}
             </nav>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto pt-24 md:pt-0 p-4 md:p-12">
        <div className="max-w-5xl mx-auto pb-20">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'logique' && renderLogique()}
          {activeTab === 'elec' && renderElec()}
          {activeTab === 'meca' && renderMeca()}
          {activeTab === 'vocab' && renderVocab()}
          {activeTab === 'quiz' && renderQuiz()}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-4 right-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden md:block">
        Durinfo
      </footer>
    </div>
  );
};

export default Accueil;