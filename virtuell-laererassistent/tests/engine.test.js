const VirtuellLaererassistent = require('../src/engine');
const path = require('path');

describe('VirtuellLaererassistent', () => {
  let assistent;

  beforeEach(() => {
    assistent = new VirtuellLaererassistent();
  });

  describe('Grunnleggende funksjonalitet', () => {
    test('skal opprette en ny instans med standard verdier', () => {
      expect(assistent.elevTilstand.navn).toBe('');
      expect(assistent.elevTilstand.nivå).toBe(1);
      expect(assistent.elevTilstand.poeng).toBe(0);
      expect(assistent.elevTilstand.motivasjon).toBe(100);
      expect(assistent.spillTilstand.startet).toBe(false);
    });

    test('skal registrere en ny elev korrekt', () => {
      const navn = 'Test Elev';
      const ferdigheter = { matematikk: 5, norsk: 3 };
      
      assistent.registrerElev(navn, ferdigheter);
      
      expect(assistent.elevTilstand.navn).toBe(navn);
      expect(assistent.elevTilstand.ferdigheter.matematikk).toBe(5);
      expect(assistent.elevTilstand.ferdigheter.norsk).toBe(3);
      expect(assistent.elevTilstand.ferdigheter.engelsk).toBe(0); // standardverdi
    });

    test('skal starte en sesjon korrekt', () => {
      assistent.registrerElev('Test');
      assistent.startSesjon();
      
      expect(assistent.spillTilstand.startet).toBe(true);
      expect(assistent.spillTilstand.aktiveSesjon).toBeInstanceOf(Date);
    });
  });

  describe('Poeng og ferdigheter', () => {
    beforeEach(() => {
      assistent.registrerElev('Test Elev');
    });

    test('skal gi poeng korrekt', () => {
      assistent.giPoeng(50);
      expect(assistent.elevTilstand.poeng).toBe(50);
      
      assistent.giPoeng(25);
      expect(assistent.elevTilstand.poeng).toBe(75);
    });

    test('skal øke ferdigheter korrekt', () => {
      assistent.økFerdighet('matematikk', 3);
      expect(assistent.elevTilstand.ferdigheter.matematikk).toBe(3);
      
      assistent.økFerdighet('matematikk', 2);
      expect(assistent.elevTilstand.ferdigheter.matematikk).toBe(5);
    });

    test('skal håndtere nye ferdigheter', () => {
      assistent.økFerdighet('historie', 4);
      expect(assistent.elevTilstand.ferdigheter.historie).toBe(4);
    });
  });

  describe('Motivasjon', () => {
    beforeEach(() => {
      assistent.registrerElev('Test Elev');
    });

    test('skal justere motivasjon innenfor grenser', () => {
      assistent.justerMotivasjon(-30);
      expect(assistent.elevTilstand.motivasjon).toBe(70);
      
      assistent.justerMotivasjon(50);
      expect(assistent.elevTilstand.motivasjon).toBe(100); // maks 100
      
      assistent.justerMotivasjon(-150);
      expect(assistent.elevTilstand.motivasjon).toBe(0); // min 0
    });
  });

  describe('Sammenligning av verdier', () => {
    test('skal sammenligne verdier korrekt', () => {
      expect(assistent.sammenlignVerdi(10, '>', 5)).toBe(true);
      expect(assistent.sammenlignVerdi(5, '>', 10)).toBe(false);
      expect(assistent.sammenlignVerdi(10, '<', 5)).toBe(false);
      expect(assistent.sammenlignVerdi(5, '<', 10)).toBe(true);
      expect(assistent.sammenlignVerdi(10, '>=', 10)).toBe(true);
      expect(assistent.sammenlignVerdi(10, '<=', 10)).toBe(true);
      expect(assistent.sammenlignVerdi(10, '==', 10)).toBe(true);
      expect(assistent.sammenlignVerdi(10, '!=', 5)).toBe(true);
    });
  });

  describe('Sjekk av betingelser', () => {
    beforeEach(() => {
      assistent.registrerElev('Test Elev', { matematikk: 10 });
      assistent.elevTilstand.poeng = 100;
      assistent.elevTilstand.motivasjon = 80;
    });

    test('skal sjekke hendelse-betingelser', () => {
      const betingelser = [{ type: 'hendelse', verdi: 'riktig_svar' }];
      
      expect(assistent.sjekkBetingelser(betingelser, 'riktig_svar')).toBe(true);
      expect(assistent.sjekkBetingelser(betingelser, 'feil_svar')).toBe(false);
    });

    test('skal sjekke ferdighetsnivå-betingelser', () => {
      const betingelser = [{ 
        type: 'ferdighetsnivå', 
        ferdighet: 'matematikk', 
        operator: '>=', 
        verdi: 5 
      }];
      
      expect(assistent.sjekkBetingelser(betingelser, 'test')).toBe(true);
      
      betingelser[0].verdi = 15;
      expect(assistent.sjekkBetingelser(betingelser, 'test')).toBe(false);
    });

    test('skal sjekke motivasjon-betingelser', () => {
      const betingelser = [{ 
        type: 'motivasjon', 
        operator: '>', 
        verdi: 70 
      }];
      
      expect(assistent.sjekkBetingelser(betingelser, 'test')).toBe(true);
      
      betingelser[0].verdi = 90;
      expect(assistent.sjekkBetingelser(betingelser, 'test')).toBe(false);
    });

    test('skal sjekke poeng-betingelser', () => {
      const betingelser = [{ 
        type: 'poeng', 
        operator: '>=', 
        verdi: 50 
      }];
      
      expect(assistent.sjekkBetingelser(betingelser, 'test')).toBe(true);
      
      betingelser[0].verdi = 150;
      expect(assistent.sjekkBetingelser(betingelser, 'test')).toBe(false);
    });
  });

  describe('Svar-behandling', () => {
    beforeEach(() => {
      assistent.registrerElev('Test Elev');
      // Mock console.log for å unngå output under testing
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('skal sjekke riktige svar', () => {
      expect(assistent.sjekkSvar(42, 42)).toBe(true);
      expect(assistent.sjekkSvar('hei', 'hei')).toBe(true);
      expect(assistent.sjekkSvar([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    test('skal sjekke feil svar', () => {
      expect(assistent.sjekkSvar(42, 24)).toBe(false);
      expect(assistent.sjekkSvar('hei', 'ha det')).toBe(false);
      expect(assistent.sjekkSvar([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    test('skal legge til arbeidshistorikk ved svar', () => {
      const startLength = assistent.elevTilstand.arbeidshistorikk.length;
      
      assistent.behandleSvar(42, 42);
      
      expect(assistent.elevTilstand.arbeidshistorikk.length).toBe(startLength + 1);
      
      const sisteSvar = assistent.elevTilstand.arbeidshistorikk[assistent.elevTilstand.arbeidshistorikk.length - 1];
      expect(sisteSvar.svar).toBe(42);
      expect(sisteSvar.fasit).toBe(42);
      expect(sisteSvar.riktig).toBe(true);
      expect(sisteSvar.tidspunkt).toBeInstanceOf(Date);
    });
  });

  describe('Regelevaluering', () => {
    beforeEach(() => {
      assistent.registrerElev('Test Elev');
      // Sett motivasjon til en lavere verdi så vi kan teste økning
      assistent.elevTilstand.motivasjon = 90;
      // Mock console.log
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('skal evaluere enkle regler', () => {
      const testRegler = [
        {
          betingelser: [{ type: 'hendelse', verdi: 'riktig_svar' }],
          handlinger: [
            { type: 'gi_poeng', mengde: 10 },
            { type: 'gi_tilbakemelding', melding: 'Bra jobbet!' }
          ]
        }
      ];
      
      assistent.regler = testRegler;
      
      const handlinger = assistent.evaluerRegler('riktig_svar');
      expect(handlinger).toHaveLength(2);
      expect(handlinger[0].type).toBe('gi_poeng');
      expect(handlinger[0].mengde).toBe(10);
    });

    test('skal utføre handlinger korrekt', () => {
      const handlinger = [
        { type: 'gi_poeng', mengde: 25 },
        { type: 'øk_ferdighet', ferdighet: 'matematikk', mengde: 2 },
        { type: 'juster_motivasjon', mengde: 5 }
      ];
      
      const startPoeng = assistent.elevTilstand.poeng;
      const startMatematikk = assistent.elevTilstand.ferdigheter.matematikk || 0;
      const startMotivasjon = assistent.elevTilstand.motivasjon;
      
      assistent.utførHandlinger(handlinger);
      
      expect(assistent.elevTilstand.poeng).toBe(startPoeng + 25);
      expect(assistent.elevTilstand.ferdigheter.matematikk).toBe(startMatematikk + 2);
      expect(assistent.elevTilstand.motivasjon).toBe(startMotivasjon + 5);
    });
  });

  describe('Status og progresjon', () => {
    beforeEach(() => {
      assistent.registrerElev('Test Elev', { matematikk: 5 });
      assistent.elevTilstand.poeng = 150;
      // Mock console.log
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('skal hente komplett status', () => {
      const status = assistent.hentStatus();
      
      expect(status).toHaveProperty('elev');
      expect(status).toHaveProperty('spill');
      expect(status).toHaveProperty('antalRegler');
      expect(status.elev.navn).toBe('Test Elev');
      expect(status.elev.poeng).toBe(150);
    });

    test('skal generere progresjonsoversikt', () => {
      // Legg til litt arbeidshistorikk
      assistent.behandleSvar(42, 42); // riktig
      assistent.behandleSvar(10, 20); // feil
      assistent.behandleSvar(5, 5);   // riktig
      
      const progresjon = assistent.genererProgresjonsoversikt();
      
      expect(progresjon).toHaveProperty('totalPoeng');
      expect(progresjon).toHaveProperty('nivå');
      expect(progresjon).toHaveProperty('ferdigheter');
      expect(progresjon).toHaveProperty('suksessrate');
      expect(progresjon).toHaveProperty('motivasjon');
      expect(progresjon).toHaveProperty('antallOppgaverLøst');
      
      expect(progresjon.suksessrate).toBe(67); // 2 av 3 riktige, avrundet
      expect(progresjon.antallOppgaverLøst).toBe(3);
    });
  });

  describe('Lasting av regler', () => {
    test('skal håndtere feil ved lasting av ikke-eksisterende fil', () => {
      // Mock console.error for å unngå output under testing
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      assistent.lastRegler('ikke-eksisterende-fil.json');
      
      expect(assistent.regler).toHaveLength(0);
      expect(console.error).toHaveBeenCalled();
      
      jest.restoreAllMocks();
    });
  });
}); 