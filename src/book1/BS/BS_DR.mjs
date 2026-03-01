export default {
	meta: {
		units:  "mm",
		fields: {
			designation: "profile series + nominal size",
			h:           "overall section height/depth (H)",
			bf:          "flange width (W / b)",
			tw:          "web thickness",
			tf:          "flange thickness"
		},
		notes: [
			"Values reflect common European hot-rolled section series (IPE, HEA, HEB, HEM).",
			"Real rolled sections include internal radii; these tables list the nominal dimensions typically used for engineering calculations.",
			"For design/verification in projects, always cross-check against the applicable standard/tables from your supplier or EN 10365 datasets."
		],
		sources: [
			{
				series: "IPE",
				url:    "https://www.wermac.org/steel/dim_ipe_inp.html"
			},
			{
				series: "HEA",
				url:    "https://www.wermac.org/steel/dim_hea.html"
			},
			{
				series: "HEB",
				url:    "https://www.wermac.org/steel/dim_heb.html"
			},
			{
				series: "HEM",
				url:    "https://www.wermac.org/steel/dim_hem.html"
			}
		]
	},
	series: {
		IPE: [
			{
				designation: "IPE 80",
				h:           80,
				bf:          46,
				tw:          3.8,
				tf:          5.2
			},
			{
				designation: "IPE 100",
				h:           100,
				bf:          55,
				tw:          4.1,
				tf:          5.7
			},
			{
				designation: "IPE 120",
				h:           120,
				bf:          64,
				tw:          4.4,
				tf:          6.3
			},
			{
				designation: "IPE 140",
				h:           140,
				bf:          73,
				tw:          4.7,
				tf:          6.9
			},
			{
				designation: "IPE 160",
				h:           160,
				bf:          82,
				tw:          5.0,
				tf:          7.4
			},
			{
				designation: "IPE 180",
				h:           180,
				bf:          91,
				tw:          5.3,
				tf:          8.0
			},
			{
				designation: "IPE 200",
				h:           200,
				bf:          100,
				tw:          5.6,
				tf:          8.5
			},
			{
				designation: "IPE 220",
				h:           220,
				bf:          110,
				tw:          5.9,
				tf:          9.2
			},
			{
				designation: "IPE 240",
				h:           240,
				bf:          120,
				tw:          6.2,
				tf:          9.8
			},
			{
				designation: "IPE 270",
				h:           270,
				bf:          135,
				tw:          6.6,
				tf:          10.2
			},
			{
				designation: "IPE 300",
				h:           300,
				bf:          150,
				tw:          7.1,
				tf:          10.7
			},
			{
				designation: "IPE 330",
				h:           330,
				bf:          160,
				tw:          7.5,
				tf:          11.5
			},
			{
				designation: "IPE 360",
				h:           360,
				bf:          170,
				tw:          8.0,
				tf:          12.7
			},
			{
				designation: "IPE 400",
				h:           400,
				bf:          180,
				tw:          8.6,
				tf:          13.5
			},
			{
				designation: "IPE 450",
				h:           450,
				bf:          190,
				tw:          9.4,
				tf:          14.6
			},
			{
				designation: "IPE 500",
				h:           500,
				bf:          200,
				tw:          10.2,
				tf:          16.0
			},
			{
				designation: "IPE 550",
				h:           550,
				bf:          210,
				tw:          11.1,
				tf:          17.2
			},
			{
				designation: "IPE 600",
				h:           600,
				bf:          220,
				tw:          12.0,
				tf:          19.0
			}
		],
		HEA: [
			{
				designation: "HEA 100",
				h:           96,
				bf:          100,
				tw:          5.0,
				tf:          8.0
			},
			{
				designation: "HEA 120",
				h:           114,
				bf:          120,
				tw:          5.0,
				tf:          8.0
			},
			{
				designation: "HEA 140",
				h:           133,
				bf:          140,
				tw:          5.5,
				tf:          8.5
			},
			{
				designation: "HEA 160",
				h:           152,
				bf:          160,
				tw:          6.0,
				tf:          9.0
			},
			{
				designation: "HEA 180",
				h:           171,
				bf:          180,
				tw:          6.0,
				tf:          9.5
			},
			{
				designation: "HEA 200",
				h:           190,
				bf:          200,
				tw:          6.5,
				tf:          10.0
			},
			{
				designation: "HEA 220",
				h:           210,
				bf:          220,
				tw:          7.0,
				tf:          11.0
			},
			{
				designation: "HEA 240",
				h:           230,
				bf:          240,
				tw:          7.5,
				tf:          12.0
			},
			{
				designation: "HEA 260",
				h:           250,
				bf:          260,
				tw:          7.5,
				tf:          12.5
			},
			{
				designation: "HEA 280",
				h:           270,
				bf:          280,
				tw:          8.0,
				tf:          13.0
			},
			{
				designation: "HEA 300",
				h:           290,
				bf:          300,
				tw:          8.5,
				tf:          14.0
			},
			{
				designation: "HEA 320",
				h:           310,
				bf:          300,
				tw:          9.0,
				tf:          15.5
			},
			{
				designation: "HEA 340",
				h:           330,
				bf:          300,
				tw:          9.5,
				tf:          16.5
			},
			{
				designation: "HEA 360",
				h:           350,
				bf:          300,
				tw:          10.0,
				tf:          17.5
			},
			{
				designation: "HEA 400",
				h:           390,
				bf:          300,
				tw:          11.0,
				tf:          19.0
			},
			{
				designation: "HEA 450",
				h:           440,
				bf:          300,
				tw:          11.5,
				tf:          21.0
			},
			{
				designation: "HEA 500",
				h:           490,
				bf:          300,
				tw:          12.0,
				tf:          23.0
			},
			{
				designation: "HEA 550",
				h:           540,
				bf:          300,
				tw:          12.5,
				tf:          24.0
			},
			{
				designation: "HEA 600",
				h:           590,
				bf:          300,
				tw:          13.0,
				tf:          25.0
			},
			{
				designation: "HEA 650",
				h:           640,
				bf:          300,
				tw:          13.5,
				tf:          26.0
			},
			{
				designation: "HEA 700",
				h:           690,
				bf:          300,
				tw:          14.5,
				tf:          27.0
			},
			{
				designation: "HEA 800",
				h:           790,
				bf:          300,
				tw:          15.0,
				tf:          28.0
			},
			{
				designation: "HEA 900",
				h:           890,
				bf:          300,
				tw:          16.0,
				tf:          30.0
			},
			{
				designation: "HEA 1000",
				h:           990,
				bf:          300,
				tw:          16.5,
				tf:          31.0
			}
		],
		HEB: [
			{
				designation: "HEB 100",
				h:           100,
				bf:          100,
				tw:          6.0,
				tf:          10.0
			},
			{
				designation: "HEB 120",
				h:           120,
				bf:          120,
				tw:          6.5,
				tf:          11.0
			},
			{
				designation: "HEB 140",
				h:           140,
				bf:          140,
				tw:          7.0,
				tf:          12.0
			},
			{
				designation: "HEB 160",
				h:           160,
				bf:          160,
				tw:          8.0,
				tf:          13.0
			},
			{
				designation: "HEB 180",
				h:           180,
				bf:          180,
				tw:          8.5,
				tf:          14.0
			},
			{
				designation: "HEB 200",
				h:           200,
				bf:          200,
				tw:          9.0,
				tf:          15.0
			},
			{
				designation: "HEB 220",
				h:           220,
				bf:          220,
				tw:          9.5,
				tf:          16.0
			},
			{
				designation: "HEB 240",
				h:           240,
				bf:          240,
				tw:          10.0,
				tf:          17.0
			},
			{
				designation: "HEB 260",
				h:           260,
				bf:          260,
				tw:          10.0,
				tf:          17.5
			},
			{
				designation: "HEB 280",
				h:           280,
				bf:          280,
				tw:          10.5,
				tf:          18.0
			},
			{
				designation: "HEB 300",
				h:           300,
				bf:          300,
				tw:          11.0,
				tf:          19.0
			},
			{
				designation: "HEB 320",
				h:           320,
				bf:          300,
				tw:          11.5,
				tf:          20.5
			},
			{
				designation: "HEB 340",
				h:           340,
				bf:          300,
				tw:          12.0,
				tf:          21.5
			},
			{
				designation: "HEB 360",
				h:           360,
				bf:          300,
				tw:          12.5,
				tf:          22.5
			},
			{
				designation: "HEB 400",
				h:           400,
				bf:          300,
				tw:          13.5,
				tf:          24.0
			},
			{
				designation: "HEB 450",
				h:           450,
				bf:          300,
				tw:          14.0,
				tf:          26.0
			},
			{
				designation: "HEB 500",
				h:           500,
				bf:          300,
				tw:          14.5,
				tf:          28.0
			},
			{
				designation: "HEB 550",
				h:           550,
				bf:          300,
				tw:          15.0,
				tf:          29.0
			},
			{
				designation: "HEB 600",
				h:           600,
				bf:          300,
				tw:          15.5,
				tf:          30.0
			},
			{
				designation: "HEB 650",
				h:           650,
				bf:          300,
				tw:          16.0,
				tf:          31.0
			},
			{
				designation: "HEB 700",
				h:           700,
				bf:          300,
				tw:          17.0,
				tf:          32.0
			},
			{
				designation: "HEB 800",
				h:           800,
				bf:          300,
				tw:          17.5,
				tf:          33.0
			},
			{
				designation: "HEB 900",
				h:           900,
				bf:          300,
				tw:          18.5,
				tf:          35.0
			},
			{
				designation: "HEB 1000",
				h:           1000,
				bf:          300,
				tw:          19.0,
				tf:          36.0
			}
		],
		HEM: [
			{
				designation: "HEM 100",
				h:           120,
				bf:          106,
				tw:          12.0,
				tf:          20.0
			},
			{
				designation: "HEM 120",
				h:           140,
				bf:          126,
				tw:          12.5,
				tf:          21.0
			},
			{
				designation: "HEM 140",
				h:           160,
				bf:          146,
				tw:          13.0,
				tf:          22.0
			},
			{
				designation: "HEM 160",
				h:           180,
				bf:          166,
				tw:          14.0,
				tf:          23.0
			},
			{
				designation: "HEM 180",
				h:           200,
				bf:          186,
				tw:          14.5,
				tf:          24.0
			},
			{
				designation: "HEM 200",
				h:           220,
				bf:          206,
				tw:          15.0,
				tf:          25.0
			},
			{
				designation: "HEM 220",
				h:           240,
				bf:          226,
				tw:          15.5,
				tf:          26.0
			},
			{
				designation: "HEM 240",
				h:           270,
				bf:          248,
				tw:          18.0,
				tf:          32.0
			},
			{
				designation: "HEM 260",
				h:           290,
				bf:          268,
				tw:          18.0,
				tf:          32.5
			},
			{
				designation: "HEM 280",
				h:           310,
				bf:          288,
				tw:          18.5,
				tf:          33.0
			},
			{
				designation: "HEM 300",
				h:           340,
				bf:          310,
				tw:          21.0,
				tf:          39.0
			},
			{
				designation: "HEM 320",
				h:           359,
				bf:          309,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 340",
				h:           377,
				bf:          309,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 360",
				h:           395,
				bf:          308,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 400",
				h:           432,
				bf:          307,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 450",
				h:           478,
				bf:          307,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 500",
				h:           524,
				bf:          306,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 550",
				h:           572,
				bf:          306,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 600",
				h:           620,
				bf:          305,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 650",
				h:           668,
				bf:          305,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 700",
				h:           716,
				bf:          304,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 800",
				h:           814,
				bf:          303,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 900",
				h:           910,
				bf:          302,
				tw:          21.0,
				tf:          40.0
			},
			{
				designation: "HEM 1000",
				h:           1008,
				bf:          302,
				tw:          21.0,
				tf:          40.0
			}
		]
	}
};