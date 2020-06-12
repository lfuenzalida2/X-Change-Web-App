module.exports = {
  up: (queryInterface) => {
    const objectsData = [
      {
        userId: 1,
        categoryId: 1,
        name: 'Vinilo Abbey Road',
        state: false,
        description: 'Álbum de los Beatles',
        views: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 1,
        name: 'Guitarra Eléctrica',
        state: false,
        description: 'Gibson Les Paul 2017',
        views: 19,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 1,
        name: 'Bateria',
        state: false,
        description: 'Yamaha Raydeen',
        views: 19,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 2,
        name: 'The Last Of Us',
        state: true,
        description: 'Juego Original para PS4',
        views: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        categoryId: 2,
        name: 'CyberPunk',
        state: true,
        description: 'Juego Original para PS4',
        views: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        categoryId: 2,
        name: 'The Witcher III',
        state: true,
        description: 'Juego Original para PC',
        views: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 3,
        name: 'Pelota Adidas Brazuca',
        state: false,
        description: 'Original del Mundial 2014',
        views: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 3,
        name: 'Guantes de MMA',
        state: false,
        description: 'Guantes en excelente estado. Limpios y bien cuidados.',
        views: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 3,
        name: 'Bicicleta',
        state: false,
        description: 'Bicicleta hermosa de cuando era un lolo',
        views: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 3,
        name: 'Palos de golf',
        state: false,
        description: 'kit de 5 palos de golf (se incluyen 10 pelotas).',
        views: 37,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 4,
        name: 'Mouse Gamer Razer',
        state: true,
        description: 'Inalámbrico Usado',
        views: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        categoryId: 4,
        name: 'TECLADO GAMER RAZER CHROMA ORNATA',
        state: true,
        description: 'Solo con 2 años de antiguedad. Le faltan 2 teclas, fácilmente intercambiables.',
        views: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        categoryId: 5,
        name: 'IdeaPad L340 15" Gaming - Black',
        state: true,
        description: 'Computador ideal para jugar. Recién comprado.',
        views: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        categoryId: 5,
        name: 'ACER ASPIRE 3 A-315',
        state: true,
        description: 'AMD RYZEN 3 / 12GB RAM / 256 SSD / AMD RADEON VEGA 3 /15.6"',
        views: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        categoryId: 5,
        name: 'ASUS LAPTOP X409FB-EK016T',
        state: true,
        description: 'INTEL CORE I7 / 8GB RAM / 1TB / NVIDIA GEFORCE MX110 / 14"',
        views: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        categoryId: 6,
        name: 'iPhone 11 Pro',
        state: true,
        description: 'Sistema de tres cámaras (ultra gran angular, gran angular y teleobjetivo) Hasta 20 horas de reproducción de video. Resistencia al agua hasta por 30 minutos a una profundidad máxima de 4 metros. Pantalla Super Retina XDR de 5,8 o 6,5 pulgadas',
        views: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        categoryId: 6,
        name: 'SAMSUNG GALAXY A71 AZUL',
        state: true,
        description: 'Android / 4G-Wifi / 64 +12 + 5 + 5 MP',
        views: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        categoryId: 6,
        name: 'Huawei Y9s Breathing Crystal',
        state: true,
        description: 'Marca: Huawei/ Modelo: Y9s/ Color: Breathing Crystal/ Compañía: Liberado/ Sistema Operativo: Android 9 Pie/ Procesador: Kirin 710F/ Núcleos de Procesador: 8 (Octacore)/ Velocidad del procesador: 4x2.2GHz+4x1.7GHz4/ Tamaño de pantalla: 6.59"/ Tipo de pantalla: LTPS display/ Resolución: FHD+ (2340 x 1080)/ Cámara Frontal: 16 MP/ Cámara Trasera: 48 MP + 8 MP + 2 MP/ N° Cámaras traseras: 3/ Flash: Si/ Lector de huella: Si/ Dual SIM: Si/ Resistente al Agua: No/ Capacidad Batería (mAh): 4.000 mAh/ Accesorios Incluidos: Cargador, audífonos y cable de datos',
        views: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        categoryId: 7,
        name: 'Sartén',
        state: true,
        description: 'Nuevecito, bonito, no se pega el huevo.',
        views: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        categoryId: 7,
        name: 'Cuchara de palo',
        state: true,
        description: 'Cuchara de palo para la sopa.',
        views: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        categoryId: 7,
        name: 'Vaso con foto de Pelé',
        state: true,
        description: 'Vaso con foto y firma de Pelé.',
        views: 43,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 9,
        categoryId: 10,
        name: 'REFRIGERADOR 317 LT BGH INVERTER',
        state: true,
        description: 'Dimensiones: Alto: 186cm /Ancho: 60 cm/profundidad 64 cm',
        views: 33,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 8,
        categoryId: 10,
        name: 'MICROONDAS OSTER BOGC701',
        state: true,
        description: 'Características Técnicas:/ Tipo de control: Manual./ Clasificación energética: A./ Control Mecánico con perillas cromadas./ 6 niveles de potencia./ Descongelar: Si./ Programas predefinidos./ Plato giratorio de vidrio resistente al calor./ Luz interior: Si./ Bloqueo infantil. / 700 Watts de potencia./ Color: Negro.',
        views: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 8,
        categoryId: 10,
        name: 'Licuadora Ultra Blender',
        state: true,
        description: 'Licuadora 500W de potencia con cuerpo de acero inoxidable y jarra de vidrio con capacidad de 1,75 lts. 5 Velocidades + Función Pulse.',
        views: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        categoryId: 8,
        name: 'Zapatilla Little Fap Color Landazuri',
        state: true,
        description: 'Nuevas recién compradas, sin uso.',
        views: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 10,
        categoryId: 8,
        name: 'Polo Ralph Lauren',
        state: true,
        description: 'Polera Custom Slim Crewneck Azul Polo Ralph Lauren.',
        views: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        categoryId: 8,
        name: 'Pantalones Cargo UA Unstoppable Camo',
        state: true,
        description: 'Pantalones Negros para hombres UnderArmour.',
        views: 77,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        categoryId: 9,
        name: 'Figura del Rey Vegeta',
        state: true,
        description: 'Vegata SSBlue, tamaño real.',
        views: 77,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        categoryId: 9,
        name: 'Serie completa Great Teacher Onizuka',
        state: true,
        description: 'Todos los capítulos de anime en latino, 720p.',
        views: 77,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        categoryId: 9,
        name: 'Colección completa del manga Chainsaw Man',
        state: true,
        description: 'Se incluyen todos los volumenes hasta la fecha.',
        views: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('objects', objectsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('objects', null, {}),
};