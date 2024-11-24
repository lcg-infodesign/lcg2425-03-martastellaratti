[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/rKbf-r4Q)
# P5-empty-project
This repository is the starting point of the assignments given in the course [Computergrafica per l'Information Design](https://www11.ceda.polimi.it/schedaincarico/schedaincarico/controller/scheda_pubblica/SchedaPublic.do?&evn_default=evento&c_classe=834257&lang=IT&__pj0=0&__pj1=9c10fe379e96db59d55d49b6b4252c5e).




Rappresentazione dei fiumi
Ogni fiume viene rappresentato con un ramo principale (main branch) e dei tributari
I fiumi sono disposti in una griglia di 4 colonne
Le dimensioni sono scalate in base alla dimensione della finestra usando scaleFactor

1. Ramo Principale (drawMainBranch):
- La lunghezza è proporzionale alla lunghezza reale del fiume
- La larghezza è proporzionale all'area del bacino del fiume
- Viene disegnato usando una curva Bézier per dare un aspetto naturale e fluido

2. Logica rappresentazione dei Tributari (drawTributaries):
- Mantenere leggibilità anche con fiumi che hanno molti tributari
- Mantiene una rappresentazione 1:1 fino a 10 tributari
- Comprime progressivamente i numeri più alti per evitare sovraffollamento
- Ha un limite massimo di 25 tributari visualizzati


Come funziona la rappresentazione 
Distribuisce i tributari in un arco che si allarga all'aumentare del loro numero
Scala la dimensione dei tributari inversamente al loro numero (più sono, più piccoli diventano)
Usa variazioni fisse per lunghezza e angolo per creare un aspetto più naturale:
           
  Variazioni:
  - Sempre uguali per lo stesso indice
  - Si ripetono ogni 3-5 tributari
  - Variazioni del 10%
