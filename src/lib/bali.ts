import type { RegionId } from "./data";

// Simplified outline of Bali and the three focus regencies, traced on a
// 680 × 460 grid (x east, y south). Good enough for an illustrative map;
// swap in GeoJSON boundaries for survey-grade accuracy.
export const MAP_W = 680;
export const MAP_H = 460;

export const island: Array<[number, number]> = [
  [15, 85], [75, 60], [150, 70], [225, 90], [325, 60], [400, 40], [500, 60], [595, 140], [655, 185],
  [640, 225], [585, 255], [500, 285], [430, 340], [410, 375], [415, 400], [365, 420], [345, 410],
  [352, 394], [378, 385], [382, 360], [365, 325], [345, 310], [275, 275], [240, 245], [200, 210],
  [110, 185], [50, 140],
];

export const regionShapes: Record<RegionId, Array<[number, number]>> = {
  tabanan: [[240, 245], [275, 275], [345, 310], [355, 280], [362, 200], [370, 128], [320, 110], [270, 122], [242, 165], [228, 215]],
  badung: [
    [345, 310], [365, 325], [382, 360], [378, 385], [352, 394], [345, 410], [365, 420], [415, 400], [410, 375],
    [398, 362], [392, 340], [390, 300], [398, 220], [402, 138], [370, 128], [362, 200], [355, 280],
  ],
  denpasar: [[390, 300], [418, 296], [432, 322], [430, 340], [410, 375], [398, 362], [392, 340]],
};

/** Where each region's floating label is anchored. */
export const regionAnchors: Record<RegionId, [number, number]> = {
  tabanan: [295, 215],
  badung: [378, 250],
  denpasar: [412, 330],
};

export const toPath = (pts: Array<[number, number]>) => `M${pts.map(([x, y]) => `${x},${y}`).join(" L")} Z`;
