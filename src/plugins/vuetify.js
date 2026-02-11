import "vuetify/styles";
import { createVuetify } from "vuetify";

const systemPrefersDark =
  typeof window !== "undefined" && window.matchMedia?.( "(prefers-color-scheme: dark)" )?.matches;

export const vuetify = createVuetify( {
	theme: {
		defaultTheme: systemPrefersDark ? "eddieDark" : "eddieLight",
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
