/** @format */

"use strict";
const namespaced = true;

const state = {
    ComplaintService: {
        primaryComplaints: [
            {
                id: 99,
                text: "cough",
                severities: [
                    { id: 0, text: "mild" },
                    { id: 1, text: "moderate" },
                    { id: 2, text: "severe" },
                ],
                loci: [],
                characterizations: [
                    { id: 0, text: "dry" },
                    { id: 1, text: "brassy" },
                    { id: 2, text: "rattling" },
                    { id: 3, text: "loose" },
                    { id: 4, text: "productive" },
                    { id: 5, text: "moist" },
                    { id: 6, text: "bovine" },
                    { id: 7, text: "hoarse" },
                    { id: 8, text: "wheezy" },
                    { id: 9, text: "barking" },
                ],
            },

            {
                id: 100,
                text: "rash",
                severities: [
                    { id: 0, text: "mild" },
                    { id: 1, text: "moderate" },
                    { id: 2, text: "severe" },
                ],
                loci: [
                    { id: 0, text: "abdomen" },
                    { id: 1, text: "chest" },
                    { id: 2, text: "foot" },
                    { id: 3, text: "head" },
                    { id: 4, text: "hip" },
                    { id: 5, text: "knee" },
                    { id: 6, text: "low back" },
                    { id: 7, text: "pelvis" },
                    { id: 8, text: "ankle" },
                    { id: 9, text: "shoulder" },
                    { id: 10, text: "throat" },
                    { id: 11, text: "neck" },
                    { id: 12, text: "upper back" },
                    { id: 13, text: "groin" },
                    { id: 14, text: "face" },
                ],
                characterizations: [
                    { id: 0, text: "aching" },
                    { id: 1, text: "burning" },
                    { id: 7, text: "hot" },
                    { id: 11, text: "smarting" },
                    { id: 15, text: "throbbing" },
                ],
            },
            {
                id: 101,
                text: "pain",
                severities: [
                    { id: 0, text: "mild" },
                    { id: 1, text: "moderate" },
                    { id: 2, text: "severe" },
                ],
                loci: [
                    { id: 0, text: "abdomen" },
                    { id: 1, text: "chest" },
                    { id: 2, text: "foot" },
                    { id: 3, text: "head" },
                    { id: 4, text: "hip" },
                    { id: 5, text: "knee" },
                    { id: 6, text: "low back" },
                    { id: 7, text: "pelvis" },
                    { id: 8, text: "ankle" },
                    { id: 9, text: "shoulder" },
                    { id: 10, text: "throat" },
                    { id: 11, text: "neck" },
                    { id: 12, text: "upper back" },
                    { id: 13, text: "groin" },
                ],
                characterizations: [
                    { id: 0, text: "aching" },
                    { id: 1, text: "burning" },
                    { id: 2, text: "cramping" },
                    { id: 3, text: "crushing" },
                    { id: 4, text: "cutting" },
                    { id: 5, text: "dull" },
                    { id: 6, text: "gnawing" },
                    { id: 7, text: "hot" },
                    { id: 8, text: "nauseating" },
                    { id: 9, text: "sharp" },
                    { id: 10, text: "shooting" },
                    { id: 11, text: "smarting" },
                    { id: 12, text: "splitting" },
                    { id: 13, text: "stabbing" },
                    { id: 14, text: "stretching" },
                    { id: 15, text: "throbbing" },
                    { id: 16, text: "twisting" },
                ],
            },
            {
                id: 102,
                text: "lump",
                severities: [],
                loci: [
                    { id: 0, text: "abdomen" },
                    { id: 1, text: "chest" },
                    { id: 2, text: "foot" },
                    { id: 3, text: "leg" },
                    { id: 4, text: "hip" },
                    { id: 5, text: "knee" },
                    { id: 6, text: "back" },
                    { id: 7, text: "pelvis" },
                    { id: 8, text: "ankle" },
                    { id: 9, text: "shoulder" },
                    { id: 10, text: "throat" },
                    { id: 11, text: "neck" },
                    { id: 13, text: "groin" },
                    { id: 14, text: "face" },
                ],
                characterizations: [
                    { id: 3, text: "soft" },
                    { id: 13, text: "hard" },
                ],
            },
        ],
    },
};

const getter = {
    primaryComplaints: (state) => state.ComplaintService.primaryComplaints,
};

const mutations = {};

const actions = {};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};
