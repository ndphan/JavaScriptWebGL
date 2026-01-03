import { CrystalCollectorGame, createCrystalCollectorApp } from "./CrystalCollectorGame";
import { ExampleWorld, createExampleApp } from "./ExampleApp";
import { createRacingGame } from "./RacingGame";

// Game registry
const games = {
  'example': {
    name: 'Example App',
    description: '3D scene with various objects and interactions',
    createFunction: createExampleApp
  },
  'crystal-collector': {
    name: 'Crystal Collector 3D',
    description: 'Collect crystals in a 3D world before time runs out!',
    createFunction: createCrystalCollectorApp
  },
  'racing': {
    name: '3D Racing Game',
    description: 'Race against AI bots on a 3D track with realistic physics!',
    createFunction: createRacingGame
  }
};

// Main game launcher
const launchGame = (gameKey: string) => {
  const game = games[gameKey];
  if (game) {
    console.log(`🎮 Launching ${game.name}...`);
    
    // Clear any existing game content
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = '';
    }
    
    // Launch the selected game
    game.createFunction();
    
    // Hide game menu
    const gameMenu = document.getElementById('game-menu');
    if (gameMenu) {
      gameMenu.style.display = 'none';
    }
    
    // Show back button
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.style.display = 'block';
    }
  } else {
    console.error(`Game '${gameKey}' not found!`);
  }
};

// Show game menu
const showGameMenu = () => {
  const gameMenu = document.getElementById('game-menu');
  const backButton = document.getElementById('back-button');
  const appElement = document.getElementById('app');
  
  if (gameMenu) gameMenu.style.display = 'block';
  if (backButton) backButton.style.display = 'none';
  if (appElement) appElement.innerHTML = '';
  
  // Clear any running game instances
  (window as any).gameInstance = null;
};

// Initialize the application
window.onload = function () {
  try {
    // Check URL parameter to decide which game to load
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get('game');
    
    if (gameMode && games[gameMode]) {
      // Load specific game directly
      launchGame(gameMode);
    } else {
      // Show game selection menu
      showGameMenu();
    }
    
    // Expose functions globally for HTML access
    (window as any).launchGame = launchGame;
    (window as any).showGameMenu = showGameMenu;
    
  } catch (error) {
    console.error(error);
  }
};
