/*!
 * compatible.js
 * @author ydr.me
 * 2014-09-16 16:20
 */


define(function (require, exports, module) {
    /**
     * @module util/compatible
     */
    'use strict';

    var data = require('../../util/data.js');
    var html5Prefixs = ['', 'webkit', 'moz', 'ms', 'MS'];
    var css3Prefixs = ['', '-webkit', '-moz', '-ms'];
    var regCss3 = /^-(webkit|moz|ms)-/i;
    var regHump = /[A-Z]/g;
    var regFirstLetter = /^(\w)(.*)$/;
    var p = document.createElement('p');

    module.exports = {
        /**
         * 获取有浏览器前缀的方法名称
         * @param {String} standard 标准属性、方法名称
         * @param {Object} parent   标准方法父级
         * @returns {String} 私有属性、方法名称
         */
        html5: function (standard, parent) {
            var html5Key = null;

            data.each(html5Prefixs, function (index, prefix) {
                html5Key = prefix ? prefix + _toUpperCaseFirstLetter(standard) : standard;

                if (html5Key in parent) {
                    return !1;
                }
            });

            return html5Key;
        },
        /**
         * 获取有浏览器前缀的CSS3名称
         * @param {String} standard 标准的CSS3属性
         * @returns {String} 私有CSS3属性
         */
        css3: function (standard) {
            var cssKey = null;
            standard = _toSepString(standard.trim().replace(regCss3, ''));

            data.each(css3Prefixs, function (index, prefix) {
                cssKey = prefix ? prefix + '-' + standard : standard;

                if (cssKey in p.style) {
                    return !1;
                }
            });

            return cssKey;
        }
    };

    /**
     * 大写单词中的第一个字母
     * @param {String} word
     * @returns {String}
     * @private
     */
    function _toUpperCaseFirstLetter(word) {
        return word.replace(regFirstLetter, function ($0, $1, $2) {
            return $1.toUpperCase() + $2;
        });
    }

    /**
     * 转换驼峰字符串为短横线分隔符字符串
     * @param {String} humpString 驼峰字符串
     * @returns {String} 短横线分隔符字符串
     * @private
     */
    function _toSepString(humpString) {
        return humpString.replace(regHump, function ($0) {
            return '-' + $0.toLowerCase();
        });
    }
});