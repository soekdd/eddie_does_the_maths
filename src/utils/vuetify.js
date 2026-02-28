import "vuetify/styles";
import { h } from "vue";
import { createVuetify } from "vuetify";
import { mdiAlertOutline, mdiFileEditOutline } from "@mdi/js";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

const mdiNameToSvgPath = {
	"mdi-alert-outline":     mdiAlertOutline,
	"mdi-file-edit-outline": mdiFileEditOutline
};

function resolveMdiIconValue( icon ) {
	if ( typeof icon !== "string" ) {
		return icon;
	}

	const trimmed = icon.trim();

	if ( !trimmed ) {
		return trimmed;
	}

	// Alias values from mdi-svg start with "svg:".
	if ( trimmed.startsWith( "svg:" ) ) {
		return trimmed.slice( 4 );
	}

	// Support raw mdi names like "mdi-alert-outline" in any Vuetify component.
	if ( trimmed.startsWith( "mdi-" ) ) {
		return mdiNameToSvgPath[ trimmed ] ?? trimmed;
	}

	return trimmed;
}

const mdiExtended = {
	component: ( props ) => h( mdi.component,
		{
			...props,
			icon: resolveMdiIconValue( props.icon )
		} )
};

export const vuetify = createVuetify( {
	ssr:   true,
	icons: {
		defaultSet: "mdi",
		aliases,
		sets:       { mdi: mdiExtended }
	},
	theme: {
		// SSR-safe initial theme. System sync is applied on the client after hydration.
		defaultTheme: "eddieLight",
		themes:       {
			eddieDark: {
				dark:   true,
				colors: {
					background: "#0b0f1a",
					surface:    "#111827",
					primary:    "#7dd3fc",
					secondary:  "#34d399",
					success:    "#34d399",
					warning:    "#fbbf24",
					error:      "#fb7185",
					info:       "#93c5fd"
				}
			},
			eddieLight: {
				dark:   false,
				colors: {
					background: "#f5f7fb",
					surface:    "#ffffff",
					primary:    "#0284c7",
					secondary:  "#10b981",
					success:    "#10b981",
					warning:    "#f59e0b",
					error:      "#e11d48",
					info:       "#2563eb"
				}
			}
		}
	},
	defaults: {
		VBtn:  { rounded: "lg" },
		VCard: {
			rounded:   "lg",
			elevation: 0
		},
		VTextField: {
			variant:     "outlined",
			density:     "comfortable",
			hideDetails: "auto"
		},
		VCheckbox: {
			density:     "comfortable",
			hideDetails: "auto"
		}
	}
} );
