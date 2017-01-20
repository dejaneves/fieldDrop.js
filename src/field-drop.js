(function(){
  'use strict';

  angular
    .module('aps.modules.nfi.upload-notes')
    .controller('UploadNotesController',UploadNotesController);

  /** @ngInject */
  function UploadNotesController (ApsResource, UploadService,Components,Conf,ApsStorage,$compile,$scope,$state,$document,$mdDialog,$mdToast) {
    var vm = this;

    // Data
    vm.uploads = [];
    vm.notes = [];
    vm.tableUpload = true;
    vm.tableProcessing = false;
    vm.btnLoadNotes = false;
    vm.btnNewUpload = true;
    vm.DataSteps = [];

    // Methods
    vm.loadNotas = loadNotes;
    vm.newUpload = newUpload;
    vm.openDialogLog = openDialogLog;

    function newUpload(){
      $state.go(Conf.app.state, {}, {reload: true});
    }

    function openDialogLog(step){
      console.log('open dialog ',step);
    }

    function dropActionsLoadNotes(){
      var btnLoadNotes = document.querySelector('.actions');
      btnLoadNotes.classList.add('hide');

      vm.tableUpload = false;
      vm.tableProcessing = true;
    }

    function loadNotes(event) {
      dropActionsLoadNotes.call(this);

      function setStatusTable(args){
        $("#step_"+args.step+" span").html($compile(args.components.html)(vm));
        $("#step_"+args.step+"_msg").html($compile(args.components.status)(vm));

        if(args.log)
          $("#step_"+args.step+"_log").find('a').removeClass('hide');

      }

      function setStatusTableError(){
        var steps = [0,1,2];
        for (var i = 0; i < steps.length; i++) {
          $("#step_"+steps[i]+" span").html($compile(Components.html.icon_cancel)(vm));
          $("#step_"+steps[i]+"_msg").html($compile(Components.status.corrupted)(vm));
        }
      }

      /**
       * Websocket
       * @type {WebSocket}
       */
      var Websocket = new WebSocket('ws://bram02:8091/aps-dfe/loadfiles?filePath='+ApsStorage.pathWebWebsocket);

      Websocket.onopen = function(evt) {
        onOpen(evt)
      };

      Websocket.onclose = function(evt) {
        console.log('close');
        console.log(evt);
        document.querySelector('#btnClose').classList.remove('hide');
        document.querySelector('#progress-steps').classList.add('hide');
        ApsStorage.clearItem('lot');
        ApsStorage.clearItem('pathWebWebsocket');

        if(evt.type !== 'close'){
          $mdToast.show(
            $mdToast.simple()
            .textContent('O processamento foi encerrado')
            .position('top center')
            .hideDelay(3000)
          );
        }
      };

      Websocket.onmessage = function(evt) {
        var data = JSON.parse(evt.data);

        var steps = data.Data.Steps;
        var sizeTamSteps = steps.length;
        var setStatus = {};
        for (var i = 0; i < sizeTamSteps; i++) {
          //vm.status = steps[i].Status;

          setStatus['step'] = steps[i].Step;

          if(steps[i].Status === 'Processing') {
            var components = {
              html:Components.html.clock,
              status:Components.status.processing
            };

            setStatus['components'] = components;
          } else if (steps[i].Status === 'Processed'){

            if( steps[i].Log.length > 0){
              setStatus['log'] = true;
              vm.DataSteps[steps[i].Step] = steps[i].Log;
            }

            var components = {
              html:Components.html.checkbox_circle,
              status:Components.status.processed
            };

            setStatus['components'] = components;
          } else if (steps[i].Status === 'Corrupted') {

            if( steps[i].Log.length > 0){
              setStatus['log'] = true;
              vm.DataSteps[steps[i].Step] = steps[i].Log;
            }

            var components = {
              html:Components.html.icon_cancel,
              status:Components.status.corrupted
            };

            setStatus['components'] = components;
          }
          setStatusTable(setStatus);
        }
        //onMessage(evt)
      };

      Websocket.onerror = function(evt) {
        ApsStorage.clearItem('lot');
        ApsStorage.clearItem('pathWebWebsocket');
        setStatusTableError();

        $mdToast.show(
          $mdToast.simple()
          .textContent('Erro no processamento dos arquivos!')
          .position('top center')
          .hideDelay(3000)
        );
      }

      function onOpen(evt){
        writeToScreen("CONNECTED");
        doSend("WebSocket rocks");
      }

      function writeToScreen(message){
        console.log(message);
      }

      function doSend(message){
        writeToScreen("SENT: " + message);
        Websocket.send(JSON.stringify(vm.notes));
      }

    }

    function openDialogLog(ev,step){
      $mdDialog.show({
        controller         : AdvancedFilterDialogController,
        controllerAs       : 'vmLog',
        templateUrl        : 'app/main/modules/nfi/upload-notes/dialogs/logs.html',
        parent             : angular.element($document.find('#content-container')),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals : {
            dialogData: {
                step: step
            }
        }
      });
    }

    function AdvancedFilterDialogController(dialogData){
      var vmLog = this;

      vmLog.Step = dialogData.step;
      vmLog.logs = vm.DataSteps[dialogData.step];

      vmLog.Steps = {
        0 : 'Convertendo documentos',
        1 : 'Salvando no banco',
        2 : 'Movendo documentos processados'
      };

      // Methods
      vmLog.closeDialog = closeDialog;

      // Close dialog
      function closeDialog() {
          $mdDialog.hide();
      }

    }

    function dropAction(){
      var contentTable = this.querySelector('.content-table');
      contentTable.classList.remove('hide');
    }

    function uploads () {

      var holder = document.querySelector('#content'),
          circle = document.querySelector('.circle'),
          tableBody = document.querySelector('table > tbody'),
          btnLoadNotes = document.querySelector('.load-notes'),
          tests = {
            filereader: typeof FileReader !== 'undefined',
            dnd: 'draggable' in document.createElement('span'),
            formdata: !!window.FormData,
            progress: "upload" in new XMLHttpRequest
          },
          acceptedTypes = {
            'image/png': false,
            'image/jpeg': false,
            'image/gif': false,
            'text/xml': true,
            'application/x-zip-compressed' : true
          },
          fileupload = document.getElementById('upload');

          function mountTr(){
            var tr = document.createElement('tr'),
            cellName = document.createElement('td'),
            cellProgress = document.createElement('td'),
            cellStatus = document.createElement('td'),
            cellTrash = document.createElement('td');

            var el = {
              cellName : document.createElement('td'),
              cellProgress : document.createElement('td'),
              cellStatus : document.createElement('td'),
              cellTrash : document.createElement('td'),
              tr: document.createElement('tr')
            };

            return el;
          }

          function mountExplodeZip(files,trFile){
            var el = mountTr();
            var size = files.length;
            var xmlFromZip = "";

            for (var i = 0; i < size; i++) {

              el.cellName.innerHTML = files[i].name;
              el.cellProgress.innerHTML = "<progress min='0' max='100' value='100'>100</progress>";
              el.cellStatus.innerHTML = "<md-icon class='md-default-theme md-font material-icons icon icon-check'></md-icon>";

              el.tr.appendChild(el.cellName);
              el.tr.appendChild(el.cellProgress);
              el.tr.appendChild(el.cellStatus);
              xmlFromZip += "<tr>"+el.tr.innerHTML+"</tr>";
            }
            trFile.remove();
            tableBody.innerHTML += xmlFromZip;
          }

          function readfiles(file,params,cb) {
            var formData = new FormData();

            var tr = document.createElement('tr'),
            cellName = document.createElement('td'),
            cellProgress = document.createElement('td'),
            cellStatus = document.createElement('td'),
            cellTrash = document.createElement('td');
            tr.setAttribute('id',file.name);

            // File Name
            cellName.innerHTML = file.name;

            formData.append('files', file);

            if(ApsStorage.lot !== null)
              formData.append('lot', ApsStorage.lot);

            // Pregress Bar
            var progressBar = document.createElement('progress');
            progressBar.setAttribute('min', 0);
            progressBar.setAttribute('max', 100);
            progressBar.setAttribute('value', 0);
            progressBar.innerHTML = 0;

            // now post a new XHR request
            var xhr = new XMLHttpRequest();

            xhr.open('POST', ApsResource().apiHost + '8092/nfi/files/upload/files');

            xhr.upload.onprogress = function (event) {
              if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total * 100 | 0);
                // Progress
                progressBar.value = progressBar.innerHTML = percentComplete;
                cellProgress.appendChild(progressBar);
                // Status
                cellStatus.innerHTML = "<md-icon class='md-default-theme md-font material-icons icon icon-clock'></md-icon>";
              }
            };

            xhr.onload = function() {
              if (xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);

                var lot = res.lot.replaceAll("\\s+","");
                ApsStorage.register('lot',lot);

                var pathWebWebsocket = res.path.replaceAll("\\s+","");
                ApsStorage.register('pathWebWebsocket',pathWebWebsocket);

                ApsStorage.save(localStorage);

                for (var i = 0; i < res.data.length; i++) {
                  vm.notes.push(res.data[i].path + "\\" + res.data[i].name);
                }

                cellStatus.innerHTML = "<md-icon class='md-default-theme md-font material-icons icon icon-check'></md-icon>";
                cellTrash.innerHTML = "<md-icon class='md-default-theme md-font material-icons icon icon-trash' ng-click='trashFile("+file.name+")'></md-icon>";
                progressBar.value = progressBar.innerHTML = 100;

                if(params.count === params.sizeArray) {
                  $(btnLoadNotes).prop('disabled',false);
                }

                if(res.type === 'zip' ) {
                  mountExplodeZip(res.data,tr);
                }

                console.log('all done: ' + xhr.status);
              } else {
                console.log('Something went terribly wrong...');
              }
            };

            xhr.onerror = function() {
              cellStatus.innerHTML = "<md-icon class='md-default-theme md-font material-icons icon icon-close-circle-outline'></md-icon>";
            };

            tr.appendChild(cellName);
            tr.appendChild(cellProgress);
            tr.appendChild(cellStatus);
            //tr.appendChild(cellTrash);
            cb(tr);
            xhr.send(formData);
          }

          holder.ondragover = function () {
            $(this).addClass('hover');
            $(circle).addClass('hover');
            return false;
          }; // ondragover

          holder.ondragleave = function () {
            $(this).removeClass('hover');
            $(circle).removeClass('hover');
            return false;
          }; // ondragleave

          holder.ondrop = function (event) {
            event.preventDefault();

            dropAction.call(this);

            $(this).removeClass('hover');
            $(circle).addClass('hide');

            var files = event.dataTransfer.files,
            sizeArray = files.length,
            positionArray = 0,
            count = 1;

            function prepareUpload(){
              var params = {count:count,sizeArray:sizeArray};
              readfiles(files[positionArray],params,function(res){
                tableBody.appendChild(res);
              });
              if(count < sizeArray){
                positionArray++;
                count++;
                prepareUpload();
              }
            } // prepareUpload

            prepareUpload();
          } // ondrop


    }

    uploads();
  }

})();
