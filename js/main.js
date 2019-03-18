$(document).ready(function () {
    // var _url = 'php/index.php';
    var _url = 'https://my-json-server.typicode.com/monsterup/api_pwa/mahasiswa';
    var result = '';
    var gender_opt = '';
    var gender  = [];

    // $.get(_url,function (data) {
    function renderPage(data) {
        $.each (data,function (key, items) {
            gend = items.gender;

            result += '<div>'+'<p><b>'+items.name+'</b></p>'+
            '<p>'+gend+'</p>'+'</div>';
            
            if($.inArray(gend,gender) === -1){
                gender.push(gend);
                gender_opt += '<option value="'+gend+'">'+gend+'</option>'
            }

        });

        $('#mhs-list').html(result);

        $('#gender-select').html('<option value="Semua">Semua</option>'+gender_opt);
    }
    // });

    var networkDataReceive = false;
    var networkUpdate = fetch(_url).then(function(response){
        return response.json();
    }).then(function(data){
        networkDataReceive = true;
        renderPage(data);
    });

    caches.match(_url).then(function(response){
        if(!response) throw Error("no data on cache");
        return response.json();
    }).then(function(data){
        if(!networkDataReceive){
            renderPage(data);
            console.log('render data from cache');
        }
    }).catch(function(){
        return networkUpdate;
    });

    $('#gender-select').on('change', function(){
        updateList($(this).val());
    });

    function updateList(opt){
        var _url2 = _url;

        if(opt !== 'Semua'){
            _url2 = _url + '?gender=' + opt;
        } else {
            _url2 = "https://my-json-server.typicode.com/monsterup/api_pwa/mahasiswa";
        }

        var result = '';

        $.get(_url2,function (data) {
            $.each (data,function (key, items) {

                gend = items.gender;

                result += '<div>'+'<p><b>'+items.name+'</b></p>'+
                '<p>'+gend+'</p>'+'</div>';

            });

            $('#mhs-list').html(result);
        });
    }

    Notification.requestPermission(function(status){
        console.log('Notification permission status : ', status);
    });

    function displayNotification(){
        if(Notification.permission === 'granted'){
            navigator.serviceWorker.getRegistration().then(function(reg){
                var options = {
                    body : 'Ini body notifikasi',
                    icon : 'images/ugm-png-6.png',
                    vibrate : [100,50,100],
                    data : {
                        dateOfArrival : Date.now(),
                        primaryKey : 1
                    },
                    actions : [
                        {action : 'explore', title : 'Kunjungi Situs'},
                        {action : 'close', title : 'Tutup'}
                    ]
                }
                reg.showNotification('Judul Notifikasi', options);
            })
        }
    }

    $('#btn-notification').on('click', function(){
        displayNotification();
    })

});


if (navigator.serviceWorker){
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/serviceworker.js').then(function (reg) {
            console.log('SW regis sukses dgn skop',reg.scope)
        }, function (err) {
            console.log('SW regis failed',err);
        })
    })
} 