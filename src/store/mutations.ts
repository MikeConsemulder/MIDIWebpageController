import { IState } from "../interfaces/state.interface";
import { IMIDIDevices } from "../interfaces/midi-device.interface";

const mutations = {
    addDevices(state: IState, devices: IMIDIDevices): void {
        state.devices = devices;
    },
    saveNewMessage(state: IState, { id, message }): void {

        let stateCopy: IState = { ...state };
        stateCopy.input_messages.push({
            id,
            unique_input_ids: [message.id],
            messages: [message]
        });
        state.input_messages = stateCopy.input_messages;
    },
    saveMessage(state: IState, { id, message }): void {

        let stateCopy: IState = { ...state };
        const device = stateCopy.input_messages.filter(device => {
            return device.id === id;
        })[0];

        if (typeof device === 'undefined') return;

        device.messages.push(message);

        if (!device.unique_input_ids.includes(message.id)) {
            device.unique_input_ids.push(message.id);
        }

        if (device.messages.length === state.maxAmountIncommingMessages + 1) {
            device.messages.shift();
        }

        state.input_messages = stateCopy.input_messages;
    },
    setActionActivator(state: IState, { action, deviceId, inputId }): void {

        const combinedId = `${deviceId}_${inputId}`;
        let stateCopy: IState = { ...state };

        if (!stateCopy.actionActivators.hasOwnProperty(combinedId)) {
            Object.defineProperty(stateCopy.actionActivators, combinedId, {
                value: [],
                writable: true,
                enumerable: true
            });
        }

        if(stateCopy.actionActivators[combinedId].includes(action)) return;
        stateCopy.actionActivators[combinedId].push(action);

        state.actionActivators = stateCopy.actionActivators;
    }
};

export { mutations };