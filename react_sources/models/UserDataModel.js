import ReactDOM from 'react-dom';
import React from 'react';

/**
 * @callback listenerCallback
 * @param {Array<T>} data user data
 */

export default class UserDataModel {
  /**
   * create a data model
   * @param {Map<String, T>} data array of user data
   * @param {listenerCallback} listeners functions called when modified
   */
  constructor(data = new Map(), ...listeners) {
    this.data = data;
    this.listeners = listeners;
    this.notify();
  }

  get all() {
    return this.data;
  }

  get size() {
    return this.data.size;
  }

  /**
   * 
   * @param {Array<T>} users array of responses for the API friends/ids or users/lookup
   */
  set(users) {
    for (let u of users) {
      let {id_str = undefined} = u;
      if (typeof id_str === 'undefined') {
        this.data.set(u, undefined);
      }
      else {
        this.data.set(u.id_str, u);
      }
    }
    this.notify();
  }

  /**
   * [start, end)
   */
  subarray(start, end) {
    return Array.from(this.data).slice(start, end);
  }

  clear() {
    this.data.clear();
    this.notify();
  }

  notify() {
    for (let i = 0; i < this.listeners.length; ++i) {
      this.listeners[i](this);
    }
  }

  toString() {
    return JSON.stringify([...this.data]);
  }

  /**
   * Whether idStr exists in database already
   * @param {String} idStr id_str
   */
  exists(idStr) {
    return this.data.filter((value) => value.id_str === idStr).length > 0;
  }
}
