const express = require('express');
const path = require('path');
const VirtuellLaererassistent = require('./engine');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Opprett lærerassistent-instans
const assistent = new VirtuellLaererassistent();

// Last eksempelregler ved oppstart
const regelFil = path.join(__dirname, '..', 'rules', 'example.json');
assistent.lastRegler(regelFil);

// API-endepunkter

// Registrer ny elev
app.post('/api/elev/registrer', (req, res) => {
  try {
    const { navn, ferdigheter } = req.body;
    assistent.registrerElev(navn, ferdigheter);
    assistent.startSesjon();
    
    res.json({
      success: true,
      message: `Elev ${navn} er registrert`,
      elevTilstand: assistent.elevTilstand
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Hent elevstatus
app.get('/api/elev/status', (req, res) => {
  try {
    const status = assistent.hentStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Hent progresjonsoversikt
app.get('/api/elev/progresjon', (req, res) => {
  try {
    const progresjon = assistent.genererProgresjonsoversikt();
    res.json({ success: true, data: progresjon });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Behandle svar på oppgave
app.post('/api/oppgave/svar', (req, res) => {
  try {
    const { svar, fasit } = req.body;
    const riktig = assistent.behandleSvar(svar, fasit);
    
    // Evaluer regler basert på svaret
    const hendelse = riktig ? 'riktig_svar' : 'feil_svar';
    const handlinger = assistent.evaluerRegler(hendelse, { svar, fasit });
    assistent.utførHandlinger(handlinger);
    
    res.json({
      success: true,
      riktig: riktig,
      handlinger: handlinger,
      elevTilstand: assistent.elevTilstand
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generer ny oppgave basert på elevens nivå
app.post('/api/oppgave/generer', (req, res) => {
  try {
    const { fag = 'matematikk' } = req.body;
    const elevNivå = assistent.elevTilstand.ferdigheter[fag] || 0;
    
    // Generer oppgave basert på nivå
    let oppgave;
    if (elevNivå < 5) {
      oppgave = genererEnkelOppgave(fag);
    } else if (elevNivå < 15) {
      oppgave = genererMediumOppgave(fag);
    } else {
      oppgave = genererVanskeligOppgave(fag);
    }
    
    // Evaluer regler for oppgavegenerering
    const handlinger = assistent.evaluerRegler('generer_oppgave', { fag, nivå: elevNivå });
    assistent.utførHandlinger(handlinger);
    
    res.json({
      success: true,
      oppgave: oppgave,
      elevNivå: elevNivå,
      handlinger: handlinger
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Hent alle regler
app.get('/api/regler', (req, res) => {
  try {
    res.json({
      success: true,
      regler: assistent.regler,
      antall: assistent.regler.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset elevdata
app.post('/api/elev/reset', (req, res) => {
  try {
    assistent.elevTilstand = {
      navn: '',
      nivå: 1,
      poeng: 0,
      ferdigheter: {},
      arbeidshistorikk: [],
      aktivOppgave: null,
      motivasjon: 100
    };
    
    res.json({ success: true, message: 'Elevdata er tilbakestilt' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Hjelpefunksjoner for oppgavegenerering
function genererEnkelOppgave(fag) {
  if (fag === 'matematikk') {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return {
      id: Date.now(),
      fag: fag,
      tittel: 'Enkel addisjon',
      spørsmål: `Hva er ${a} + ${b}?`,
      svar: a + b,
      vanskelighetsgrad: 'lett',
      poeng: 10
    };
  }
  return { spørsmål: 'Ukjent fag', svar: null };
}

function genererMediumOppgave(fag) {
  if (fag === 'matematikk') {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const operator = Math.random() > 0.5 ? '+' : '-';
    const resultat = operator === '+' ? a + b : a - b;
    
    return {
      id: Date.now(),
      fag: fag,
      tittel: 'Addisjon og subtraksjon',
      spørsmål: `Hva er ${a} ${operator} ${b}?`,
      svar: resultat,
      vanskelighetsgrad: 'medium',
      poeng: 20
    };
  }
  return { spørsmål: 'Ukjent fag', svar: null };
}

function genererVanskeligOppgave(fag) {
  if (fag === 'matematikk') {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 20) + 5;
    
    return {
      id: Date.now(),
      fag: fag,
      tittel: 'Multiplikasjon',
      spørsmål: `Hva er ${a} × ${b}?`,
      svar: a * b,
      vanskelighetsgrad: 'vanskelig',
      poeng: 30
    };
  }
  return { spørsmål: 'Ukjent fag', svar: null };
}

// Serve hovedsiden
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'game.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Noe gikk galt!' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Virtuell Lærerassistent server kjører på port ${port}`);
  console.log(`📱 Åpne http://localhost:${port} i nettleseren`);
  console.log(`🎮 Spill-interface: http://localhost:${port}/game.html`);
  console.log(`📊 API dokumentasjon: http://localhost:${port}/api/status`);
});

module.exports = app; 