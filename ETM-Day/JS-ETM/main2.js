var globalNumber = 0;

$(document).ready(function() {

    async function fetchData() {
        const response = await fetch('https://f.hubspotusercontent10.net/hubfs/7800319/js/etm-day/agenda2.json');
        const data = await response.json();
        return data;
    }

    const carruselExpositores = (carrusel) => {

        $(carrusel).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            mobileFirst:true,
            dots: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: true,
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: false,
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        dots: false,
                    }
                },
            ]
        });

    }

    const loadInitialAgenda = () =>{
        fetchData()
            .then(response => {
                response.agenda.forEach(element => {
                    //console.log(element.events);
                    $('#tpl-tabs-content').clone().appendTo($('.programas__tab')).attr('id', element.day).attr("data-length", element.events.length);
                    for(let i = 0; i < element.events.length; i++){
                        $('#tpl-tabs-content-item').clone().appendTo( $('#'+element.day) ).attr('id', element.events[i].id).attr("data-room", element.events[i].rooms);
                        if( element.events[i].rooms == 1 ){
                            $('#'+element.day + " #"+ element.events[i].id +" a").last().attr("href", "etm-room-1?date="+element.day+"&eventID="+(element.events[i].id - 1));
                        }else if(element.events[i].rooms == 2){
                            $('#'+element.day + " #"+ element.events[i].id +" a").last().attr("href", "etm-room-2?date="+element.day+"&eventID="+(element.events[i].id - 1));
                        }else if(element.events[i].rooms == 3){
                            $('#'+element.day + " #"+ element.events[i].id +" a").last().attr("href", "etm-room-3?date="+element.day+"&eventID="+(element.events[i].id - 1));
                        }else if(element.events[i].rooms == 4){
                            $('#'+element.day + " #"+ element.events[i].id +" a").last().attr("href", "etm-room-4?date="+element.day+"&eventID="+(element.events[i].id - 1));
                        }
                        //else{
                        //   $('#'+element.day + " #"+ element.events[i].id +" a").last().attr("href", "etm-new-room?date="+element.day+"&eventID="+(element.events[i].id - 1)+"&"+element.events[i].rooms);
                        //}
                        //$('#'+element.day + " #"+ element.events[i].id +" a").last().attr("href", "etm-new-room?roomID="+element.events[i].rooms+"&date="+element.day+"&eventID="+(element.events[i].id - 1));
                        $('#'+element.day).find( $( '.horario').last() ).text(element.events[i].time);
                        $('#'+element.day).find( $( '.titulo').last() ).text(element.events[i].title);
                        $('#'+element.day).find( $( '.contenido').last() ).append(element.events[i].description);
                    }

                    paginadorHorarios(element.day);

                  
                    
                });

                //console.log();
                localStorage.setItem("DayLength1", response.agenda[0].day+","+response.agenda[0].totalEvents);
                localStorage.setItem("DayLength2", response.agenda[1].day+","+response.agenda[1].totalEvents);
                
                $('.programas__tab-content').eq(1).addClass('is-active');
            });
    }

  


    const tabsAgenda = () => {

        $('.js-programas-tabs li').click(function(e){
            e.preventDefault();
            let tabs = $(this).attr('id');
            let tabsDate = $(this).attr('data-date'); 
            let contentInfo = $('.programas__tab-content');
            
            if(!$(this).hasClass('is-active')){ 

                $('.js-programas-tabs li').removeClass('is-active');
                $(this).addClass('is-active');
                
                contentInfo.removeClass('is-active');
                $('#'+tabsDate).addClass('is-active');

            }

            $('#js-prev-arrow').attr("data-rel", 0);
            $('#js-next-arrow').attr("data-rel", 1);
            
        });

        
    }

    const loadInitialRooms = (numberDay) => {

        fetchData()
            .then(response => {
                //console.log(response);
                let day = response.agenda[numberDay].day;
                let rooms = response.agenda[numberDay].events;
                //console.log(day);

                rooms.forEach( (element, index) => {
                    $('#tpl-rooms-items').clone().appendTo( $('.js-rooms')).attr('id', element.id);
                    $('#'+element.id).find( $('a') ).attr("href", "etm-new-2.html?date="+day+"&eventID="+(element.id - 1));
                    $('#'+element.id).find( $('strong') ).text(element.title);
                    $('#'+element.id).find( $('img') ).attr("src", element.image);
                    $('#'+element.id).find( $('img') ).attr("alt", element.name);

                });

            });
        
    }

    // Read a page's GET URL variables and return them as an associative array.
    const getUrlVars = () =>{
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    const loadInternalRoom = () =>{

        
        let day = getUrlVars()["date"];
        let eventID = getUrlVars()["eventID"];
        let roomID = getUrlVars()["roomID"];

        
        fetchData()
            .then(response => {
                let internalRoom;
                if(day == "2021-12-10"){
                    internalRoom = response.agenda[0].events[eventID];
                }else{
                    internalRoom = response.agenda[1].events[eventID];
                }
                
                //console.log(internalRoom);

                $('.js-internal-room').find( $('h2') ).text(internalRoom.title);
                $('.js-internal-room').find( $('h1') ).text(internalRoom.titleRoom);
                $('.internal-iframe').find( $('iframe')).remove();
                $('.internal-iframe').append(internalRoom.iframeUrl);
                
                for(let i = 0; i < internalRoom.speakers.length; i++){
                    $('#tpl-carrusel-item').clone().appendTo( $('.expositores__carrusel') ).attr('id',  internalRoom.speakers[i].name);
                    $('.expositores__carrusel-item-contenedor').last().find('strong').text(internalRoom.speakers[i].name);
                    $('.expositores__carrusel-item-contenedor').last().find('p').text(internalRoom.speakers[i].description);
                    $('.expositores__carrusel-item-contenedor').last().find('img').attr("src",internalRoom.speakers[i].image);
                    $('.expositores__carrusel-item-contenedor').last().find('img').attr("alt",internalRoom.speakers[i].name);
                }

                carruselExpositores('#carrusel_interno');

            });

    }

    
    const modalForm = (e) =>{
        let modal = $("#myModal");
        let span = $(".close-modal");

        span.click(function(e) {
            modal.css("display", "none");            
        });

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.css("display", "none");
            }
        }


    }

    const paginadorHorarios = (dayActive) =>{
        
        //Variable para los items a mostrar
        let itemShow = 4;

        //Vas a Esconder todos los tr
        $("#"+dayActive+' .programas__tab-content-item').hide();

        //Vas a mostrar nada mas del 0 al numero que quieres mostrar
        $("#"+dayActive+' .programas__tab-content-item').slice(0, itemShow).show();
        
    
    }

    const flechaSiguienteHorarios = () =>{
        //let localData = localStorage.getItem("DayLength1");
        //let splitData = localData.split(",");
        //console.log(splitData);


        let itemShow = 4;
        
        
        $('#js-next-arrow').click(function (e){

            e.preventDefault();
            //Numero total de items
            let totalItems = parseInt($('.programas__tab-content.is-active').attr("data-length"));
            //console.log("Total items: ", totalItems);
            
            //Paginas que se deben de crear
            let paginas =  Math.round( totalItems / itemShow);
            //console.log("Numero de paginas totales: ", paginas);

            //Pagina en la que estamos
            let currentPage = $(this).attr('data-rel');
            //console.log("Pagina actual: ", currentPage);

            //En la variable starItem calculamos la relacion por el numero a mostrar
            let startItem = currentPage * itemShow;

            //console.log("Item inicial: ",startItem);
            //En la variable endItem seria el numero inicial mas los items amostra
            var endItem = startItem + itemShow;
            //console.log("Item final: ", endItem);

            let contentActive = $('.programas__tab-content.is-active').attr("id");
            //console.log(contentActive);
            //En los TR, le agregamos el opacity 0, lo ocultamos y mostramos del item inicial, al ultimo item
            $('#' + contentActive + ' .programas__tab-content-item').css('opacity','0.0').hide().slice(startItem, endItem).css('display','block').animate({opacity:1}, 300);

            let pageNumber = parseInt(currentPage, 10);
            //console.log("Pagina actual en number", pageNumber);

            let finalPage = paginas - 1;
            //console.log("Ultima pagina: ", finalPage);


            if(pageNumber ==  finalPage || finalPage == 0){
                //console.log("Llegue a mi tope");
                //$('#' + contentActive + ' .programas__tab-content-item').css('opacity','0.0').hide().slice(startItem, endItem).css('display','block').animate({opacity:1}, 300);
                $(this).css("cursor", "not-allowed").animate({opacity:0.5}, 300);
            }else{

                if($('#js-prev-arrow').attr("id") == 0){
                    console.log("Soy cero") 
                }else{
                    $('#js-prev-arrow').attr("data-rel", (pageNumber));
                }
                $(this).attr("data-rel", (pageNumber + 1));
                //localStorage.setItem("NumeroGlobal", 1);
                globalNumber = globalNumber + 1;        
            }
        
        });

    }

    const flechaAnterior = () =>{
        let itemShow = 4;
        

        
        $('#js-prev-arrow').click(function (e){
            e.preventDefault();
            let contentActive = $('.programas__tab-content.is-active').attr("id");
            //console.clear()
            //console.log("Global number actual: ", globalNumber);
            if((globalNumber - 1) <= 0){
                //console.log("entre");
                globalNumber = 0;
                //console.log("Globar number en 0, validacion: ", globalNumber);
                $('#' + contentActive + ' .programas__tab-content-item').css('opacity','0.0').hide().slice(0, 4).css('display','block').animate({opacity:1}, 300);
                $(this).attr("data-rel", globalNumber);
                $('#js-next-arrow').attr("data-rel", 1);
                $('#js-next-arrow').css("cursor", "pointer").animate({opacity:1}, 300);
            }else{
                
                $('#js-next-arrow').css("cursor", "pointer").animate({opacity:1}, 300);
                //console.clear();
                //console.log("Global number actual: ", globalNumber);
                globalNumber = globalNumber - 1;
                //Pagina en la que estamos
                let currentPage = globalNumber;
                //console.log("Pagina actual: ", currentPage);
                
                //En la variable starItem calculamos la relacion por el numero a mostrar
                let startItem = currentPage * itemShow;
                //console.log("Item inicial: ",startItem);
                
                //En la variable endItem seria el numero inicial mas los items amostra
                var endItem = startItem + itemShow;
                //console.log("Item final: ", endItem);

                $(this).attr("data-rel", globalNumber);
                $('#js-next-arrow').attr("data-rel", (globalNumber + 1));

                $('#' + contentActive + ' .programas__tab-content-item').css('opacity','0.0').hide().slice(startItem, endItem).css('display','block').animate({opacity:1}, 300);

            }
            

        });

    }

    async function temasData() {

        const response = await fetch('https://f.hubspotusercontent10.net/hubfs/7800319/js/etm-day/temas.json');
        const data = await response.json();
        return data;


    }

    const fillTemasData = () => {

        temasData()
            .then(response => {
                //console.log(response);

                response.temas.forEach( (element) => {
                    console.log();
                    $('#tpl-suscribete-card').clone().appendTo( $('.suscribete__contenedor')).attr('id', element.id).attr("data-tema", element.title);
                    $('.suscribete__card').last().find( $('.suscribete__card-header img')).attr("src", element.image);
                    $('.suscribete__card').last().find( $('.suscribete__card-header strong')).text(element.title);
                    $('.suscribete__card').last().find( $('.suscribete__card-body p')).text(element.text);
                });

                $('.suscribete__card').css('opacity','0.0').hide().slice(0, 5).css('display','flex').animate({opacity:1}, 300);
                
                
            });

    }

    const showAllTemas = () => {

        $('.suscribete__footer a').click(function (e){
            e.preventDefault();

            if($(this).hasClass('isActive')){
                $(this).removeClass('isActive');
                $('.suscribete__card').css('opacity','0.0').hide().slice(0, 5).css('display','flex').animate({opacity:1}, 300);
            }else{
                $(this).addClass('isActive');
                $('.suscribete__card').css('opacity','0.0').hide().slice(0, $('.suscribete__card').length).css('display','flex').animate({opacity:1}, 300);
            }

        });
    }

    window.onload = function () {

        $('.suscribete__card-footer-container a').on('click',function (){
            $('#myModal').css("display", "block");
            //console.log($('[name="preferencias_de_suscripcion"]').length);
            let parentSubject = $(this).parents('.suscribete__card').attr("data-tema");
            $('[name="preferencias_de_suscripcion"]').prop("checked", false);
            
            if(parentSubject == "Formacion"){
                $('input[value="Capacitación/Formación"]').prop("checked", true );
            }else if (parentSubject == "Crear Pyme"){
                $('input[value="Creación de Pymes"]').prop("checked", true );
            }else{
                $('input[value="'+parentSubject+'"]').prop("checked", true );
            }
        })

        changeImageResp();

        //if( $('.js-filtro-interno').length ) {
        //    agendaFiltro();
        //}
    }

    var changeImageResp = () => {
		let image = $('.js-change-image');

        for (var i = 0; i < image.length; i++) {
			imgSrc = $(image[i]).attr('data-src');
            $(image[i]).css("background-image", "url("+imgSrc+")");
		}
	};
    
    const switchBanner = () => {
        let eventID = getUrlVars()["eventID"];

        if(eventID == "0" || eventID == "2"){
            $('#tpl-banner-first').addClass('banner__bg-first');
            $('#tpl-banner-first').clone().appendTo( $('#js-banner-ventas'));
        }else{
            $('#tpl-banner-second').addClass('banner__bg-second');
            $('#tpl-banner-second').clone().appendTo( $('#js-banner-ventas'));
            
        }

    }

    const agendaFiltro = () => {

        let eventID = parseInt(getUrlVars()["eventID"], 10) + 1;
        //console.log("Numero de sala: ", eventID);
        

        $('.js-filtro-interno [data-room]').each(function( index ) {
            if($( this ).attr("data-room") != eventID){
                $(this).remove();
            }
        });

        $('.js-filtro-interno .programas__tab-content').each(function (index){
            //console.log("This: " + index + " data-length="+$(this).attr("data-length"));
            $(this).attr("data-length", $(this).find($('.programas__tab-content-item')).length);
        });

       

        setTimeout(() => {

            let day1 = "2021-12-10";
            let day2 = "2021-12-11";
            paginadorHorarios(day1);
            paginadorHorarios(day2);
           
        }, 1500);

        
        

    }



    const init = () => {
        //localStorage.setItem("NumeroGlobal", 0);

        //Agenda
        if( $('.expositores').length ) {
            tabsAgenda();
            loadInitialAgenda();
            flechaSiguienteHorarios();
            flechaAnterior();
            
        }

        if( $('#js-banner-ventas').length){
            switchBanner();
        }

        //if( $('.js-etm-rooms').length ){
        //    loadInitialRooms(0);
        //}

        if( $('.js-internal-room').length ){
            loadInternalRoom();
        }

        if( $('#js-modal-form').length ) {
            //console.log("Entre");
            modalForm();
        }

        if( $('.expositores__carrusel').length ) carruselExpositores('#js-carrusel-expositores-destacados');

        if( $('.suscribete').length) {
            fillTemasData();
            showAllTemas();
        }
    }

    init();
    
});