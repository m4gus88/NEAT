class Reproduction {

    createGenome(config) {
        return new Genome(++genome_key, config);
    }

    reproduce(populationSize, genomes) {
        let newGenomes = {};

        let pool = [];
        Object.values(genomes).forEach(genome => {
            for (let i = 0; i < genome.fitness; i++) {
                pool.push(genome);
            }
        });

        for (let i = 0; i < populationSize; i++) {
            let parent1 = this.selectParent(pool);
            let parent2 = this.selectParent(pool);
            let newGenome = parent1.crossOver(parent2);
            newGenome.mutate();
            newGenomes[newGenome.key] = newGenome;
        }

        return newGenomes;
    }

    selectParent(pool) {
        return pool[Math.random() * pool.length >> 0];
    }
}