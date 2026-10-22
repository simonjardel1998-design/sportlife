/* Datos de SportLife: rutinas y tips. Editá acá para agregar contenido. */
window.RUTINAS = [
  {
    id: 'empujes-desde-cero', cat: 'calistenia', nivel: 'Principiante',
    nombre: 'Empujes desde cero', trabajo: 40, descanso: 20,
    ejercicios: ['Flexiones (con rodillas si hace falta)', 'Fondos en silla', 'Pike push-up', 'Plancha', 'Superman en el piso', 'Flexiones con apoyo en pared']
  },
  {
    id: 'barra-y-espalda', cat: 'calistenia', nivel: 'Intermedio',
    nombre: 'Barra y espalda', trabajo: 40, descanso: 30,
    ejercicios: ['Remo invertido bajo una mesa firme', 'Colgado activo en barra', 'Dominada negativa (bajada lenta)', 'Elevación de rodillas colgado', 'Hollow hold']
  },
  {
    id: 'piernas-sin-equipo', cat: 'calistenia', nivel: 'Principiante',
    nombre: 'Piernas sin equipo', trabajo: 40, descanso: 20,
    ejercicios: ['Sentadillas', 'Zancadas alternadas', 'Puente de glúteos', 'Sentadilla isométrica en pared', 'Elevación de talones']
  },
  {
    id: 'circuito-mancuernas', cat: 'gimnasio', nivel: 'Principiante',
    nombre: 'Circuito de mancuernas', trabajo: 45, descanso: 30,
    ejercicios: ['Sentadilla goblet', 'Press con mancuernas', 'Remo con mancuerna', 'Peso muerto rumano liviano', 'Press de hombros']
  },
  {
    id: 'tren-superior-maquinas', cat: 'gimnasio', nivel: 'Intermedio',
    nombre: 'Tren superior en máquinas', trabajo: 45, descanso: 30,
    ejercicios: ['Jalón al pecho', 'Press en máquina', 'Remo en polea', 'Vuelos laterales', 'Curl de bíceps', 'Extensión de tríceps en polea']
  },
  {
    id: 'explosivo-cancha', cat: 'equipo', nivel: 'Intermedio',
    nombre: 'Explosivo para la cancha', trabajo: 30, descanso: 30,
    ejercicios: ['Saltos verticales', 'Sprint en el lugar', 'Desplazamientos laterales', 'Sentadilla con salto', 'Zancadas con cambio de pierna']
  },
  {
    id: 'resistencia-agilidad', cat: 'equipo', nivel: 'Principiante',
    nombre: 'Resistencia y agilidad', trabajo: 40, descanso: 20,
    ejercicios: ['Trote en el lugar', 'Skipping', 'Escaladores', 'Burpees sin salto', 'Pasos laterales rápidos']
  },
  {
    id: 'movilidad-manana', cat: 'vida', nivel: 'Principiante',
    nombre: 'Movilidad de la mañana', trabajo: 40, descanso: 10,
    ejercicios: ['Círculos de cuello suaves', 'Rotación de hombros', 'Gato-vaca', 'Estocada con rotación', 'Sentadilla profunda con pausa']
  },
  {
    id: 'pausa-estudio', cat: 'vida', nivel: 'Principiante',
    nombre: 'Pausa activa para estudiar', trabajo: 40, descanso: 10,
    ejercicios: ['Estiramiento de pecho en la pared', 'Rotación de columna sentado', 'Sentadillas lentas', 'Elevación de talones', 'Respiración profunda']
  }
];

window.TIPS = [
  { cat: 'entrenamiento', titulo: 'Primero la técnica', texto: 'Hacé cada repetición lenta y completa. Si tenés que balancear el cuerpo para terminarla, el ejercicio te queda grande: pasá a una versión más fácil.' },
  { cat: 'entrenamiento', titulo: 'Constancia gana a intensidad', texto: 'Tres días por semana durante meses rinden más que una semana a full y después nada. Elegí algo que puedas sostener.' },
  { cat: 'entrenamiento', titulo: 'Calentá cinco minutos', texto: 'Movilidad de hombros, cadera y tobillos, y unas repeticiones suaves antes de arrancar. Tu cuerpo rinde mejor y llegás más cuidado a la serie fuerte.' },
  { cat: 'entrenamiento', titulo: 'Anotá lo que hacés', texto: 'Alcanza con las notas del celu: ejercicio, repeticiones, cómo te sentiste. Si no lo medís, no te das cuenta de que estás mejorando.' },
  { cat: 'entrenamiento', titulo: 'Entrená lo que pide tu deporte', texto: 'Si jugás al fútbol, básquet o vóley, sumá saltos, cambios de dirección y piernas fuertes. La cancha te va a mostrar la diferencia.' },
  { cat: 'alimentacion', titulo: 'Llevá tu botella', texto: 'Tomar agua de a poco durante el día y mientras entrenás te ayuda a sentirte mejor. No esperes a estar con la boca seca.' },
  { cat: 'alimentacion', titulo: 'Si tenés hambre, comé algo antes', texto: 'Una fruta o una tostada una hora antes alcanza. Entrenar mareado o sin energía no te hace más fuerte, te hace más propenso a lastimarte.' },
  { cat: 'alimentacion', titulo: 'Las dietas milagro no existen', texto: 'Ningún alimento ni suplemento hace todo. Variá: verduras, frutas, proteínas y cereales. Si querés cambiar mucho tu alimentación, consultá con un nutricionista.' },
  { cat: 'descanso', titulo: 'Dormir también es entrenar', texto: 'La mayoría de los jóvenes necesita entre 7 y 10 horas. Dormir poco te baja el rendimiento, el ánimo y las ganas de moverte.' },
  { cat: 'descanso', titulo: 'Un día libre no te hace perder nada', texto: 'Tu cuerpo mejora mientras descansa. Dejá al menos uno o dos días por semana sin entrenar fuerte, o hacé algo suave como caminar.' },
  { cat: 'mentalidad', titulo: 'No te compares con tu feed', texto: 'En redes ves lo mejor de cada persona, con luz y ángulo. Compará tu rutina de hoy con la tuya de hace un mes.' },
  { cat: 'mentalidad', titulo: 'Empezá con 10 minutos', texto: 'Si hoy no tenés ganas, prometete solo diez. Casi siempre, una vez que arrancás, seguís. Y si no, igual sumaste.' },
  { cat: 'mentalidad', titulo: 'Si duele, frená', texto: 'Cansancio en el músculo es normal. Dolor punzante en una articulación no lo es. Pará y, si sigue, consultá a un profesional de la salud.' }
];

/* Información extra de cada rutina (se muestra en su página).
   Los comentarios son de ejemplo para el prototipo del proyecto. */
window.RUTINAS_INFO = {
  'empujes-desde-cero': {
    desc: 'Una rutina para trabajar pecho, hombros y tríceps usando solo tu peso. Combina flexiones, fondos y plancha en bloques cortos, con pausas para que llegues bien a cada ejercicio.',
    ideal: ['Estás empezando con calistenia y querés una base', 'No tenés equipo: alcanza con el piso y una silla', 'Querés ganar fuerza en el tren superior sin ir al gimnasio'],
    cuidado: 'Si una flexión te sale mal, pasá a la versión con rodillas o con apoyo en la pared.',
    comentarios: [
      { n: 'Cande', e: 16, p: 5, t: 'Empecé con flexiones en la pared y ahora ya hago con rodillas. Se nota el progreso.' },
      { n: 'Tomi', e: 17, p: 4, t: 'Cortita y clara. Los fondos en silla me costaron, pero la versión fácil ayuda.' },
      { n: 'Lu', e: 15, p: 4, t: 'Perfecta para hacer en casa antes de ponerme con la tarea.' }
    ]
  },
  'barra-y-espalda': {
    desc: 'Rutina pensada para la espalda y los brazos con una barra o una mesa firme. Trabaja tirones, agarre y abdomen, que son la base para lograr una dominada.',
    ideal: ['Ya hacés flexiones y querés sumar tirones', 'Tenés una barra a mano, en casa o en la plaza', 'Tu objetivo es lograr tu primera dominada'],
    cuidado: 'Antes de colgarte, asegurate de que la mesa o la barra aguanten tu peso.',
    comentarios: [
      { n: 'Nacho', e: 19, p: 5, t: 'Con la mesa del patio pude hacer el remo. Ya aguanto 20 segundos colgado.' },
      { n: 'Mica', e: 18, p: 4, t: 'Me sirvió para prepararme para la barra de la plaza.' },
      { n: 'Fran', e: 20, p: 3, t: 'Está buena, pero es difícil si recién arrancás. Hay que ir de a poco.' }
    ]
  },
  'piernas-sin-equipo': {
    desc: 'Piernas y glúteos con ejercicios básicos que podés hacer en tu cuarto. Es ideal para soltar el cuerpo después de pasar mucho tiempo sentado.',
    ideal: ['Querés trabajar piernas sin ir al gimnasio', 'Jugás algún deporte y querés piernas más firmes', 'Pasás muchas horas sentado estudiando'],
    cuidado: 'Si te molesta la rodilla, bajá menos y consultá a un profesional.',
    comentarios: [
      { n: 'Sofi', e: 17, p: 5, t: 'Después de jugar al vóley me dejó las piernas como nuevas, en el buen sentido.' },
      { n: 'Joaco', e: 16, p: 4, t: 'Sin equipo y rápida. La sentadilla en la pared es una tortura.' },
      { n: 'Abril', e: 21, p: 4, t: 'La hago en el descanso de estudiar y me despeja.' }
    ]
  },
  'circuito-mancuernas': {
    desc: 'Un circuito de cuerpo completo con un par de mancuernas livianas. Va de las piernas a los hombros para que entres al gimnasio con un plan claro.',
    ideal: ['Es tu primera vez en el gimnasio', 'Tenés poco tiempo y querés trabajar todo el cuerpo', 'Querés aprender los movimientos básicos con peso'],
    cuidado: 'Empezá con poco peso: lo importante es la técnica, no cuánto levantás.',
    comentarios: [
      { n: 'Valen', e: 18, p: 5, t: 'Fui por primera vez al gimnasio con esta rutina y no me sentí perdida.' },
      { n: 'Mateo', e: 16, p: 4, t: 'Con una mancuerna sola alcanza. Me gustó que sea corta.' },
      { n: 'Agus', e: 22, p: 4, t: 'Buen punto de partida para armar mi propio plan.' }
    ]
  },
  'tren-superior-maquinas': {
    desc: 'Pecho, espalda, hombros y brazos en máquinas y poleas. Las máquinas guían el movimiento, así que te podés concentrar en sentir el músculo trabajar.',
    ideal: ['Ya fuiste algunas semanas al gimnasio', 'Querés un día dedicado solo al tren superior', 'Preferís las máquinas antes que el peso libre'],
    cuidado: 'Ajustá el asiento y el peso de cada máquina antes de empezar.',
    comentarios: [
      { n: 'Dami', e: 20, p: 5, t: 'Con las máquinas es más fácil concentrarse en el músculo.' },
      { n: 'Cami', e: 19, p: 4, t: 'Muy completa para un día de tren superior.' },
      { n: 'Bruno', e: 21, p: 4, t: 'Me hubiera gustado más descanso entre ejercicios, pero se banca.' }
    ]
  },
  'explosivo-cancha': {
    desc: 'Saltos, sprints y cambios de dirección para ganar potencia y velocidad. Los tiempos son cortos y parejos, como los esfuerzos de un partido.',
    ideal: ['Jugás fútbol, básquet, vóley o handball', 'Querés mejorar tu salto y tu arranque', 'Ya tenés buena base y buscás un desafío'],
    cuidado: 'Calentá bien tobillos y rodillas, y hacela sobre una superficie que no resbale.',
    comentarios: [
      { n: 'Lauti', e: 17, p: 5, t: 'Juego al básquet y noté la diferencia en los saltos después de unas semanas.' },
      { n: 'Rochi', e: 18, p: 4, t: 'Cansa, pero es corta. Las zancadas con salto me matan.' },
      { n: 'Gonza', e: 20, p: 4, t: 'Ideal para hacer antes de que arranque la temporada.' }
    ]
  },
  'resistencia-agilidad': {
    desc: 'Cardio liviano y movimientos rápidos de pies para aguantar mejor todo el partido. Sirve para entrar en ritmo sin llegar al límite.',
    ideal: ['Te cansás rápido en los partidos', 'Volvés a entrenar después de un tiempo parado', 'Querés mejorar el cardio sin correr largas distancias'],
    cuidado: 'Si te falta el aire, bajá el ritmo y respirá: no hace falta ir a tope.',
    comentarios: [
      { n: 'Male', e: 15, p: 4, t: 'Me costaba el cardio en los partidos y esto me ayudó a aguantar más.' },
      { n: 'Santi', e: 17, p: 5, t: 'Simple y divertida. Los escaladores son lo más difícil.' },
      { n: 'Pau', e: 16, p: 4, t: 'Los pasos laterales me hicieron acordar a las clases de gimnasia.' }
    ]
  },
  'movilidad-manana': {
    desc: 'Una rutina suave para despertar el cuerpo. Mueve cuello, hombros, columna y cadera para arrancar el día con menos rigidez.',
    ideal: ['Te levantás duro o con sueño', 'Querés sumar un hábito sano sin mucho esfuerzo', 'Venís de entrenar fuerte y necesitás soltar'],
    cuidado: 'Nada de rebotes ni de forzar: todo tiene que sentirse cómodo.',
    comentarios: [
      { n: 'Isa', e: 16, p: 5, t: 'La hago apenas me levanto y empiezo el día mucho más suelta.' },
      { n: 'Thiago', e: 18, p: 4, t: 'Suave y sin complicaciones. Se la recomendé a mi mamá.' },
      { n: 'Mili', e: 22, p: 5, t: 'Me soltó el cuello después de dormir mal.' }
    ]
  },
  'pausa-estudio': {
    desc: 'Para cuando llevás horas frente al cuaderno o la compu. Son estiramientos y movimientos cortos que podés hacer sin cambiarte ni salir del cuarto.',
    ideal: ['Estudiás o usás pantallas muchas horas seguidas', 'Te duele el cuello o la espalda por la postura', 'Necesitás despejar la cabeza entre materia y materia'],
    cuidado: 'Hacela cada una o dos horas. No reemplaza una buena silla ni dormir bien.',
    comentarios: [
      { n: 'Juli', e: 17, p: 5, t: 'Mientras estudio para los exámenes la hago cada dos horas. Me salva la espalda.' },
      { n: 'Emi', e: 19, p: 4, t: 'Cortita. Los estiramientos en la pared están buenísimos.' },
      { n: 'Cata', e: 15, p: 4, t: 'Me ayuda a desconectar un ratito entre materias.' }
    ]
  }
};
window.RUTINAS.forEach(function (r) {
  var i = window.RUTINAS_INFO[r.id];
  if (i) { r.desc = i.desc; r.ideal = i.ideal; r.cuidado = i.cuidado; r.comentarios = i.comentarios; }
});
