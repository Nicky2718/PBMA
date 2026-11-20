/* =========================================================
   Estrellas brillantes (J2000) y líneas de constelaciones
   formato: id: [ascensión recta (horas), declinación (°), magnitud]
   ========================================================= */
const STARS = {
  // Orión
  betelgeuse: [5.919, 7.407, 0.5], rigel: [5.242, -8.202, 0.1], bellatrix: [5.419, 6.350, 1.6],
  mintaka: [5.533, -0.299, 2.2], alnilam: [5.604, -1.202, 1.7], alnitak: [5.679, -1.943, 1.8],
  saiph: [5.796, -9.670, 2.1], meissa: [5.585, 9.934, 3.4],
  // Can Mayor
  sirius: [6.752, -16.716, -1.4], mirzam: [6.378, -17.956, 2.0], adhara: [6.977, -28.972, 1.5],
  wezen: [7.140, -26.393, 1.8], aludra: [7.401, -29.303, 2.4], furud: [6.338, -30.063, 3.0],
  // Can Menor
  procyon: [7.655, 5.225, 0.4], gomeisa: [7.453, 8.289, 2.9],
  // Tauro
  aldebaran: [4.599, 16.509, 0.9], elnath: [5.438, 28.608, 1.7], zetaTau: [5.627, 21.143, 3.0],
  ainTau: [4.477, 19.180, 3.5], gammaTau: [4.330, 15.628, 3.6], alcyone: [3.791, 24.105, 2.9],
  // Cochero
  capella: [5.278, 45.998, 0.1], menkalinan: [5.992, 44.948, 1.9], thetaAur: [5.995, 37.213, 2.6],
  iotaAur: [4.950, 33.166, 2.7],
  // Géminis
  castor: [7.577, 31.888, 1.6], pollux: [7.755, 28.026, 1.1], alhena: [6.629, 16.399, 1.9],
  mebsuta: [6.732, 25.131, 3.0], wasat: [7.335, 21.982, 3.5], tejat: [6.383, 22.514, 2.9],
  // Leo
  regulus: [10.140, 11.967, 1.4], denebola: [11.818, 14.572, 2.1], algieba: [10.333, 19.842, 2.0],
  zosma: [11.235, 20.524, 2.6], chertan: [11.237, 15.430, 3.3], adhafera: [10.278, 23.417, 3.4],
  rasElased: [9.879, 26.007, 3.9], etaLeo: [10.122, 16.763, 3.5],
  // Osa Mayor
  dubhe: [11.062, 61.751, 1.8], merak: [11.031, 56.382, 2.4], phecda: [11.897, 53.695, 2.4],
  megrez: [12.257, 57.033, 3.3], alioth: [12.900, 55.960, 1.8], mizar: [13.399, 54.925, 2.2],
  alkaid: [13.792, 49.313, 1.9],
  // Cruz del Sur
  acrux: [12.443, -63.099, 0.8], mimosa: [12.795, -59.689, 1.3], gacrux: [12.519, -57.113, 1.6],
  deltaCru: [12.252, -58.749, 2.8],
  // Centauro
  rigilKent: [14.660, -60.835, -0.3], hadar: [14.064, -60.373, 0.6],
  // Boyero
  arcturus: [14.261, 19.182, -0.1], izar: [14.750, 27.074, 2.4], muphrid: [13.911, 18.398, 2.7],
  seginus: [14.535, 38.308, 3.0], nekkar: [15.032, 40.391, 3.5], deltaBoo: [15.258, 33.315, 3.5],
  // Virgo
  spica: [13.420, -11.161, 1.0], porrima: [12.694, -1.449, 2.7], vindemiatrix: [13.036, 10.959, 2.8],
  // Escorpio
  antares: [16.490, -26.432, 1.0], dschubba: [16.006, -22.622, 2.3], acrab: [16.091, -19.806, 2.6],
  piSco: [15.981, -26.114, 2.9], sigmaSco: [16.353, -25.593, 2.9], tauSco: [16.598, -28.216, 2.8],
  epsSco: [16.836, -34.293, 2.3], muSco: [16.864, -38.048, 3.0], zetaSco: [16.910, -42.362, 3.6],
  etaSco: [17.203, -43.239, 3.3], sargas: [17.622, -42.998, 1.9], iotaSco: [17.793, -40.127, 3.0],
  kappaSco: [17.708, -39.030, 2.4], shaula: [17.560, -37.104, 1.6], lesath: [17.512, -37.296, 2.7],
  // Sagitario
  kausAus: [18.403, -34.385, 1.8], kausMed: [18.350, -29.828, 2.7], kausBor: [18.466, -25.422, 2.8],
  nunki: [18.921, -26.297, 2.0], ascella: [19.044, -29.880, 2.6], alnasl: [18.097, -30.424, 3.0],
  phiSgr: [18.761, -26.991, 3.2], tauSgr: [19.116, -27.671, 3.3],
  // Lira
  vega: [18.616, 38.784, 0.0], sheliak: [18.835, 33.363, 3.5], sulafat: [18.982, 32.690, 3.3],
  zetaLyr: [18.746, 37.605, 4.3], deltaLyr: [18.908, 36.899, 4.3],
  // Cisne
  deneb: [20.690, 45.280, 1.3], sadr: [20.370, 40.257, 2.2], gienah: [20.770, 33.970, 2.5],
  deltaCyg: [19.750, 45.131, 2.9], albireo: [19.512, 27.960, 3.1],
  // Águila
  altair: [19.846, 8.868, 0.8], tarazed: [19.771, 10.613, 2.7], alshain: [19.922, 6.407, 3.7],
  // Casiopea
  caph: [0.153, 59.150, 2.3], schedar: [0.675, 56.537, 2.2], gammaCas: [0.945, 60.717, 2.4],
  ruchbah: [1.430, 60.235, 2.7], segin: [1.907, 63.670, 3.4],
  // Pegaso y Andrómeda
  markab: [23.079, 15.205, 2.5], scheat: [23.063, 28.083, 2.4], algenib: [0.221, 15.184, 2.8],
  alpheratz: [0.140, 29.091, 2.1], mirach: [1.162, 35.621, 2.1], almach: [2.065, 42.330, 2.1],
  // Sueltas muy brillantes
  canopus: [6.399, -52.696, -0.7], achernar: [1.629, -57.237, 0.5], fomalhaut: [22.961, -29.622, 1.2]
};

const CONSTELLATIONS = [
  { name: "Orión", lines: [["meissa","betelgeuse"],["meissa","bellatrix"],["betelgeuse","alnitak"],["bellatrix","mintaka"],["mintaka","alnilam"],["alnilam","alnitak"],["alnitak","saiph"],["mintaka","rigel"]] },
  { name: "Can Mayor", lines: [["mirzam","sirius"],["sirius","wezen"],["wezen","adhara"],["wezen","aludra"],["adhara","furud"]] },
  { name: "Can Menor", lines: [["procyon","gomeisa"]] },
  { name: "Tauro", lines: [["zetaTau","aldebaran"],["aldebaran","gammaTau"],["gammaTau","ainTau"],["ainTau","elnath"]] },
  { name: "Cochero", lines: [["capella","menkalinan"],["menkalinan","thetaAur"],["thetaAur","elnath"],["elnath","iotaAur"],["iotaAur","capella"]] },
  { name: "Géminis", lines: [["castor","pollux"],["castor","mebsuta"],["mebsuta","tejat"],["pollux","wasat"],["wasat","alhena"]] },
  { name: "Leo", lines: [["regulus","etaLeo"],["etaLeo","algieba"],["algieba","adhafera"],["adhafera","rasElased"],["algieba","zosma"],["zosma","denebola"],["denebola","chertan"],["chertan","regulus"],["zosma","chertan"]] },
  { name: "Osa Mayor", lines: [["dubhe","merak"],["merak","phecda"],["phecda","megrez"],["megrez","dubhe"],["megrez","alioth"],["alioth","mizar"],["mizar","alkaid"]] },
  { name: "Cruz del Sur", lines: [["acrux","gacrux"],["mimosa","deltaCru"]] },
  { name: "Centauro", lines: [["rigilKent","hadar"]] },
  { name: "Boyero", lines: [["arcturus","izar"],["izar","deltaBoo"],["deltaBoo","nekkar"],["nekkar","seginus"],["seginus","arcturus"],["arcturus","muphrid"]] },
  { name: "Virgo", lines: [["spica","porrima"],["porrima","vindemiatrix"]] },
  { name: "Escorpio", lines: [["acrab","dschubba"],["dschubba","piSco"],["dschubba","sigmaSco"],["sigmaSco","antares"],["antares","tauSco"],["tauSco","epsSco"],["epsSco","muSco"],["muSco","zetaSco"],["zetaSco","etaSco"],["etaSco","sargas"],["sargas","iotaSco"],["iotaSco","kappaSco"],["kappaSco","shaula"],["shaula","lesath"]] },
  { name: "Sagitario", lines: [["alnasl","kausMed"],["kausMed","kausAus"],["alnasl","kausAus"],["kausMed","kausBor"],["kausBor","phiSgr"],["kausMed","phiSgr"],["phiSgr","nunki"],["nunki","tauSgr"],["tauSgr","ascella"],["ascella","phiSgr"],["ascella","kausAus"]] },
  { name: "Lira", lines: [["vega","zetaLyr"],["zetaLyr","sheliak"],["sheliak","sulafat"],["sulafat","deltaLyr"],["deltaLyr","zetaLyr"]] },
  { name: "Cisne", lines: [["deneb","sadr"],["sadr","albireo"],["gienah","sadr"],["sadr","deltaCyg"]] },
  { name: "Águila", lines: [["tarazed","altair"],["altair","alshain"]] },
  { name: "Casiopea", lines: [["caph","schedar"],["schedar","gammaCas"],["gammaCas","ruchbah"],["ruchbah","segin"]] },
  { name: "Pegaso", lines: [["markab","scheat"],["scheat","alpheratz"],["alpheratz","algenib"],["algenib","markab"]] },
  { name: "Andrómeda", lines: [["alpheratz","mirach"],["mirach","almach"]] }
];
