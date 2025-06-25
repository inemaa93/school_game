import java.util.Scanner;

public class Laeringsspill {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int poeng = 0;
        int nivå = 1;
        int motivasjon = 100;
        int oppgaverLøst = 0;
        int matte = 0;
        int norsk = 0;

        System.out.println("🎓 Virtuell Lærerassistent");
        System.out.println("Velkommen til læringsspillet!\n");

        // Spørsmål 1: Matematikk
        System.out.println("Matematikk: Hva er 8 + 6?");
        int svar1 = scanner.nextInt();
        if (svar1 == 14) {
            System.out.println("Riktig!");
            poeng += 15;
            matte += 1;
        } else {
            System.out.println("Feil. Riktig svar er 14.");
            motivasjon -= 10;
        }
        oppgaverLøst++;

        // Spørsmål 2: Norsk
        scanner.nextLine(); // Tøm buffer
        System.out.println("Norsk: Hva heter Norges nasjonaldag?");
        String svar2 = scanner.nextLine();
        if (svar2.trim().equalsIgnoreCase("17. mai") || svar2.trim().equalsIgnoreCase("syttende mai")) {
            System.out.println("Riktig!");
            poeng += 15;
            norsk += 1;
        } else {
            System.out.println("Feil. Riktig svar er 17. mai.");
            motivasjon -= 10;
        }
        oppgaverLøst++;

        // Nivå-oppgradering
        if (poeng >= 30) {
            nivå = 2;
        }

        // Oppsummering
        System.out.println("\n--- Din progresjon ---");
        System.out.println("Totale poeng: " + poeng);
        System.out.println("Nivå: " + nivå);
        System.out.println("Motivasjon: " + motivasjon + "%");
        System.out.println("Oppgaver løst: " + oppgaverLøst);
        System.out.println("Matematikk: " + matte);
        System.out.println("Norsk: " + norsk);

        scanner.close();
    }
} 