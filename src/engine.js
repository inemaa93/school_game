const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/**
 * Virtuell Lærerassistent - Regelmotor
 * En smart regelmotor for skolespill som tilpasser seg elevenes behov
 */
class VirtuellLaererassistent {
  constructor() {
    this.regler = [];
    this.elevTilstand = {
      navn: '',
      nivå: 1,
      poeng: 0,
      ferdigheter: {},
      arbeidshistorikk: [],
      aktivOppgave: null,
      motivasjon: 100
    };
    this.spillTilstand = {
      startet: false,
      aktiveSesjon: null,
      totaltid: 0
    };
  }

  /**
   * Laster regler fra JSON-fil
   * @param {string} filsti - Sti til JSON-fil med regler
   */
  lastRegler(filsti) {
    try {
      const regelData = fs.readFileSync(filsti, 'utf8');
      const parsedRegler = JSON.parse(regelData);
      this.regler = parsedRegler.regler || [];
      console.log(`Lastet ${this.regler.length} regler fra ${filsti}`);
    } catch (error) {
      console.error('Feil ved lasting av regler:', error.message);
    }
  }

  /**
   * Registrerer en ny elev i systemet
   * @param {string} navn - Elevens navn
   * @param {Object} innledendeFerdigheter - Elevens startferdigheter
   */
  registrerElev(navn, innledendeFerdigheter = {}) {
    this.elevTilstand = {
      ...this.elevTilstand,
      navn: navn,
      ferdigheter: {
        matematikk: 0,
        norsk: 0,
        engelsk: 0,
        naturfag: 0,
        ...innledendeFerdigheter
      }
    };
    console.log(`Elev ${navn} er registrert i systemet`);
  }

  /**
   * Starter en ny spillsesjon
   */
  startSesjon() {
    this.spillTilstand.startet = true;
    this.spillTilstand.aktiveSesjon = new Date();
    console.log(`Sesjon startet for ${this.elevTilstand.navn}`);
  }

  /**
   * Evaluerer regler basert på gjeldende tilstand
   * @param {string} hendelse - Type hendelse som utløser regelevaluering
   * @param {Object} kontekst - Ekstra kontekstinformasjon
   * @returns {Array} - Liste med handlinger som skal utføres
   */
  evaluerRegler(hendelse, kontekst = {}) {
    const handlinger = [];
    
    for (const regel of this.regler) {
      if (this.sjekkBetingelser(regel.betingelser, hendelse, kontekst)) {
        handlinger.push(...regel.handlinger);
      }
    }

    return handlinger;
  }

  /**
   * Sjekker om betingelsene for en regel er oppfylt
   * @param {Array} betingelser - Liste med betingelser
   * @param {string} hendelse - Gjeldende hendelse
   * @param {Object} kontekst - Kontekstinformasjon
   * @returns {boolean} - True hvis alle betingelser er oppfylt
   */
  sjekkBetingelser(betingelser, hendelse, kontekst) {
    return betingelser.every(betingelse => {
      switch (betingelse.type) {
        case 'hendelse':
          return betingelse.verdi === hendelse;
        
        case 'ferdighetsnivå':
          const ferdighetVerdi = this.elevTilstand.ferdigheter[betingelse.ferdighet] || 0;
          return this.sammenlignVerdi(ferdighetVerdi, betingelse.operator, betingelse.verdi);
        
        case 'motivasjon':
          return this.sammenlignVerdi(this.elevTilstand.motivasjon, betingelse.operator, betingelse.verdi);
        
        case 'poeng':
          return this.sammenlignVerdi(this.elevTilstand.poeng, betingelse.operator, betingelse.verdi);
        
        default:
          return false;
      }
    });
  }

  /**
   * Sammenligner verdier basert på operator
   * @param {number} verdi1 - Første verdi
   * @param {string} operator - Sammenligningsoperator
   * @param {number} verdi2 - Andre verdi
   * @returns {boolean} - Resultat av sammenligningen
   */
  sammenlignVerdi(verdi1, operator, verdi2) {
    switch (operator) {
      case '>': return verdi1 > verdi2;
      case '<': return verdi1 < verdi2;
      case '>=': return verdi1 >= verdi2;
      case '<=': return verdi1 <= verdi2;
      case '==': return verdi1 === verdi2;
      case '!=': return verdi1 !== verdi2;
      default: return false;
    }
  }

  /**
   * Utfører handlinger basert på regelevaluering
   * @param {Array} handlinger - Liste med handlinger som skal utføres
   */
  utførHandlinger(handlinger) {
    for (const handling of handlinger) {
      switch (handling.type) {
        case 'gi_poeng':
          this.giPoeng(handling.mengde);
          break;
        
        case 'øk_ferdighet':
          this.økFerdighet(handling.ferdighet, handling.mengde);
          break;
        
        case 'gi_tilbakemelding':
          this.giTilbakemelding(handling.melding);
          break;
        
        case 'foreslå_oppgave':
          this.foreslåOppgave(handling.oppgave);
          break;
        
        case 'juster_motivasjon':
          this.justerMotivasjon(handling.mengde);
          break;
      }
    }
  }

  /**
   * Gir poeng til eleven
   * @param {number} mengde - Antall poeng som skal gis
   */
  giPoeng(mengde) {
    this.elevTilstand.poeng += mengde;
    console.log(`${this.elevTilstand.navn} fikk ${mengde} poeng! Totalt: ${this.elevTilstand.poeng}`);
  }

  /**
   * Øker en spesifikk ferdighet
   * @param {string} ferdighet - Navn på ferdigheten
   * @param {number} mengde - Mengde å øke med
   */
  økFerdighet(ferdighet, mengde) {
    if (!this.elevTilstand.ferdigheter[ferdighet]) {
      this.elevTilstand.ferdigheter[ferdighet] = 0;
    }
    this.elevTilstand.ferdigheter[ferdighet] += mengde;
    console.log(`${ferdighet} økte med ${mengde}! Nytt nivå: ${this.elevTilstand.ferdigheter[ferdighet]}`);
  }

  /**
   * Gir tilbakemelding til eleven
   * @param {string} melding - Tilbakemeldingen som skal gis
   */
  giTilbakemelding(melding) {
    console.log(`💬 Lærerassistent: ${melding}`);
  }

  /**
   * Foreslår en ny oppgave til eleven
   * @param {Object} oppgave - Oppgaveobjekt
   */
  foreslåOppgave(oppgave) {
    this.elevTilstand.aktivOppgave = oppgave;
    console.log(`📋 Ny oppgave foreslått: ${oppgave.tittel}`);
  }

  /**
   * Justerer elevens motivasjon
   * @param {number} mengde - Mengde å justere (positiv eller negativ)
   */
  justerMotivasjon(mengde) {
    this.elevTilstand.motivasjon = Math.max(0, Math.min(100, this.elevTilstand.motivasjon + mengde));
    console.log(`Motivasjon justert: ${this.elevTilstand.motivasjon}/100`);
  }

  /**
   * Behandler elevens svar på oppgaver
   * @param {*} svar - Elevens svar
   * @param {*} fasit - Riktig svar
   */
  behandleSvar(svar, fasit) {
    const riktig = this.sjekkSvar(svar, fasit);
    
    if (riktig) {
      const handlinger = this.evaluerRegler('riktig_svar', { svar, fasit });
      this.utførHandlinger(handlinger);
    } else {
      const handlinger = this.evaluerRegler('feil_svar', { svar, fasit });
      this.utførHandlinger(handlinger);
    }

    this.elevTilstand.arbeidshistorikk.push({
      tidspunkt: new Date(),
      svar: svar,
      fasit: fasit,
      riktig: riktig
    });

    return riktig;
  }

  /**
   * Sjekker om svaret er riktig
   * @param {*} svar - Elevens svar
   * @param {*} fasit - Riktig svar
   * @returns {boolean} - True hvis svaret er riktig
   */
  sjekkSvar(svar, fasit) {
    return _.isEqual(svar, fasit);
  }

  /**
   * Henter gjeldende status for eleven
   * @returns {Object} - Komplett tilstandsobjekt
   */
  hentStatus() {
    return {
      elev: this.elevTilstand,
      spill: this.spillTilstand,
      antalRegler: this.regler.length
    };
  }

  /**
   * Genererer en progresjonsoversikt
   * @returns {Object} - Progressjonsdata
   */
  genererProgresjonsoversikt() {
    const riktigeSvar = this.elevTilstand.arbeidshistorikk.filter(item => item.riktig).length;
    const totaltSvar = this.elevTilstand.arbeidshistorikk.length;
    const suksessrate = totaltSvar > 0 ? (riktigeSvar / totaltSvar) * 100 : 0;

    return {
      totalPoeng: this.elevTilstand.poeng,
      nivå: this.elevTilstand.nivå,
      ferdigheter: this.elevTilstand.ferdigheter,
      suksessrate: Math.round(suksessrate),
      motivasjon: this.elevTilstand.motivasjon,
      antallOppgaverLøst: totaltSvar
    };
  }
}

// Eksporter klassen for bruk i andre moduler
module.exports = VirtuellLaererassistent;

// Kjør bare hvis filen kjøres direkte
if (require.main === module) {
  const assistent = new VirtuellLaererassistent();
  
  // Eksempel på bruk
  assistent.registrerElev('Anna', { matematikk: 5, norsk: 7 });
  assistent.startSesjon();
  
  console.log('\n=== Virtuell Lærerassistent startet ===');
  console.log('Systemet er klart for bruk!');
  
  // Last regler hvis example.json finnes
  const regelFil = path.join(__dirname, '..', 'rules', 'example.json');
  if (fs.existsSync(regelFil)) {
    assistent.lastRegler(regelFil);
  }
} 