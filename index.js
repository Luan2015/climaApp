require('dotenv').config();
const { inquirerMenu,leerInput,pausa, listarLugares } = require('./helpers/inquirer'); 
const Busquedas = require('./models/busquedas');



const main = async () => {
    
    const busquedas = new Busquedas()
    let opt;

    do {
        // Imprimir el menú
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const lugar = await leerInput('Cuidad:');
                
                // Buscar lugar
                const lugares = await busquedas.cuidad( lugar );
                
                // Seleccionar el lugar
                const id = await listarLugares( lugares );

                if ( id === '0' ) continue;

                const lugarSel =  lugares.find( l => l.id === id );

                // Grabar en DB

                busquedas.agregarHistorial( lugarSel.nombre );
                
                // Clima
                const datosLugar = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng);
                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la cuidad\n'.green);
                console.log('Cuidad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng', lugarSel.lng);
                console.log('Temperatura:',datosLugar.temp);
                console.log('Minima:',datosLugar.min);
                console.log('Maxima:',datosLugar.max);
                console.log('El clima está:', datosLugar.desc.green);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( ( lugar, i ) =>{
                    const idx = `${ i +1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                });

            break;
        
        }
        if ( opt !== 0 ) await pausa();

    } while( opt !== 0 );

}

main()  