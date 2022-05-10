class Reproduction {

    createGenome(config) {
        return new Genome(++genome_key, config);
    }

    reproduce(populationSize, species, config) {
        let remainingSpecies = [];
        let extinctSpecies = [];
        species.species.forEach(s => {
            if (species.isStagnant(s)) {
                extinctSpecies.push(s.key);
            } else {
                remainingSpecies.push(s);
            }
        });
        species.extinction(extinctSpecies);

        if (!remainingSpecies.length) {
            throw 'Total extinction';
        }

        let allFitnesses = [];
        remainingSpecies.forEach(s => s.members.forEach(g => allFitnesses.push(g.fitness)));

        let minFitness = allFitnesses.reduce((a, b) => a < b ? a : b);
        let maxFitness = allFitnesses.reduce((a, b) => a > b ? a : b);
        let fitnessRange = Math.max(1.0, maxFitness - minFitness);
        remainingSpecies.forEach(s => {
            let mean = s.members.map(g => g.fitness).reduce((a, b) => a + b) / s.members.length;
            s.adjustedFitness = (mean - minFitness) / fitnessRange;
        })

        let fitnessSum = remainingSpecies.map(s => s.adjustedFitness).reduce((a, b) => a + b);
        let spawns = {};
        remainingSpecies.forEach(s => {
            if (fitnessSum > 0) {
                spawns[s.key] = Math.round(s.adjustedFitness / fitnessSum * populationSize);
            } else {
                spawns[s.key] = Math.round(populationSize / species.length);
            }
        });

        let newGenomes = {};
        remainingSpecies.forEach(s => {
            let elitism = config.elitism;
            for (let i = 0; i < spawns[s.key]; i++) {
                if (config.survivalThreshold > 0) {
                    s.members.sort((a, b) => b.fitness - a.fitness);
                    let idx = Math.max(2, Math.round(config.survivalThreshold * s.members.length));
                    s.members.splice(idx, s.members.length - idx);
                }

                if (elitism > 0) {
                    s.members.sort((a, b) => b.fitness - a.fitness);
                    for (let j = 0; j < elitism; j++) {
                        let newGenome = s.members[j];
                        if (!!newGenome) {
                            newGenome.generation++;
                            newGenomes[newGenome.key] = newGenome;
                        }
                    }
                    elitism = 0;
                } else {
                    let parent1 = this.selectParent(s.members);
                    let parent2 = this.selectParent(s.members);
                    let newGenome = parent1.crossOver(parent2);
                    newGenome.mutate();
                    newGenomes[newGenome.key] = newGenome;
                }
            }
        });

        return newGenomes;
    }

    selectParent(pool) {
        return pool[Math.random() * pool.length >> 0];
    }
}