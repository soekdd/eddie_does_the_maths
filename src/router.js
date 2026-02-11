import { createRouter, createWebHashHistory } from "vue-router";

import DG from "@/views/DG.vue";
import ST from "@/views/ST.vue";
import O1 from "@/views/O1.vue";
import MO from "@/views/MO.vue";
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
				title: "IMO 1985 Aufgabe 1", index: true, order: 30
			}
		},
		{
			path:      "/O2",
			name:      "O2",
			component: CatchAll,
			meta:      {
				title: "IMO 1985 Aufgabe 2", index: true, order: 40, wip: true
			}
		},
		{
			path:      "/O3",
			name:      "O3",
			component: CatchAll,
			meta:      {
				title: "IMO 1985 Aufgabe 3", index: true, order: 50, wip: true
			}
		},
		{
			path:      "/O4",
			name:      "O4",
			component: CatchAll,
			meta:      {
				title: "IMO 1985 Aufgabe 4", index: true, order: 60, wip: true
			}
		},
		{
			path:      "/O5",
			name:      "O5",
			component: CatchAll,
			meta:      {
				title: "IMO 1985 Aufgabe 5", index: true, order: 70, wip: true
			}
		},
		{
			path:      "/O6",
			name:      "O6",
			component: CatchAll,
			meta:      {
				title: "IMO 1985 Aufgabe 6", index: true, order: 80, wip: true
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
