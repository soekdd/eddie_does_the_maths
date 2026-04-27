import { createApp } from "vue";
import i18n from "@/utils/i18n.mjs";
import { vuetify } from "@/utils/vuetify";
import PGCardsPdf from "./PG_CardsPdf.vue";

createApp( PGCardsPdf )
	.use( i18n )
	.use( vuetify )
	.mount( "#app" );
