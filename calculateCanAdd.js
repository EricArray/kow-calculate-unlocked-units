/// Receives the number of unlocking units and Heroes, War Engines, Monsters/Titans; and returns whether units can be added.
/// hordeCount: number of Infantry + Heavy Infantry hordes
/// largeInfCount: number of  Large Infatry + Monstruos Infantry + Large Cavalry hordes
/// regimentCount: number of Infantry + Heavy Infantry regiments
/// monsterCount: number of Monster + Titan
/// Undefined behavior if input heroCount, warEngineCount or monsterCount isn't already legal.
function calculateCanAdd({ hordeCount, largeInfCount, regimentCount, heroCount, warEngineCount, monsterCount }) {
  const min = Math.min;

  // spend horde slots first
  const heroIntoHorde = min(heroCount, hordeCount);
  const warEngineIntoHorde = min(warEngineCount, hordeCount);
  const monsterIntoHorde = min(monsterCount, hordeCount);

  // spend large inf slots before regiments
  const heroIntoLargeInf = min(heroCount - heroIntoHorde, largeInfCount);
  const warEngineIntoLargeInf = min(warEngineCount - warEngineIntoHorde, largeInfCount);
  const monsterIntoLargeInf = min(monsterCount - monsterIntoHorde, largeInfCount);

  // spend regiment slots latest
  const heroIntoRegiment = min(heroCount - heroIntoHorde - heroIntoLargeInf, regimentCount);
  const warEngineIntoRegiment = min(warEngineCount - warEngineIntoHorde - warEngineIntoLargeInf, regimentCount - heroIntoRegiment);
  const monsterIntoRegiment = min(
    monsterCount - monsterIntoHorde - monsterIntoLargeInf,
    regimentCount - heroIntoRegiment - warEngineIntoRegiment,
  );

  // check unused slots and return results
  const hasUnusedLargeInfSlots = heroIntoLargeInf + warEngineIntoLargeInf + monsterIntoLargeInf < largeInfCount * 2;
  const hasUnusedRegimentSlots = heroIntoRegiment + warEngineIntoRegiment + monsterIntoRegiment < regimentCount;

  const canAddHero = heroIntoHorde < hordeCount || (heroIntoLargeInf < largeInfCount && hasUnusedLargeInfSlots) || hasUnusedRegimentSlots;
  const canAddWarEngine =
    warEngineIntoHorde < hordeCount || (warEngineIntoLargeInf < largeInfCount && hasUnusedLargeInfSlots) || hasUnusedRegimentSlots;
  const canAddMonster =
    monsterIntoHorde < hordeCount || (monsterIntoLargeInf < largeInfCount && hasUnusedLargeInfSlots) || hasUnusedRegimentSlots;

  return {
    canAddHero,
    canAddWarEngine,
    canAddMonster,
  };
};

(function test_calculateCanAdd() {
  // I am using JSON.stringify to compare object as this is vanilla js

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 0,
        largeInfCount: 0,
        regimentCount: 0,
        heroCount: 0,
        warEngineCount: 0,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: false,
        canAddWarEngine: false,
        canAddMonster: false,
      }),
    'should not allow anything if everything is on 0',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 1,
        largeInfCount: 0,
        regimentCount: 0,
        heroCount: 0,
        warEngineCount: 0,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: true,
        canAddWarEngine: true,
        canAddMonster: true,
      }),
    'should allow to add any if there is only 1 horde',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 1,
        largeInfCount: 0,
        regimentCount: 0,
        heroCount: 1,
        warEngineCount: 0,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: false,
        canAddWarEngine: true,
        canAddMonster: true,
      }),
    'should not allow to add hero if there is only 1 horde and 1 hero',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 0,
        largeInfCount: 1,
        regimentCount: 0,
        heroCount: 1,
        warEngineCount: 0,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: false,
        canAddWarEngine: true,
        canAddMonster: true,
      }),
    'should not allow to add hero if there is only 1 large inf and 1 hero',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 0,
        largeInfCount: 0,
        regimentCount: 1,
        heroCount: 1,
        warEngineCount: 0,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: false,
        canAddWarEngine: false,
        canAddMonster: false,
      }),
    'should not allow to add anything if there is only 1 regiment and 1 hero',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 0,
        largeInfCount: 2,
        regimentCount: 0,
        heroCount: 2,
        warEngineCount: 1,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: false,
        canAddWarEngine: true,
        canAddMonster: true,
      }),
    'should not allow more than 2 of the same kind per large inf unit',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 1,
        largeInfCount: 2,
        regimentCount: 2,
        heroCount: 4,
        warEngineCount: 2,
        monsterCount: 2,
      }),
    ) ===
      JSON.stringify({
        canAddHero: true,
        canAddWarEngine: true,
        canAddMonster: true,
      }),
    'should allow to add any if there is an unused regiment',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 1,
        largeInfCount: 2,
        regimentCount: 2,
        heroCount: 5,
        warEngineCount: 3,
        monsterCount: 2,
      }),
    ) ===
      JSON.stringify({
        canAddHero: false,
        canAddWarEngine: false,
        canAddMonster: false,
      }),
    'should not allow to add anything if every slot is taken',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 1,
        largeInfCount: 1,
        regimentCount: 2,
        heroCount: 0,
        warEngineCount: 3,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: true,
        canAddWarEngine: true,
        canAddMonster: true,
      }),
    'another test 1',
  );

  console.assert(
    JSON.stringify(
      calculateCanAdd({
        hordeCount: 1,
        largeInfCount: 1,
        regimentCount: 2,
        heroCount: 0,
        warEngineCount: 4,
        monsterCount: 0,
      }),
    ) ===
      JSON.stringify({
        canAddHero: true,
        canAddWarEngine: false,
        canAddMonster: true,
      }),
    'another test 2',
  );
})();
