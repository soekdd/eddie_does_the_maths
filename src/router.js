import { createRouter, createWebHistory } from "vue-router";

import DG from "@/book1/DG/DG.vue";
import ST from "@/book1/ST/ST.vue";
import MO from "@/book1/MO/MO.vue";
import O1 from "@/book1/O1/O1.vue";
import O2 from "@/book1/O2/O2.vue";
import O3 from "@/book1/O3/O3.vue";
import O4 from "@/book1/O4/O4.vue";
import O5 from "@/book1/O5/O5.vue";
import O6 from "@/book1/O6/O6.vue";
import FI from "@/book1/FI/FI.vue";
import PG from "@/book1/PG/PG.vue";
import AL from "@/book1/AL/AL.vue";
import BA from "@/book1/BA/BA.vue";
import BS from "@/book1/BS/BS.vue";
import BD from "@/book1/BD/BD.vue";
import BZ from "@/book1/BZ/BZ.vue";
import NV from "@/book1/NV/NV.vue";
import SE from "@/book1/SE/SE.vue";
import RD from "@/book1/RD/RD.vue";
import SD from "@/book1/SD/SD.vue";
import FX from "@/book1/FX/FX.vue";
import GD from "@/book1/GD/GD.vue";
import UD from "@/book1/UD/UD.vue";
import VA from "@/book1/VA/VA.vue";
import QH from "@/book1/QH/QH.vue";
import FS from "@/book1/FS/FS.vue";
import LT from "@/book1/LT/LT.vue";
import WO from "@/book1/WO/WO.vue";
import CatchAll from "@/components/CatchAll.vue";
import Welcome from "@/components/Welcome.vue";
const error = true;
const warning = true;
const wip = true;
const fallbackDescription = "Interaktive Mathematik mit Eddie: Rechenwege, Visualisierungen und Übungen zum Mitmachen.";

export function normalizeSeoText( value ) {
	if ( typeof value !== "string" ) {
		return "";
	}

	return value
		.replace( /&shy;/gi, "" )
		.replace( /\u00ad/g, "" )
		.trim();
}

export const scrollBehavior = (
	to, _from, savedPosition
) => {
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
};

export const routes = [
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
			title:      "Dio&shy;phan&shy;tische Gleichung",
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
			corrector:	 "Kitaktus",
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
			corrector:	 "Kitaktus",
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
			corrector:	 "Kitaktus",
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
			corrector:	 "Kitaktus",
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
			corrector:	 "Kitaktus",
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
			corrector:	 "Kitaktus",
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
			warning,
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
		path:      "/NV",
		name:      "NV",
		component: NV,
		meta:      {
			warning,
			difficulty: 1,
			title:      "Navi&shy;gation im Wald",
			index:      true,
			book:       1,
			order:      120
		}
	},
	{
		path:      "/SE",
		name:      "SE",
		component: SE,
		meta:      {
 			corrector:	 "Kitaktus",
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
			warning,
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
			warning,
			title:      "Baustatik #1, Satz v. Steiner",
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
		path:      "/BD",
		name:      "BD",
		component: BD,
		meta:      {
			difficulty: 2,
			warning,
			title:      "Baustatik #2, DIN vs. TGL",
			index:      true,
			book:       1,
			order:      205
		}
	},
	{
		path:      "/FX",
		name:      "FX",
		component: FX,
		meta:      {
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
		component: BZ,
		meta:      {
			warning,
			difficulty: 1,
			title:      "Baustatik #3 Dynamik",
			index:      true,
			book:       1,
			order:      230
		}
	},
	{
		path:      "/GD",
		name:      "GD",
		component: GD,
		meta:      {
			difficulty: 1,
			title:      "Diophantos Grab&shy;platte",
			index:      true,
			book:       1,
			order:      240
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
].map( ( route ) => {
	const nextMeta = route?.meta && typeof route.meta === "object" ? { ...route.meta } : {};
	const title = normalizeSeoText( nextMeta.title );

	if ( typeof nextMeta.description !== "string" || !nextMeta.description.trim() ) {
		nextMeta.description = title ?
			`Interaktive Mathe-Seite: ${title}. Rechenwege, Visualisierungen und Übungen zum Mitmachen.` :
			fallbackDescription;
	}

	return {
		...route,
		meta: nextMeta
	};
} );

export function createClientRouter() {
	return createRouter( {
		history: createWebHistory( import.meta.env.BASE_URL ),
		scrollBehavior,
		routes
	} );
}

// Backward-compatible export for pure SPA entry points.
export const router = typeof window !== "undefined" ? createClientRouter() : undefined;
