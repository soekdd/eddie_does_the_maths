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
import FI from "@/views/FI.vue";
import PG from "@/views/PG.vue";
import AL from "@/views/AL.vue";
import BA from "@/views/BA.vue";
import BS from "@/views/BS.vue";
import SE from "@/views/SE.vue";
import RD from "@/views/RD.vue";
import SD from "@/views/SD.vue";
import FX from "@/views/FX.vue";
import UD from "@/views/UD.vue";
import VA from "@/views/VA.vue";
import QH from "@/views/QH.vue";
import FS from "@/views/FS.vue";
import LT from "@/views/LT.vue";
import WO from "@/views/WO.vue";
import CatchAll from "@/views/CatchAll.vue";
import Welcome from "@/views/Welcome.vue";
const error = true;
const warning = true;
const wip = true;
export const router = createRouter( {
	// Keep this working for both dev-server and static file hosting.
	history: createWebHashHistory(),
	scrollBehavior(
		to, _from, savedPosition
	) {
		if ( savedPosition ) {
			return savedPosition;
		}

		if ( to.hash ) {
			const hashOffset = globalThis.matchMedia?.( "(max-width: 860px)" )?.matches ? 132 : 96;

			return {
				el:       to.hash,
				top:      hashOffset,
				behavior: "smooth"
			};
		}

		return {
			top:      0,
			left:     0,
			behavior: "auto"
		};
	},
	routes: [
		{
			path:      "/",
			name:      "ER",
			component: Welcome,
			meta:      { title: "Welcome" }
		},
		{
			path:      "/ST",
			name:      "ST",
			component: ST,
			meta:      {
				difficulty: 1,
				title:      "Spiel&shy;theorie am Bus&shy;bahnhof",
				index:      true,
				book:       1,
				order:      10
			}
		},
		{
			path:      "/DG",
			name:      "DG",
			component: DG,
			meta:      {
				difficulty: 2,
				title:      "Dio&shy;phan&shy;tische Gleichung #1",
				index:      true,
				book:       1,
				order:      20
			}
		},
		{
			path:      "/MO",
			name:      "MO",
			component: MO,
			meta:      {
				warning,
				difficulty: 3,
				title:      "IMO 1985 Aufgaben 1-6",
				index:      false
			}
		},
		{
			path:      "/O1",
			name:      "O1",
			component: O1,
			meta:      {
				warning,
				difficulty: 3,
				title:      "IMO 1985 Aufgabe A1",
				index:      true,
				book:       1,
				order:      30
			}
		},
		{
			path:      "/O2",
			name:      "O2",
			component: O2,
			meta:      {
				warning,
				difficulty: 3,
				title:      "IMO 1985 Aufgabe A2",
				index:      true,
				book:       1,
				order:      40
			}
		},
		{
			path:      "/O3",
			name:      "O3",
			component: O3,
			meta:      {
				warning,
				difficulty: 3,
				title:      "IMO 1985 Aufgabe A3",
				index:      true,
				book:       1,
				order:      50
			}
		},
		{
			path:      "/O4",
			name:      "O4",
			component: O4,
			meta:      {
				warning,
				difficulty: 3,
				title:      "IMO 1985 Aufgabe B1",
				index:      true,
				book:       1,
				order:      60
			}
		},
		{
			path:      "/O5",
			name:      "O5",
			component: O5,
			meta:      {
				warning,
				difficulty: 3,
				title:      "IMO 1985 Aufgabe B2",
				index:      true,
				book:       1,
				order:      70
			}
		},
		{
			path:      "/O6",
			name:      "O6",
			component: O6,
			meta:      {
				warning,
				difficulty: 3,
				title:      "IMO 1985 Aufgabe B3",
				index:      true,
				book:       1,
				order:      80
			}
		},
		{
			path:      "/FI",
			name:      "FI",
			component: FI,
			meta:      {
				error,
				difficulty: 2,
				title:      "Land&shy;karten Geo&shy;metrie",
				index:      true,
				book:       1,
				order:      90
			}
		},
		{
			path:      "/PG",
			name:      "PG",
			component: PG,
			meta:      {
				difficulty: 1,
				title:      "Mit Eddie zum Poker&shy;genie",
				index:      true,
				book:       1,
				order:      100
			}
		},
		{
			path:      "/DZ",
			name:      "DZ",
			component: CatchAll,
			meta:      {
				warning,
				difficulty: 1,
				title:      "Dio&shy;phan&shy;tische Gleichung #2",
				index:      true,
				book:       1,
				order:      110,
				wip
			}
		},
		{
			path:      "/NV",
			name:      "NV",
			component: CatchAll,
			meta:      {
				warning,
				difficulty: 1,
				title:      "Navi&shy;gation im Wald",
				index:      true,
				book:       1,
				order:      120,
				wip
			}
		},
		{
			path:      "/SE",
			name:      "SE",
			component: SE,
			meta:      {
				warning,
				difficulty: 1,
				title:      "Gute-Nacht-Rechen&shy;routine",
				index:      true,
				book:       1,
				order:      125
			}
		},
		{
			path:      "/FS",
			name:      "FS",
			component: FS,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Fischsee",
				index:      true,
				book:       1,
				order:      130
			}
		},
		{
			path:      "/RD",
			name:      "RD",
			component: RD,
			meta:      {
				error,
				difficulty: 2,
				title:      "Rentier-Depot",
				index:      true,
				book:       1,
				order:      140
			}
		},
		{
			path:      "/UD",
			name:      "UD",
			component: UD,
			meta:      {
				warning,
				difficulty: 3,
				title:      "Minkow&shy;skis Ufer&shy;auf&shy;dickung",
				index:      true,
				book:       1,
				order:      150
			}
		},
		{
			path:      "/BA",
			name:      "BA",
			component: BA,
			meta:      {
				warning,
				difficulty: 1,
				title:      "BASIC for Runaways",
				index:      true,
				book:       1,
				order:      160
			}
		},
		{
			path:      "/SD",
			name:      "SD",
			component: SD,
			meta:      {
				warning,
				difficulty: 1,
				title:      "Ich zeig dir deine DNA",
				index:      true,
				book:       1,
				order:      170
			}
		},
		{
			path:      "/BS",
			name:      "BS",
			component: BS,
			meta:      {
				difficulty: 2,
				title:      "Baustatik #1",
				index:      true,
				book:       1,
				order:      180
			}
		},
		{
			path:      "/AL",
			name:      "AL",
			component: AL,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Karten&shy;spiel mit Ada Lovelace",
				index:      true,
				book:       1,
				order:      190
			}
		},
		{
			path:      "/WO",
			name:      "WO",
			component: WO,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Weg&shy;optimierung",
				index:      true,
				book:       1,
				order:      200
			}
		},
		{
			path:      "/FX",
			name:      "FX",
			component: FX,
			meta:      {
				warning,
				difficulty: 1,
				title:      "Mein fx-7000G",
				index:      true,
				book:       1,
				order:      210
			}
		},
		{
			path:      "/VA",
			name:      "VA",
			component: VA,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Warum die Vasa sinken musste",
				index:      true,
				book:       1,
				order:      220
			}
		},
		{
			path:      "/BZ",
			name:      "BZ",
			component: CatchAll,
			meta:      {
				warning,
				difficulty: 3,
				title:      "Baustatik #2",
				index:      true,
				book:       1,
				order:      230,
				wip
			}
		},
		{
			path:      "/GD",
			name:      "GD",
			component: CatchAll,
			meta:      {
				warning,
				difficulty: 1,
				title:      "Diophantos Grab&shy;platte",
				index:      true,
				book:       1,
				order:      240,
				wip
			}
		},
		{
			path:      "/QH",
			name:      "QH",
			component: QH,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Der Quanten-Hall-Effekt",
				index:      true,
				book:       1,
				order:      250
			}
		},
		{
			path:      "/LT",
			name:      "LT",
			component: LT,
			meta:      {
				warning,
				difficulty: 3,
				title:      "Laplace-Trans&shy;formation",
				index:      true,
				book:       1,
				order:      260
			}
		},
		{
			path:      "/ZR",
			name:      "ZR",
			component: CatchAll,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Atomare Zerfalls&shy;reihen",
				index:      true,
				book:       2,
				order:      10,
				wip
			}
		},
		{
			path:      "/AW",
			name:      "AW",
			component: CatchAll,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Aus&shy;sage&shy;wahrs&shy;cheinlichkeit",
				index:      true,
				book:       2,
				order:      20,
				wip
			}
		},{
			path:      "/KK",
			name:      "KK",
			component: CatchAll,
			meta:      {
				warning,
				difficulty: 2,
				title:      "Spaß mit Kugel&shy;koordinaten",
				index:      true,
				book:       2,
				order:      20,
				wip
			}
		},
		{
			path:      "/O7",
			name:      "O7",
			component: CatchAll,
			meta:      {
				wip,
				difficulty: 3,
				title:      "IMO 1987 Aufgabe A1",
				index:      true,
				book:       2,
				order:      30
			}
		},
		{
			path:      "/O8",
			name:      "O8",
			component: CatchAll,
			meta:      {
				wip,
				difficulty: 3,
				title:      "IMO 1987 Aufgabe A2",
				index:      true,
				book:       2,
				order:      30
			}
		},
		{
			path:      "/O9",
			name:      "O9",
			component: CatchAll,
			meta:      {
				wip,
				difficulty: 3,
				title:      "IMO 1987 Aufgabe A3",
				index:      true,
				book:       2,
				order:      30
			}
		},
		{
			path:      "/OA",
			name:      "OA",
			component: CatchAll,
			meta:      {
				wip,
				difficulty: 3,
				title:      "IMO 1987 Aufgabe B1",
				index:      true,
				book:       2,
				order:      30
			}
		},
		{
			path:      "/OB",
			name:      "OB",
			component: CatchAll,
			meta:      {
				wip,
				difficulty: 3,
				title:      "IMO 1987 Aufgabe B2",
				index:      true,
				book:       2,
				order:      30
			}
		},
		{
			path:      "/OC",
			name:      "OC",
			component: CatchAll,
			meta:      {
				wip,
				difficulty: 3,
				title:      "IMO 1987 Aufgabe B3",
				index:      true,
				book:       2,
				order:      30
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
	const browserTitle = title.replace( /&shy;/gi, "" );

	if ( typeof document !== "undefined" ) {
		document.title = browserTitle ? `Eddie rechnet: ${browserTitle}` : "Eddie rechnet";
	}
} );
