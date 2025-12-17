/**
 * ye-bail - WhatsApp Web API Library
 * 
 * Copyright (C) 2025 yemobyte <yemobyte@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WAProto_1 = require("../../WAProto");
const Utils_1 = require("../Utils");
const logger_1 = require("../Utils/logger");
const makeCacheManagerAuthState = async (store, sessionKey, opts = {}) => {
    const logger = opts.logger || logger_1.default;
    const scopedKey = (file) => `${sessionKey}:${file}`;
    const writeData = async (file, data) => {
        let ttl = undefined;
        if (file === 'creds') {
            ttl = 63115200;
        }
        await store.set(scopedKey(file), JSON.stringify(data, Utils_1.BufferJSON.replacer), ttl);
    };
    const readData = async (file) => {
        try {
            const data = await store.get(scopedKey(file));
            if (!data) {
                return null;
            }
            if (typeof data === 'string') {
                return JSON.parse(data, Utils_1.BufferJSON.reviver);
            }
            return JSON.parse(String(data), Utils_1.BufferJSON.reviver);
        }
        catch (err) {
            logger.error({ err, file }, 'failed reading auth state item');
            return null;
        }
    };
    const removeData = async (file) => {
        try {
            await store.del(scopedKey(file));
        }
        catch (err) {
            logger.error({ err, file }, 'failed removing auth state item');
        }
    };
    const clearState = async () => {
        try {
            const backing = store === null || store === void 0 ? void 0 : store.store;
            const keysFn = backing && typeof backing.keys === 'function' ? backing.keys.bind(backing) : undefined;
            if (!keysFn) {
                return;
            }
            const keys = await keysFn();
            const prefix = `${sessionKey}:`;
            const toDelete = (keys || []).filter((k) => typeof k === 'string' && k.startsWith(prefix));
            await Promise.all(toDelete.map((k) => store.del(k)));
        }
        catch (err) {
            logger.error({ err }, 'failed clearing auth state');
        }
    };
    const creds = (await readData('creds')) || (0, Utils_1.initAuthCreds)();
    return {
        clearState,
        saveCreds: () => writeData('creds', creds),
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        const value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            data[id] = WAProto_1.proto.Message.AppStateSyncKeyData.create(value);
                        }
                        else {
                            data[id] = value;
                        }
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            tasks.push(value ? writeData(key, value) : removeData(key));
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        }
    };
};
exports.default = makeCacheManagerAuthState;

