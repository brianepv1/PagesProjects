$(document).ready(function() {

    console.log("Prueba");

    async function fetchData() {
        const response = await fetch('https://f.hubspotusercontent10.net/hubfs/7800319/js/etm-day/agenda.json');
        const data = await response.json();
        return data;
    }

    const carruselExpositores = (carrusel) => {

        $(carrusel).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            arrows: false,
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

    const loadInitialData = () => {
        fetchData()
            .then(response => {
                response.agenda.forEach(element => {
                    //console.log(element.events);
                    $('#tpl-tabs-content').clone().appendTo($('.programas__tab')).attr('id', element.day);
                    for(let i = 0; i < element.events.length; i++){
                        $('#tpl-tabs-content-item').clone().appendTo( $('#'+element.day) ).attr('id', element.events[i].id);
                        $('#'+element.day + " #"+ element.events[i].id +" a").last().attr("href", "etm-rooms.html?date="+element.day+"&eventID="+(element.events[i].id - 1));
                        $('#'+element.day).find( $( '.horario').last() ).text(element.events[i].time);
                        $('#'+element.day).find( $( '.titulo').last() ).text(element.events[i].title);
                        $('#'+element.day).find( $( '.contenido').last() ).append(element.events[i].description);
                    }
                });

                
                $('.programas__tab-content').eq(1).addClass('is-active');
            });
    }

    const loadRoomData = (number, indexRoom) =>{
        let day = getUrlVars()["date"];
        let idRoom = getUrlVars()["eventID"];

        fetchData()
            .then(response => {
                let rooms = response.agenda[number].events[indexRoom].rooms;
                rooms.forEach( (element, index) => {
                    $('#tpl-rooms-items').clone().appendTo( $('.js-rooms')).attr('id', element.id);
                    $('#'+element.id).find( $('a') ).attr("href", "room.html?date="+day+"&eventID="+idRoom+"&roomID="+index);
                    $('#'+element.id).find( $('strong') ).text(element.name);
                    $('#'+element.id).find( $('img') ).attr("src", element.url);
                    $('#'+element.id).find( $('img') ).attr("alt", element.name);
                });


            });

    }

    const loadInternalRoom = (day, eventID, roomID) =>{

        fetchData()
            .then(response => {
                let internalRoom = response.agenda[day].events[eventID].rooms[roomID];
                console.log(internalRoom.speakers);
                $('.js-internal-room').find( $('h2') ).text(internalRoom.name);
                $('.js-internal-room').find( $('h1') ).text(internalRoom.title);
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

    const internalRoomInit = () => {

        let day = getUrlVars()["date"];
        let eventID = getUrlVars()["eventID"];
        let roomID = getUrlVars()["roomID"];

        if(day ==  '2021-12-10'){
            console.log("Room 1");
            loadInternalRoom("1", eventID, roomID);
        }else{
            console.log("Room internal 2");
        }
    }



    const loadRooms = () => {
        let day = getUrlVars()["date"];
        let idRoom = getUrlVars()["eventID"];
        //console.log(day);
        //console.log(idRoom);

        if(day ==  '2021-12-10'){
            //console.log("Room 1");

            loadRoomData("0", idRoom);
        }else{
            loadRoomData("1", idRoom);
            console.log("Room 2");
        }
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
            
        });
    }

    const jqueryWarning = () => {
        jQuery.event.special.touchstart = {
            setup: function( _, ns, handle ){
              if ( ns.includes("noPreventDefault") ) {
                this.addEventListener("touchstart", handle, { passive: false });
              } else {
                this.addEventListener("touchstart", handle, { passive: true });
              }
            }
        };
    }


    const init = () => {

        jqueryWarning();


        if( $('.js-etm-rooms').length ) loadRooms();
        if( $('.js-internal-room').length ){
            internalRoomInit();
        } 
        if( $('.programas').length ) {
            tabsAgenda();
            loadInitialData();
        }
        if( $('.expositores__carrusel').length ){
            carruselExpositores('#carrusel_rooms');
        }
        
    }

    init();
    
});