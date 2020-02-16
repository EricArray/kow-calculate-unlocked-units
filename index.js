function calculate() {
  // inputs
  const hordeCount = +document.querySelector('#hordeCount').value;
  const largeInfCount = +document.querySelector('#largeInfCount').value;
  const regimentCount = +document.querySelector('#regimentCount').value;

  const heroCount = +document.querySelector('#heroCount').value;
  const warEngineCount = +document.querySelector('#warEngineCount').value;
  const monsterCount = +document.querySelector('#monsterCount').value;

  // calculate
  const {
    canAddHero,
    canAddWarEngine,
    canAddMonster,
  } = calculateCanAdd({
    hordeCount,
    largeInfCount,
    regimentCount,
    heroCount,
    warEngineCount,
    monsterCount,
  });

  // outputs
  document.querySelector('#canAddHero').textContent = canAddHero ? 'Yes' : 'No';
  document.querySelector('#canAddWarEngine').textContent = canAddWarEngine ? 'Yes' : 'No';
  document.querySelector('#canAddMonster').textContent = canAddMonster ? 'Yes' : 'No';
}