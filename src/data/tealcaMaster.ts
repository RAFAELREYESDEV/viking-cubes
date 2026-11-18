// Base Oficial Maestro de Sucursales Tealca (134 Sedes en 24 Estados de Venezuela)
export interface TealcaOffice {
  code: string;
  name: string;
  city: string;
  tel: string;
}

export interface StateData {
  cities: string[];
  offices: TealcaOffice[];
}

export const TEALCA_MASTER: Record<string, StateData> = {
  "Distrito Capital": {
    "cities": [
      "Caracas",
      "El Junquito"
    ],
    "offices": [
      {
        "code": "1114",
        "city": "Caracas",
        "name": "Boleíta",
        "tel": "0414.332.08.59"
      },
      {
        "code": "1143",
        "city": "Caracas",
        "name": "Capitolio",
        "tel": ""
      },
      {
        "code": "1125",
        "city": "Caracas",
        "name": "Catia",
        "tel": "0424.120.65.72"
      },
      {
        "code": "1137B",
        "city": "Caracas",
        "name": "Ccct",
        "tel": ""
      },
      {
        "code": "1142",
        "city": "Caracas",
        "name": "El Cafetal",
        "tel": "0414.250.17.83"
      },
      {
        "code": "1128B",
        "city": "Caracas",
        "name": "El Cementerio",
        "tel": "0412.953.51.79"
      },
      {
        "code": "1126",
        "city": "Caracas",
        "name": "El Paraíso",
        "tel": "0414.322.42.89"
      },
      {
        "code": "1137",
        "city": "Caracas",
        "name": "El Rosal - Chacao",
        "tel": "0414.120.01.52"
      },
      {
        "code": "1132",
        "city": "Caracas",
        "name": "Filas De Mariches",
        "tel": "0412.957.32.15"
      },
      {
        "code": "1114C",
        "city": "Caracas",
        "name": "La California",
        "tel": "0424-332.08.59"
      },
      {
        "code": "1128",
        "city": "Caracas",
        "name": "La Candelaria",
        "tel": "0412.955.01.90"
      },
      {
        "code": "1128C",
        "city": "Caracas",
        "name": "La Candelaria C.c. Lord Center",
        "tel": "0424-959.99.96"
      },
      {
        "code": "1110",
        "city": "Caracas",
        "name": "La Trinidad",
        "tel": ""
      },
      {
        "code": "1131",
        "city": "Caracas",
        "name": "Los Caobos",
        "tel": "0414.319.53.22"
      },
      {
        "code": "AA",
        "city": "Caracas",
        "name": "Los Chaguaramos",
        "tel": ""
      },
      {
        "code": "1127",
        "city": "Caracas",
        "name": "Los Palos Grandes",
        "tel": "0414.338.08.62"
      },
      {
        "code": "1114B",
        "city": "Caracas",
        "name": "Montecristo",
        "tel": "0414.332.08.59"
      },
      {
        "code": "1133",
        "city": "Caracas",
        "name": "Prados Del Este",
        "tel": "0424.286.31.89"
      },
      {
        "code": "EXPNN",
        "city": "Caracas",
        "name": "Quinta Crespo Internacional",
        "tel": ""
      },
      {
        "code": "1102",
        "city": "Caracas",
        "name": "Sabana Grande",
        "tel": "0414.322.16.06"
      },
      {
        "code": "1119",
        "city": "Caracas",
        "name": "San Martin",
        "tel": "0414-920-3007"
      },
      {
        "code": "1102B",
        "city": "Caracas",
        "name": "Urbina",
        "tel": ""
      },
      {
        "code": "1141",
        "city": "El Junquito",
        "name": "Junquito",
        "tel": ""
      }
    ]
  },
  "Miranda": {
    "cities": [
      "Caracas (Este - Chacao/Baruta/Sucre)",
      "Carrizal",
      "Charallave",
      "Cúa",
      "Guarenas",
      "Guatire",
      "Higuerote",
      "Los Teques",
      "Ocumare del Tuy",
      "San Antonio de los A",
      "San Antonio de los Altos",
      "Santa Teresa del Tuy"
    ],
    "offices": [
      {
        "code": "1406",
        "city": "Carrizal",
        "name": "Carrizal",
        "tel": ""
      },
      {
        "code": "1501",
        "city": "Charallave",
        "name": "Charallave",
        "tel": "0424.268.81.66"
      },
      {
        "code": "1305",
        "city": "Guarenas",
        "name": "Guarenas",
        "tel": "0414.900.07.63"
      },
      {
        "code": "1302",
        "city": "Guatire",
        "name": "Guatire",
        "tel": "0426.516.35.51"
      },
      {
        "code": "1503",
        "city": "Higuerote",
        "name": "Higuerote",
        "tel": ""
      },
      {
        "code": "1405B",
        "city": "Los Teques",
        "name": "Los Teques",
        "tel": "0412.939.94.96"
      },
      {
        "code": "1405",
        "city": "San Antonio de los A",
        "name": "San Antonio De Los Altos",
        "tel": "0424.143.1191"
      }
    ]
  },
  "Carabobo": {
    "cities": [
      "Guacara",
      "Los Guayos",
      "Mariara",
      "Morón",
      "Naguanagua",
      "Puerto Cabello",
      "San Diego",
      "Tocuyito",
      "Valencia"
    ],
    "offices": [
      {
        "code": "5214",
        "city": "Guacara",
        "name": "Guacara",
        "tel": "0412-269.69.19"
      },
      {
        "code": "5209",
        "city": "Valencia",
        "name": "Naguanagua",
        "tel": ""
      },
      {
        "code": "DD",
        "city": "Valencia",
        "name": "Oficina Comercial Valencia",
        "tel": ""
      },
      {
        "code": "5210",
        "city": "Valencia",
        "name": "San Diego",
        "tel": "0412-033.49.31"
      },
      {
        "code": "5211",
        "city": "Valencia",
        "name": "Tocuyito",
        "tel": "0426-546.80.92"
      },
      {
        "code": "5201",
        "city": "Valencia",
        "name": "Valencia (av. Andrés Eloy Blanco)",
        "tel": ""
      },
      {
        "code": "5207",
        "city": "Valencia",
        "name": "Valencia (distribuidor San Blas)",
        "tel": "0424-431.10.39"
      },
      {
        "code": "5207B",
        "city": "Valencia",
        "name": "Valencia (plaza La Candelaria)",
        "tel": "0414-142.32.25"
      },
      {
        "code": "5208",
        "city": "Valencia",
        "name": "Valencia (zona Industrial Norte)",
        "tel": "0424-403.91.66"
      },
      {
        "code": "5206",
        "city": "Valencia",
        "name": "Valencia Sur (paseo Las Industrias)",
        "tel": "0414-414.81.87"
      }
    ]
  },
  "Aragua": {
    "cities": [
      "Cagua",
      "El Limón",
      "La Victoria",
      "Maracay",
      "Palo Negro",
      "Santa Cruz",
      "Turmero",
      "Villa de Cura"
    ],
    "offices": [
      {
        "code": "5119B",
        "city": "El Limón",
        "name": "El Limon",
        "tel": ""
      },
      {
        "code": "5115",
        "city": "Cagua",
        "name": "Cagua",
        "tel": "0412-439.17.44"
      },
      {
        "code": "5118",
        "city": "La Victoria",
        "name": "La Victoria",
        "tel": "0424-346.86.75"
      },
      {
        "code": "5122",
        "city": "Maracay",
        "name": "Las Delicias",
        "tel": ""
      },
      {
        "code": "5113",
        "city": "Maracay",
        "name": "Maracay Este (av. Sucre)",
        "tel": ""
      },
      {
        "code": "5119",
        "city": "Maracay",
        "name": "Maracay Oeste",
        "tel": ""
      },
      {
        "code": "CC",
        "city": "Maracay",
        "name": "Oficina Comercial Maracay",
        "tel": ""
      },
      {
        "code": "5113B",
        "city": "Maracay",
        "name": "Tealca Maracay Sector Santa Ana",
        "tel": "0412-257.1546"
      },
      {
        "code": "5117",
        "city": "Turmero",
        "name": "La Morita",
        "tel": "0412-456.91.88"
      },
      {
        "code": "5120",
        "city": "Turmero",
        "name": "Turmero",
        "tel": ""
      }
    ]
  },
  "Zulia": {
    "cities": [
      "Cabimas",
      "Ciudad Ojeda",
      "Machiques",
      "Maracaibo",
      "San Francisco",
      "Santa Bárbara del Zulia",
      "Villa del Rosario"
    ],
    "offices": [
      {
        "code": "8307B",
        "city": "Santa Bárbara del Zulia",
        "name": "Santa Barbara Del Zulia",
        "tel": ""
      },
      {
        "code": "8405",
        "city": "Cabimas",
        "name": "Cabimas",
        "tel": ""
      },
      {
        "code": "8406",
        "city": "Ciudad Ojeda",
        "name": "Ciudad Ojeda",
        "tel": ""
      },
      {
        "code": "8502",
        "city": "Maracaibo",
        "name": "Bella Vista 5 De Julio",
        "tel": ""
      },
      {
        "code": "8502B",
        "city": "Maracaibo",
        "name": "Delicias 5 De Julio",
        "tel": ""
      },
      {
        "code": "8511",
        "city": "Maracaibo",
        "name": "Dr. Portillo",
        "tel": ""
      },
      {
        "code": "8511B",
        "city": "Maracaibo",
        "name": "Maracaibo Centro Cc Gran Bazar",
        "tel": ""
      },
      {
        "code": "8513B",
        "city": "Maracaibo",
        "name": "Maracaibo Circunvalacion 2 Sur Oeste",
        "tel": "0414.607.91.92"
      },
      {
        "code": "8513C",
        "city": "Maracaibo",
        "name": "Maracaibo Delicias Norte Centro Comercial El Pilar",
        "tel": ""
      },
      {
        "code": "8514",
        "city": "Maracaibo",
        "name": "Maracaibo Norte",
        "tel": "0414.651.53.23"
      },
      {
        "code": "8513",
        "city": "Maracaibo",
        "name": "Maracaibo Oeste - La Limpia",
        "tel": "0412.124.64.56"
      },
      {
        "code": "8509B",
        "city": "Maracaibo",
        "name": "Maracaibo Sur (la Coromoto)",
        "tel": ""
      },
      {
        "code": "8509",
        "city": "Maracaibo",
        "name": "Maracaibo Sur (san Francisco)",
        "tel": ""
      },
      {
        "code": "BB",
        "city": "Maracaibo",
        "name": "Oficina Comercial Maracaibo - Cecilio Acosta",
        "tel": ""
      },
      {
        "code": "8516",
        "city": "Villa del Rosario",
        "name": "Villa Del Rosario",
        "tel": ""
      }
    ]
  },
  "Lara": {
    "cities": [
      "Barquisimeto",
      "Cabudare",
      "Carora",
      "Duaca",
      "El Tocuyo",
      "Quíbor"
    ],
    "offices": [
      {
        "code": "7918C",
        "city": "Barquisimeto",
        "name": "Barquisimeto Carrera 19",
        "tel": ""
      },
      {
        "code": "7910",
        "city": "Barquisimeto",
        "name": "Barquisimeto Este",
        "tel": "0414-071.06.44"
      },
      {
        "code": "7918",
        "city": "Barquisimeto",
        "name": "Barquisimeto Oeste",
        "tel": ""
      },
      {
        "code": "7918B",
        "city": "Barquisimeto",
        "name": "Barquisimeto Oeste Av. Las Industrias",
        "tel": ""
      },
      {
        "code": "7912",
        "city": "Barquisimeto",
        "name": "Barquisimeto Sur",
        "tel": ""
      },
      {
        "code": "GG",
        "city": "Barquisimeto",
        "name": "Oficina Comercial Barquisimeto",
        "tel": ""
      },
      {
        "code": "7915",
        "city": "Cabudare",
        "name": "Cabudare",
        "tel": ""
      },
      {
        "code": "7916",
        "city": "Carora",
        "name": "Carora",
        "tel": ""
      }
    ]
  },
  "Anzoátegui": {
    "cities": [
      "Anaco",
      "Barcelona",
      "Cantaura",
      "El Tigre",
      "Lechería",
      "Pariaguán",
      "Puerto La Cruz"
    ],
    "offices": [
      {
        "code": "2912",
        "city": "Anaco",
        "name": "Anaco",
        "tel": "0412.251.98.49"
      },
      {
        "code": "2907",
        "city": "Barcelona",
        "name": "Barcelona",
        "tel": "0424.823.25.20"
      },
      {
        "code": "2901",
        "city": "El Tigre",
        "name": "El Tigre",
        "tel": ""
      },
      {
        "code": "2906",
        "city": "Lechería",
        "name": "Lechería",
        "tel": "0424.815.98.54"
      },
      {
        "code": "2909",
        "city": "Puerto La Cruz",
        "name": "Puerto La Cruz",
        "tel": ""
      },
      {
        "code": "2913",
        "city": "Puerto La Cruz",
        "name": "Puerto La Cruz Oeste",
        "tel": ""
      }
    ]
  },
  "Bolívar": {
    "cities": [
      "Ciudad Bolívar",
      "Puerto Ordaz",
      "San Félix",
      "Santa Elena de Uairén",
      "Tumeremo",
      "Unare",
      "Upata"
    ],
    "offices": [
      {
        "code": "3211",
        "city": "Santa Elena de Uairén",
        "name": "Santa Elena De Uairen",
        "tel": ""
      },
      {
        "code": "3104",
        "city": "Tumeremo",
        "name": "Tumeremo",
        "tel": ""
      },
      {
        "code": "3210",
        "city": "Ciudad Bolívar",
        "name": "Ciudad Bolivar",
        "tel": ""
      },
      {
        "code": "3205B",
        "city": "Puerto Ordaz",
        "name": "Puerto Ordaz Alta Vista",
        "tel": "0424.926.10.41"
      },
      {
        "code": "3205",
        "city": "Puerto Ordaz",
        "name": "Puerto Ordaz Castillito",
        "tel": "0424.907.63.29"
      },
      {
        "code": "3209",
        "city": "Puerto Ordaz",
        "name": "Ventuari",
        "tel": "0412.194.94.25"
      },
      {
        "code": "3208",
        "city": "San Félix",
        "name": "San Félix (el Roble)",
        "tel": "0414.830.49.24"
      },
      {
        "code": "3207",
        "city": "Unare",
        "name": "Unare",
        "tel": "0424.928.12.65"
      },
      {
        "code": "3208B",
        "city": "Upata",
        "name": "Upata",
        "tel": "0414.872.57.39"
      }
    ]
  },
  "Táchira": {
    "cities": [
      "Capacho",
      "Colón",
      "La Fría",
      "La fria",
      "Rubio",
      "San Antonio del Tach",
      "San Antonio del Táchira",
      "San Cristobal",
      "San Cristóbal",
      "Tariba",
      "Táriba",
      "Ureña"
    ],
    "offices": [
      {
        "code": "8517",
        "city": "Rubio",
        "name": "Rubio",
        "tel": ""
      },
      {
        "code": "8115C",
        "city": "Capacho",
        "name": "Capacho",
        "tel": ""
      },
      {
        "code": "8113",
        "city": "La fria",
        "name": "La Fria",
        "tel": "0412.061.2251"
      },
      {
        "code": "8112B",
        "city": "San Antonio del Tach",
        "name": "San Antonio Del Tachira",
        "tel": ""
      },
      {
        "code": "8112",
        "city": "San Cristobal",
        "name": "Paramillo",
        "tel": ""
      },
      {
        "code": "8115",
        "city": "San Cristobal",
        "name": "San Cristobal",
        "tel": ""
      },
      {
        "code": "8111",
        "city": "San Cristobal",
        "name": "San Cristóbal (barrio Obrero)",
        "tel": ""
      },
      {
        "code": "8114",
        "city": "San Cristobal",
        "name": "San Cristóbal Sur",
        "tel": "0414.379.92.08"
      },
      {
        "code": "8115B",
        "city": "Tariba",
        "name": "Tariba",
        "tel": ""
      },
      {
        "code": "8107",
        "city": "Ureña",
        "name": "Ureña",
        "tel": ""
      }
    ]
  },
  "Falcón": {
    "cities": [
      "Chichiriviche",
      "Coro",
      "Dabajuro",
      "Punta Cardon",
      "Punta Cardón",
      "Punto Fijo",
      "Tucacas"
    ],
    "offices": [
      {
        "code": "7609",
        "city": "Dabajuro",
        "name": "Dabajuro",
        "tel": ""
      },
      {
        "code": "7607",
        "city": "Coro",
        "name": "Coro",
        "tel": ""
      },
      {
        "code": "7608",
        "city": "Punta Cardon",
        "name": "Punto Fijo Las Virtudes Ciudad Comercial",
        "tel": ""
      },
      {
        "code": "7607B",
        "city": "Punto Fijo",
        "name": "Punto Fijo Centro",
        "tel": ""
      }
    ]
  },
  "Mérida": {
    "cities": [
      "Caja Seca",
      "Ejido",
      "El Vigía",
      "Mérida",
      "Tovar"
    ],
    "offices": [
      {
        "code": "8301B",
        "city": "Mérida",
        "name": "Merida",
        "tel": ""
      },
      {
        "code": "8308",
        "city": "Mérida",
        "name": "Merida Norte",
        "tel": ""
      },
      {
        "code": "8204C",
        "city": "Caja Seca",
        "name": "Caja Seca",
        "tel": ""
      },
      {
        "code": "8307",
        "city": "El Vigía",
        "name": "El Vigía",
        "tel": ""
      }
    ]
  },
  "Monagas": {
    "cities": [
      "Caripe",
      "Maturín",
      "Punta de Mata"
    ],
    "offices": [
      {
        "code": "3005",
        "city": "Maturín",
        "name": "Maturín Este (c.c. Juanico)",
        "tel": "0424.973.95.67"
      },
      {
        "code": "RR",
        "city": "Maturín",
        "name": "Oficina Comercial Maturín",
        "tel": "0412-876.70.77"
      },
      {
        "code": "3007",
        "city": "Maturín",
        "name": "Tipuro",
        "tel": ""
      }
    ]
  },
  "Nueva Esparta": {
    "cities": [
      "Juan Griego",
      "La Asuncion",
      "La Asunción",
      "Los Robles",
      "Los Robles / Pampatar",
      "Porlamar"
    ],
    "offices": [
      {
        "code": "2706C",
        "city": "La Asuncion",
        "name": "Cocheima",
        "tel": ""
      },
      {
        "code": "2706",
        "city": "Los Robles",
        "name": "Porlamar",
        "tel": "0424.827.57.82"
      }
    ]
  },
  "Portuguesa": {
    "cities": [
      "Acarigua",
      "Araure",
      "Guanare",
      "Turén"
    ],
    "offices": [
      {
        "code": "5401B",
        "city": "Acarigua",
        "name": "Acarigua",
        "tel": "0412-056.60.00"
      },
      {
        "code": "5401C",
        "city": "Acarigua",
        "name": "Acarigua Ii Mamanico",
        "tel": ""
      },
      {
        "code": "7705",
        "city": "Guanare",
        "name": "Guanare",
        "tel": "0424.553.59.72"
      }
    ]
  },
  "Sucre": {
    "cities": [
      "Carupano",
      "Carúpano",
      "Cumana",
      "Cumaná",
      "Güiria"
    ],
    "offices": [
      {
        "code": "2803",
        "city": "Carupano",
        "name": "Carupano",
        "tel": ""
      },
      {
        "code": "2804",
        "city": "Cumana",
        "name": "Cumana Santa Rosa",
        "tel": ""
      },
      {
        "code": "2802",
        "city": "Cumana",
        "name": "Cumaná",
        "tel": "0414.084.01.03"
      }
    ]
  },
  "Trujillo": {
    "cities": [
      "Boconó",
      "Sabana de Mendoza",
      "Trujillo",
      "Valera"
    ],
    "offices": [
      {
        "code": "8204",
        "city": "Valera",
        "name": "Valera",
        "tel": ""
      },
      {
        "code": "8204B",
        "city": "Valera",
        "name": "Valera-Centro",
        "tel": ""
      }
    ]
  },
  "Yaracuy": {
    "cities": [
      "Chivacoa",
      "Nirgua",
      "San Felipe",
      "Yaritagua"
    ],
    "offices": [
      {
        "code": "7802",
        "city": "San Felipe",
        "name": "San Felipe",
        "tel": ""
      }
    ]
  },
  "Barinas": {
    "cities": [
      "Alto Barinas",
      "Barinas",
      "Barinitas",
      "Santa Bárbara de Barinas",
      "Socopó"
    ],
    "offices": [
      {
        "code": "8006",
        "city": "Barinas",
        "name": "Alto Barinas",
        "tel": ""
      },
      {
        "code": "8006C",
        "city": "Barinas",
        "name": "Barinas Calle Cedeno",
        "tel": ""
      },
      {
        "code": "8006B",
        "city": "Barinas",
        "name": "Barinas Centro Comercial Barinas",
        "tel": ""
      },
      {
        "code": "8008",
        "city": "Barinas",
        "name": "Santa Barbara De Barinas",
        "tel": ""
      },
      {
        "code": "8007",
        "city": "Barinitas",
        "name": "Barinitas",
        "tel": ""
      }
    ]
  },
  "Guárico": {
    "cities": [
      "Calabozo",
      "San Juan de los Morros",
      "Valle de La Pascua",
      "Zaraza"
    ],
    "offices": [
      {
        "code": "J5121",
        "city": "San Juan de los Morros",
        "name": "San Juan De Los Morros - Villa De Cura",
        "tel": ""
      },
      {
        "code": "5501",
        "city": "Calabozo",
        "name": "Calabozo",
        "tel": ""
      },
      {
        "code": "5303",
        "city": "Valle de La Pascua",
        "name": "Valle De La Pascua",
        "tel": "0412-293.09.99"
      }
    ]
  },
  "Cojedes": {
    "cities": [
      "San Carlos",
      "Tinaquillo"
    ],
    "offices": [
      {
        "code": "5402",
        "city": "San Carlos",
        "name": "San Carlos",
        "tel": ""
      },
      {
        "code": "5403",
        "city": "Tinaquillo",
        "name": "Tinaquillo",
        "tel": ""
      }
    ]
  },
  "Apure": {
    "cities": [
      "Achaguas",
      "Guasdualito",
      "San Fernando de Apure"
    ],
    "offices": [
      {
        "code": "5601",
        "city": "Guasdualito",
        "name": "Guasdualito",
        "tel": ""
      },
      {
        "code": "5602",
        "city": "San Fernando de Apure",
        "name": "San Fernando De Apure",
        "tel": ""
      }
    ]
  },
  "La Guaira (Vargas)": {
    "cities": [
      "Caraballeda",
      "Catia La Mar",
      "La Guaira",
      "Maiquetia",
      "Maiquetía"
    ],
    "offices": [
      {
        "code": "1234",
        "city": "Maiquetia",
        "name": "Maiquetia",
        "tel": ""
      }
    ]
  },
  "Delta Amacuro": {
    "cities": [
      "Tucupita"
    ],
    "offices": [
      {
        "code": "3300",
        "city": "Tucupita",
        "name": "Tucupita",
        "tel": "0426.905.20.88"
      }
    ]
  },
  "Amazonas": {
    "cities": [
      "Puerto Ayacucho"
    ],
    "offices": []
  }
};

export const VENEZUELA_STATES_LIST = Object.keys(TEALCA_MASTER);

// Lista plana de todas las ciudades mapeadas con su estado
export interface CityOption {
  city: string;
  state: string;
}

export const ALL_CITIES: CityOption[] = [];
for (const [state, data] of Object.entries(TEALCA_MASTER)) {
  for (const city of data.cities) {
    ALL_CITIES.push({ city, state });
  }
}
ALL_CITIES.sort((a, b) => a.city.localeCompare(b.city, "es", { sensitivity: "base" }));
