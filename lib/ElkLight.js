"use strict";

var Service, Characteristic, uuid;

var ElkLight = function (homebridge, log, elk, id, name) {

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    uuid = homebridge.hap.uuid;
    this.log = log;
    this.id = id;
    this.elk = elk;
    this.name = this.name = (name != "") ? name:"Light "+(id+'');;
    this.uuid_base = "light"+name;

    this.outputState = false;
    this.dimState = 0;
    

    this._service = new Service.Switch(this.name);
    this._informationService = new Service.AccessoryInformation();

    this._onChar = this._service.getCharacteristic(Characteristic.On);

    this._onChar.on('get', (callback) => {
        callback(null, this.outputState);
    });

    this._onChar.on('set', (state,callback) => {
        if (state != this.outputState) {
        if (state) {
            this.elk.setLightingOn(this.id,0);
        } else {
            this.elk.setLightingOff(this.id);
        }
    }
        callback(null,state);
    });

    this._informationService.setCharacteristic(Characteristic.Manufacturer, 'Elk')
        .setCharacteristic(Characteristic.Model, 'Output')
        .setCharacteristic(Characteristic.SerialNumber, this.id+'');
}

ElkLight.prototype.setStatusFromMessage = function(message) {
    this.outputState = (message.state == 'On');
    this._service.setCharacteristic(Characteristic.On, this.outputState);
}

ElkLight.prototype.getServices = function () {
    return [this._informationService, this._service];
}

module.exports = ElkLight;
