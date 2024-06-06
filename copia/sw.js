auto . addEventListener ( 'instalar' ,  evento  =>  {
    evento . espere até (
        caches . open ( 'cache de teste do sensor' ) . então ( cache  =>  {
             cache de retorno . adicionarTodos ( [
                '/' ,
                '/index.html' ,
                '/sensores.js' ,
                '/manifest.json' ,
                '/icon.png' ,
                '/icon-512.png'
            ] ) ;
        } )
    ) ;
} ) ;

auto . addEventListener ( 'buscar' ,  evento  =>  {
    evento . responderCom (
        caches . correspondência ( evento.solicitação ) .​​ então ( resposta => {  
             resposta  de retorno ||  buscar ( evento.solicitação ) ;​​
        } )
    ) ;
} ) ;