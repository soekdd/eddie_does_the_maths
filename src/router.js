import { createRouter, createWebHashHistory } from "vue-router";

import DG from "@/views/DG.vue";
import ST from "@/views/ST.vue";
import MO from "@/views/MO.vue";
import O1 from "@/views/O1.vue";
import O2 from "@/views/O2.vue";
import O3 from "@/views/O3.vue";
import O4 from "@/views/O4.vue";
import O5 from "@/views/O5.vue";
import O6 from "@/views/O6.vue";
import PG from "@/views/PG.vue";
import AL from "@/views/AL.vue";
import BA from "@/views/BA.vue";
import SE from "@/views/SE.vue";
import RD from "@/views/RD.vue";
import FX from "@/views/FX.vue";
import CatchAll from "@/views/CatchAll.vue";
import Welcome from "@/views/Welcome.vue";

export const router = createRouter( {
	// Keep this working for both dev-server and static file hosting.
	history: createWebHashHistory(),
	routes:  [
		{
			path:      "/",
			name:      "Welcome",
			component: Welcome,
			meta:      { title: "Welcome" }
		},
		{
			path:      "/ST",
			name:      "ST",
			component: ST,
			meta:      {
				title: "Spieltheorie am Busbahnhof", index: true, order: 10
			}
		},
		{
			path:      "/DG",
			name:      "DG",
			component: DG,
			meta:      {
				title: "Diophantische Gleichung", index: true, order: 20
			}
		},
		{
			path:      "/MO",
			name:      "MO",
			component: MO,
			meta:      { title: "IMO 1985 Aufgaben 1-6", index: false }
		},
		{
			path:      "/O1",
			name:      "O1",
			component: O1,
			meta:      {
				title: "IMO 1985 Aufgabe A1", index: true, order: 30
			}
		},
		{
			path:      "/O2",
			name:      "O2",
			component: O2,
			meta:      {
				title: "IMO 1985 Aufgabe A2", index: true, order: 40
			}
		},
		{
			path:      "/O3",
			name:      "O3",
			component: O3,
			meta:      {
				title: "IMO 1985 Aufgabe A3", index: true, order: 50
			}
		},
		{
			path:      "/O4",
			name:      "O4",
			component: O4,
			meta:      {
				title: "IMO 1985 Aufgabe B1", index: true, order: 60
			}
		},
		{
			path:      "/O5",
			name:      "O5",
			component: O5,
			meta:      {
				title: "IMO 1985 Aufgabe B2", index: true, order: 70
			}
		},
		{
			path:      "/O6",
			name:      "O6",
			component: O6,
			meta:      {
				title: "IMO 1985 Aufgabe B3", index: true, order: 80
			}
		},
		{
			path:      "/FI",
			name:      "FI",
			component: CatchAll,
			meta:      {
				title: "Landkarten Geometrie", index: true, order: 90, wip: true
			}
		},
		{
			path:      "/PG",
			name:      "PG",
			component: PG,
			meta:      {
				title: "Mit Eddie zum Pokergenie", index: true, order: 100
			}
		},
		{
			path:      "/DZ",
			name:      "DZ",
			component: CatchAll,
			meta:      {
				title: "Diophantische Gleichung #2", index: true, order: 110, wip: true
			}
		},
		{
			path:      "/NV",
			name:      "NV",
			component: CatchAll,
			meta:      {
				title: "Navigation im Wald", index: true, order: 120, wip: true
			}
		},
		{
			path:      "/SE",
			name:      "SE",
			component: SE,
			meta:      {
				title: "Gute-Nacht-Rechenroutine", index: true, order: 125
			}
		},
		{
			path:      "/FS",
			name:      "FS",
			component: CatchAll,
			meta:      {
				title: "Fischsee", index: true, order: 130, wip: true
			}
		},
		{
			path:      "/RD",
			name:      "RD",
			component: RD,
			meta:      {
				title: "Rentier-Depot", index: true, order: 140
			}
		},
		{
			path:      "/UD",
			name:      "UD",
			component: CatchAll,
			meta:      {
				title: "Minkowskis Uferaufdickung", index: true, order: 150, wip: true
			}
		},
		{
			path:      "/BA",
			name:      "BA",
			component: BA,
			meta:      {
				title: "BASIC for Runaways", index: true, order: 160
			}
		},
		{
			path:      "/SD",
			name:      "SD",
			component: CatchAll,
			meta:      {
				title: "Ich zeig dir deine DNA", index: true, order: 170, wip: true
			}
		},
		{
			path:      "/AL",
			name:      "AL",
			component: AL,
			meta:      {
				title: "Kartenspiel mit Ada Lovelace", index: true, order: 180
			}
		},
		{
			path:      "/OA",
			name:      "OA",
			component: CatchAll,
			meta:      {
				title: "Wegoptimierung", index: true, order: 190, wip: true
			}
		},
		{
			path:      "/BS",
			name:      "BS",
			component: CatchAll,
			meta:      {
				title: "Baustatik #1", index: true, order: 200, wip: true
			}
		},
		{
			path:      "/FX",
			name:      "FX",
			component: FX,
			meta:      {
				title: "Mein fx-7000G", index: true, order: 210
			}
		},
		{
			path:      "/VA",
			name:      "VA",
			component: CatchAll,
			meta:      {
				title: "Warum die Vasa sinken musste", index: true, order: 220, wip: true
			}
		},
		{
			path:      "/BZ",
			name:      "BZ",
			component: CatchAll,
			meta:      {
				title: "Baustatik #2", index: true, order: 230, wip: true
			}
		},
		{
			path:      "/GD",
			name:      "GD",
			component: CatchAll,
			meta:      {
				title: "Diophantos Grabplatte", index: true, order: 240, wip: true
			}
		},
		{
			path:      "/QH",
			name:      "QH",
			component: CatchAll,
			meta:      {
				title: "Der Quanten-Hall-Effekt", index: true, order: 250, wip: true
			}
		},
		{
			path:      "/LT",
			name:      "LT",
			component: CatchAll,
			meta:      {
				title: "Laplace-Transformation", index: true, order: 260, wip: true
			}
		},
		{
			path:      "/:pathMatch(.*)*",
			name:      "CatchAll",
			component: CatchAll,
			meta:      { title: "Thema in Arbeit" }
		}
	]
} );

// Page title from route meta
router.afterEach( ( to ) => {
	const title = typeof to?.meta?.title === "string" ? to.meta.title : "";

	if ( typeof document !== "undefined" ) {
		document.title = title ? `Eddie rechnet: ${title}` : "Eddie rechnet";
	}
} );
