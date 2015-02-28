/*!
 * UI 类基础
 * @author ydr.me
 * @create 2014-11-11 20:07
 */


define(function (require, exports, module) {
    /**
     * @module ui/base
     * @requires util/dato
     * @requires util/typeis
     * @requires util/class
     * @requires libs/Emitter
     */
    'use strict';

    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var klass = require('../utils/class.js');
    var Emitter = require('../libs/Emitter.js');
    var udf;
    var warningPropertyList = 'emit on un _eventsPool _eventsLimit'.split(' ');
    var zIndex = 999;


    /**
     * 获取 zIndex
     * @returns {number}
     */
    exports.getZindex = function () {
        return zIndex++;
    };


    /**
     * 创建一个 UI 类
     * @param property {Object}
     * @property property.constructor {Function} 构造函数
     * @property [property.STATIC={}] {Object} 静态属性、方法，可以为空
     * @param [isInheritSuperStatic=false] {Boolean} 是否继承父类的静态方法
     *
     * @example
     * var Dialog = ui({
     *     constructor: fn,
     *     STATIC: {},
     *     myClassName: fn
     * });
     */
    exports.create = function (property, isInheritSuperStatic) {
        var proto = {};

        if (typeis(property) !== 'object') {
            throw 'UI class property must be an obejct';
        }

        if (typeis(property.constructor) !== 'function') {
            throw 'UI class property.constructor must be a function';
        }

        dato.each(property, function (key, val) {
            proto[key] = val;

            if (warningPropertyList.indexOf(key) > -1) {
                console.warn(property.constructor.toString() + ' rewrite Emitter\' property in prototype of `' + key + '`');
            }
        });

        proto.constructor = function () {
            Emitter.apply(this, arguments);
            property.constructor.apply(this, arguments);
        };

        // 添加默认方法
        if (property.getOptions === udf) {
            proto.getOptions = function (key) {
                var the = this;
                var keyType = typeis(key);
                var ret = [];

                the.emit('getoptions');
                if (keyType === 'string' || keyType === 'number') {
                    return the._options && the._options[key];
                } else if (keyType === 'array') {
                    dato.each(key, function (index, k) {
                        ret.push(the._options && the._options[k]);
                    });

                    return ret;
                } else {
                    return the._options;
                }
            };
        }

        if (property.setOptions === udf) {
            proto.setOptions = function (key, val) {
                var the = this;
                var keyType = typeis(key);

                if (keyType === 'string' || keyType === 'number') {
                    the._options ? the._options[key] = val : udf;
                } else if (keyType === 'object') {
                    dato.extend(the._options, key);
                }

                the.emit('setoptions', the._options);
            };
        }

        return klass.create(proto, Emitter, isInheritSuperStatic);
    };
});