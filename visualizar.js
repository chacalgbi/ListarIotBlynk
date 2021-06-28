let chamaLoop
function atualiza() { chamaLoop = setInterval(obterValores, 15000); }

function obterValores() {
    $.ajax({
        type: "POST",
        url: "teste.json",
        dataType: "json",
        success: function (data) {
            var count = Object.keys(data).length;   
            $("#corpoTabela").empty();
            for (var i = 1; i <= count; i++) {
                var tb = document.getElementById("corpoTabela");
                var qtdLinhas = tb.rows.length;
                var linha = tb.insertRow(qtdLinhas);

                var cellId       = linha.insertCell(0);
                var cellNome     = linha.insertCell(1);
                var cellPino     = linha.insertCell(2);
                var cellHardware = linha.insertCell(3);
                var cellApp      = linha.insertCell(4);
                var cellProj     = linha.insertCell(5);
                var cellPro      = linha.insertCell(6);
                var cellTipo     = linha.insertCell(7);

                cellHardware.id = `device${data[i].id}`;
                cellApp.id      = `app${data[i].id}`;
                cellPino.id     = `pin${data[i].id}`;
                cellPro.id      = `pro${data[i].id}`;
                cellProj.id     = `proj${data[i].id}`;
                cellTipo.id     = `tipo${data[i].id}`;

                cellId.innerHTML    = data[i].id;
                cellNome.innerHTML  = data[i].nome;
                cellPino.innerHTML  = data[i].pino;
                cellHardware.innerHTML = "Aguarde...";
                cellApp.innerHTML = "Aguarde...";
                cellPro.innerHTML = "Aguarde...";
                cellProj.innerHTML = "Aguarde...";
                cellTipo.innerHTML = "";

                isHardwareConnected(data[i].token, data[i].id);
                isAppConnected(data[i].token, data[i].id);
                getPin(data[i].token, data[i].id, data[i].pino);
                getProject(data[i].token, data[i].id, data[i].nome);
            }
        }
    });
}

function isHardwareConnected(token, id){
    url = `http://blynk-cloud.com/${token}/isHardwareConnected`;
    let ajax = new XMLHttpRequest();
    ajax.open('GET', url)
    ajax.onreadystatechange = () =>{
        if(ajax.readyState == 4 && ajax.status == 200){
            let valor = String(ajax.responseText);
            
            if(valor == "true"){
                $(`#device${id}`).html("OnLine");
                $(`#device${id}`).attr('style', 'background-color: #00FF7F;');
            }else{
                $(`#device${id}`).html("OffLine");
                $(`#device${id}`).attr('style', 'background-color: #FA8072;');
            }
        }else{
            $(`#device${id}`).html(`AJAX: ${ajax.readyState}, HTTP: ${ajax.status}, Valor: ${ajax.responseText}`);
        }
    }
    ajax.send()
}

function isAppConnected(token, id){
    url = `http://blynk-cloud.com/${token}/isAppConnected`;
    let ajax = new XMLHttpRequest();
    ajax.open('GET', url)
    ajax.onreadystatechange = () =>{
        if(ajax.readyState == 4 && ajax.status == 200){
            let valor = String(ajax.responseText);
            if(valor == "true"){
                $(`#app${id}`).html("OnLine");
                $(`#app${id}`).attr('style', 'background-color: #00FF7F;');
            }else{
                $(`#app${id}`).html("OffLine");
                $(`#app${id}`).attr('style', 'background-color: #FA8072;');
            }
        }else{
            $(`#app${id}`).html(`AJAX: ${ajax.readyState}, HTTP: ${ajax.status}, Valor: ${ajax.responseText}`);
        }
    }
    ajax.send()
}

function getPin(token, id, pin){
    url = `http://blynk-cloud.com/${token}/get/${pin}`;
    let ajax = new XMLHttpRequest();
    ajax.open('GET', url)
    ajax.onreadystatechange = () =>{
        if(ajax.readyState == 4 && ajax.status == 200){
            let valor = JSON.parse(ajax.responseText);
            $(`#pin${id}`).html(pin + " - " + valor);
        }
    }
    ajax.send()
}

function getProject(token, id, nome){
    url = `http://blynk-cloud.com/${token}/project`;
    let ajax = new XMLHttpRequest();
    ajax.open('GET', url)
    ajax.onreadystatechange = () =>{
        if(ajax.readyState == 4 && ajax.status == 200){
            const OBJ = JSON.parse(ajax.responseText);
            const placas = OBJ.devices.map(item => item.boardType);
            const vendor = OBJ.devices.map(item => item.vendor);
            const name = OBJ.devices.map(item => item.name);
            const projeto = OBJ.name;
            for(let i = 0; i < placas.length; i++){
                if(nome == vendor[i] || nome == name[i]){
                    $(`#tipo${id}`).html(placas[i]);
                }
            }
            $(`#pro${id}`).html(placas.length);
            $(`#proj${id}`).html(projeto);
        }   
    }
    ajax.send()
}