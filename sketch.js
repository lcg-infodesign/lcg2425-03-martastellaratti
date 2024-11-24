let data = [];          // Array che conterrà tutti i dati dei fiumi
let maxLength = 0;      // Lunghezza massima tra tutti i fiumi
let maxArea = 0;        // Area massima tra tutti i fiumi
let maxTributaries = 0; // Numero massimo di tributari tra tutti i fiumi
let bgImage;            // Variabile per l'immagine di sfondo
let scaleFactor = 1;    // Fattore di scala globale per adattare i grafici alle dimensioni del canvas


function preload() {
  // Immagine di sfondo
  bgImage = loadImage('assets/images/background.jpg');
  
  loadTable("assets/data.csv", "csv", "header", tableLoaded);
}


function tableLoaded(table) {
  // Itera su tutte le righe del CSV (partendo dalla seconda riga, indice 1)
  for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];
    let values = row.arr;
    
    // Crea un oggetto "river" per ogni fiume e lo aggiunge all'array "data"
    let river = {
      name: values[1],                   // Nome del fiume
      length: parseFloat(values[3]),     // Lunghezza del fiume
      area: parseFloat(values[4]),       // Area del fiume
      tributaries: parseInt(values[8])   // Numero di tributari
    };
    data.push(river);  
    
    // Aggiorna i valori massimi
    maxLength = Math.max(maxLength, river.length);
    maxArea = Math.max(maxArea, river.area);
    maxTributaries = Math.max(maxTributaries, river.tributaries);
  }
}


function setup() {
  // Creo un div per lo sfondo fisso
  let bgDiv = createDiv('');
  bgDiv.style('position', 'fixed');
  bgDiv.style('top', '0');
  bgDiv.style('left', '0');
  bgDiv.style('width', '100%');
  bgDiv.style('height', '100%');
  // Usa l'immagine caricata come sfondo
  bgDiv.style('background-image', `url(${bgImage.canvas.toDataURL()})`);
  bgDiv.style('background-size', 'cover');
  bgDiv.style('background-position', 'center');
  bgDiv.style('z-index', '-1');
  
  // Creo il canvas con sfondo trasparente
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('position', 'relative');
  cnv.style('z-index', '1');
  noLoop();
}


function draw() {
  clear();  // Usa clear() per mantenere la trasparenza
  
  // Calcola il fattore di scala dinamico per adattarlo al ridimensionamento del canvas
  calculateScaleFactor(); // Calcola il fattore di scala in base alla dimensione del canvas
  
  // Layout
  let riversPerRow = 4;                                     
  let padding = 50 * scaleFactor;                            // Scala il padding
  let cellWidth = (width - (padding * 2)) / riversPerRow;   // Calcola la larghezza della cella
  let cellHeight = 300 * scaleFactor;                        // Scala l'altezza della cella
  let rows = Math.ceil(data.length / riversPerRow);          // Calcola il numero di righe
  
  // Calcola l'altezza totale necessaria per il canvas
  let totalHeight = rows * (cellHeight + padding) + padding + 60 * scaleFactor;
  
  // Ridimensiona il canvas per contenere tutti i fiumi
  resizeCanvas(windowWidth, Math.max(totalHeight, windowHeight));
  
  // Titolo
  textAlign(CENTER, CENTER);
  textSize(32 * scaleFactor); // Scala la dimensione del testo
  fill(255);
  text('Rivers in The World', width / 2, 40 * scaleFactor);
  
  // Sposta l'origine per il padding
  translate(padding, padding + 60 * scaleFactor);
  
  // Ciclo per disegnare ogni fiume
  for (let i = 0; i < data.length; i++) {
    let river = data[i];  
    
    let row = Math.floor(i / riversPerRow);  
    let col = i % riversPerRow;              
    let x = col * cellWidth;                 
    let y = row * (cellHeight + padding);    
    
    push();
    translate(x + cellWidth / 2, y);
    drawMainBranch(river);  // Per disegnare il ramo principale del fiume
    pop();
  }
}

// Funzione per calcolare il fattore di scala
function calculateScaleFactor() {
  let baseWidth = 1920; // Dimensioni di riferimento
  let baseHeight = 1080;
  scaleFactor = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);
}

// Funzione per disegnare il ramo principale e gli affluenti
function drawMainBranch(river) {
  // Calcola la lunghezza e la larghezza del ramo principale
  let branchLength = map(river.length, 0, maxLength, 50 * scaleFactor, 200 * scaleFactor);
  let branchWidth = map(river.area, 0, maxArea, 5 * scaleFactor, 30 * scaleFactor);
  
  // Determina il numero di affluenti da disegnare
  let numTributaries;
  if (river.tributaries <= 10) {
    numTributaries = river.tributaries;
  } else if (river.tributaries <= 50) {
    numTributaries = map(river.tributaries, 10, 50, 10, 15);
  } else if (river.tributaries <= 200) {
    numTributaries = map(river.tributaries, 50, 200, 15, 20);
  } else {
    numTributaries = map(river.tributaries, 200, maxTributaries, 20, 25);
  }
  numTributaries = Math.ceil(numTributaries); // Arrotonda il numero di affluenti
  
  push();
  fill('#0d43de');
  noStroke();
  
  // Disegna il ramo principale del fiume
  beginShape();
  vertex(-branchWidth / 2, 0);
  bezierVertex(-branchWidth / 2, branchLength / 3, -branchWidth / 4, branchLength / 2, 0, branchLength);
  bezierVertex(branchWidth / 4, branchLength / 2, branchWidth / 2, branchLength / 3, branchWidth / 2, 0);
  endShape(CLOSE);
  
  // Disegna gli affluenti
  drawTributaries(branchLength, branchWidth, numTributaries);
  
  // Testo con il numero di tributari e il nome del fiume
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(10 * scaleFactor);  // Scala la dimensione del testo
  text(`Tributaries: ${river.tributaries}`, 0, branchLength + 20 * scaleFactor);
  
  textSize(12 * scaleFactor);  // Scala la dimensione del testo
  text(river.name, 0, branchLength + 40 * scaleFactor);
  
  pop();
}

// Funzione per disegnare gli affluenti
function drawTributaries(branchLength, branchWidth, numTributaries) {
  // Calcola l'angolo totale degli affluenti
  let totalAngle = map(numTributaries, 1, 25, PI / 6, PI);  // Angolo totale disponibile
let startAngle = -totalAngle / 2;                         // Angolo di partenza
let angleStep = totalAngle / (numTributaries - 1 || 1);   // Divisione dello spazio tra i tributari (num trib - 1) --> tra 3 trib abbiamo 2 spazi
let tributaryScale = map(numTributaries, 1, 25, 1, 0.5); // Scala la dimensione degli affluenti
//  (numTributaries - 1 || 1) viene utilizzato per calcolare correttamente l'angleStep e per gestire in particolarte il caso di 1 singolo tributario
// nella divisione 0/1, restituisce 1, verrà posizionato ad una posizione di -totalAngle
  
// Ciclo per disegnare ogni affluente
  for (let i = 0; i < numTributaries; i++) {
    let angle = startAngle + i * angleStep;
    let tributaryLength = branchLength * 0.4 * tributaryScale;
    let tributaryWidth = branchWidth * 0.5 * tributaryScale;
    
    let fixedLengthVariation = 0.8 + (i % 5) * 0.1; //Variazioni fisse dell'angolo
    let fixedAngleVariation = -0.1 + (i % 3) * 0.1;
    
    let finalLength = tributaryLength * fixedLengthVariation;
    let finalAngle = angle + fixedAngleVariation;
    
    push();
    translate(0, branchLength * (0.6 + (i % 3) * 0.1));
    rotate(finalAngle);
    
    // Disegna il singolo affluente
    beginShape();
    vertex(-tributaryWidth / 2, 0);
    bezierVertex(-tributaryWidth / 2, finalLength / 3, -tributaryWidth / 4, finalLength / 2, 0, finalLength);
    bezierVertex(tributaryWidth / 4, finalLength / 2, tributaryWidth / 2, finalLength / 3, tributaryWidth / 2, 0);
    endShape(CLOSE);
    
    pop();
  }
}

// Ridimensionamento canvas
function windowResized() {
  let riversPerRow = 4;
  let padding = 50 * scaleFactor;
  let cellHeight = 300 * scaleFactor;
  let rows = Math.ceil(data.length / riversPerRow);
  let totalHeight = rows * (cellHeight + padding) + padding + 60 * scaleFactor;

  
  resizeCanvas(windowWidth, Math.max(totalHeight, windowHeight));
  redraw();
}




