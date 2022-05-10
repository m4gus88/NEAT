var species_key = 0;

class Species {
    constructor(key, generation) {
        this.key = key;
        this.created = generation;
        this.generation = generation;
        this.lastImproved = generation;
        this.representative = null;
        this.members = [];
        this.fitness = null;
        this.adjustedFitness = null;
        this.fitnessHistory = [];
    }
}

class SpeciesSet {
    constructor(config) {
        this.species = [];
        this.lastIndex = 0;
        this.cache = new DistanceCache();
        this.config = config;
    }

    speciate(genomes, generation) {
        let unspeciated = [...genomes];
        let newRepresentatives = {};
        let newMembers = {};

        // Find the new representatives
        for (let species of this.species) {
            let candidates = [];
            for (let genome of genomes) {
                let d = this.cache.distance(species.representative, genome);
                candidates.push({distance: d, genome: genome});
            }

            let newRep = candidates.reduce((a, b) => a.distance < b.distance ? a : b).genome;
            newRepresentatives[species.key] = newRep;
            newMembers[species.key] = [newRep];
            unspeciated.splice(unspeciated.indexOf(newRep), 1);
        }

        while(!!unspeciated.length) {
            let genome = unspeciated.pop();

            let candidates = [];
            for (let key of Object.keys(newRepresentatives)) {
                let d = this.cache.distance(newRepresentatives[key], genome);
                if (d < this.config.distanceThreshold) {
                    candidates.push({distance: d, speciesId: key});
                }
            }

            if (!!candidates.length) {
                let key = candidates.reduce((a, b) => a.distance < b.distance ? a : b).speciesId;
                newMembers[key].push(genome);
            } else {
                let s = new Species(++this.lastIndex, generation);
                this.species.push(s);
                newRepresentatives[s.key] = genome;
                newMembers[s.key] = [genome];
            }
        }

        for (let species of this.species) {
            species.representative = newRepresentatives[species.key];
            species.members = newMembers[species.key];
            species.generation = generation;
        }
    }

    updateFitness() {
        for (let species of this.species) {
            let newFitness = species.members.map(genome => genome.fitness).reduce((a, b) => a + b) / species.members.length;
            if (!species.fitness || newFitness > species.fitness) {
                species.lastImproved = species.generation;
            }

            species.fitnessHistory.push(species.fitness);
            species.fitness = newFitness;
        }
    }

    isStagnant(species) {
        return species.generation - species.lastImproved > this.config.extinctionThreshold;
    }

    extinction(species) {
        while(!!species.length) {
            let s = species.pop();
            let idx = this.species.findIndex(x => x.key === s);
            this.species.splice(idx, 1);
        }
    }

}

class DistanceCache {
    constructor() {
        this.cache = {};
    }

    distance(genome1, genome2) {
        let d = undefined;
        let x = this.cache[genome1.key];
        if (!!x) {
            d = this.cache[genome1.key][genome2.key];
        }

        if (d === undefined) {
            d = genome1.distance(genome2);
            if (!this.cache[genome1.key]) {
                this.cache[genome1.key] = {};
            }
            if (!this.cache[genome2.key]) {
                this.cache[genome2.key] = {};
            }
            this.cache[genome1.key][genome2.key] = d;
            this.cache[genome2.key][genome1.key] = d;
        }

        return d;
    }
}